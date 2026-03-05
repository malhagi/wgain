// 중국어 TTS 유틸리티

export interface TTSOptions {
  rate?: number;
  lang?: string;
}

// 중국어 음성 캐시
let cachedChineseVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

// 알려진 남성 중국어 음성 이름 (소문자)
const MALE_VOICE_NAMES = [
  'kangkang', 'yunxi', 'yunyang', 'yunjian', 'yunze', 'yunhao',
  'male', 'man', 'boy',
];

function isMaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  return MALE_VOICE_NAMES.some(male => name.includes(male));
}

// 알려진 여성 중국어 음성 이름 (소문자)
const FEMALE_VOICE_NAMES = [
  'ting-ting', 'meijia', 'huihui', 'yaoyao', 'xiaoxiao', 'lili',
  'xiaoyi', 'xiaochen', 'xiaomo', 'xiaoxuan', 'xiaoshuang',
  'female', 'woman',
];

function isKnownFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  return FEMALE_VOICE_NAMES.some(female => name.includes(female));
}

function findChineseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const zhCNVoices = voices.filter(voice =>
    voice.lang === 'zh-CN' || voice.lang === 'zh_CN'
  );

  const anyChineseVoices = voices.filter(voice =>
    voice.lang.startsWith('zh') || voice.lang.startsWith('cmn')
  );

  // 1순위: zh-CN 중 알려진 여성 음성
  const knownFemale = zhCNVoices.find(v => isKnownFemaleVoice(v));
  if (knownFemale) return knownFemale;

  // 2순위: zh-CN 중 남성이 아닌 음성 (성별 불명은 여성으로 간주)
  const nonMaleZhCN = zhCNVoices.find(v => !isMaleVoice(v));
  if (nonMaleZhCN) return nonMaleZhCN;

  // 3순위: 모든 중국어 중 알려진 여성 음성
  const knownFemaleAny = anyChineseVoices.find(v => isKnownFemaleVoice(v));
  if (knownFemaleAny) return knownFemaleAny;

  // 4순위: 모든 중국어 중 남성이 아닌 음성
  const nonMaleAny = anyChineseVoices.find(v => !isMaleVoice(v));
  if (nonMaleAny) return nonMaleAny;

  // 5순위: 아무 중국어 음성이라도 (남성이라도 한국어보다 나음)
  if (anyChineseVoices.length > 0) return anyChineseVoices[0];

  return null;
}

function getChineseVoice(): Promise<SpeechSynthesisVoice | null> {
  return new Promise((resolve) => {
    if (cachedChineseVoice) {
      resolve(cachedChineseVoice);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedChineseVoice = findChineseVoice(voices);
      voicesLoaded = true;
      resolve(cachedChineseVoice);
      return;
    }

    // Voices가 아직 로드되지 않은 경우 대기
    const onVoicesChanged = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      cachedChineseVoice = findChineseVoice(loadedVoices);
      voicesLoaded = true;
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(cachedChineseVoice);
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // 1초 후에도 voices가 로드되지 않으면 null로 진행 (lang 속성에 의존)
    setTimeout(() => {
      if (!voicesLoaded) {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        voicesLoaded = true;
        resolve(null);
      }
    }, 1000);
  });
}

export function speakChinese(text: string, options?: TTSOptions | string): Promise<void> {
  const opts: TTSOptions = typeof options === 'string'
    ? { lang: options }
    : { rate: 0.8, lang: 'zh-CN', ...options };

  let speechText = text;

  if (speechText.includes('|')) {
    speechText = speechText.split('|')[0].trim();
  }

  speechText = speechText.replace(/^[AB][:：]\s*/, '').trim();

  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    // 이전 음성 중지
    window.speechSynthesis.cancel();

    // iOS Safari에서는 약간의 딜레이가 필요할 수 있음
    setTimeout(async () => {
      try {
        // 중국어 음성을 먼저 확보
        const chineseVoice = await getChineseVoice();

        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = opts.lang ?? 'zh-CN';
        utterance.rate = opts.rate ?? 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // 반드시 중국어 음성을 설정 (한국어 시스템에서 기본 음성이 한국어가 되는 것을 방지)
        if (chineseVoice) {
          utterance.voice = chineseVoice;
        }

        let resolved = false;
        let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

        const cleanup = () => {
          if (keepAliveInterval !== null) {
            clearInterval(keepAliveInterval);
            keepAliveInterval = null;
          }
        };

        utterance.onstart = () => {
          // Workaround for Chrome/Safari bug where long utterances get cut off after ~15s
          keepAliveInterval = setInterval(() => {
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 10000);
        };

        utterance.onend = () => {
          cleanup();
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };

        utterance.onerror = (error) => {
          console.error('TTS error:', error);
          cleanup();
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };

        window.speechSynthesis.speak(utterance);

        // 타임아웃 설정 (30초 후 실패 처리 - 긴 문장 고려)
        setTimeout(() => {
          if (!resolved) {
            cleanup();
            window.speechSynthesis.cancel();
            resolved = true;
            resolve();
          }
        }, 30000);
      } catch {
        resolve();
      }
    }, 100);
  });
}

// TTS 중지
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// TTS 지원 여부 확인
export function isTTSSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return 'speechSynthesis' in window;
}

// iOS에서 voices 로드를 위한 초기화 함수
export function initTTS(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // iOS에서 voices를 미리 로드
    window.speechSynthesis.getVoices();

    // voices가 변경될 때마다 다시 로드
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }
}
