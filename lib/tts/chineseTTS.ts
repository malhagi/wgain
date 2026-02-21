// 중국어 TTS 유틸리티

export function speakChinese(text: string, lang: string = 'zh-CN'): Promise<void> {
  let character: 'A' | 'B' | 'default' = 'default'; // Default to A voice
  let speechText = text;

  // '|' 문자를 기준으로 앞부분(중국어)만 가져옴
  if (speechText.includes('|')) {
    speechText = speechText.split('|')[0].trim();
  }

  // Check for A: or B: prefixes
  if (speechText.startsWith('A:') || speechText.startsWith('A：') || speechText.startsWith('A: ') || speechText.startsWith('A： ')) {
    speechText = speechText.replace(/^A[:：]\s*/, '').trim();
    character = 'A';
  } else if (speechText.startsWith('B:') || speechText.startsWith('B：') || speechText.startsWith('B: ') || speechText.startsWith('B： ')) {
    speechText = speechText.replace(/^B[:：]\s*/, '').trim();
    character = 'B';
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // 이전 음성 중지
    window.speechSynthesis.cancel();

    // iOS Safari에서는 약간의 딜레이가 필요할 수 있음
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = lang;
        utterance.rate = 0.8; // 조금 더 느리게 (더 명확하게)
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // 이벤트 핸들러 설정
        let resolved = false;

        utterance.onstart = () => {
          console.log('TTS started:', speechText);
        };

        utterance.onend = () => {
          console.log('TTS ended');
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };

        utterance.onerror = (error) => {
          console.error('TTS error:', error);
          if (!resolved) {
            resolved = true;
            // 에러가 발생해도 resolve하여 다음 단계로 진행 가능하도록
            resolve();
          }
        };

        // iOS에서는 voices가 로드될 때까지 기다려야 할 수 있음
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);

        if (voices.length > 0) {
          // 여성 대표 음성들 찾기
          const chineseFemaleVoices = voices.filter(voice =>
            (voice.lang.startsWith('zh') || voice.lang.startsWith('cmn')) &&
            (voice.name.toLowerCase().includes('female') ||
              voice.name.toLowerCase().includes('woman') ||
              voice.name.toLowerCase().includes('ting-ting') ||
              voice.name.toLowerCase().includes('sin-ji') ||
              voice.name.toLowerCase().includes('meijia') ||
              voice.name.toLowerCase().includes('huihui') ||
              voice.name.toLowerCase().includes('yaoyao') ||
              voice.name.toLowerCase().includes('xiaoxiao'))
          );

          const fallbackChineseVoices = voices.filter(voice =>
            voice.lang.startsWith('zh') || voice.lang.startsWith('cmn')
          );

          const primaryVoice = chineseFemaleVoices.length > 0 ? chineseFemaleVoices[0] : (fallbackChineseVoices.length > 0 ? fallbackChineseVoices[0] : null);
          const secondaryVoice = chineseFemaleVoices.length > 1 ? chineseFemaleVoices[1] : (fallbackChineseVoices.length > 1 ? fallbackChineseVoices[1] : primaryVoice);

          let selectedVoice = primaryVoice;

          if (character === 'A' || character === 'default') {
            selectedVoice = primaryVoice;
          } else if (character === 'B') {
            selectedVoice = secondaryVoice;
          }

          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('Using voice:', selectedVoice.name, 'for character:', character);
          }
        }

        // 음성 재생 시작
        console.log('Starting speech synthesis');
        window.speechSynthesis.speak(utterance);

        // 타임아웃 설정 (20초 후 실패 처리)
        setTimeout(() => {
          if (!resolved) {
            console.log('TTS timeout');
            window.speechSynthesis.cancel();
            resolved = true;
            resolve();
          }
        }, 20000);
      } catch (error) {
        console.error('TTS setup error:', error);
        reject(error);
      }
    }, 100); // iOS를 위한 짧은 딜레이
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
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded:', voices.length);
      };
    }
  }
}
