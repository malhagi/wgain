import type { LearningProgress } from '@/types';
import { updateProgressOnCorrect, updateProgressOnIncorrect, isDueToday, needsReview } from './spacedRepetition';

// 학습 큐 항목 타입
export interface QueueItem {
  itemId: string;
  itemType: 'vocabulary' | 'grammar' | 'sentence' | 'reading';
  priority: number;
  addedAt: string;
}

// 우선순위 계산
export function calculatePriority(progress: LearningProgress): number {
  let priority = 0;

  // 오답 횟수가 많을수록 높은 우선순위
  priority += progress.incorrectCount * 10;

  // 최근에 틀린 항목 (오늘 틀렸으면 더 높은 우선순위)
  const lastStudied = new Date(progress.lastStudiedAt);
  const today = new Date();
  const daysSinceLastStudy = Math.floor(
    (today.getTime() - lastStudied.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceLastStudy === 0 && progress.incorrectCount > 0) {
    priority += 50; // 오늘 틀린 항목은 매우 높은 우선순위
  }

  // 힌트를 많이 사용한 항목은 더 자주 출제
  const hintUsageCount = 
    progress.hintUsage.ttsCount + 
    progress.hintUsage.pinyinCount + 
    progress.hintUsage.meaningCount;
  priority += hintUsageCount * 2;

  // 미학습 항목도 우선순위
  if (progress.status === 'new') {
    priority += 5;
  }

  // 복습 필요한 항목
  if (needsReview(progress)) {
    priority += 3;
  }

  return priority;
}

// 학습 큐 생성
export function createLearningQueue(
  progressMap: Record<string, LearningProgress>
): QueueItem[] {
  const queue: QueueItem[] = [];

  for (const [itemId, progress] of Object.entries(progressMap)) {
    // 오늘 학습할 항목만 큐에 추가
    if (isDueToday(progress) || progress.status === 'new' || needsReview(progress)) {
      const priority = calculatePriority(progress);
      queue.push({
        itemId,
        itemType: progress.itemType,
        priority,
        addedAt: new Date().toISOString(),
      });
    }
  }

  // 우선순위가 높은 순으로 정렬
  queue.sort((a, b) => b.priority - a.priority);

  return queue;
}

// 항목을 큐에 즉시 추가 (오답 시)
export function addToQueueImmediately(
  queue: QueueItem[],
  itemId: string,
  itemType: 'vocabulary' | 'grammar' | 'sentence' | 'reading',
  progress: LearningProgress
): QueueItem[] {
  // 이미 큐에 있는지 확인
  const existingIndex = queue.findIndex((item) => item.itemId === itemId);
  
  if (existingIndex >= 0) {
    // 이미 있으면 우선순위만 업데이트
    queue[existingIndex].priority = calculatePriority(progress);
    queue[existingIndex].addedAt = new Date().toISOString();
  } else {
    // 없으면 추가
    queue.push({
      itemId,
      itemType,
      priority: calculatePriority(progress),
      addedAt: new Date().toISOString(),
    });
  }

  // 우선순위 순으로 재정렬
  return queue.sort((a, b) => b.priority - a.priority);
}

// 큐에서 다음 항목 가져오기
export function getNextFromQueue(queue: QueueItem[]): QueueItem | null {
  if (queue.length === 0) {
    return null;
  }
  return queue[0];
}

// 큐에서 항목 제거
export function removeFromQueue(
  queue: QueueItem[],
  itemId: string
): QueueItem[] {
  return queue.filter((item) => item.itemId !== itemId);
}

// 정답 처리 후 큐 업데이트
export function handleCorrectAnswer(
  queue: QueueItem[],
  itemId: string,
  progress: LearningProgress
): { queue: QueueItem[]; shouldRemove: boolean } {
  const updatedProgress = updateProgressOnCorrect(progress);
  
  // mastered 상태이고 다음 복습일이 오늘이 아니면 큐에서 제거
  if (updatedProgress.status === 'mastered' && !isDueToday(updatedProgress)) {
    return {
      queue: removeFromQueue(queue, itemId),
      shouldRemove: true,
    };
  }

  // 우선순위 업데이트
  return {
    queue: addToQueueImmediately(
      queue,
      itemId,
      updatedProgress.itemType,
      updatedProgress
    ),
    shouldRemove: false,
  };
}

// 오답 처리 후 큐 업데이트 (즉시 재추가)
export function handleIncorrectAnswer(
  queue: QueueItem[],
  itemId: string,
  progress: LearningProgress
): QueueItem[] {
  const updatedProgress = updateProgressOnIncorrect(progress);
  
  // 오답 시 즉시 큐에 재추가 (높은 우선순위)
  return addToQueueImmediately(
    queue,
    itemId,
    updatedProgress.itemType,
    updatedProgress
  );
}
