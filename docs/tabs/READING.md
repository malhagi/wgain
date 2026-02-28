# Reading Tab Specification

> **Tab**: Reading  
> **Route**: `/reading`  
> **Status**: ✅ Implemented  
> **Last Updated**: 2026-02-28

## Purpose
Listening comprehension + reading practice in a 3-step flow: Listen → Quiz → Read.

## Flow Overview

```
┌────────────┐    ┌────────────┐    ┌────────────┐
│ 1. Listen  │───▶│  2. Quiz   │───▶│  3. Text   │
│ TTS 재생   │    │ 문제 풀기   │    │ 본문 보기   │
└────────────┘    └────────────┘    └────────────┘
                                          │
                                    [Next Reading]
                                    (랜덤 순서)
```

## Layout

### Phase 1: Listening

```
┌─────────────────────────────────┐
│ 🎧 Listening                    │
│ Listen and comprehend           │
├─────────────────────────────────┤
│                                  │
│   ┌──────────────────────────┐  │
│   │                          │  │
│   │      📖 我的学校生活       │  │
│   │                          │  │
│   │          🔊              │  │
│   │    (Big play button)     │  │
│   │                          │  │
│   │   "Listen to the passage" │  │
│   │                          │  │
│   └──────────────────────────┘  │
│                                  │
│   [▶ Play Again]                │
│                                  │
│   [Start Quiz →]                │
│   (활성: 1회 이상 재생 후)       │
│                                  │
│ 3 / 100                         │
└─────────────────────────────────┘
```

### Phase 2: Quiz

```
┌─────────────────────────────────┐
│ 🎧 Listening                    │
│ Listen and comprehend           │
├─────────────────────────────────┤
│                                  │
│   📖 我的学校生活                │
│                                  │
│   [🔊 Play Again]              │
│                                  │
│ 问题 1: 作者每天几点起床?        │
│ ○ 六点                          │
│ ○ 七点  ← Selected (blue)      │
│ ○ 八点                          │
│ ○ 九点                          │
│                                  │
│ 问题 2: ...                     │
│ ...                              │
│                                  │
│ [Submit Answers]                │
│                                  │
│ 3 / 100                         │
└─────────────────────────────────┘
```

### Phase 3: Text View

```
┌─────────────────────────────────┐
│ 🎧 Listening                    │
│ Listen and comprehend           │
├─────────────────────────────────┤
│                                  │
│   Score: 2/3 ✓                  │
│                                  │
│   📖 我的学校生活                │
│                                  │
│   [🔊 Play]                    │
│                                  │
│ ┌──────────────────────────────┐│
│ │ 我是学生，每天都要去学校。    ││
│ │ 早上七点起床，八点去学校。    ││
│ │ (Plain text, no word hints)  ││
│ └──────────────────────────────┘│
│                                  │
│ 问题 1: ... ✓ (결과 표시)       │
│ 问题 2: ... ✗ (결과 표시)       │
│                                  │
│ [Next Reading →]                │
│                                  │
│ 3 / 100                         │
└─────────────────────────────────┘
```

## Key Components

### 1. Phase Indicator
Progress dots or step indicator showing current phase (1/2/3).

### 2. Title
```tsx
<h2 className="text-xl font-bold text-black">{currentReading.title}</h2>
```
Visible in all phases.

### 3. TTS Button
- **Listening phase**: Large centered button (64x64), auto-plays on entry
- **Quiz phase**: Smaller replay button above questions
- **Text phase**: Small replay button above passage

### 4. Passage Text (Phase 3 only)
**No per-word pronunciation/hints**. Plain text display.

```css
Background: bg-gradient-to-br from-blue-50 to-blue-100
Border: border border-blue-200/50
Shape: rounded-2xl
Padding: p-5
Font: text-lg leading-relaxed
```

### 5. Questions Section (Phase 2 & 3)
Same styling as before. In Phase 3, results are shown.

### 6. Navigation
- **"Start Quiz"**: Appears after listening at least once
- **"Submit Answers"**: During quiz phase
- **"Next Reading"**: After viewing text (goes to random reading)

## Data Model

```typescript
interface Reading {
  id: string;
  title: string;
  content: string;
  questions: ReadingQuestion[];
  wordIds: string[];
  grammarIds: string[];
}

interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}
```

## Behavior Flow

### On Load
1. Load readings data
2. Pick random reading (not recently shown)
3. Start in Listening phase

### Phase 1: Listening
1. Show title + large TTS button
2. Auto-play TTS on first load
3. User can replay
4. After first play, "Start Quiz" button becomes active
5. User clicks "Start Quiz" → Phase 2

### Phase 2: Quiz
1. Show title + small TTS replay button
2. Show questions with options
3. User selects answers
4. User clicks "Submit" → show results → Phase 3

### Phase 3: Text View
1. Show score summary
2. Show full passage text (plain, no word hints)
3. Show quiz results with correct/incorrect markers
4. TTS replay available
5. User clicks "Next Reading" → random reading → Phase 1

### Random Navigation
- Maintain list of shown reading IDs in session
- Pick random from unshown readings
- When all shown, reset the list

## Answer Feedback (Phase 2 → 3)

**Correct Answer**:
```css
Background: bg-gradient-to-br from-green-50 to-green-100
Border: border-2 border-green-500
Append: " ✓"
```

**Incorrect Selection**:
```css
Background: bg-gradient-to-br from-red-50 to-red-100
Border: border-2 border-red-500
Append: " ✗"
```

## State Management

```typescript
type ReadingPhase = 'listening' | 'quiz' | 'text';

const [readings, setReadings] = useState<Reading[]>([]);
const [currentReading, setCurrentReading] = useState<Reading | null>(null);
const [phase, setPhase] = useState<ReadingPhase>('listening');
const [hasListened, setHasListened] = useState(false);
const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
const [isPlaying, setIsPlaying] = useState(false);
const [shownIds, setShownIds] = useState<Set<string>>(new Set());
const [correctCount, setCorrectCount] = useState(0);
```

## Scoring
Same as before: track correct/incorrect per reading in UserProgress.

## Mobile Optimization
- Container: max-w-2xl px-4 py-6 pb-24
- Touch targets: min 44px height
- Large TTS button in listening phase for easy tap
- Full-width option buttons

---

**See**: [Full Design Spec](../DESIGN_SPEC.md#reading-tab-spec) for complete details
