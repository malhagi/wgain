# Writing Tab Specification

> **Tab**: Writing  
> **Route**: `/writing`  
> **Status**: ✅ Implemented  
> **Last Updated**: 2026-01-31

## Purpose
Free-form Chinese writing practice with guided topics and vocabulary suggestions.

## Layout

```
┌─────────────────────────────────┐
│ ✍️ Writing                      │
│ Practice Chinese writing         │
├─────────────────────────────────┤
│ Select Topic                     │
│ ┌────────────────────────────┐ │
│ │ ○ 自我介绍      [初级]    │ │
│ │ ○ 我的家人      [初级]    │ │
│ │ ● 周末活动      [中级]    │ │ ← Selected
│ │ ...                         │ │
│ └────────────────────────────┘ │
├─────────────────────────────────┤
│ 周末活动 [中级]          [Clear]│
│                                  │
│ 💡 Example:                     │
│ 这个周末我打算...，因为...      │
│                                  │
│ ┌────────────────────────────┐ │
│ │ [Text Area]                 │ │
│ │ 在这里用中文写作...         │ │
│ │                             │ │
│ └────────────────────────────┘ │
│                                  │
│ Characters: 75                   │
│ Speed: 25 chars/min              │
│ Goal: 100-150 characters ✓      │
├─────────────────────────────────┤
│ 预览                             │
│ [Formatted text preview]         │
├─────────────────────────────────┤
│ 📝 推荐词汇                      │
│ ┌─────────┬─────────┐          │
│ │ 周末    │ 打算    │          │
│ │ zhōu mò │ dǎ suàn │          │
│ ├─────────┼─────────┤          │
│ │ 锻炼    │ 聊天    │          │
│ │ duàn... │ liáo... │          │
│ └─────────┴─────────┘          │
│ 💡 提示: 试着在写作中使用...    │
└─────────────────────────────────┘
```

## Key Components

### 1. Topic Selection Card

**Topics List**:
```tsx
<div className="grid grid-cols-1 gap-3">
  {writingTopics.map((topic) => (
    <button
      onClick={() => handleTopicChange(topic)}
      className={/* Dynamic based on selection */}
    >
      <div className="flex items-center justify-between">
        <div className="font-bold">{topic.title}</div>
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
```

**Button States**:

**Unselected**:
```css
Border: border-2 border-blue-200
Background: bg-white
Active: scale-98
```

**Selected**:
```css
Border: border-2 border-blue-500
Background: bg-gradient-to-br from-blue-50 to-blue-100
Shadow: shadow-md
Transform: scale-[1.02]
```

### 2. Difficulty Badges

**初级 (Beginner - Level 1)**:
```css
Background: bg-green-100
Text: text-green-800
Border: border-green-300
Goal: 50-100 characters
```

**中级 (Intermediate - Level 2)**:
```css
Background: bg-yellow-100
Text: text-yellow-800
Border: border-yellow-300
Goal: 100-150 characters
```

**高级 (Advanced - Level 3)**:
```css
Background: bg-red-100
Text: text-red-800
Border: border-red-300
Goal: 150-200 characters
```

### 3. Writing Area Header

```tsx
<div className="flex justify-between items-center">
  <div className="flex items-center gap-2">
    <h2 className="text-lg font-bold">{topic.title}</h2>
    <span className={/* Difficulty badge */} />
  </div>
  <button
    onClick={handleClear}
    className="text-sm text-red-500 font-bold hover:text-red-700 active:scale-95"
  >
    Clear
  </button>
</div>
```

### 4. Example Section

```tsx
<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200/50 p-4">
  <div className="text-sm font-bold mb-2 text-yellow-900">
    💡 Example:
  </div>
  <div className="text-sm text-black">
    {selectedTopic.example}
  </div>
</div>
```

### 5. Text Area

```tsx
<textarea
  ref={textareaRef}
  value={text}
  onChange={handleTextChange}
  placeholder="在这里用中文写作..."
  className="w-full h-48 p-4 border-2 border-blue-300 rounded-2xl resize-none focus:outline-none focus:border-blue-500"
  style={{ fontSize: '16px' }}
/>
```

**Requirements**:
- **Size**: w-full h-48 (192px height)
- **Padding**: p-4
- **Border**: border-2 border-blue-300
- **Focus**: focus:border-blue-500
- **Resize**: resize-none (fixed size)
- **Font**: 16px (prevents iOS zoom)
- **Placeholder**: "在这里用中文写作..."

### 6. Character Count & Stats

```tsx
<div className="mt-4 space-y-2">
  <div className="flex justify-between items-center text-sm font-semibold">
    <div>Characters: {wordCount}</div>
    {typingSpeed !== null && (
      <div>Speed: {typingSpeed} chars/min</div>
    )}
  </div>
  
  <div className="flex items-center gap-2 text-sm">
    <span className="font-semibold">Goal:</span>
    <span className={/* Color based on range */}>
      {goal.min}-{goal.max} characters
    </span>
    {isInRange && <span className="text-green-600 font-bold">✓</span>}
  </div>
  
  {typingSpeed !== null && (
    <div className={typingSpeed >= 20 ? 'text-green-600' : 'text-orange-600'}>
      {typingSpeed >= 20 ? '✓ Goal Achieved!' : 'Goal: 20 chars/min'}
    </div>
  )}
</div>
```

**Goal Colors**:
- **Below minimum**: text-orange-600
- **In range**: text-green-600 font-semibold
- **Above maximum**: text-red-600

**Typing Speed Goal**: 20 chars/min

### 7. Preview Card (Conditional)

```tsx
{text.length > 0 && (
  <div className="ios-card p-5">
    <h3 className="font-bold mb-3">预览</h3>
    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 whitespace-pre-wrap">
      {text}
    </div>
  </div>
)}
```

