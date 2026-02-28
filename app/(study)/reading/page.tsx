'use client';

import { useEffect, useState, useCallback } from 'react';
import { loadReadingsAsync } from '@/lib/data/loader';
import { getOrInitializeProgress, updateItemProgress } from '@/lib/utils/storage';
import { getOrCreateProgress } from '@/lib/learning/progressTracker';
import type { Reading, LearningProgress, UserProgress } from '@/types';
import { Volume2, Headphones, ChevronRight, RotateCcw } from 'lucide-react';
import { speakChinese, stopSpeaking } from '@/lib/tts/chineseTTS';

const LISTENING_TTS_RATE = 0.6;
const NORMAL_TTS_RATE = 0.8;

type ReadingPhase = 'listening' | 'quiz' | 'text';

export default function ReadingPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [currentReading, setCurrentReading] = useState<Reading | null>(null);
  const [phase, setPhase] = useState<ReadingPhase>('listening');
  const [hasListened, setHasListened] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [shownIds, setShownIds] = useState<Set<string>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentProgress, setCurrentProgress] = useState<LearningProgress | null>(null);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const pickRandomReading = useCallback((readingList: Reading[], shown: Set<string>): Reading | null => {
    if (readingList.length === 0) return null;
    const unseen = readingList.filter(r => !shown.has(r.id));
    const pool = unseen.length > 0 ? unseen : readingList;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }, []);

  useEffect(() => {
    loadReadingsAsync().then((readingList) => {
      if (readingList.length === 0) return;
      setReadings(readingList);

      const userProgress = getOrInitializeProgress();
      setProgress(userProgress);

      const reading = pickRandomReading(readingList, new Set());
      if (reading) {
        setCurrentReading(reading);
        setShownIds(new Set([reading.id]));
        const readingProgress = getOrCreateProgress(userProgress, reading.id, 'reading');
        setCurrentProgress(readingProgress);
      }
    }).catch(() => {
      // API load failure handled gracefully
    });
  }, [pickRandomReading]);

  useEffect(() => {
    return () => { stopSpeaking(); };
  }, []);

  const handleTTS = async (slow?: boolean) => {
    if (!currentReading || isPlaying) return;
    setIsPlaying(true);
    try {
      const rate = slow ?? (phase === 'listening') ? LISTENING_TTS_RATE : NORMAL_TTS_RATE;
      await speakChinese(currentReading.content, { rate });
    } finally {
      setIsPlaying(false);
      setHasListened(true);
    }
  };

  const handleStartQuiz = () => {
    setPhase('quiz');
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = () => {
    if (!currentReading || !currentProgress || !progress) return;

    let correct = 0;
    currentReading.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    setCorrectCount(correct);
    setTotalAnswered(currentReading.questions.length);

    const allCorrect = correct === currentReading.questions.length;
    const updatedProgress = updateItemProgress(progress, {
      ...currentProgress,
      correctCount: allCorrect ? currentProgress.correctCount + 1 : currentProgress.correctCount,
      incorrectCount: allCorrect ? currentProgress.incorrectCount : currentProgress.incorrectCount + 1,
      consecutiveCorrect: allCorrect ? currentProgress.consecutiveCorrect + 1 : 0,
    });

    setProgress(updatedProgress);
    setCurrentProgress(updatedProgress.reading[currentReading.id]);
    setPhase('text');
  };

  const handleNext = () => {
    stopSpeaking();
    const newShown = new Set(shownIds);
    if (newShown.size >= readings.length) {
      newShown.clear();
    }
    const next = pickRandomReading(readings, newShown);
    if (!next) return;
    newShown.add(next.id);

    setCurrentReading(next);
    setShownIds(newShown);
    setPhase('listening');
    setHasListened(false);
    setSelectedAnswers({});
    setCorrectCount(0);
    setTotalAnswered(0);

    if (progress) {
      const nextProgress = getOrCreateProgress(progress, next.id, 'reading');
      setCurrentProgress(nextProgress);
    }
  };

  if (!currentReading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-black/60">Loading...</div>
      </div>
    );
  }

  const allQuestionsAnswered = currentReading.questions.every(
    q => selectedAnswers[q.id] !== undefined
  );

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black tracking-tight flex items-center gap-2">
          <Headphones className="w-8 h-8 text-blue-600" />
          Listening
        </h1>
        <p className="text-sm text-blue-600 font-medium mt-1">Listen and comprehend</p>
      </div>

      {/* Phase Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {(['listening', 'quiz', 'text'] as const).map((p, i) => {
          const labels = ['Listen', 'Quiz', 'Text'];
          const isActive = p === phase;
          const isDone = (phase === 'quiz' && i === 0) || (phase === 'text' && i < 2);
          return (
            <div key={p} className="flex items-center gap-2">
              {i > 0 && (
                <div className={`w-8 h-0.5 ${isDone || isActive ? 'bg-blue-500' : 'bg-black/10'}`} />
              )}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : isDone
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-black/5 text-black/40'
              }`}>
                <span>{i + 1}</span>
                <span>{labels[i]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase 1: Listening */}
      {phase === 'listening' && (
        <div className="ios-card p-6 transition-ios shadow-lg">
          <h2 className="text-xl font-bold text-black text-center mb-8">
            {currentReading.title}
          </h2>

          <div className="flex flex-col items-center gap-6 mb-8">
            <button
              onClick={() => handleTTS(true)}
              disabled={isPlaying}
              className={`w-24 h-24 rounded-3xl transition-ios shadow-xl flex items-center justify-center ${
                isPlaying
                  ? 'bg-blue-300 cursor-wait animate-pulse'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 active:scale-95'
              }`}
              aria-label="Play passage audio"
            >
              <Volume2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </button>

            <p className="text-sm text-black/50 font-medium">
              {isPlaying ? 'Playing slowly...' : hasListened ? 'Tap to replay' : 'Tap to listen'}
            </p>
          </div>

          {hasListened && (
            <div className="space-y-3">
              <button
                onClick={() => handleTTS(true)}
                disabled={isPlaying}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border-2 border-blue-200 text-blue-600 font-bold text-base transition-ios active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
              <button
                onClick={handleStartQuiz}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95"
              >
                Start Quiz
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Phase 2: Quiz */}
      {phase === 'quiz' && (
        <div className="ios-card p-6 transition-ios shadow-lg">
          <h2 className="text-lg font-bold text-black mb-4">
            {currentReading.title}
          </h2>

          <button
            onClick={() => handleTTS(false)}
            disabled={isPlaying}
            className={`flex items-center gap-2 mb-5 px-4 py-2 rounded-xl text-sm font-bold transition-ios ${
              isPlaying
                ? 'bg-blue-100 text-blue-400 cursor-wait'
                : 'bg-blue-50 text-blue-600 active:scale-95'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {isPlaying ? 'Playing...' : 'Replay'}
          </button>

          <div className="space-y-4 mb-6">
            {currentReading.questions.map((question, qIdx) => (
              <div key={question.id} className="p-4 bg-white/50 rounded-2xl border border-blue-200/50 shadow-sm">
                <div className="font-bold mb-3 text-black text-base">
                  {qIdx + 1}. {question.question}
                </div>
                <div className="space-y-2">
                  {question.options.map((option, idx) => {
                    const isSelected = selectedAnswers[question.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(question.id, idx)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-ios text-base ${
                          isSelected
                            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 text-black font-bold shadow-sm'
                            : 'bg-white border-blue-200 text-black active:scale-98'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95 ${
              allQuestionsAnswered
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                : 'bg-black/10 text-black/30 cursor-not-allowed'
            }`}
          >
            Submit Answers
          </button>
        </div>
      )}

      {/* Phase 3: Text View */}
      {phase === 'text' && (
        <div className="space-y-4">
          {/* Score */}
          <div className={`ios-card p-4 transition-ios shadow-lg text-center ${
            correctCount === totalAnswered
              ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
              : 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200'
          }`}>
            <div className="text-2xl font-bold">
              {correctCount === totalAnswered ? '🎉' : '📝'} {correctCount} / {totalAnswered}
            </div>
            <div className="text-sm font-medium text-black/60 mt-1">
              {correctCount === totalAnswered ? 'Perfect!' : 'Keep practicing!'}
            </div>
          </div>

          {/* Passage */}
          <div className="ios-card p-6 transition-ios shadow-lg">
            <h2 className="text-lg font-bold text-black mb-3">
              {currentReading.title}
            </h2>

            <button
              onClick={() => handleTTS(false)}
              disabled={isPlaying}
              className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-xl text-sm font-bold transition-ios ${
                isPlaying
                  ? 'bg-blue-100 text-blue-400 cursor-wait'
                  : 'bg-blue-50 text-blue-600 active:scale-95'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {isPlaying ? 'Playing...' : 'Play'}
            </button>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 shadow-sm mb-5">
              <p className="text-lg leading-relaxed text-black">
                {currentReading.content}
              </p>
            </div>

            {/* Quiz Results */}
            <div className="space-y-3 mb-5">
              {currentReading.questions.map((question, qIdx) => {
                const userAnswer = selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div key={question.id} className="p-4 bg-white/50 rounded-2xl border border-blue-200/50 shadow-sm">
                    <div className="font-bold mb-3 text-black text-base">
                      {qIdx + 1}. {question.question}
                    </div>
                    <div className="space-y-2">
                      {question.options.map((option, idx) => {
                        const isUserChoice = userAnswer === idx;
                        const isCorrectOption = idx === question.correctAnswer;
                        const showCorrect = isCorrectOption;
                        const showIncorrect = isUserChoice && !isCorrect;

                        return (
                          <div
                            key={idx}
                            className={`w-full text-left p-4 rounded-xl border-2 text-base ${
                              showCorrect
                                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-500 text-black font-bold shadow-md'
                                : showIncorrect
                                ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-500 text-black font-bold shadow-md'
                                : 'bg-white border-blue-100 text-black/50'
                            }`}
                          >
                            {option}
                            {showCorrect && ' ✓'}
                            {showIncorrect && ' ✗'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95"
            >
              Next Reading
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Counter */}
      <div className="mt-4 text-sm font-bold text-black/40 text-center">
        {shownIds.size} / {readings.length}
      </div>
    </div>
  );
}
