'use client';

import { useEffect, useState } from 'react';
import { loadReadingsAsync, loadVocabularyAsync } from '@/lib/data/loader';
import { getOrInitializeProgress, updateItemProgress } from '@/lib/utils/storage';
import { getOrCreateProgress, updateHintUsage } from '@/lib/learning/progressTracker';
import type { Reading, LearningProgress, HintStage, UserProgress, Vocabulary } from '@/types';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { speakChinese } from '@/lib/tts/chineseTTS';

export default function ReadingPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentProgress, setCurrentProgress] = useState<LearningProgress | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [vocabMap, setVocabMap] = useState<Record<string, Vocabulary>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReadingsAsync().then((readingList) => {
      setReadings(readingList);

      const userProgress = getOrInitializeProgress();
      setProgress(userProgress);

      // 단어 맵 생성
      const allWordIds = new Set<string>();
      readingList.forEach((r) => r.wordIds.forEach((id) => allWordIds.add(id)));
      loadVocabularyAsync().then((vocabularies) => {
        const vocabMapObj: Record<string, Vocabulary> = {};
        vocabularies.forEach((v) => {
          if (allWordIds.has(v.id)) {
            vocabMapObj[v.id] = v;
          }
        });
        setVocabMap(vocabMapObj);
      });

      if (readingList.length > 0) {
        const reading = readingList[0];
        const readingProgress = getOrCreateProgress(userProgress, reading.id, 'reading');
        setCurrentProgress(readingProgress);
      }
    });
  }, []);

  const currentReading = readings[currentIndex];

  const handleTTS = async () => {
    if (!currentReading || isPlaying) return;
    
    setIsPlaying(true);
    try {
      await speakChinese(currentReading.content);
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

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmit = () => {
    if (!currentReading || !currentProgress || !progress) return;

    let correctCount = 0;
    currentReading.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const allCorrect = correctCount === currentReading.questions.length;

    const updatedProgress = updateItemProgress(progress, {
      ...currentProgress,
      correctCount: allCorrect ? currentProgress.correctCount + 1 : currentProgress.correctCount,
      incorrectCount: allCorrect ? currentProgress.incorrectCount : currentProgress.incorrectCount + 1,
      consecutiveCorrect: allCorrect ? currentProgress.consecutiveCorrect + 1 : 0,
    });

    setProgress(updatedProgress);
    setCurrentProgress(updatedProgress.reading[currentReading.id]);
    setShowResults(true);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % readings.length;
    setCurrentIndex(nextIndex);
    setSelectedAnswers({});
    setShowResults(false);
    setClickedWords(new Set()); // Reset clicked words for new reading
    if (progress && readings[nextIndex]) {
      const nextProgress = getOrCreateProgress(progress, readings[nextIndex].id, 'reading');
      setCurrentProgress(nextProgress);
    }
  };

  if (!currentReading || !currentProgress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // 본문을 단어별로 분리하여 힌트 가능하게
  const renderContentWithHints = (content: string, wordIds: string[]) => {
    // 본문의 단어 ID를 사용하여 단어 매칭 (중복 방지)
    const contentWords: Array<{ vocab: Vocabulary; startIdx: number; endIdx: number; uniqueKey: string }> = [];
    const usedPositions = new Set<number>();
    
    wordIds.forEach((wordId) => {
      const vocab = vocabMap[wordId];
      if (vocab) {
        let searchIdx = 0;
        // 이 단어의 모든 등장 위치를 찾되, 아직 사용되지 않은 위치만
        while (searchIdx < content.length) {
          const startIdx = content.indexOf(vocab.characters, searchIdx);
          if (startIdx < 0) break;
          
          const endIdx = startIdx + vocab.characters.length;
          // 이 위치가 아직 사용되지 않았다면 추가
          if (!usedPositions.has(startIdx)) {
            // 이 위치 범위의 모든 인덱스를 사용됨으로 표시
            for (let i = startIdx; i < endIdx; i++) {
              usedPositions.add(i);
            }
            contentWords.push({
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
    contentWords.sort((a, b) => a.startIdx - b.startIdx);

    const elements: React.ReactElement[] = [];
    let lastIdx = 0;

    contentWords.forEach((wordInfo) => {
      // 단어 앞의 텍스트
      if (wordInfo.startIdx > lastIdx) {
        elements.push(
          <span key={`text-${lastIdx}`} className="text-black">
            {content.substring(lastIdx, wordInfo.startIdx)}
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
    if (lastIdx < content.length) {
      elements.push(
        <span key={`text-${lastIdx}`} className="text-black">
          {content.substring(lastIdx)}
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1 text-base sm:text-lg leading-relaxed">
        {elements.length > 0 ? elements : <span className="text-black">{content}</span>}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black tracking-tight">📖 Reading</h1>
          <p className="text-sm text-blue-600 font-medium mt-1">Reading comprehension</p>
        </div>

        <div className="ios-card p-6 transition-ios shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">{currentReading.title}</h2>
        
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={handleTTS}
            disabled={isPlaying}
            className={`w-16 h-16 rounded-2xl transition-ios shadow-lg flex items-center justify-center ${
              isPlaying 
                ? 'bg-blue-200 cursor-wait' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600 active:scale-95'
            }`}
            aria-label="Play reading pronunciation"
          >
            <Volume2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="mb-5 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 shadow-sm">
          {renderContentWithHints(currentReading.content, currentReading.wordIds)}
        </div>

        <div className="space-y-3 mb-5">
          {currentReading.questions.map((question) => (
            <div key={question.id} className="p-4 bg-white/50 rounded-2xl border border-blue-200/50 shadow-sm">
              <div className="font-bold mb-3 text-black text-base">{question.question}</div>
              <div className="space-y-2">
                {question.options.map((option, idx) => {
                  const isSelected = selectedAnswers[question.id] === idx;
                  const isCorrect = idx === question.correctAnswer;
                  const showCorrect = showResults && isCorrect;
                  const showIncorrect = showResults && isSelected && !isCorrect;

                  return (
                    <button
                      key={idx}
                      onClick={() => !showResults && handleAnswerSelect(question.id, idx)}
                      disabled={showResults}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-ios text-base ${
                        showCorrect
                          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-500 text-black font-bold shadow-md'
                          : showIncorrect
                          ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-500 text-black font-bold shadow-md'
                          : isSelected
                          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 text-black font-bold shadow-sm'
                          : 'bg-white border-blue-200 text-black active:scale-98'
                      }`}
                    >
                      {option}
                      {showCorrect && ' ✓'}
                      {showIncorrect && ' ✗'}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!showResults ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95"
          >
            Submit Answers
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95"
          >
            Next Reading
          </button>
        )}

        <div className="mt-4 text-sm font-bold text-black/60 text-center">
          {currentIndex + 1} / {readings.length}
        </div>
      </div>
    </div>
  );
}
