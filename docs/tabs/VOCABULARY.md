# Vocabulary Tab Specification

> **Tab**: Vocabulary  
> **Route**: `/vocabulary`  
> **Status**: ✅ Implemented  
> **Last Updated**: 2026-01-31

## Purpose
Learn individual Chinese words using spaced repetition with progressive hints.

## Layout

```
┌─────────────────────────────────┐
│ 📚 Vocabulary                    │
│ Learn Chinese words              │
├─────────────────────────────────┤
│ ❌ Incorrect: 2 (if any)        │
│                                  │
│        🔊                        │
│                                  │
│       你好                       │
│     (text-6xl)                   │
│                                  │
│   [Show Pinyin]                  │
│    ↓ (after click)               │
│      nǐ hǎo                     │
│                                  │
│   [Show Meaning]                 │
│    ↓ (after click)               │
│      Hello                       │
│                                  │
│ 📝 Example:                     │
│ 你好，我是李明。                │
│                                  │
│ [I Know]  [Don't Know]          │
│                                  │
│ 1 / 600                         │
├─────────────────────────────────┤
│ 📊 Statistics                   │
│ Correct | Incorrect | Status     │
│    5    |     2     | learning   │
└─────────────────────────────────┘
```

## Key Components

### 1. Progressive Hint System

**Stage 0: Initial**
- TTS button (w-16 h-16, blue gradient)
- Chinese characters (text-6xl font-bold)
- "Show Pinyin" button

**Stage 1: After TTS**
- TTS button remains
- Pinyin revealed (text-2xl text-blue-700)
- "Show Meaning" button

**Stage 2: Full Reveal**
- TTS button remains
- Pinyin visible
- Meaning revealed (text-xl text-green-700)

### 2. Example Section
- **Always visible** (not hidden behind hints)
- Purple gradient background
- Shows word in context

### 3. Action Buttons
**I Know Button**:
- Green gradient (from-green-500 to-green-600)
- CheckCircle2 icon
- Triggers: TTS playback → Progress update → Next word

**Don't Know Button**:
- Red gradient (from-red-500 to-red-600)
- XCircle icon
- Triggers: TTS playback → Progress update → Next word

### 4. Statistics Card
Shows 3 metrics:
- Correct count (green)
- Incorrect count (red)
- Current status (blue)

## Progressive Hint Component

```tsx
<ProgressiveHint
  key={currentVocab.id}
  characters={currentVocab.characters}
  pinyin={currentVocab.pinyin}
  meaning={currentVocab.meaning}
  onHintUsed={handleHintUsed}
/>
```

**Props**:
- `characters`: Chinese word
- `pinyin`: Romanization
- `meaning`: English translation
- `onHintUsed`: Callback for tracking hints

**Key behavior**: Component remounts when key changes (resets hint state)

## Data Model

```typescript
interface Vocabulary {
  id: string;
  characters: string;
  pinyin: string;
  meaning: string;
  example?: string;
}

interface LearningProgress {
  itemId: string;
  itemType: 'vocabulary';
  status: 'new' | 'learning' | 'review' | 'mastered';
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  lastStudiedAt: string;
  nextReviewAt: string;
  hintUsage: HintUsage;
}
```

## Behavior Flow

### On Load
1. Load vocabulary data from JSON
2. Load user progress from localStorage
3. Create learning queue (prioritize due reviews)
4. Show first item from queue

### When User Clicks "I Know"
1. **Disable buttons** (set isProcessing = true)
2. **Play TTS** for character (await)
3. **Play TTS** for example if exists (await)
4. **Update progress**:
   - correctCount++
   - consecutiveCorrect++
   - Update status if thresholds met
   - Calculate nextReviewAt
5. **Save to localStorage**
6. **Move to next word**
7. **Reset hint state** (component remounts)
8. **Re-enable buttons** (set isProcessing = false)

### When User Clicks "Don't Know"
1. Same as "I Know" but:
   - incorrectCount++
   - consecutiveCorrect = 0
   - Status may regress

### TTS Playback
Uses Web Speech API:
```typescript
await speakChinese(characters);
if (example) {
  await speakChinese(example);
}
```

## Spaced Repetition

### Status Transitions
- **new → learning**: After first attempt
- **learning → review**: After 3 consecutive correct
- **review → mastered**: After 5 consecutive correct
- **Any → learning**: When incorrect

### Review Intervals
- **new**: Immediate
- **learning**: 1 day after last study
- **review**: 3 days after last study
- **mastered**: 7 days after last study

### Next Review Calculation
```typescript
const intervals = {
  new: 0,
  learning: 1 * 24 * 60 * 60 * 1000, // 1 day
  review: 3 * 24 * 60 * 60 * 1000,   // 3 days
  mastered: 7 * 24 * 60 * 60 * 1000  // 7 days
};

nextReviewAt = new Date(Date.now() + intervals[status]);
```

## Hint Usage Tracking

```typescript
interface HintUsage {
  ttsCount: number;
  pinyinCount: number;
  meaningCount: number;
  lastHintStage: 'none' | 'tts' | 'pinyin' | 'meaning';
}
```

Each hint click increments the respective counter.

## Styling

### TTS Button
```css
Normal: bg-gradient-to-br from-blue-500 to-blue-600
Playing: bg-blue-200 cursor-wait
Size: w-16 h-16 rounded-2xl
Icon: Volume2, w-8 h-8, white
Active: scale-95
```

### Chinese Characters
```css
Font: text-6xl font-bold
Color: text-black
Align: center
```

### Hint Buttons
```css
Width: full
Padding: py-3 px-4
Background: bg-blue-500
Text: white font-bold
Shape: rounded-xl
Shadow: shadow-md
Active: scale-95
```

### Action Buttons
```css
Layout: flex gap-3
Size: flex-1 py-4 px-6
Icons: w-6 h-6 strokeWidth-2.5
Shape: rounded-2xl
Shadow: shadow-lg
Active: scale-95
Disabled: opacity-50 cursor-not-allowed
```

## Mobile Optimization
- Container: max-w-2xl px-4 py-6 pb-24
- Touch targets: min 44x44px
- TTS button: 64x64px (w-16 h-16)
- Action buttons: full width with adequate padding

---

**See**: [Full Design Spec](../DESIGN_SPEC.md#vocabulary-tab-spec) for complete details
