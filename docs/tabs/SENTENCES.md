# Sentences Tab Specification

> **Tab**: Sentences  
> **Route**: `/sentences`  
> **Status**: ✅ Implemented  
> **Last Updated**: 2026-02-28

## Purpose
Practice full Chinese sentences with example stories and Korean translation toggle.

## Layout

```
┌─────────────────────────────────┐
│ 💬 Sentences                     │
│ Practice Chinese sentences       │
├─────────────────────────────────┤
│          🔊                      │
│                                  │
│   我喜欢学习中文。              │
│   (Plain text, no pinyin)        │
│                                  │
│ ┌─ (After "Don't Know") ──────┐│
│ │ Translation:                 ││
│ │ I like to study Chinese.     ││
│ │                              ││
│ │ 📖 Grammar: 喜欢 + Verb      ││
│ │ Used to express preference...││
│ └──────────────────────────────┘│
│                                  │
│ [I Know]  [Don't Know]          │
│                                  │
│ ── 예문으로 읽기 ────────────── │
│                                  │
│ [한국어 보기]  (toggle button)   │
│                                  │
│ 小明很喜欢学习中文。每天早上，  │
│ 他都会花一个小时学习。           │
│ (샤오밍은 중국어 공부를 매우     │
│  좋아합니다.) ← shown on toggle  │
│ ...                              │
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

### 2. Main Sentence Display

**Plain text rendering** (no word-level hints):
- Font: text-2xl font-bold text-center
- No pinyin, no info buttons
- Clean, simple display of the Chinese sentence

### 3. Translation & Grammar Section

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

### 4. Action Buttons
Same as Vocabulary tab:
- **I Know**: Green gradient
- **Don't Know**: Red gradient

### 5. Example Story Section

**Divider**: Horizontal line with label "예문으로 읽기"

**Example TTS Button**:
- Rounded-full pill button, left of Korean toggle
- Icon: Volume2, w-4 h-4
- Label: "듣기"
- Action: Plays all example sentences' Chinese text concatenated
- Disabled state with `cursor-wait` while playing

**Korean Toggle Button**:
- iOS-style toggle at top of story section, right of TTS button
- Default: OFF (Korean hidden)
- ON: Shows Korean translation below each Chinese sentence
- Label: "한국어 보기"

**Story Display**:
- Connected paragraph of ~10 example sentences
- Each sentence uses the main sentence's key expression naturally
- **Per-sentence TTS button**: Each example has a small Volume2 icon button (w-7 h-7, rounded-lg) on the left
  - Normal state: `bg-gray-200 text-gray-500`
  - Playing state: `bg-blue-400 text-white`
  - Tap to play that single sentence; tap again while playing to stop
  - Enables repeated listening for individual sentences
- Chinese text: `text-base leading-relaxed` 
- Korean text (when toggled on): `text-sm text-gray-500 mt-1` below each Chinese sentence
- Smooth transition animation when toggling

## Data Model

```typescript
interface ExampleSentence {
  chinese: string;
  korean: string;
}

interface Sentence {
  id: string;
  content: string;
  translation: string;
  translationKo?: string;
  examples?: ExampleSentence[];
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
2. Load vocabulary data (for internal tracking)
3. Load user progress
4. Create learning queue
5. Show first sentence

### When User Clicks TTS Button (Main Sentence)
1. Set isPlaying = true
2. Play sentence audio (await)
3. Set isPlaying = false

### When User Clicks Per-sentence TTS Button (Story)
1. If already playing another sentence, stop it first (`stopSpeaking()`)
2. Set `playingSentenceIdx` to identify which sentence is playing
3. Play that single sentence's Chinese text (await)
4. Reset `playingSentenceIdx` to null
5. Tapping the same button while playing cancels playback

### When User Clicks "I Know"
1. Update progress (spaced repetition)
2. Update learning queue
3. Move to next sentence
4. Hide translation (showAnswer = false)
5. Reset Korean toggle to OFF

### When User Clicks "Don't Know"
1. Show translation and grammar (showAnswer = true)
2. Update progress (incorrectCount++, consecutiveCorrect = 0)
3. Add to learning queue
4. **Stay on current sentence** (let user read explanation)

### When User Toggles Korean
1. Toggle showKorean state
2. All example sentences show/hide Korean translation simultaneously
3. Smooth CSS transition

## State Management

```typescript
const [sentences, setSentences] = useState<Sentence[]>([]);
const [grammars, setGrammars] = useState<Grammar[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [progress, setProgress] = useState<UserProgress | null>(null);
const [currentProgress, setCurrentProgress] = useState<LearningProgress | null>(null);
const [showAnswer, setShowAnswer] = useState(false);
const [isPlaying, setIsPlaying] = useState(false);
const [showKorean, setShowKorean] = useState(false);
const [playingSentenceIdx, setPlayingSentenceIdx] = useState<string | null>(null);
```

## Styling

### Main Sentence Display
```css
Font: text-2xl font-bold
Layout: text-center
Color: text-black
```

### Example Story Section
```css
Container: mt-6 pt-6 border-t border-gray-200
Title: text-sm font-bold text-gray-500 uppercase tracking-wide
```

### Chinese Example Text
```css
Font: text-base leading-relaxed
Color: text-black
```

### Korean Translation Text
```css
Font: text-sm
Color: text-gray-500
Margin: mt-1
Transition: transition-all duration-300
Overflow: overflow-hidden
```

### Per-sentence TTS Button (Story)
```css
Size: w-7 h-7 (28px)
Shape: rounded-lg
Icon: Volume2, w-3.5 h-3.5, strokeWidth-2.5
Normal: bg-gray-200 text-gray-500
Playing: bg-blue-400 text-white
Active: scale-90
Layout: shrink-0, mt-0.5 (aligned to first line of text)
```

### Korean Toggle Button
```css
Shape: rounded-full
Padding: px-4 py-2
Active: bg-blue-500 text-white
Inactive: bg-gray-200 text-gray-600
Transition: transition-ios
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
- Touch targets: Toggle button min 44x44px
- Story section: Comfortable reading with proper line-height
- Sentence: Wraps naturally on small screens

---

**See**: [Full Design Spec](../DESIGN_SPEC.md#sentences-tab-spec) for complete details
