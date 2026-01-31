import type { Vocabulary, Grammar, Sentence, Reading } from '@/types';

// JSON 데이터 캐시
let vocabularyDataCache: Vocabulary[] | null = null;
let grammarDataCache: Grammar[] | null = null;
let sentencesDataCache: Sentence[] | null = null;
let readingsDataCache: Reading[] | null = null;

// API를 통해 데이터 로드
async function loadJsonDataFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to load ${endpoint}`);
  }
  return response.json();
}


// 단어 데이터 로드 (비동기 - 클라이언트/서버 모두)
export async function loadVocabularyAsync(): Promise<Vocabulary[]> {
  if (vocabularyDataCache) {
    return vocabularyDataCache;
  }
  vocabularyDataCache = await loadJsonDataFromAPI<Vocabulary[]>('/api/data/vocabulary');
  return vocabularyDataCache;
}

// 단어 데이터 로드 (동기 - 서버만, API 라우트 사용)
export function loadVocabulary(): Vocabulary[] {
  if (vocabularyDataCache) {
    return vocabularyDataCache;
  }
  throw new Error('Use loadVocabularyAsync() - synchronous loading not supported');
}

// 단어 ID로 단어 찾기
export function getVocabularyById(id: string, data?: Vocabulary[]): Vocabulary | undefined {
  const vocabData = data || vocabularyDataCache || [];
  return vocabData.find((vocab) => vocab.id === id);
}

// 여러 단어 ID로 단어 찾기
export function getVocabularyByIds(ids: string[], data?: Vocabulary[]): Vocabulary[] {
  const vocabData = data || vocabularyDataCache || [];
  return vocabData.filter((vocab) => ids.includes(vocab.id));
}

// 문법 데이터 로드
export async function loadGrammarAsync(): Promise<Grammar[]> {
  if (grammarDataCache) {
    return grammarDataCache;
  }
  grammarDataCache = await loadJsonDataFromAPI<Grammar[]>('/api/data/grammar');
  return grammarDataCache;
}

export function loadGrammar(): Grammar[] {
  if (grammarDataCache) {
    return grammarDataCache;
  }
  throw new Error('Use loadGrammarAsync() - synchronous loading not supported');
}

// 문법 ID로 문법 찾기
export function getGrammarById(id: string, data?: Grammar[]): Grammar | undefined {
  const grammarData = data || grammarDataCache || [];
  return grammarData.find((grammar) => grammar.id === id);
}

// 여러 문법 ID로 문법 찾기
export function getGrammarByIds(ids: string[], data?: Grammar[]): Grammar[] {
  const grammarData = data || grammarDataCache || [];
  return grammarData.filter((grammar) => ids.includes(grammar.id));
}

// 문장 데이터 로드
export async function loadSentencesAsync(): Promise<Sentence[]> {
  if (sentencesDataCache) {
    return sentencesDataCache;
  }
  sentencesDataCache = await loadJsonDataFromAPI<Sentence[]>('/api/data/sentences');
  return sentencesDataCache;
}

export function loadSentences(): Sentence[] {
  if (sentencesDataCache) {
    return sentencesDataCache;
  }
  throw new Error('Use loadSentencesAsync() - synchronous loading not supported');
}

// 문장 ID로 문장 찾기
export function getSentenceById(id: string, data?: Sentence[]): Sentence | undefined {
  const sentenceData = data || sentencesDataCache || [];
  return sentenceData.find((sentence) => sentence.id === id);
}

// 단어 ID로 관련 문장 찾기
export function getSentencesByWordId(wordId: string, data?: Sentence[]): Sentence[] {
  const sentenceData = data || sentencesDataCache || [];
  return sentenceData.filter((sentence) => sentence.wordIds.includes(wordId));
}

// 문법 ID로 관련 문장 찾기
export function getSentencesByGrammarId(grammarId: string, data?: Sentence[]): Sentence[] {
  const sentenceData = data || sentencesDataCache || [];
  return sentenceData.filter((sentence) => sentence.grammarIds.includes(grammarId));
}

// 독해 데이터 로드
export async function loadReadingsAsync(): Promise<Reading[]> {
  if (readingsDataCache) {
    return readingsDataCache;
  }
  readingsDataCache = await loadJsonDataFromAPI<Reading[]>('/api/data/readings');
  return readingsDataCache;
}

export function loadReadings(): Reading[] {
  if (readingsDataCache) {
    return readingsDataCache;
  }
  throw new Error('Use loadReadingsAsync() - synchronous loading not supported');
}

// 독해 ID로 독해 찾기
export function getReadingById(id: string, data?: Reading[]): Reading | undefined {
  const readingData = data || readingsDataCache || [];
  return readingData.find((reading) => reading.id === id);
}

// 단어 ID로 관련 독해 찾기
export function getReadingsByWordId(wordId: string, data?: Reading[]): Reading[] {
  const readingData = data || readingsDataCache || [];
  return readingData.filter((reading) => reading.wordIds.includes(wordId));
}

// 문법 ID로 관련 독해 찾기
export function getReadingsByGrammarId(grammarId: string, data?: Reading[]): Reading[] {
  const readingData = data || readingsDataCache || [];
  return readingData.filter((reading) => reading.grammarIds.includes(grammarId));
}

// 난이도별 문장 필터링
export function getSentencesByDifficulty(difficulty: number, data?: Sentence[]): Sentence[] {
  const sentenceData = data || sentencesDataCache || [];
  return sentenceData.filter((sentence) => sentence.difficulty === difficulty);
}

