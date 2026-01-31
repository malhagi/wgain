'use client';

import { useEffect, useState } from 'react';
import { loadSentencesAsync, loadGrammarAsync } from '@/lib/data/loader';
import { getOrInitializeProgress, updateItemProgress } from '@/lib/utils/storage';
import { getOrCreateProgress, updateHintUsage } from '@/lib/learning/progressTracker';
import { createLearningQueue, handleCorrectAnswer, handleIncorrectAnswer } from '@/lib/learning/learningQueue';
import { updateProgressOnCorrect, updateProgressOnIncorrect } from '@/lib/learning/spacedRepetition';
import { getVocabularyByIds, loadVocabularyAsync } from '@/lib/data/loader';
import type { Sentence, Grammar, LearningProgress, HintStage, UserProgress, Vocabulary } from '@/types';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { speakChinese } from '@/lib/tts/chineseTTS';

export default function SentencesPage() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentProgress, setCurrentProgress] = useState<LearningProgress | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [vocabMap, setVocabMap] = useState<Record<string, Vocabulary>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([loadSentencesAsync(), loadGrammarAsync()]).then(([sentenceList, grammarList]) => {
      setSentences(sentenceList);
      setGrammars(grammarList);

    const userProgress = getOrInitializeProgress();
    setProgress(userProgress);

    // 단어 맵 생성
    const allWordIds = new Set<string>();
    sentenceList.forEach((s) => s.wordIds.forEach((id) => allWordIds.add(id)));
    loadVocabularyAsync().then((vocabularies) => {
      const vocabMapObj: Record<string, Vocabulary> = {};
      vocabularies.forEach((v) => {
        if (allWordIds.has(v.id)) {
          vocabMapObj[v.id] = v;
        }
      });
      setVocabMap(vocabMapObj);
    });

    // 학습 큐 생성
      const queue = createLearningQueue(userProgress.sentence);
    if (queue.length > 0) {
      const firstItem = queue[0];
      const sentence = sentenceList.find((s) => s.id === firstItem.itemId);
      if (sentence) {
        const sentenceProgress = getOrCreateProgress(userProgress, sentence.id, 'sentence');
        setCurrentProgress(sentenceProgress);
        setCurrentIndex(sentenceList.findIndex((s) => s.id === sentence.id));
      }
    } else if (sentenceList.length > 0) {
      const sentence = sentenceList[0];
      const sentenceProgress = getOrCreateProgress(userProgress, sentence.id, 'sentence');
      setCurrentProgress(sentenceProgress);
    }
    });
  }, []);

  const currentSentence = sentences[currentIndex];
  const relatedGrammar = currentSentence
    ? grammars.find((g) => currentSentence.grammarIds.includes(g.id))
    : null;

  const handleTTS = async () => {
    if (!currentSentence || isPlaying) return;
    
    setIsPlaying(true);
    try {
      await speakChinese(currentSentence.content);
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleWordClick = (wordId: string) => {
    setClickedWords(prev => new Set([...prev, wordId]));
    handleHintUsed(wordId, 'meaning');
  };

  const handleHintUsed = (wordId: string, stage: HintStage) => {
    if (!currentProgress || !progress) return;

    const updatedProgress = updateHintUsage(currentProgress, stage);
    const updatedUserProgress = updateItemProgress(progress, updatedProgress);
    setCurrentProgress(updatedProgress);
    setProgress(updatedUserProgress);
  };

  const handleCorrect = () => {
    if (!currentProgress || !progress || !currentSentence) return;

    // 간격 반복 알고리즘을 사용하여 진행도 업데이트
    const updatedProgressData = updateProgressOnCorrect(currentProgress);
    const updatedProgress = updateItemProgress(progress, updatedProgressData);

    // 학습 큐 처리
    const { queue: updatedQueue } = handleCorrectAnswer(
      createLearningQueue(updatedProgress.sentence),
      currentSentence.id,
      updatedProgressData
    );

    setProgress(updatedProgress);
    setCurrentProgress(updatedProgressData);

    // 다음 문장으로
    if (updatedQueue.length > 0) {
      const nextItem = updatedQueue[0];
      const nextSentence = sentences.find((s) => s.id === nextItem.itemId);
      if (nextSentence) {
        const nextProgress = getOrCreateProgress(updatedProgress, nextSentence.id, 'sentence');
        setCurrentIndex(sentences.findIndex((s) => s.id === nextSentence.id));
        setCurrentProgress(nextProgress);
      }
    } else {
      const nextIndex = (currentIndex + 1) % sentences.length;
      setCurrentIndex(nextIndex);
      const nextSentence = sentences[nextIndex];
      const nextProgress = getOrCreateProgress(updatedProgress, nextSentence.id, 'sentence');
      setCurrentProgress(nextProgress);
    }

    setShowAnswer(false);
    setClickedWords(new Set()); // Reset clicked words for new sentence
  };

  const handleIncorrect = () => {
    if (!currentProgress || !progress || !currentSentence) return;

    // 간격 반복 알고리즘을 사용하여 진행도 업데이트
    const updatedProgressData = updateProgressOnIncorrect(currentProgress);
    const updatedProgress = updateItemProgress(progress, updatedProgressData);

    // 학습 큐에 즉시 재추가 (반복 학습)
    handleIncorrectAnswer(
      createLearningQueue(updatedProgress.sentence),
      currentSentence.id,
      updatedProgressData
    );

    setProgress(updatedProgress);
    setCurrentProgress(updatedProgressData);
    setShowAnswer(true);
  };

  if (!currentSentence || !currentProgress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // 문장을 단어별로 분리하여 힌트 가능하게
  const renderSentenceWithHints = (sentence: Sentence) => {
    // 문장의 단어 ID를 사용하여 단어 매칭 (중복 방지)
    const sentenceWords: Array<{ vocab: Vocabulary; startIdx: number; endIdx: number; uniqueKey: string }> = [];
    const usedPositions = new Set<number>();
    
    sentence.wordIds.forEach((wordId) => {
      const vocab = vocabMap[wordId];
      if (vocab) {
        let searchIdx = 0;
        // 이 단어의 모든 등장 위치를 찾되, 아직 사용되지 않은 위치만
        while (searchIdx < sentence.content.length) {
          const startIdx = sentence.content.indexOf(vocab.characters, searchIdx);
          if (startIdx < 0) break;
          
          const endIdx = startIdx + vocab.characters.length;
          // 이 위치가 아직 사용되지 않았다면 추가
          if (!usedPositions.has(startIdx)) {
            // 이 위치 범위의 모든 인덱스를 사용됨으로 표시
            for (let i = startIdx; i < endIdx; i++) {
              usedPositions.add(i);
            }
            sentenceWords.push({
              vocab,
              startIdx,
              endIdx,
              uniqueKey: `${wordId}-${startIdx}`,
            });
            break; // 이 wordId에 대해서는 첫 번째 매칭만 사용
          }
          searchIdx = startIdx + 1;
        }
      }
    });

    // 시작 위치로 정렬
    sentenceWords.sort((a, b) => a.startIdx - b.startIdx);

    const elements: React.ReactElement[] = [];
    let lastIdx = 0;

    sentenceWords.forEach((wordInfo) => {
      // 단어 앞의 텍스트
      if (wordInfo.startIdx > lastIdx) {
        elements.push(
          <span key={`text-${lastIdx}`} className="text-black">
            {sentence.content.substring(lastIdx, wordInfo.startIdx)}
          </span>
        );
      }

      const isClicked = clickedWords.has(wordInfo.uniqueKey);

      // 단어 (info 버튼으로 힌트 표시)
      elements.push(
        <span
          key={wordInfo.uniqueKey}
          className="inline-flex items-center gap-0.5"
        >
          <span className="text-black font-bold border-b-2 border-blue-300">{wordInfo.vocab.characters}</span>
          <button
            onClick={() => handleWordClick(wordInfo.uniqueKey)}
            className="text-blue-500 hover:text-blue-700 p-0.5 relative"
            aria-label="Show word info"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {isClicked && (
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 p-2 bg-black text-white text-sm rounded shadow-lg whitespace-nowrap z-50">
                <div className="font-bold">{wordInfo.vocab.pinyin}</div>
                <div className="text-yellow-300 font-bold">{wordInfo.vocab.meaning}</div>
              </span>
            )}
          </button>
        </span>
      );

      lastIdx = wordInfo.endIdx;
    });

    // 마지막 단어 뒤의 텍스트
    if (lastIdx < sentence.content.length) {
      elements.push(
        <span key={`text-${lastIdx}`} className="text-black">
          {sentence.content.substring(lastIdx)}
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1 justify-center text-xl sm:text-2xl mb-4 leading-relaxed">
        {elements.length > 0 ? elements : <span className="text-black">{sentence.content}</span>}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black tracking-tight">💬 Sentences</h1>
          <p className="text-sm text-blue-600 font-medium mt-1">Practice Chinese sentences</p>
        </div>

        <div className="ios-card p-6 transition-ios shadow-lg">
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={handleTTS}
            disabled={isPlaying}
            className={`w-16 h-16 rounded-2xl transition-ios shadow-lg flex items-center justify-center ${
              isPlaying 
                ? 'bg-blue-200 cursor-wait' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600 active:scale-95'
            }`}
            aria-label="Play sentence pronunciation"
          >
            <Volume2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="text-center mb-6">
          {renderSentenceWithHints(currentSentence)}
        </div>

        {showAnswer && (
          <div className="mt-5 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 shadow-sm">
            <div className="text-lg mb-2 text-black">
              <span className="font-bold text-blue-900">Translation:</span> 
              <span className="ml-2 text-black">{currentSentence.translation}</span>
            </div>
            {relatedGrammar && (
              <div className="mt-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200/50">
                <div className="font-bold text-black mb-1">📖 {relatedGrammar.name}</div>
                <div className="text-sm text-black">{relatedGrammar.description}</div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCorrect}
            className="flex-1 bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
            I Know
          </button>
          <button
            onClick={handleIncorrect}
            className="flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95 flex items-center justify-center gap-2"
          >
            <XCircle className="w-6 h-6" strokeWidth={2.5} />
            Don't Know
          </button>
        </div>

        <div className="mt-4 text-sm font-bold text-black/60 text-center">
          {currentIndex + 1} / {sentences.length}
        </div>
      </div>
    </div>
  );
}
