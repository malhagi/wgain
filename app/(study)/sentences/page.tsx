'use client';

import { useEffect, useState } from 'react';
import { loadSentencesAsync, loadGrammarAsync } from '@/lib/data/loader';
import { getOrInitializeProgress, updateItemProgress } from '@/lib/utils/storage';
import { getOrCreateProgress } from '@/lib/learning/progressTracker';
import { createLearningQueue, handleCorrectAnswer, handleIncorrectAnswer } from '@/lib/learning/learningQueue';
import { updateProgressOnCorrect, updateProgressOnIncorrect } from '@/lib/learning/spacedRepetition';
import type { Sentence, Grammar, LearningProgress, UserProgress } from '@/types';
import { CheckCircle2, XCircle, Volume2, Eye, EyeOff } from 'lucide-react';
import { speakChinese, stopSpeaking } from '@/lib/tts/chineseTTS';

export default function SentencesPage() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentProgress, setCurrentProgress] = useState<LearningProgress | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingExamples, setIsPlayingExamples] = useState(false);
  const [showKorean, setShowKorean] = useState(false);
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([loadSentencesAsync(), loadGrammarAsync()]).then(([sentenceList, grammarList]) => {
      setSentences(sentenceList);
      setGrammars(grammarList);

      const userProgress = getOrInitializeProgress();
      setProgress(userProgress);

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
    }).catch(() => {
      // API load failure handled gracefully
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

  const handleExamplesTTS = async () => {
    if (!currentSentence || isPlayingExamples) return;
    const examples = currentSentence.examples ?? [];
    if (examples.length === 0) return;

    setIsPlayingExamples(true);
    try {
      for (const ex of examples) {
        await speakChinese(ex.chinese);
      }
    } catch (error) {
      console.error('Example TTS error:', error);
    } finally {
      setIsPlayingExamples(false);
    }
  };

  const playSingleExample = async (text: string, key: string) => {
    if (playingSentenceIdx) {
      stopSpeaking();
      setPlayingSentenceIdx(null);
      return;
    }
    setPlayingSentenceIdx(key);
    try {
      await speakChinese(text);
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setPlayingSentenceIdx(null);
    }
  };

  const handleCorrect = () => {
    if (!currentProgress || !progress || !currentSentence) return;

    const updatedProgressData = updateProgressOnCorrect(currentProgress);
    const updatedProgress = updateItemProgress(progress, updatedProgressData);

    const { queue: updatedQueue } = handleCorrectAnswer(
      createLearningQueue(updatedProgress.sentence),
      currentSentence.id,
      updatedProgressData
    );

    setProgress(updatedProgress);
    setCurrentProgress(updatedProgressData);

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
    setShowKorean(false);
  };

  const handleIncorrect = () => {
    if (!currentProgress || !progress || !currentSentence) return;

    const updatedProgressData = updateProgressOnIncorrect(currentProgress);
    const updatedProgress = updateItemProgress(progress, updatedProgressData);

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

  const examples = currentSentence.examples ?? [];

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black tracking-tight">💬 Sentences</h1>
        <p className="text-sm text-blue-600 font-medium mt-1">Practice Chinese sentences</p>
      </div>

      <div className="ios-card p-6 transition-ios shadow-lg">
        {/* TTS Button */}
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

        {/* Main Sentence - plain text, no pinyin */}
        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-black leading-relaxed">
            {currentSentence.content}
          </p>
        </div>

        {/* Translation & Grammar (shown after Don't Know) */}
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

        {/* Action Buttons */}
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
            Don&apos;t Know
          </button>
        </div>

        {/* Progress Counter */}
        <div className="mt-4 text-sm font-bold text-black/60 text-center">
          {currentIndex + 1} / {sentences.length}
        </div>
      </div>

      {/* Example Story Section */}
      {examples.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">예문으로 읽기</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Korean Toggle + Example TTS */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={handleExamplesTTS}
              disabled={isPlayingExamples}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-ios active:scale-95 ${
                isPlayingExamples
                  ? 'bg-blue-200 text-blue-400 cursor-wait'
                  : 'bg-gray-200 text-gray-600'
              }`}
              aria-label="Play example sentences"
            >
              <Volume2 className="w-4 h-4" />
              듣기
            </button>
            <button
              onClick={() => setShowKorean((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-ios active:scale-95 ${
                showKorean
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {showKorean ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              한국어 보기
            </button>
          </div>

          {/* Story */}
          <div className="ios-card p-5 transition-ios shadow-sm space-y-3">
            {examples.map((ex, idx) => {
              const sentenceKey = `story-${idx}`;
              const isSentencePlaying = playingSentenceIdx === sentenceKey;
              return (
                <div key={idx} className="flex items-start gap-2">
                  <button
                    onClick={() => playSingleExample(ex.chinese, sentenceKey)}
                    className={`mt-0.5 w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-ios ${
                      isSentencePlaying
                        ? 'bg-blue-400 text-white'
                        : 'bg-gray-200 text-gray-500 active:scale-90'
                    }`}
                    aria-label={`Play: ${ex.chinese}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                  <div className="flex-1">
                    <p className="text-base text-black leading-relaxed">{ex.chinese}</p>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        showKorean ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-sm text-gray-500">{ex.korean}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
