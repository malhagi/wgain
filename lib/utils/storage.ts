import type { UserProgress, LearningProgress } from '@/types';

const STORAGE_KEY = 'hsk_learning_progress';

// 로컬스토리지에서 진행도 로드
export function loadProgress(): UserProgress | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as UserProgress;
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return null;
  }
}

// 초기 진행도 생성
export function createInitialUserProgress(): UserProgress {
  return {
    vocabulary: {},
    grammar: {},
    sentence: {},
    reading: {},
    lastUpdated: new Date().toISOString(),
  };
}

// 진행도 가져오기 (없으면 초기화)
export function getOrInitializeProgress(): UserProgress {
  const loaded = loadProgress();
  if (loaded) {
    return loaded;
  }
  return createInitialUserProgress();
}

// 진행도 저장
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const updated = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
}

// 특정 항목의 진행도 업데이트
export function updateItemProgress(
  progress: UserProgress,
  itemProgress: LearningProgress
): UserProgress {
  const updated = {
    ...progress,
    [itemProgress.itemType]: {
      ...progress[itemProgress.itemType],
      [itemProgress.itemId]: itemProgress,
    },
    lastUpdated: new Date().toISOString(),
  };

  saveProgress(updated);
  return updated;
}

// 진행도 초기화
export function resetProgress(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
}

// 진행도 백업 (JSON 다운로드)
export function exportProgress(): string {
  const progress = getOrInitializeProgress();
  return JSON.stringify(progress, null, 2);
}

// 진행도 복원 (JSON 업로드)
export function importProgress(jsonString: string): UserProgress | null {
  try {
    const progress = JSON.parse(jsonString) as UserProgress;
    saveProgress(progress);
    return progress;
  } catch (error) {
    console.error('Failed to import progress:', error);
    return null;
  }
}
