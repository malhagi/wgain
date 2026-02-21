'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadVocabularyAsync } from '@/lib/data/loader';
import { getOrInitializeProgress, updateItemProgress } from '@/lib/utils/storage';
import { getOrCreateProgress, updateHintUsage } from '@/lib/learning/progressTracker';
import { createLearningQueue, handleCorrectAnswer, handleIncorrectAnswer } from '@/lib/learning/learningQueue';
import { updateProgressOnCorrect, updateProgressOnIncorrect } from '@/lib/learning/spacedRepetition';
import ProgressiveHint from '@/components/study/ProgressiveHint';
import type { Vocabulary, LearningProgress, HintStage, UserProgress } from '@/types';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { speakChinese } from '@/lib/tts/chineseTTS';

export default function VocabularyPage() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentProgress, setCurrentProgress] = useState<LearningProgress | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadVocabularyAsync().then((vocabList) => {
      // 1. 단어의 순서를 1,2,3 순서가 아니라 random으로 나오도록 섞어줘
      const shuffledVocab = [...vocabList].sort(() => Math.random() - 0.5);
      setVocabularies(shuffledVocab);

      const userProgress = getOrInitializeProgress();
      setProgress(userProgress);

      // 학습 큐 생성
      const queue = createLearningQueue(userProgress.vocabulary);
      if (queue.length > 0) {
        const firstItem = queue[0];
        const vocab = shuffledVocab.find((v) => v.id === firstItem.itemId);
        if (vocab) {
          const vocabProgress = getOrCreateProgress(userProgress, vocab.id, 'vocabulary');
          setCurrentProgress(vocabProgress);
          setCurrentIndex(shuffledVocab.findIndex((v) => v.id === vocab.id));
        }
      } else if (shuffledVocab.length > 0) {
        // 큐가 비어있으면 섞인 리스트의 첫 번째 단어로
        const vocab = shuffledVocab[0];
        const vocabProgress = getOrCreateProgress(userProgress, vocab.id, 'vocabulary');
        setCurrentProgress(vocabProgress);
      }
    });
  }, []);

  const currentVocab = vocabularies[currentIndex];

  const handleHintUsed = (stage: HintStage) => {
    if (!currentProgress || !progress) return;

    const updatedProgress = updateHintUsage(currentProgress, stage);
    const updatedUserProgress = updateItemProgress(progress, updatedProgress);
    setCurrentProgress(updatedProgress);
    setProgress(updatedUserProgress);
  };

  const handleCorrect = async () => {
    if (!currentProgress || !progress || !currentVocab || isProcessing) return;

    setIsProcessing(true);

    try {
      // 1. 단어 TTS 재생
      await speakChinese(currentVocab.characters);

      // 2. 예문이 있으면 예문 TTS 재생 (순차적으로)
      if (currentVocab.examples && currentVocab.examples.length > 0) {
        for (const example of currentVocab.examples) {
          await speakChinese(example);
        }
      }

      // 3. 진행도 업데이트
      const updatedProgressData = updateProgressOnCorrect(currentProgress);
      const updatedProgress = updateItemProgress(progress, updatedProgressData);

      setProgress(updatedProgress);
      setCurrentProgress(updatedProgressData);

      // 4. 다음 단어로 이동
      const nextIndex = (currentIndex + 1) % vocabularies.length;
      setCurrentIndex(nextIndex);
      const nextVocab = vocabularies[nextIndex];
      const nextProgress = getOrCreateProgress(updatedProgress, nextVocab.id, 'vocabulary');
      setCurrentProgress(nextProgress);

      setShowAnswer(false);
    } catch (error) {
      console.error('Error in handleCorrect:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIncorrect = async () => {
    if (!currentProgress || !progress || !currentVocab || isProcessing) return;

    setIsProcessing(true);

    try {
      // 1. 단어 TTS 재생
      await speakChinese(currentVocab.characters);

      // 2. 예문이 있으면 예문 TTS 재생 (순차적으로)
      if (currentVocab.examples && currentVocab.examples.length > 0) {
        for (const example of currentVocab.examples) {
          await speakChinese(example);
        }
      }

      // 3. 진행도 업데이트
      const updatedProgressData = updateProgressOnIncorrect(currentProgress);
      const updatedProgress = updateItemProgress(progress, updatedProgressData);

      setProgress(updatedProgress);
      setCurrentProgress(updatedProgressData);

      // 4. 다음 단어로 이동
      const nextIndex = (currentIndex + 1) % vocabularies.length;
      setCurrentIndex(nextIndex);
      const nextVocab = vocabularies[nextIndex];
      const nextProgress = getOrCreateProgress(updatedProgress, nextVocab.id, 'vocabulary');
      setCurrentProgress(nextProgress);

      setShowAnswer(false);
    } catch (error) {
      console.error('Error in handleIncorrect:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const playSimilarWord = async (similarWord: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await speakChinese(similarWord.word);
      if (similarWord.examples && similarWord.examples.length > 0) {
        for (const example of similarWord.examples) {
          await speakChinese(example);
        }
      }
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentVocab || !currentProgress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black tracking-tight">📚 Vocabulary</h1>
        <p className="text-sm text-blue-600 font-medium mt-1">Learn Chinese words</p>
      </div>

      <div className="ios-card p-6 mb-5 transition-ios shadow-lg">
        <div className="text-center mb-6">
          {/* 틀린 횟수 표시 */}
          {currentProgress.incorrectCount > 0 && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-300 rounded-xl">
              <span className="text-red-600 font-bold text-sm">❌ Incorrect: {currentProgress.incorrectCount}</span>
            </div>
          )}
          <ProgressiveHint
            key={currentVocab.id} // 단어가 바뀔 때마다 컴포넌트 리마운트하여 힌트 초기화
            characters={currentVocab.characters}
            pinyin={currentVocab.pinyin}
            meaning={currentVocab.meaning}
            examples={currentVocab.examples}
            onHintUsed={handleHintUsed}
            className="mb-4"
          />
        </div>

        {/* 예문 항상 표시 */}
        {currentVocab.examples && currentVocab.examples.length > 0 && (
          <div className="mt-5 p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200/50 shadow-sm">
            <div className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
              📝 Examples
            </div>
            <div className="space-y-3">
              {currentVocab.examples.map((example, idx) => {
                const [chinese, korean] = example.split('|');
                return (
                  <div key={idx} className="pb-2 border-b border-purple-200/40 last:border-0 last:pb-0">
                    <div className="text-base text-black font-medium">{chinese}</div>
                    {korean && <div className="text-sm text-purple-700 mt-1">{korean}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Similar Words Section */}
        {currentVocab.similarWords && currentVocab.similarWords.length > 0 && (
          <div className="mt-5 p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200/50 shadow-sm">
            <div className="text-sm font-bold text-orange-900 mb-4 flex items-center gap-2">
              🔍 Similar Words
            </div>
            <div className="space-y-6">
              {currentVocab.similarWords.map((sim, idx) => (
                <div key={idx} className="pb-4 border-b border-orange-200/60 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-2xl font-bold text-black mr-2">{sim.word}</span>
                      <span className="text-sm text-gray-600 mr-2">{sim.pinyin}</span>
                      <span className="text-sm text-orange-700 font-medium">{sim.meaning}</span>
                    </div>
                    <button
                      onClick={() => playSimilarWord(sim)}
                      disabled={isProcessing}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-ios shadow-sm ${isProcessing ? 'bg-orange-200 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
                        }`}
                      aria-label="Play similar word and examples"
                    >
                      <Volume2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="space-y-3 mt-3">
                    {sim.examples.map((ex, exIdx) => {
                      const [chinese, korean] = ex.split('|');
                      return (
                        <div key={exIdx} className="text-sm text-gray-800">
                          <div className="font-medium text-black">{chinese}</div>
                          {korean && <div className="text-xs text-orange-800 mt-0.5">{korean}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCorrect}
            disabled={isProcessing}
            className={`flex-1 bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
          >
            <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
            {isProcessing ? 'Playing...' : 'I Know'}
          </button>
          <button
            onClick={handleIncorrect}
            disabled={isProcessing}
            className={`flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
          >
            <XCircle className="w-6 h-6" strokeWidth={2.5} />
            {isProcessing ? 'Playing...' : "Don't Know"}
          </button>
        </div>

        <div className="mt-4 text-sm font-bold text-black/60 text-center">
          {currentIndex + 1} / {vocabularies.length}
        </div>
      </div>

      <div className="ios-card p-5 transition-ios">
        <h2 className="font-bold mb-4 text-black text-lg">📊 Statistics</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200/50 shadow-sm">
            <div className="font-bold text-green-900 text-xs mb-1">Correct</div>
            <div className="text-2xl font-bold text-green-600">{currentProgress.correctCount}</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-2xl border border-red-200/50 shadow-sm">
            <div className="font-bold text-red-900 text-xs mb-1">Incorrect</div>
            <div className="text-2xl font-bold text-red-600">{currentProgress.incorrectCount}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200/50 shadow-sm">
            <div className="font-bold text-blue-900 text-xs mb-1">Status</div>
            <div className="text-base font-bold text-blue-600 capitalize">{currentProgress.status}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
