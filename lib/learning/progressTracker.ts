import type { LearningProgress, UserProgress, HintStage, HintUsage } from '@/types';

// 초기 진행도 생성
export function createInitialProgress(
  itemId: string,
  itemType: 'vocabulary' | 'grammar' | 'sentence' | 'reading'
): LearningProgress {
  return {
    itemId,
    itemType,
    status: 'new',
    correctCount: 0,
    incorrectCount: 0,
    consecutiveCorrect: 0,
    lastStudiedAt: new Date().toISOString(),
    nextReviewAt: new Date().toISOString(),
    hintUsage: {
      ttsCount: 0,
      pinyinCount: 0,
      meaningCount: 0,
      lastHintStage: 'none',
    },
  };
}

// 진행도 가져오기 (없으면 생성)
export function getOrCreateProgress(
  userProgress: UserProgress,
  itemId: string,
  itemType: 'vocabulary' | 'grammar' | 'sentence' | 'reading'
): LearningProgress {
  const progressMap = userProgress[itemType];
  
  if (progressMap[itemId]) {
    return progressMap[itemId];
  }

  // 없으면 생성
  const newProgress = createInitialProgress(itemId, itemType);
  progressMap[itemId] = newProgress;
  return newProgress;
}

// 힌트 사용 추적
export function updateHintUsage(
  progress: LearningProgress,
  hintStage: HintStage
): LearningProgress {
  const hintUsage: HintUsage = { ...progress.hintUsage };

  switch (hintStage) {
    case 'tts':
      hintUsage.ttsCount += 1;
      hintUsage.lastHintStage = 'tts';
      break;
    case 'pinyin':
      hintUsage.pinyinCount += 1;
      hintUsage.lastHintStage = 'pinyin';
      break;
    case 'meaning':
      hintUsage.meaningCount += 1;
      hintUsage.lastHintStage = 'meaning';
      break;
    default:
      break;
  }

  return {
    ...progress,
    hintUsage,
  };
}

// 진행도 업데이트
export function updateProgress(
  userProgress: UserProgress,
  progress: LearningProgress
): UserProgress {
  const updated = {
    ...userProgress,
    [progress.itemType]: {
      ...userProgress[progress.itemType],
      [progress.itemId]: progress,
    },
    lastUpdated: new Date().toISOString(),
  };

  return updated;
}

// 전체 진행도 통계 계산
export function calculateOverallStats(userProgress: UserProgress): {
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
} {
  let total = 0;
  let newCount = 0;
  let learningCount = 0;
  let reviewCount = 0;
  let masteredCount = 0;

  const types: Array<'vocabulary' | 'grammar' | 'sentence' | 'reading'> = [
    'vocabulary',
    'grammar',
    'sentence',
    'reading',
  ];

  for (const type of types) {
    const progressMap = userProgress[type];
    for (const progress of Object.values(progressMap)) {
      total++;
      switch (progress.status) {
        case 'new':
          newCount++;
          break;
        case 'learning':
          learningCount++;
          break;
        case 'review':
          reviewCount++;
          break;
        case 'mastered':
          masteredCount++;
          break;
      }
    }
  }

  return {
    total,
    new: newCount,
    learning: learningCount,
    review: reviewCount,
    mastered: masteredCount,
  };
}

// 섹션별 진행도 통계
export function calculateSectionStats(
  userProgress: UserProgress,
  section: 'vocabulary' | 'grammar' | 'sentence' | 'reading'
): {
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
} {
  const progressMap = userProgress[section];
  let total = 0;
  let newCount = 0;
  let learningCount = 0;
  let reviewCount = 0;
  let masteredCount = 0;

  for (const progress of Object.values(progressMap)) {
    total++;
    switch (progress.status) {
      case 'new':
        newCount++;
        break;
      case 'learning':
        learningCount++;
        break;
      case 'review':
        reviewCount++;
        break;
      case 'mastered':
        masteredCount++;
        break;
    }
  }

  return {
    total,
    new: newCount,
    learning: learningCount,
    review: reviewCount,
    mastered: masteredCount,
  };
}
