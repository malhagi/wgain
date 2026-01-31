# 包子 HSK 3 - Design Specification

> **Version**: 1.0.0  
> **Last Updated**: 2026-01-31  
> **Purpose**: This document serves as the single source of truth for all UI/UX specifications and feature requirements for the 包子 HSK 3 application.

---

## Table of Contents
1. [Overview](#overview)
2. [Design System](#design-system)
3. [Dashboard Spec](#dashboard-spec)
4. [Vocabulary Tab Spec](#vocabulary-tab-spec)
5. [Sentences Tab Spec](#sentences-tab-spec)
6. [Reading Tab Spec](#reading-tab-spec)
7. [Writing Tab Spec](#writing-tab-spec)
8. [Common Components](#common-components)
9. [Data Models](#data-models)

---

## Overview

### Application Purpose
包子 HSK 3 is a mobile-first Chinese learning application focused on HSK 3 level vocabulary, sentences, reading comprehension, and writing practice. The app uses spaced repetition algorithms and progressive hint systems to optimize learning.

### Target Platform
- **Primary**: Mobile (iOS/Android)
- **Secondary**: Desktop browsers
- **Framework**: Next.js with Tailwind CSS
- **Design Language**: iOS-inspired UI with glassmorphism effects

### Key Learning Features
- **Spaced Repetition**: Intelligent review scheduling based on performance
- **Progressive Hints**: TTS → Pinyin → Meaning hint system
- **Status Tracking**: 'new' → 'learning' → 'review' → 'mastered'
- **Offline-First**: LocalStorage-based progress tracking

---

## Design System

### Color Palette

```css
/* Primary Colors */
--blue-500: #3B82F6
--blue-600: #2563EB
--green-500: #10B981
--green-600: #059669
--orange-500: #F97316
--orange-600: #EA580C
--purple-500: #A855F7
--purple-600: #9333EA
--red-500: #EF4444
--red-600: #DC2626

/* Background Gradients */
--blue-gradient: from-blue-50 to-blue-100
--green-gradient: from-green-50 to-green-100
--orange-gradient: from-orange-50 to-orange-100
--purple-gradient: from-purple-50 to-purple-100
--red-gradient: from-red-50 to-red-100
--yellow-gradient: from-yellow-50 to-yellow-100

/* Text Colors */
--text-primary: #000000 (black)
--text-secondary: #3B82F6 (blue-600)
--text-muted: rgba(0,0,0,0.6)
```

### Typography

```css
/* Headings */
h1: text-3xl font-bold text-black tracking-tight (30px)
h2: text-xl font-bold text-black (20px)
h3: text-lg font-bold text-black (18px)

/* Body Text */
body-large: text-base text-black (16px)
body: text-sm text-black (14px)
body-small: text-xs text-black (12px)

/* Chinese Characters */
character-large: text-6xl font-bold (60px)
character-medium: text-2xl font-bold (24px)
character-small: text-xl font-bold (20px)
```

### Component Styles

```css
/* iOS Card */
.ios-card {
  @apply bg-white/80 backdrop-blur-sm rounded-3xl shadow-md border border-black/5;
}

/* Transition iOS */
.transition-ios {
  @apply transition-all duration-200 ease-out;
}

/* Active Scale */
.active:scale-95 {
  transform: scale(0.95);
}

.active:scale-98 {
  transform: scale(0.98);
}
```

### Spacing System
- **Container padding**: px-4 (16px)
- **Section spacing**: py-6 (24px)
- **Bottom padding** (for nav): pb-24 (96px)
- **Card padding**: p-5 or p-6 (20px or 24px)
- **Gap between elements**: gap-3 or gap-4 (12px or 16px)

### Border Radius
- **Small buttons**: rounded-xl (12px)
- **Cards**: rounded-2xl or rounded-3xl (16px or 24px)
- **Large buttons**: rounded-2xl (16px)
- **Circle buttons**: rounded-full

---

## Dashboard Spec

### Purpose
Central hub showing overall progress and navigation to all learning sections.

### Layout Structure

```
┌─────────────────────────────────┐
│ Header                          │
│  - Title: "包子 HSK 3"          │
│  - Subtitle                     │
├─────────────────────────────────┤
│ Overall Progress Card           │
│  ┌─────────────────────────┐   │
│  │ Total | New             │   │
│  │ Learning | Mastered     │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│ Navigation Cards                │
│  ┌─────────────────────────┐   │
│  │ 📚 Vocabulary           │   │
│  │ Progress: 0/600         │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 💬 Sentences            │   │
│  │ Progress: 0/300         │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 📖 Reading              │   │
│  │ Progress: 0/50          │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ ✍️ Writing              │   │
│  │ Coming soon... 🚀       │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Components

#### 1. Header Section
```tsx
<div className="mb-6">
  <h1 className="text-3xl font-bold mb-1 text-black tracking-tight">
    包子 HSK 3
  </h1>
  <p className="text-sm text-blue-600 font-medium">
    Chinese Learning Made Easy
  </p>
</div>
```

**Requirements**:
- Title must be prominent and bold
- Subtitle provides context
- Spacing: mb-6 (24px)

#### 2. Overall Progress Card
```tsx
<div className="ios-card p-5 mb-6 transition-ios">
  <h2 className="text-lg font-bold mb-4 flex items-center text-black">
    <TrendingUp icon with gradient background />
    Overall Progress
  </h2>
  <div className="grid grid-cols-2 gap-3">
    {/* 4 stat cards: Total, New, Learning, Mastered */}
  </div>
</div>
```

**Requirements**:
- **Stats Displayed**:
  - Total Items
  - New (never studied)
  - Learning (in progress)
  - Mastered (completed)
- **Visual Design**:
  - 2x2 grid layout
  - Each stat has gradient background
  - Icon in header with circular gradient background
  - Hover effect: shadow-md
  - Active effect: scale-95

**Stat Card Colors**:
- Total: blue gradient (from-blue-50 to-blue-100)
- New: purple gradient (from-purple-50 to-purple-100)
- Learning: orange gradient (from-orange-50 to-orange-100)
- Mastered: green gradient (from-green-50 to-green-100)

#### 3. Section Navigation Cards

```tsx
<Link href="/vocabulary" className="block ios-card p-5 transition-ios hover:shadow-lg active:scale-98">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      <div className="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center mr-3 shadow-md">
        <Book icon />
      </div>
      <h2 className="text-xl font-bold text-black">Vocabulary</h2>
    </div>
    <ChevronRight icon />
  </div>
  
  {/* Progress Section */}
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span>Progress</span>
      <span className="text-blue-600">0 / 600</span>
    </div>
    <ProgressBar />
    <div className="flex justify-between text-xs">
      <span>📚 Learning: X</span>
      <span>🔄 Review: Y</span>
    </div>
  </div>
</Link>
```

**Requirements**:
- **Icon Colors**:
  - Vocabulary: bg-blue-500
  - Sentences: bg-green-500
  - Reading: bg-purple-500
  - Writing: bg-orange-500
- **Progress Bar**:
  - Full width with rounded corners
  - Height: 12px (h-3)
  - Background: bg-blue-50 with border-blue-100
  - Fill color matches section color
  - Animated transition: duration-500
- **Stats Row**:
  - Learning count (orange)
  - Review count (blue)
  - Font: text-xs font-semibold
- **Hover States**:
  - hover:shadow-lg
  - active:scale-98
- **Coming Soon State**:
  - No progress section
  - Show: "Coming soon... 🚀" in blue text

### Data Requirements

**State Variables**:
```typescript
progress: UserProgress | null
overallStats: {
  total: number;
  new: number;
  learning: number;
  mastered: number;
}
```

**Calculations**:
- Total: Sum of all vocabulary + sentences + reading items
- New: Items with status 'new'
- Learning: Items with status 'learning'
- Mastered: Items with status 'mastered'

**Section Stats**:
```typescript
{
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
}
```

---

## Vocabulary Tab Spec

### Purpose
Learn individual Chinese words using spaced repetition with progressive hints.

### Layout Structure

```
┌─────────────────────────────────┐
│ Header                          │
│  - Title: "📚 Vocabulary"       │
│  - Subtitle                     │
├─────────────────────────────────┤
│ Learning Card                   │
│  ┌─────────────────────────┐   │
│  │ ❌ Incorrect: 2 (if any)│   │
│  │                         │   │
│  │ Progressive Hint        │   │
│  │  [TTS Button]           │   │
│  │  你好 (Large Chinese)   │   │
│  │  [Pinyin Button]        │   │
│  │  [Meaning Button]       │   │
│  │                         │   │
│  │ Example Sentence        │   │
│  │ (Always shown)          │   │
│  │                         │   │
│  │ [I Know] [Don't Know]  │   │
│  │                         │   │
│  │ 1 / 600                 │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│ Statistics Card                 │
│  - Correct Count                │
│  - Incorrect Count              │
│  - Current Status               │
└─────────────────────────────────┘
```

### Components

#### 1. Header Section
```tsx
<div className="mb-6">
  <h1 className="text-3xl font-bold text-black tracking-tight">
    📚 Vocabulary
  </h1>
  <p className="text-sm text-blue-600 font-medium mt-1">
    Learn Chinese words
  </p>
</div>
```

#### 2. Incorrect Count Badge (Conditional)
```tsx
{currentProgress.incorrectCount > 0 && (
  <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-300 rounded-xl">
    <span className="text-red-600 font-bold text-sm">
      ❌ Incorrect: {currentProgress.incorrectCount}
    </span>
  </div>
)}
```

**Requirements**:
- Only show if incorrectCount > 0
- Red theme with border
- Center aligned above progressive hint
- Font: text-sm font-bold

#### 3. Progressive Hint Component

```tsx
<ProgressiveHint
  key={currentVocab.id} // Force remount on word change
  characters={currentVocab.characters}
  pinyin={currentVocab.pinyin}
  meaning={currentVocab.meaning}
  onHintUsed={handleHintUsed}
  className="mb-4"
/>
```

**Progressive Hint States**:

**State 0: Initial (Only TTS)**
```
┌─────────────────────────┐
│    🔊 [TTS Button]      │
│      (Blue, round)      │
│                         │
│       你好               │
│   (text-6xl, bold)     │
│                         │
│   [Show Pinyin]         │
│    (Blue button)        │
└─────────────────────────┘
```

**State 1: After TTS (Show Pinyin Button)**
- TTS button remains visible
- Pinyin button appears below character

**State 2: Pinyin Revealed**
```
┌─────────────────────────┐
│    🔊 [TTS Button]      │
│                         │
│       你好               │
│                         │
│      nǐ hǎo            │
│   (text-2xl, blue-700) │
│                         │
│   [Show Meaning]        │
│    (Blue button)        │
└─────────────────────────┘
```

**State 3: Meaning Revealed**
```
┌─────────────────────────┐
│    🔊 [TTS Button]      │
│                         │
│       你好               │
│                         │
│      nǐ hǎo            │
│                         │
│      Hello              │
│  (text-xl, green-700)  │
└─────────────────────────┘
```

**Requirements**:
- **TTS Button**: 
  - Size: w-16 h-16
  - Shape: rounded-2xl
  - Color: bg-gradient-to-br from-blue-500 to-blue-600
  - Icon: Volume2, w-8 h-8, white
  - Disabled state: bg-blue-200 cursor-wait
  - Active: scale-95
- **Chinese Characters**:
  - Font: text-6xl font-bold
  - Color: text-black
  - Center aligned
- **Pinyin**:
  - Font: text-2xl font-semibold
  - Color: text-blue-700
- **Meaning**:
  - Font: text-xl font-bold
  - Color: text-green-700
- **Hint Buttons**:
  - Full width
  - Padding: py-3 px-4
  - Background: bg-blue-500
  - Text: white font-bold
  - Shape: rounded-xl
  - Shadow: shadow-md
  - Active: scale-95

#### 4. Example Section (Always Visible)
```tsx
{currentVocab.example && (
  <div className="mt-5 p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200/50 shadow-sm">
    <div className="text-sm font-bold text-purple-900 mb-2">
      📝 Example:
    </div>
    <div className="text-base text-black font-medium">
      {currentVocab.example}
    </div>
  </div>
)}
```

**Requirements**:
- Always visible (not hidden behind hints)
- Purple gradient background
- Border and shadow for depth
- Example text in Chinese characters

#### 5. Action Buttons

```tsx
<div className="flex gap-3 mt-6">
  <button
    onClick={handleCorrect}
    disabled={isProcessing}
    className="flex-1 bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios flex items-center justify-center gap-2"
  >
    <CheckCircle2 icon />
    {isProcessing ? 'Playing...' : 'I Know'}
  </button>
  
  <button
    onClick={handleIncorrect}
    disabled={isProcessing}
    className="flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios flex items-center justify-center gap-2"
  >
    <XCircle icon />
    {isProcessing ? 'Playing...' : "Don't Know"}
  </button>
</div>
```

**Requirements**:
- **Layout**: flex, equal width (flex-1), gap-3
- **Size**: py-4 px-6
- **Icons**: CheckCircle2 and XCircle, w-6 h-6, strokeWidth 2.5
- **States**:
  - Normal: Gradient background with shadow-lg
  - Active: scale-95
  - Disabled: opacity-50 cursor-not-allowed
  - Processing: Show "Playing..." text
- **Green Button** (I Know):
  - from-green-500 to-green-600
- **Red Button** (Don't Know):
  - from-red-500 to-red-600

#### 6. Progress Counter
```tsx
<div className="mt-4 text-sm font-bold text-black/60 text-center">
  {currentIndex + 1} / {vocabularies.length}
</div>
```

**Requirements**:
- Center aligned
- Muted color: text-black/60
- Font: text-sm font-bold

#### 7. Statistics Card
```tsx
<div className="ios-card p-5 transition-ios">
  <h2 className="font-bold mb-4 text-black text-lg">
    📊 Statistics
  </h2>
  <div className="grid grid-cols-3 gap-3">
    {/* Correct, Incorrect, Status */}
  </div>
</div>
```

**Stat Cards**:
- **Correct**: Green gradient (from-green-50 to-green-100)
- **Incorrect**: Red gradient (from-red-50 to-red-100)
- **Status**: Blue gradient (from-blue-50 to-blue-100)

**Requirements**:
- 3 column grid
- Each card: p-4, rounded-2xl, border, shadow-sm
- Label: text-xs font-bold (status color)
- Value: text-2xl font-bold (status color) OR text-base for status text

### Behavior Flow

#### When User Clicks "I Know":
1. Disable both buttons (set isProcessing = true)
2. Play TTS for the character (await)
3. If example exists, play TTS for example (await)
4. Update progress:
   - Increment correctCount
   - Increment consecutiveCorrect
   - Update status based on spaced repetition algorithm
   - Calculate nextReviewAt timestamp
5. Save to localStorage
6. Move to next vocabulary item
7. Reset hint state (component remounts due to key change)
8. Re-enable buttons (set isProcessing = false)

#### When User Clicks "Don't Know":
1. Disable both buttons (set isProcessing = true)
2. Play TTS for the character (await)
3. If example exists, play TTS for example (await)
4. Update progress:
   - Increment incorrectCount
   - Reset consecutiveCorrect to 0
   - Adjust status based on spaced repetition algorithm
5. Save to localStorage
6. Move to next vocabulary item
7. Reset hint state
8. Re-enable buttons (set isProcessing = false)

### Data Requirements

**State Variables**:
```typescript
vocabularies: Vocabulary[]
currentIndex: number
progress: UserProgress | null
currentProgress: LearningProgress | null
showAnswer: boolean
isProcessing: boolean
```

**Vocabulary Model**:
```typescript
interface Vocabulary {
  id: string;
  characters: string;
  pinyin: string;
  meaning: string;
  example?: string;
  status?: LearningStatus;
}
```

**Learning Progress Model**:
```typescript
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

### Spaced Repetition Algorithm

**Status Transitions**:
- **new → learning**: After first attempt
- **learning → review**: After 3 consecutive correct answers
- **review → mastered**: After 5 consecutive correct answers
- **Any → learning**: When user clicks "Don't Know"

**Review Intervals**:
- **new**: Immediate
- **learning**: 1 day after last study
- **review**: 3 days after last study
- **mastered**: 7 days after last study

---

## Sentences Tab Spec

### Purpose
Practice full Chinese sentences with word-level hints and grammar explanations.

### Layout Structure

```
┌─────────────────────────────────┐
│ Header                          │
│  - Title: "💬 Sentences"        │
│  - Subtitle                     │
├─────────────────────────────────┤
│ Sentence Card                   │
│  ┌─────────────────────────┐   │
│  │    🔊 [TTS Button]      │   │
│  │                         │   │
│  │   我 ⓘ 是 ⓘ 学生 ⓘ    │   │
│  │   (Clickable words)     │   │
│  │                         │   │
│  │   [Translation]         │   │
│  │   (After Don't Know)    │   │
│  │                         │   │
│  │   [Grammar Explanation] │   │
│  │   (After Don't Know)    │   │
│  │                         │   │
│  │  [I Know] [Don't Know] │   │
│  │                         │   │
│  │  1 / 300                │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Components

#### 1. Header Section
```tsx
<div className="mb-6">
  <h1 className="text-3xl font-bold text-black tracking-tight">
    💬 Sentences
  </h1>
  <p className="text-sm text-blue-600 font-medium mt-1">
    Practice Chinese sentences
  </p>
</div>
```

#### 2. TTS Button (Top Center)
```tsx
<div className="flex items-center justify-center gap-4 mb-6">
  <button
    onClick={handleTTS}
    disabled={isPlaying}
    className="w-16 h-16 rounded-2xl transition-ios shadow-lg flex items-center justify-center"
  >
    <Volume2 className="w-8 h-8 text-white" strokeWidth={2.5} />
  </button>
</div>
```

**Requirements**:
- Same style as Vocabulary TTS button
- Center aligned above sentence
- States:
  - Normal: Blue gradient (from-blue-500 to-blue-600)
  - Playing: bg-blue-200 cursor-wait
  - Active: scale-95

#### 3. Interactive Sentence Display

**Sentence with Word Hints**:
```tsx
<div className="text-center mb-6">
  {renderSentenceWithHints(currentSentence)}
</div>
```

**Word Rendering**:
```
我 ⓘ 喜欢 ⓘ 学习 ⓘ 中文 ⓘ。
```

Each known word from `wordIds` is rendered as:
```tsx
<span className="inline-flex items-center gap-0.5">
  <span className="text-black font-bold border-b-2 border-blue-300">
    {word.characters}
  </span>
  <button
    onClick={() => handleWordClick(uniqueKey)}
    className="text-blue-500 hover:text-blue-700 p-0.5 relative"
  >
    <InfoIcon className="w-4 h-4" />
    {isClicked && (
      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 p-2 bg-black text-white text-sm rounded shadow-lg whitespace-nowrap z-50">
        <div className="font-bold">{pinyin}</div>
        <div className="text-yellow-300 font-bold">{meaning}</div>
      </span>
    )}
  </button>
</span>
```

**Requirements**:
- **Word Styling**:
  - Font: text-xl or text-2xl font-bold
  - Color: text-black
  - Border bottom: border-b-2 border-blue-300
- **Info Button**:
  - Icon: Info circle (w-4 h-4)
  - Color: text-blue-500
  - Hover: text-blue-700
- **Tooltip** (on click):
  - Background: bg-black
  - Text: white for pinyin, yellow-300 for meaning
  - Position: Below info icon, centered
  - Shadow: shadow-lg
  - Z-index: z-50
  - Font: text-sm font-bold
- **Non-word text**: Regular text-black without underline

#### 4. Translation Section (Conditional)
```tsx
{showAnswer && (
  <div className="mt-5 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 shadow-sm">
    <div className="text-lg mb-2 text-black">
      <span className="font-bold text-blue-900">Translation:</span>
      <span className="ml-2 text-black">{currentSentence.translation}</span>
    </div>
    
    {relatedGrammar && (
      <div className="mt-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200/50">
        <div className="font-bold text-black mb-1">
          📖 {relatedGrammar.name}
        </div>
        <div className="text-sm text-black">
          {relatedGrammar.description}
        </div>
      </div>
    )}
  </div>
)}
```

**Requirements**:
- Only shown after clicking "Don't Know" (showAnswer = true)
- Blue gradient background for translation
- Yellow gradient inset for grammar explanation
- Translation label bold, content regular
- Grammar nested inside translation card

#### 5. Action Buttons
Same as Vocabulary tab, but without isProcessing state:

```tsx
<div className="flex gap-3 mt-6">
  <button
    onClick={handleCorrect}
    className="flex-1 bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95 flex items-center justify-center gap-2"
  >
    <CheckCircle2 />
    I Know
  </button>
  
  <button
    onClick={handleIncorrect}
    className="flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95 flex items-center justify-center gap-2"
  >
    <XCircle />
    Don't Know
  </button>
</div>
```

#### 6. Progress Counter
```tsx
<div className="mt-4 text-sm font-bold text-black/60 text-center">
  {currentIndex + 1} / {sentences.length}
</div>
```

### Behavior Flow

#### When User Clicks Word Info Button:
1. Add word's uniqueKey to clickedWords Set
2. Display tooltip with pinyin and meaning
3. Track hint usage in progress
4. Tooltip remains visible until user clicks elsewhere

#### When User Clicks TTS Button:
1. Set isPlaying = true
2. Play sentence TTS (await)
3. Set isPlaying = false

#### When User Clicks "I Know":
1. Update progress with spaced repetition algorithm
2. Update learning queue
3. Move to next sentence
4. Hide translation section (showAnswer = false)
5. Clear clickedWords Set

#### When User Clicks "Don't Know":
1. Show translation and grammar (showAnswer = true)
2. Update progress (increment incorrectCount, reset consecutiveCorrect)
3. Add to learning queue for immediate retry
4. **Do NOT advance to next sentence** - allow user to read explanation

**After reading explanation, user clicks button again to proceed**

### Data Requirements

**State Variables**:
```typescript
sentences: Sentence[]
grammars: Grammar[]
currentIndex: number
progress: UserProgress | null
currentProgress: LearningProgress | null
showAnswer: boolean
vocabMap: Record<string, Vocabulary>
isPlaying: boolean
clickedWords: Set<string>
```

**Sentence Model**:
```typescript
interface Sentence {
  id: string;
  content: string;
  translation: string;
  wordIds: string[];
  grammarIds: string[];
  difficulty: number;
}
```

**Grammar Model**:
```typescript
interface Grammar {
  id: string;
  name: string;
  description: string;
  examples: string[];
  relatedWordIds?: string[];
}
```

### Word Matching Algorithm

**Requirements**:
- Match words in sentence based on `wordIds` array
- Prevent overlapping matches (track used positions)
- Each wordId should only match once per sentence
- Sort matched words by start position for rendering
- Render unmatched text as regular spans

**Example**:
```typescript
Sentence: "我喜欢学习中文。"
wordIds: ["w001", "w002", "w003", "w004"]
vocab: {
  w001: { characters: "我", pinyin: "wǒ", meaning: "I" },
  w002: { characters: "喜欢", pinyin: "xǐ huan", meaning: "like" },
  w003: { characters: "学习", pinyin: "xué xí", meaning: "study" },
  w004: { characters: "中文", pinyin: "zhōng wén", meaning: "Chinese" }
}

Result: "我 ⓘ 喜欢 ⓘ 学习 ⓘ 中文 ⓘ。"
```

---

## Reading Tab Spec

### Purpose
Practice reading comprehension with full passages and multiple-choice questions.

### Layout Structure

```
┌─────────────────────────────────┐
│ Header                          │
│  - Title: "📖 Reading"          │
│  - Subtitle                     │
├─────────────────────────────────┤
│ Reading Card                    │
│  ┌─────────────────────────┐   │
│  │ [Title]                 │   │
│  │                         │   │
│  │    🔊 [TTS Button]      │   │
│  │                         │   │
│  │   [Passage with hints]  │   │
│  │                         │   │
│  │   Question 1            │   │
│  │   ○ Option A            │   │
│  │   ○ Option B            │   │
│  │   ○ Option C            │   │
│  │   ○ Option D            │   │
│  │                         │   │
│  │   Question 2            │   │
│  │   ...                   │   │
│  │                         │   │
│  │  [Submit Answers]       │   │
│  │   OR                    │   │
│  │  [Next Reading]         │   │
│  │                         │   │
│  │  1 / 50                 │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Components

#### 1. Header Section
```tsx
<div className="mb-6">
  <h1 className="text-3xl font-bold text-black tracking-tight">
    📖 Reading
  </h1>
  <p className="text-sm text-blue-600 font-medium mt-1">
    Reading comprehension
  </p>
</div>
```

#### 2. Reading Title
```tsx
<h2 className="text-xl font-bold mb-4 text-black">
  {currentReading.title}
</h2>
```

**Requirements**:
- Font: text-xl font-bold
- Color: text-black
- Margin: mb-4

#### 3. TTS Button
```tsx
<div className="flex items-center justify-center mb-4">
  <button
    onClick={handleTTS}
    disabled={isPlaying}
    className="w-16 h-16 rounded-2xl transition-ios shadow-lg flex items-center justify-center"
  >
    <Volume2 />
  </button>
</div>
```

**Requirements**:
- Same as Sentences tab TTS button
- Center aligned
- Plays entire passage

#### 4. Passage with Word Hints
```tsx
<div className="mb-5 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 shadow-sm">
  {renderContentWithHints(currentReading.content, currentReading.wordIds)}
</div>
```

**Requirements**:
- Same word hint system as Sentences tab
- Blue gradient background
- Font: text-base or text-lg
- Leading: leading-relaxed (for better readability)
- Words have info icons with tooltips
- Non-word text flows naturally

#### 5. Questions Section

**Question Container**:
```tsx
<div className="space-y-3 mb-5">
  {currentReading.questions.map((question) => (
    <div key={question.id} className="p-4 bg-white/50 rounded-2xl border border-blue-200/50 shadow-sm">
      {/* Question and options */}
    </div>
  ))}
</div>
```

**Question Display**:
```tsx
<div className="font-bold mb-3 text-black text-base">
  {question.question}
</div>
```

**Options**:
```tsx
<div className="space-y-2">
  {question.options.map((option, idx) => {
    const isSelected = selectedAnswers[question.id] === idx;
    const isCorrect = idx === question.correctAnswer;
    const showCorrect = showResults && isCorrect;
    const showIncorrect = showResults && isSelected && !isCorrect;
    
    return (
      <button
        onClick={() => !showResults && handleAnswerSelect(question.id, idx)}
        disabled={showResults}
        className={/* Dynamic classes */}
      >
        {option}
        {showCorrect && ' ✓'}
        {showIncorrect && ' ✗'}
      </button>
    );
  })}
</div>
```

**Option States**:

**Before Submission**:
- **Unselected**: 
  - bg-white
  - border-2 border-blue-200
  - text-black
  - active:scale-98
- **Selected**:
  - bg-gradient-to-br from-blue-50 to-blue-100
  - border-2 border-blue-500
  - text-black font-bold
  - shadow-sm

**After Submission (showResults = true)**:
- **Correct Answer**:
  - bg-gradient-to-br from-green-50 to-green-100
  - border-2 border-green-500
  - text-black font-bold
  - shadow-md
  - Append " ✓"
- **Incorrect Selection**:
  - bg-gradient-to-br from-red-50 to-red-100
  - border-2 border-red-500
  - text-black font-bold
  - shadow-md
  - Append " ✗"
- **Other Options**:
  - bg-white
  - border-2 border-blue-200
  - text-black

**Requirements**:
- Full width buttons (w-full)
- Text left aligned (text-left)
- Padding: p-4
- Border radius: rounded-xl
- Border: border-2
- Font: text-base
- Transition: transition-ios
- Disabled after submission

#### 6. Submit/Next Button

**Before Submission**:
```tsx
<button
  onClick={handleSubmit}
  className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95"
>
  Submit Answers
</button>
```

**After Submission**:
```tsx
<button
  onClick={handleNext}
  className="w-full bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-ios active:scale-95"
>
  Next Reading
</button>
```

**Requirements**:
- Full width
- Changes color from blue to green after submission
- Changes text from "Submit Answers" to "Next Reading"
- Shadow-lg for prominence
- Active: scale-95

#### 7. Progress Counter
```tsx
<div className="mt-4 text-sm font-bold text-black/60 text-center">
  {currentIndex + 1} / {readings.length}
</div>
```

### Behavior Flow

#### When User Clicks TTS Button:
1. Set isPlaying = true
2. Play passage TTS (await)
3. Set isPlaying = false

#### When User Clicks Word Info:
1. Add to clickedWords Set
2. Show tooltip with pinyin and meaning
3. Track hint usage

#### When User Selects Answer:
1. Update selectedAnswers state
2. Highlight selected option with blue border

#### When User Clicks "Submit Answers":
1. Calculate score (count correct answers)
2. Determine if all answers are correct
3. Update progress:
   - If allCorrect: increment correctCount, consecutiveCorrect
   - If not allCorrect: increment incorrectCount, reset consecutiveCorrect
4. Set showResults = true
5. Display correct/incorrect visual feedback on all options

#### When User Clicks "Next Reading":
1. Increment currentIndex
2. Reset selectedAnswers to {}
3. Set showResults = false
4. Clear clickedWords Set
5. Load next reading's progress

### Data Requirements

**State Variables**:
```typescript
readings: Reading[]
currentIndex: number
progress: UserProgress | null
currentProgress: LearningProgress | null
selectedAnswers: Record<string, number> // questionId -> optionIndex
showResults: boolean
vocabMap: Record<string, Vocabulary>
isPlaying: boolean
clickedWords: Set<string>
```

**Reading Model**:
```typescript
interface Reading {
  id: string;
  title: string;
  content: string; // Max 300 characters
  questions: ReadingQuestion[];
  wordIds: string[];
  grammarIds: string[];
}
```

**ReadingQuestion Model**:
```typescript
interface ReadingQuestion {
  id: string;
  question: string;
  options: string[]; // 4 options
  correctAnswer: number; // Index of correct option (0-3)
}
```

### Scoring Logic

**All Correct**:
- correctCount += 1
- consecutiveCorrect += 1
- Status may advance based on spaced repetition

**Any Incorrect**:
- incorrectCount += 1
- consecutiveCorrect = 0
- Status may regress

---

## Writing Tab Spec

### Purpose
Free-form Chinese writing practice with guided topics and vocabulary suggestions.

### Layout Structure

```
┌─────────────────────────────────┐
│ Header                          │
│  - Title: "✍️ Writing"          │
│  - Subtitle                     │
├─────────────────────────────────┤
│ Topic Selection Card            │
│  ┌─────────────────────────┐   │
│  │ ○ 自我介绍 [初级]      │   │
│  │ ○ 我的家人 [初级]      │   │
│  │ ○ 周末活动 [中级]      │   │
│  │ ...                     │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│ Writing Area Card               │
│  ┌─────────────────────────┐   │
│  │ [Topic Title] [Clear]   │   │
│  │                         │   │
│  │ 💡 Example: ...        │   │
│  │                         │   │
│  │ [Text Area]             │   │
│  │                         │   │
│  │ Characters: 50          │   │
│  │ Goal: 50-100            │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│ Preview Card (if text exists)   │
│  - Shows formatted text         │
├─────────────────────────────────┤
│ Vocabulary Suggestions          │
│  - Relevant HSK3 words          │
└─────────────────────────────────┘
```

### Components

#### 1. Header Section
```tsx
<div className="mb-6">
  <h1 className="text-3xl font-bold text-black tracking-tight">
    ✍️ Writing
  </h1>
  <p className="text-sm text-blue-600 font-medium mt-1">
    Practice Chinese writing
  </p>
</div>
```

#### 2. Topic Selection Card
```tsx
<div className="ios-card p-5 mb-5 transition-ios shadow-lg">
  <h2 className="text-base font-bold mb-3 text-black">
    Select Topic
  </h2>
  <div className="grid grid-cols-1 gap-3">
    {writingTopics.map((topic) => (
      <button
        onClick={() => handleTopicChange(topic)}
        className={/* Dynamic classes */}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold text-black">{topic.title}</div>
          <span className={/* Difficulty badge */}>
            {getDifficultyLabel(topic.difficulty)}
          </span>
        </div>
        <div className="text-sm text-black/70">
          {topic.description}
        </div>
      </button>
    ))}
  </div>
</div>
```

**Topic Button States**:
- **Unselected**:
  - border-2 border-blue-200
  - bg-white
  - active:scale-98
- **Selected**:
  - border-2 border-blue-500
  - bg-gradient-to-br from-blue-50 to-blue-100
  - shadow-md
  - scale-[1.02]

**Difficulty Badges**:
- **初级 (Beginner)**:
  - bg-green-100 text-green-800 border-green-300
- **中级 (Intermediate)**:
  - bg-yellow-100 text-yellow-800 border-yellow-300
- **高级 (Advanced)**:
  - bg-red-100 text-red-800 border-red-300

**Requirements**:
- Font: text-xs font-bold
- Shape: rounded-full
- Border: border
- Padding: px-2 py-1

#### 3. Writing Area Card

**Header**:
```tsx
<div className="flex justify-between items-center mb-4">
  <div className="flex items-center gap-2">
    <h2 className="text-lg font-bold text-black">
      {selectedTopic.title}
    </h2>
    <span className={/* Difficulty badge */}>
      {getDifficultyLabel(selectedTopic.difficulty)}
    </span>
  </div>
  <button
    onClick={handleClear}
    className="text-sm text-red-500 font-bold hover:text-red-700 active:scale-95 transition-ios"
  >
    Clear
  </button>
</div>
```

**Example Section**:
```tsx
<div className="mb-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200/50 shadow-sm">
  <div className="text-sm font-bold mb-2 text-yellow-900">
    💡 Example:
  </div>
  <div className="text-sm text-black">
    {selectedTopic.example}
  </div>
</div>
```

**Text Area**:
```tsx
<textarea
  ref={textareaRef}
  value={text}
  onChange={handleTextChange}
  placeholder="在这里用中文写作..."
  className="w-full h-48 p-4 border-2 border-blue-300 rounded-2xl resize-none focus:outline-none focus:border-blue-500 text-black text-base shadow-sm transition-ios"
  style={{ fontSize: '16px' }}
/>
```

**Requirements**:
- **Size**: w-full h-48
- **Padding**: p-4
- **Border**: border-2 border-blue-300
- **Focus**: focus:border-blue-500
- **Shape**: rounded-2xl
- **Resize**: resize-none (fixed size)
- **Font**: text-base (16px to prevent iOS zoom)
- **Style**: Inline fontSize: '16px' for iOS compatibility
- **Placeholder**: "在这里用中文写作..."

**Character Count & Stats**:
```tsx
<div className="mt-4 space-y-2">
  <div className="flex justify-between items-center text-sm font-semibold text-black">
    <div>Characters: {wordCount}</div>
    {typingSpeed !== null && (
      <div>Speed: {typingSpeed} chars/min</div>
    )}
  </div>
  
  <div className="flex items-center gap-2 text-sm">
    <span className="font-semibold text-black">Goal:</span>
    <span className={/* Color based on progress */}>
      {wordCountGoal.min}-{wordCountGoal.max} characters
    </span>
    {isWordCountInRange && (
      <span className="text-green-600 font-bold">✓</span>
    )}
  </div>
</div>
```

**Goal Colors**:
- **Below minimum**: text-orange-600
- **In range**: text-green-600 font-semibold
- **Above maximum**: text-red-600

**Word Count Goals by Difficulty**:
- **初级 (1)**: 50-100 characters
- **中级 (2)**: 100-150 characters
- **高级 (3)**: 150-200 characters

**Typing Speed**:
- Calculated as: characters / (elapsed time in minutes)
- Goal: 20 chars/min
- Display when speed >= 20: "✓ Goal Achieved!" in green
- Display when speed < 20: "Goal: 20 chars/min" in orange

#### 4. Preview Card (Conditional)
```tsx
{text.length > 0 && (
  <div className="ios-card p-5 transition-ios shadow-lg">
    <h3 className="font-bold mb-3 text-black">预览</h3>
    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 whitespace-pre-wrap text-black text-base shadow-sm">
      {text}
    </div>
  </div>
)}
```

**Requirements**:
- Only shown when text.length > 0
- Title: "预览" (Preview)
- Content: whitespace-pre-wrap to preserve line breaks
- Blue gradient background

#### 5. Vocabulary Suggestions (Conditional)
```tsx
{selectedTopic.suggestedWords.length > 0 && (
  <div className="ios-card p-5 transition-ios shadow-lg">
    <h3 className="text-lg font-bold mb-4 text-black">
      📝 推荐词汇
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {selectedTopic.suggestedWords.map((word) => (
        <div
          key={word}
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-300/50 shadow-sm transition-ios active:scale-95"
        >
          <div className="font-bold text-xl text-black mb-1">
            {word}
          </div>
          <div className="text-xs text-blue-700 font-semibold">
            {pinyinMap[word] || 'pinyin'}
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-300/50 text-sm shadow-sm">
      <p className="font-bold mb-1 text-black">💡 提示:</p>
      <p className="text-black">试着在写作中使用这些HSK3词汇！</p>
    </div>
  </div>
)}
```

**Requirements**:
- Only shown if topic has suggestedWords
- 2 column grid (grid-cols-2)
- Each word card:
  - Chinese: text-xl font-bold
  - Pinyin: text-xs text-blue-700 font-semibold
  - Blue gradient background
  - Active: scale-95 (for future copy functionality)
- Tip box at bottom with yellow gradient

### Behavior Flow

#### When User Selects Topic:
1. Update selectedTopic state
2. Load saved text from localStorage (if exists)
3. Clear text, wordCount, startTime, typingSpeed
4. Focus textarea

#### When User Types:
1. Update text state
2. Calculate wordCount (text.length)
3. If first character and no startTime:
   - Set startTime = Date.now()
4. If startTime exists:
   - Calculate elapsed time in minutes
   - Calculate typingSpeed = wordCount / elapsedMinutes
5. Auto-save to localStorage:
   - Key: `writing_${topicId}`
   - Value: text

#### When User Clicks "Clear":
1. Clear text state
2. Reset wordCount to 0
3. Reset startTime to null
4. Reset typingSpeed to null
5. Remove from localStorage
6. Focus textarea

### Data Requirements

**State Variables**:
```typescript
text: string
startTime: number | null
typingSpeed: number | null
wordCount: number
selectedTopic: WritingTopic
writingTopics: WritingTopic[]
```

**WritingTopic Model**:
```typescript
interface WritingTopic {
  id: number;
  title: string; // Chinese title
  description: string; // English description
  example: string; // Example sentence in Chinese
  difficulty: 1 | 2 | 3; // 1=初级, 2=中级, 3=高级
  suggestedWords: string[]; // Array of Chinese words
}
```

**localStorage Keys**:
- `writing_${topicId}`: Stores user's text for each topic

### Topic List

**Difficulty 1 (初级)**:
1. 自我介绍 (Self-introduction)
2. 我的家人 (My family)
3. 我的爱好 (My hobbies)
4. 我的学校 (My school)
5. 周末计划 (Weekend plans) - 词汇: 周末, 打算
6. 我的邻居 (My neighbor) - 词汇: 邻居, 认识, 帮忙, 关心
7. 周末活动 (Weekend activities) - 词汇: 周末, 打算, 锻炼, 聊天

**Difficulty 2 (中级)**:
8. 我的工作 (My job) - 词汇: 办公室, 同事, 经理, 会议
9. 学习经历 (Learning experience) - 词汇: 练习, 复习, 提高, 努力
10. 旅行计划 (Travel plans) - 词汇: 旅行, 机会, 决定, 准备
11. 健康生活 (Healthy life) - 词汇: 锻炼, 习惯, 健康, 注意

**Difficulty 3 (高级)**:
12. 一次重要的决定 (An important decision) - 词汇: 决定, 选择, 影响, 结果
13. 环境保护 (Environmental protection) - 词汇: 环境, 变化, 注意, 重要
14. 我的理想 (My ideal) - 词汇: 愿意, 努力, 完成, 相信
15. 文化差异 (Cultural differences) - 词汇: 文化, 习惯, 了解, 不同

---

## Common Components

### Navigation Bar (Bottom)

**Location**: Fixed bottom of screen

**Requirements**:
- Position: fixed bottom-0
- Full width
- Background: white with shadow
- Height: appropriate for touch targets (min 60px)
- Icons + labels for each tab:
  - Dashboard: Home icon
  - Vocabulary: Book icon
  - Sentences: FileText icon
  - Reading: BookOpen icon
  - Writing: PenTool icon
- Active tab highlighted with blue color
- Inactive tabs gray

### Loading State

```tsx
<div className="container mx-auto px-4 py-8">
  <div className="text-center">Loading...</div>
</div>
```

**Requirements**:
- Center aligned
- Simple text
- Shown when data is null or loading

### Error State

**Not currently implemented**
**Recommendation**: Add error boundaries and error states for:
- Failed data loading
- TTS errors
- localStorage errors

---

## Data Models

### Core Types

```typescript
// Learning Status
type LearningStatus = 'new' | 'learning' | 'review' | 'mastered';

// Hint Stage
type HintStage = 'none' | 'tts' | 'pinyin' | 'meaning';

// Vocabulary
interface Vocabulary {
  id: string;
  characters: string;
  pinyin: string;
  meaning: string;
  example?: string;
  status?: LearningStatus;
}

// Grammar
interface Grammar {
  id: string;
  name: string;
  description: string;
  examples: string[];
  relatedWordIds?: string[];
  status?: LearningStatus;
}

// Sentence
interface Sentence {
  id: string;
  content: string;
  translation: string;
  wordIds: string[];
  grammarIds: string[];
  difficulty: number;
}

// Reading
interface Reading {
  id: string;
  title: string;
  content: string; // Max 300 characters
  questions: ReadingQuestion[];
  wordIds: string[];
  grammarIds: string[];
}

interface ReadingQuestion {
  id: string;
  question: string;
  options: string[]; // 4 options
  correctAnswer: number; // 0-3
}

// Hint Usage
interface HintUsage {
  ttsCount: number;
  pinyinCount: number;
  meaningCount: number;
  lastHintStage: HintStage;
}

// Learning Progress
interface LearningProgress {
  itemId: string;
  itemType: 'vocabulary' | 'grammar' | 'sentence' | 'reading';
  status: LearningStatus;
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  lastStudiedAt: string; // ISO date
  nextReviewAt: string; // ISO date
  hintUsage: HintUsage;
}

// User Progress
interface UserProgress {
  vocabulary: Record<string, LearningProgress>;
  grammar: Record<string, LearningProgress>;
  sentence: Record<string, LearningProgress>;
  reading: Record<string, LearningProgress>;
  lastUpdated: string;
}

// Writing Topic
interface WritingTopic {
  id: number;
  title: string;
  description: string;
  example: string;
  difficulty: 1 | 2 | 3;
  suggestedWords: string[];
}
```

### localStorage Schema

**Key**: `hsk3_user_progress`

**Value**: JSON stringified UserProgress object

```json
{
  "vocabulary": {
    "v001": {
      "itemId": "v001",
      "itemType": "vocabulary",
      "status": "learning",
      "correctCount": 3,
      "incorrectCount": 1,
      "consecutiveCorrect": 2,
      "lastStudiedAt": "2026-01-31T10:00:00.000Z",
      "nextReviewAt": "2026-02-01T10:00:00.000Z",
      "hintUsage": {
        "ttsCount": 2,
        "pinyinCount": 1,
        "meaningCount": 0,
        "lastHintStage": "pinyin"
      }
    }
  },
  "sentence": {},
  "reading": {},
  "grammar": {},
  "lastUpdated": "2026-01-31T10:00:00.000Z"
}
```

**Additional localStorage Keys**:
- `writing_1`: Text for topic 1
- `writing_2`: Text for topic 2
- ... (one key per writing topic)

---

## Future Enhancements (Out of Scope for v1.0)

### Potential Features:
1. **Grammar Tab**: Dedicated practice for grammar patterns
2. **Statistics Dashboard**: Detailed charts and progress tracking
3. **Daily Goals**: Set and track daily study targets
4. **Streak Tracking**: Consecutive days studied
5. **Export Progress**: Download progress data as JSON
6. **Import Progress**: Upload progress data to sync across devices
7. **Dark Mode**: iOS-style dark mode toggle
8. **Custom Topics**: User-created writing topics
9. **Audio Recording**: Record and compare pronunciation
10. **Flashcard Mode**: Quick review mode without spaced repetition
11. **Search**: Search vocabulary, sentences, readings
12. **Favorites**: Mark items for quick access

---

## Version History

### v1.0.0 (2026-01-31)
- Initial specification document
- Documented all 5 tabs: Dashboard, Vocabulary, Sentences, Reading, Writing
- Defined design system, components, and data models
- Established iOS-inspired visual language
- Specified spaced repetition algorithms
- Defined progressive hint system

---

## How to Use This Document

### For Developers:
When implementing features or fixing bugs:
1. Read the relevant tab specification
2. Follow the exact component structure and styling
3. Maintain consistency with the design system
4. Reference data models for state management
5. Follow behavior flows for user interactions

### For Designers:
When creating mockups or prototypes:
1. Use the color palette and typography system
2. Reference component examples for spacing and layout
3. Maintain iOS-inspired design language
4. Ensure touch targets are appropriate (min 44x44px)

### For Product Managers:
When planning features:
1. Reference the spec to understand current functionality
2. Propose changes as updates to this document
3. Ensure new features align with existing patterns
4. Consider impact on data models and localStorage

### For Future Updates:
When code needs to be modified:
1. AI Agent reads this spec first
2. AI Agent implements changes according to spec
3. After implementation, update this spec if changes deviate
4. Maintain single source of truth

---

**End of Design Specification v1.0.0**