**Requirements**:
- Only shown when text exists
- `whitespace-pre-wrap`: Preserves line breaks
- Blue gradient background

### 8. Vocabulary Suggestions (Conditional)

```tsx
{selectedTopic.suggestedWords.length > 0 && (
  <div className="ios-card p-5">
    <h3 className="text-lg font-bold mb-4">📝 推荐词汇</h3>
    <div className="grid grid-cols-2 gap-3">
      {selectedTopic.suggestedWords.map((word) => (
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-300/50 active:scale-95">
          <div className="font-bold text-xl text-black mb-1">
            {word}
          </div>
          <div className="text-xs text-blue-700 font-semibold">
            {pinyinMap[word]}
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-300/50">
      <p className="font-bold mb-1">💡 提示:</p>
      <p>试着在写作中使用这些HSK3词汇！</p>
    </div>
  </div>
)}
```

**Requirements**:
- Only shown if topic has suggestedWords
- 2-column grid (grid-cols-2)
- Each word card clickable (future: copy to clipboard)
- Tip box at bottom

## Data Model

```typescript
interface WritingTopic {
  id: number;
  title: string; // Chinese title
  description: string; // English description
  example: string; // Example sentence
  difficulty: 1 | 2 | 3;
  suggestedWords: string[]; // Chinese words
}
```

### Topic List (15 topics)

**Difficulty 1 (初级) - 7 topics**:
1. 自我介绍 (Self-introduction)
2. 我的家人 (My family)
3. 我的爱好 (My hobbies)
4. 我的学校 (My school)
5. 周末计划 (Weekend plans)
6. 我的邻居 (My neighbor)
7. 周末活动 (Weekend activities)

**Difficulty 2 (中级) - 4 topics**:
8. 我的工作 (My job)
9. 学习经历 (Learning experience)
10. 旅行计划 (Travel plans)
11. 健康生活 (Healthy life)

**Difficulty 3 (高级) - 4 topics**:
12. 一次重要的决定 (An important decision)
13. 环境保护 (Environmental protection)
14. 我的理想 (My ideal)
15. 文化差异 (Cultural differences)

## Behavior Flow

### On Load
1. Check localStorage for saved text
2. If exists, load into textarea
3. Calculate wordCount

### When User Selects Topic
1. Update selectedTopic state
2. Load saved text from localStorage (key: `writing_${topicId}`)
3. If no saved text, clear textarea
4. Reset stats (wordCount, startTime, typingSpeed)
5. Focus textarea

### When User Types
1. Update text state
2. Calculate wordCount (text.length)
3. **First character**:
   - Set startTime = Date.now()
4. **Subsequent typing**:
   - Calculate elapsed time in minutes
   - Calculate typingSpeed = wordCount / elapsedMinutes
   - Round to nearest integer
5. **Auto-save**:
   - Save to localStorage
   - Key: `writing_${topicId}`
   - Value: text

### When User Clicks "Clear"
1. Clear text state
2. Reset wordCount = 0
3. Reset startTime = null
4. Reset typingSpeed = null
5. Remove from localStorage
6. Focus textarea

## Character Count Goals

```typescript
const getWordCountGoal = (difficulty: 1 | 2 | 3) => {
  switch (difficulty) {
    case 1:
      return { min: 50, max: 100 };
    case 2:
      return { min: 100, max: 150 };
    case 3:
      return { min: 150, max: 200 };
  }
};
```

## Typing Speed Calculation

```typescript
const elapsedMinutes = (Date.now() - startTime) / 60000;
const speed = Math.round(text.length / elapsedMinutes);
```

**Goal**: 20 chars/min

## State Management

```typescript
const [text, setText] = useState('');
const [startTime, setStartTime] = useState<number | null>(null);
const [typingSpeed, setTypingSpeed] = useState<number | null>(null);
const [wordCount, setWordCount] = useState(0);
const [selectedTopic, setSelectedTopic] = useState(writingTopics[0]);
const textareaRef = useRef<HTMLTextAreaElement>(null);
```

## localStorage Schema

**Keys**:
- `writing_1`: Text for topic 1
- `writing_2`: Text for topic 2
- ... (one key per topic)

**Value**: Plain text string

## Styling

### Topic Button
```css
Padding: p-4
Border: border-2
Shape: rounded-2xl
Transition: transition-ios
Shadow: shadow-sm
Active: scale-98 (unselected), scale-[1.02] (selected)
```

### Difficulty Badge
```css
Font: text-xs font-bold
Shape: rounded-full
Border: border
Padding: px-2 py-1
```

### Text Area
```css
Width: w-full
Height: h-48 (192px)
Padding: p-4
Border: border-2 border-blue-300
Focus: focus:border-blue-500
Shape: rounded-2xl
Resize: none
Font: 16px (inline style for iOS)
Shadow: shadow-sm
```

### Vocabulary Card
```css
Padding: p-4
Background: bg-gradient-to-br from-blue-50 to-blue-100
Border: border border-blue-300/50
Shape: rounded-2xl
Shadow: shadow-sm
Active: scale-95
```

## Mobile Optimization
- Container: max-w-2xl px-4 py-6 pb-24
- Textarea: Fixed height (h-48) to prevent layout shift
- Font size: 16px to prevent iOS zoom
- Touch targets: Topics full width, adequate height
- Grid: 2 columns for vocab cards

## Auto-Save Behavior
- **Trigger**: Every keypress in textarea
- **Debounce**: None (instant save to localStorage)
- **Persistence**: Across page refreshes
- **Cleanup**: Manual via "Clear" button

---

**See**: [Full Design Spec](../DESIGN_SPEC.md#writing-tab-spec) for complete details
