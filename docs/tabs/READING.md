# Reading Tab Specification

> **Tab**: Reading  
> **Route**: `/reading`  
> **Status**: ✅ Implemented  
> **Last Updated**: 2026-01-31

## Purpose
Practice reading comprehension with full passages and multiple-choice questions.

## Layout

```
┌─────────────────────────────────┐
│ 📖 Reading                       │
│ Reading comprehension            │
├─────────────────────────────────┤
│ 我的一天                         │
│ (Title, text-xl font-bold)       │
│                                  │
│          🔊                      │
│                                  │
│ ┌──────────────────────────────┐│
│ │ 每天 ⓘ 早上 ⓘ 我 ⓘ 七点 ⓘ  ││
│ │ 起床 ⓘ。我 ⓘ 先 ⓘ 洗脸 ⓘ... ││
│ │ (Passage with word hints)     ││
│ └──────────────────────────────┘│
│                                  │
│ 问题 1: 他每天几点起床?          │
│ ○ 六点                           │
│ ○ 七点  ← Selected (blue)       │
│ ○ 八点                           │
│ ○ 九点                           │
│                                  │
│ 问题 2: ...                      │
│ ...                              │
│                                  │
│ [Submit Answers] or [Next]       │
│                                  │
│ 1 / 50                          │
└─────────────────────────────────┘
```

## Key Components

### 1. Reading Title
```tsx
<h2 className="text-xl font-bold mb-4 text-black">
  {currentReading.title}
</h2>
```

### 2. TTS Button
Same as Sentences tab:
- Center aligned
- Plays entire passage

### 3. Passage with Word Hints

**Container**:
```css
Background: bg-gradient-to-br from-blue-50 to-blue-100
Border: border border-blue-200/50
Shape: rounded-2xl
Padding: p-4
```

**Text**:
- Font: text-base or text-lg
- Leading: leading-relaxed
- Layout: flex flex-wrap gap-1

**Word hints**: Same system as Sentences tab
- Interactive words with info buttons
- Click to show tooltip (pinyin + meaning)

### 4. Questions Section

**Question Container**:
```tsx
<div className="space-y-3 mb-5">
  {questions.map((q) => (
    <div className="p-4 bg-white/50 rounded-2xl border border-blue-200/50">
      {/* Question and options */}
    </div>
  ))}
</div>
```

**Question Text**:
```css
Font: text-base font-bold
Color: text-black
Margin: mb-3
```

### 5. Answer Options

**Before Submission**:

**Unselected**:
```css
Background: bg-white
Border: border-2 border-blue-200
Text: text-black
Active: scale-98
```

**Selected**:
```css
Background: bg-gradient-to-br from-blue-50 to-blue-100
Border: border-2 border-blue-500
Text: text-black font-bold
Shadow: shadow-sm
```

**After Submission**:

**Correct Answer**:
```css
Background: bg-gradient-to-br from-green-50 to-green-100
Border: border-2 border-green-500
Text: text-black font-bold
Shadow: shadow-md
Append: " ✓"
```

**Incorrect Selection**:
```css
Background: bg-gradient-to-br from-red-50 to-red-100
Border: border-2 border-red-500
Text: text-black font-bold
Shadow: shadow-md
Append: " ✗"
```

**Other Options**:
```css
Background: bg-white
Border: border-2 border-blue-200
Text: text-black
```

### 6. Submit/Next Button

**Before Submission**:
```tsx
<button className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold">
  Submit Answers
</button>
```

**After Submission**:
```tsx
<button className="w-full bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold">
  Next Reading
</button>
```

**Changes**: Color (blue → green), Text (Submit → Next)

## Data Model

```typescript
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
  correctAnswer: number; // Index 0-3
}
```

## Behavior Flow

### On Load
1. Load readings data
2. Load vocabulary data (for word hints)
3. Create vocab map
4. Load user progress
5. Show first reading

### When User Clicks TTS
1. Set isPlaying = true
2. Play passage audio (await)
3. Set isPlaying = false

### When User Clicks Word Info
1. Add to clickedWords Set
2. Show tooltip with pinyin and meaning
3. Track hint usage

### When User Selects Answer
1. Update selectedAnswers state
2. Highlight selected option (blue border)
3. Can change selection before submit

### When User Clicks "Submit Answers"
1. Calculate score:
   ```typescript
   let correctCount = 0;
   questions.forEach((q) => {
     if (selectedAnswers[q.id] === q.correctAnswer) {
       correctCount++;
     }
   });
   const allCorrect = correctCount === questions.length;
   ```

2. Update progress:
   ```typescript
   if (allCorrect) {
     correctCount++;
     consecutiveCorrect++;
   } else {
     incorrectCount++;
     consecutiveCorrect = 0;
   }
   ```

3. Set showResults = true

4. Display visual feedback:
   - Correct answers: Green background with ✓
   - Incorrect selections: Red background with ✗
   - Other options: Gray out

### When User Clicks "Next Reading"
1. Increment currentIndex
2. Reset selectedAnswers to {}
3. Set showResults = false
4. Clear clickedWords Set
5. Load next reading's progress

## Scoring Logic

### All Correct
- correctCount++
- consecutiveCorrect++
- Status may advance (learning → review → mastered)

### Any Incorrect
- incorrectCount++
- consecutiveCorrect = 0
- Status may regress (review → learning)

## State Management

```typescript
const [readings, setReadings] = useState<Reading[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [progress, setProgress] = useState<UserProgress | null>(null);
const [currentProgress, setCurrentProgress] = useState<LearningProgress | null>(null);
const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({}); // questionId -> optionIndex
const [showResults, setShowResults] = useState(false);
const [vocabMap, setVocabMap] = useState<Record<string, Vocabulary>>({});
const [isPlaying, setIsPlaying] = useState(false);
const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());
```

## Word Matching Algorithm

**Same as Sentences tab**:
1. Match words from wordIds
2. Prevent overlapping matches
3. Track used positions
4. Sort by start index
5. Render with gaps filled by regular text

## Styling

### Passage Container
```css
Background: bg-gradient-to-br from-blue-50 to-blue-100
Border: border border-blue-200/50
Shape: rounded-2xl
Padding: p-4
Shadow: shadow-sm
Margin: mb-5
```

### Question Container
```css
Background: bg-white/50
Border: border border-blue-200/50
Shape: rounded-2xl
Padding: p-4
Shadow: shadow-sm
Space: space-y-3
```

### Option Button
```css
Width: w-full
Text align: text-left
Padding: p-4
Border: border-2
Shape: rounded-xl
Font: text-base
Transition: transition-ios
```

### Submit/Next Button
```css
Width: w-full
Padding: py-4 px-6
Shape: rounded-2xl
Font: text-base font-bold
Shadow: shadow-lg
Transition: transition-ios
Active: scale-95
```

## Mobile Optimization
- Container: max-w-2xl px-4 py-6 pb-24
- Touch targets: Options min 44px height
- Option buttons: Full width, adequate padding
- Passage: Wraps naturally
- Questions: Stack vertically (space-y-3)

## Accessibility
- All buttons have proper labels
- Color is not the only indicator (use ✓ and ✗)
- Options disabled after submission
- Clear visual feedback for all states

---

**See**: [Full Design Spec](../DESIGN_SPEC.md#reading-tab-spec) for complete details
