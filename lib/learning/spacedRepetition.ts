import type { LearningStatus, LearningProgress } from '@/types';

// 복습 간격 계산 (일 단위)
export function calculateNextReviewInterval(
  consecutiveCorrect: number,
  incorrectCount: number,
  hintUsageCount: number
): number {
  // 기본 간격
  let interval = 1; // 1일

  // 연속 정답 횟수에 따라 간격 증가
  if (consecutiveCorrect >= 3) {
    interval = 7; // 3회 이상 정답 시 7일
  } else if (consecutiveCorrect >= 2) {
    interval = 3; // 2회 정답 시 3일
  } else if (consecutiveCorrect >= 1) {
    interval = 1; // 1회 정답 시 1일
  }

  // 오답 횟수가 많으면 간격 감소 (더 자주 복습)
  if (incorrectCount > 3) {
    interval = Math.max(1, interval - 1);
  }

  // 힌트를 많이 사용했으면 간격 감소
  if (hintUsageCount > 5) {
    interval = Math.max(1, interval - 1);
  }

  return interval;
}

// 다음 복습일 계산
export function calculateNextReviewDate(intervalDays: number): Date {
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return nextReview;
}

// 학습 상태 업데이트 (정답 시)
export function updateProgressOnCorrect(
  progress: LearningProgress
): LearningProgress {
  const newConsecutiveCorrect = progress.consecutiveCorrect + 1;
  const newCorrectCount = progress.correctCount + 1;
  
  // 연속 3회 정답 시 mastered 상태로 전환
  let newStatus: LearningStatus = progress.status;
  if (newConsecutiveCorrect >= 3 && progress.status !== 'mastered') {
    newStatus = 'mastered';
  } else if (progress.status === 'new') {
    newStatus = 'learning';
  } else if (progress.status === 'learning' && newConsecutiveCorrect >= 2) {
    newStatus = 'review';
  }

  const hintUsageCount = 
    progress.hintUsage.ttsCount + 
    progress.hintUsage.pinyinCount + 
    progress.hintUsage.meaningCount;

  const interval = calculateNextReviewInterval(
    newConsecutiveCorrect,
    progress.incorrectCount,
    hintUsageCount
  );

  return {
    ...progress,
    status: newStatus,
    correctCount: newCorrectCount,
    consecutiveCorrect: newConsecutiveCorrect,
    incorrectCount: 0, // 정답 시 오답 카운트 리셋
    lastStudiedAt: new Date().toISOString(),
    nextReviewAt: calculateNextReviewDate(interval).toISOString(),
  };
}

// 학습 상태 업데이트 (오답 시)
export function updateProgressOnIncorrect(
  progress: LearningProgress
): LearningProgress {
  const newIncorrectCount = progress.incorrectCount + 1;
  let newStatus: LearningStatus = progress.status;

  // 오답 시 상태 조정
  if (progress.status === 'mastered') {
    newStatus = 'review'; // mastered에서 틀리면 review로
  } else if (progress.status === 'review') {
    newStatus = 'learning'; // review에서 틀리면 learning으로
  }

  return {
    ...progress,
    status: newStatus,
    incorrectCount: newIncorrectCount,
    consecutiveCorrect: 0, // 오답 시 연속 정답 카운트 리셋
    lastStudiedAt: new Date().toISOString(),
    nextReviewAt: calculateNextReviewDate(1).toISOString(), // 오답 시 다음날 복습
  };
}

// 복습이 필요한 항목인지 확인
export function needsReview(progress: LearningProgress): boolean {
  if (progress.status === 'mastered') {
    const nextReview = new Date(progress.nextReviewAt);
    return new Date() >= nextReview;
  }
  return progress.status === 'review' || progress.status === 'learning';
}

// 오늘 학습할 항목인지 확인
export function isDueToday(progress: LearningProgress): boolean {
  if (!progress.nextReviewAt) {
    return true; // 복습일이 없으면 오늘 학습
  }
  
  const nextReview = new Date(progress.nextReviewAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextReview.setHours(0, 0, 0, 0);
  
  return today >= nextReview;
}
