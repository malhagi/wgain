// 학습 상태 타입
export type LearningStatus = 'new' | 'learning' | 'review' | 'mastered';

// 힌트 단계 타입
export type HintStage = 'none' | 'tts' | 'pinyin' | 'meaning';

// 단어 타입
export interface Vocabulary {
  id: string;
  characters: string; // Simplified Chinese characters
  pinyin: string;
  meaning: string; // English meaning
  example?: string;
  status?: LearningStatus;
}

// 문법 타입
export interface Grammar {
  id: string;
  name: string;
  description: string;
  examples: string[];
  relatedWordIds?: string[];
  status?: LearningStatus;
}

// 문장 타입
export interface Sentence {
  id: string;
  content: string; // 간체자
  translation: string;
  wordIds: string[];
  grammarIds: string[];
  difficulty: number;
}

// 독해 문제 타입
export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// 독해 타입
export interface Reading {
  id: string;
  title: string;
  content: string; // 간체자, 300자 이내
  questions: ReadingQuestion[];
  wordIds: string[];
  grammarIds: string[];
}

// 힌트 사용 추적
export interface HintUsage {
  ttsCount: number;
  pinyinCount: number;
  meaningCount: number;
  lastHintStage: HintStage;
}

// 학습 진행도
export interface LearningProgress {
  itemId: string;
  itemType: 'vocabulary' | 'grammar' | 'sentence' | 'reading';
  status: LearningStatus;
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  lastStudiedAt: string; // ISO date string
  nextReviewAt: string; // ISO date string
  hintUsage: HintUsage;
}

// 사용자 진행도 (전체)
export interface UserProgress {
  vocabulary: Record<string, LearningProgress>;
  grammar: Record<string, LearningProgress>;
  sentence: Record<string, LearningProgress>;
  reading: Record<string, LearningProgress>;
  lastUpdated: string;
}

// 학습 큐 항목
export interface LearningQueueItem {
  itemId: string;
  itemType: 'vocabulary' | 'grammar' | 'sentence' | 'reading';
  priority: number;
  addedAt: string;
}

// 퀴즈 모드 타입
export type QuizMode = 'character-to-meaning' | 'meaning-to-character' | 'pinyin-to-meaning' | 'character-to-pinyin';

// 퀴즈 문제
export interface QuizQuestion {
  id: string;
  mode: QuizMode;
  question: string;
  correctAnswer: string;
  options?: string[];
  itemId: string;
  itemType: 'vocabulary' | 'grammar' | 'sentence';
}
