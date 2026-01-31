# Sentences Tab Specification

> **Tab**: Sentences  
> **Route**: `/sentences`  
> **Status**: ✅ Implemented  
> **Last Updated**: 2026-01-31

## Purpose
Practice full Chinese sentences with word-level hints and grammar explanations.

## Layout

```
┌─────────────────────────────────┐
│ 💬 Sentences                     │
│ Practice Chinese sentences       │
├─────────────────────────────────┤
│          🔊                      │
│                                  │
│   我 ⓘ 喜欢 ⓘ 学习 ⓘ 中文 ⓘ。  │
│   (Interactive words)            │
│                                  │
│ ┌─ (After "Don't Know") ──────┐│
│ │ Translation:                 ││
│ │ I like to study Chinese.     ││
│ │                              ││
│ │ 📖 Grammar: 喜欢 + Verb      ││
│ │ Used to express preference... ││
│ └──────────────────────────────┘│
│                                  │
│ [I Know]  [Don't Know]          │
│                                  │
│ 1 / 300                         │
└─────────────────────────────────┘
```

## Key Components

### 1. TTS Button (Top Center)
- Size: w-16 h-16
- Shape: rounded-2xl
- Color: Blue gradient
- Icon: Volume2, w-8 h-8
- Action: Plays full sentence

### 2. Interactive Sentence Display

**Word Rendering**:
```
我 ⓘ 喜欢 ⓘ 学习 ⓘ 中文 ⓘ。
```

Each known word has:
- **Chinese text**: font-bold, border-b-2 border-blue-300
- **Info button** (ⓘ): Blue circle with info icon
- **Tooltip** (on click): Black popup with pinyin and meaning

**Non-word text**: Regular text-black without underline

### 3. Word Hint Tooltip

```
┌──────────────┐
│  xǐ huan     │ (white, font-bold)
│  like        │ (yellow-300, font-bold)
└──────────────┘
```

**Styling**:
- Background: bg-black
- Position: Below info icon, centered
- Shadow: shadow-lg
- Z-index: z-50
- Triggered by click, persists until next click

### 4. Translation & Grammar Section

**Only shown after clicking "Don't Know"**:

```tsx
<div className="bg-gradient-to-br from-blue-50 to-blue-100">
  <div>
    <span className="font-bold text-blue-900">Translation:</span>
    <span>{translation}</span>
  </div>
  
  {/* Grammar nested inside */}
  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100">
    <div className="font-bold">📖 {grammarName}</div>
    <div>{grammarDescription}</div>
  </div>
</div>
```

**Colors**:
- Translation: Blue gradient
- Grammar: Yellow gradient (nested)

### 5. Action Buttons
Same as Vocabulary tab:
- **I Know**: Green gradient
- **Don't Know**: Red gradient

## Data Model

```typescript
interface Sentence {
  id: string;
  content: string;
  translation: string;
  wordIds: string[];
  grammarIds: string[];
  difficulty: number;
}

interface Grammar {
  id: string;
  name: string;
  description: string;
  examples: string[];
  relatedWordIds?: string[];
}
```

## Behavior Flow

### On Load
1. Load sentences and grammar data
2. Load vocabulary data (for word hints)
3. Create vocab map: `Record<string, Vocabulary>`
4. Load user progress
5. Create learning queue
6. Show first sentence

### When User Clicks TTS Button
1. Set isPlaying = true
2. Play sentence audio (await)
3. Set isPlaying = false

### When User Clicks Word Info (ⓘ)
1. Add word's uniqueKey to clickedWords Set
2. Display tooltip with pinyin and meaning
3. Track hint usage in progress
4. Tooltip stays visible until user clicks elsewhere

### When User Clicks "I Know"
1. Update progress (spaced repetition)
2. Update learning queue
3. Move to next sentence
4. Hide translation (showAnswer = false)
5. Clear clickedWords Set

### When User Clicks "Don't Know"
1. Show translation and grammar (showAnswer = true)
2. Update progress (incorrectCount++, consecutiveCorrect = 0)
3. Add to learning queue
4. **Stay on current sentence** (let user read explanation)

## Word Matching Algorithm

### Requirements
- Match words in sentence based on `wordIds` array
- Prevent overlapping matches (track used positions)
- Each wordId matches only once per sentence
- Sort by start position for proper rendering

### Example
```typescript
Sentence: "我喜欢学习中文。"
wordIds: ["w001", "w002", "w003", "w004"]

vocab: {
  w001: { characters: "我", pinyin: "wǒ", meaning: "I" },
  w002: { characters: "喜欢", pinyin: "xǐ huan", meaning: "like" },
  w003: { characters: "学习", pinyin: "xué xí", meaning: "study" },
  w004: { characters: "中文", pinyin: "zhōng wén", meaning: "Chinese" }
}

Output: 我 ⓘ 喜欢 ⓘ 学习 ⓘ 中文 ⓘ。
```

### Algorithm Steps
1. Create empty `sentenceWords` array
2. Create `usedPositions` Set
3. For each wordId:
   - Find vocab from vocabMap
   - Search for word in sentence content
   - If position not used:
     - Mark positions as used
     - Add to sentenceWords with uniqueKey
4. Sort by startIdx
5. Render elements with gaps filled by regular text

### Unique Key Generation
```typescript
uniqueKey = `${wordId}-${startIdx}`
```

This ensures same word appearing twice has different keys.

## State Management

```typescript
const [sentences, setSentences] = useState<Sentence[]>([]);
const [grammars, setGrammars] = useState<Grammar[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [progress, setProgress] = useState<UserProgress | null>(null);
const [currentProgress, setCurrentProgress] = useState<LearningProgress | null>(null);
const [showAnswer, setShowAnswer] = useState(false);
const [vocabMap, setVocabMap] = useState<Record<string, Vocabulary>>({});
const [isPlaying, setIsPlaying] = useState(false);
const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());
```

## Styling

### Sentence Display
```css
Font: text-xl or text-2xl
Layout: flex flex-wrap gap-1
Align: justify-center
Leading: leading-relaxed
```

### Word Styling
```css
Characters: font-bold border-b-2 border-blue-300
Info button: w-4 h-4 text-blue-500 hover:text-blue-700
```

### Tooltip
```css
Background: bg-black
Text: white (pinyin), yellow-300 (meaning)
Font: text-sm font-bold
Position: absolute top-full left-1/2 transform -translate-x-1/2
Padding: p-2
Shape: rounded
Shadow: shadow-lg
Whitespace: whitespace-nowrap
Z-index: z-50
```

### Translation Section
```css
Background: bg-gradient-to-br from-blue-50 to-blue-100
Border: border border-blue-200/50
Shape: rounded-2xl
Padding: p-5
Shadow: shadow-sm
```

### Grammar Section (nested)
```css
Background: bg-gradient-to-br from-yellow-50 to-yellow-100
Border: border border-yellow-200/50
Shape: rounded-2xl
Padding: p-4
Margin: mt-4
```

## Mobile Optimization
- Container: max-w-2xl px-4 py-6 pb-24
- Touch targets: Info buttons min 44x44px (with padding)
- Tooltip: Positioned to avoid viewport edges
- Sentence: Wraps naturally on small screens

---

**See**: [Full Design Spec](../DESIGN_SPEC.md#sentences-tab-spec) for complete details
