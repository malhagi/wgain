# Dashboard Specification

> **Tab**: Dashboard (Home)  
> **Route**: `/`  
> **Status**: ✅ Implemented  
> **Last Updated**: 2026-01-31

## Purpose
Central hub showing overall progress and navigation to all learning sections.

## Layout

```
┌─────────────────────────────────┐
│ 包子 HSK 3                       │
│ Chinese Learning Made Easy       │
├─────────────────────────────────┤
│ 📈 Overall Progress             │
│ ┌─────────┬─────────┐          │
│ │ Total   │ New     │          │
│ ├─────────┼─────────┤          │
│ │ Learning│ Mastered│          │
│ └─────────┴─────────┘          │
├─────────────────────────────────┤
│ 📚 Vocabulary →                 │
│ Progress: X/600                  │
│ ▓▓▓▓▓░░░░░ XX%                  │
│ 📚 Learning: X | 🔄 Review: Y   │
├─────────────────────────────────┤
│ 💬 Sentences →                  │
│ Progress: X/300                  │
│ ...                              │
├─────────────────────────────────┤
│ 📖 Reading →                    │
│ Progress: X/50                   │
│ ...                              │
├─────────────────────────────────┤
│ ✍️ Writing →                    │
│ Coming soon... 🚀               │
└─────────────────────────────────┘
```

## Key Components

### 1. Header
- **Title**: "包子 HSK 3" (text-3xl font-bold)
- **Subtitle**: "Chinese Learning Made Easy" (text-sm text-blue-600)

### 2. Overall Progress Card
Shows 4 metrics in 2x2 grid:
- **Total Items**: Blue gradient
- **New**: Purple gradient
- **Learning**: Orange gradient
- **Mastered**: Green gradient

### 3. Section Cards
Each section card includes:
- **Icon**: Colored circular background (w-12 h-12)
- **Title**: Section name (text-xl font-bold)
- **Progress Bar**: Visual representation of completion
- **Stats**: Learning count and Review count
- **Chevron**: Right arrow for navigation

**Colors**:
- Vocabulary: Blue (bg-blue-500)
- Sentences: Green (bg-green-500)
- Reading: Purple (bg-purple-500)
- Writing: Orange (bg-orange-500)

## Data Requirements

```typescript
interface DashboardData {
  progress: UserProgress;
  overallStats: {
    total: number;
    new: number;
    learning: number;
    mastered: number;
  };
  sections: Array<{
    name: string;
    href: string;
    icon: LucideIcon;
    color: string;
    stats: {
      total: number;
      new: number;
      learning: number;
      review: number;
      mastered: number;
    } | null;
  }>;
}
```

## Behavior

### On Load
1. Read `hsk3_user_progress` from localStorage
2. Calculate overall stats from all sections
3. Calculate per-section stats
4. Display progress bars

### On Section Click
1. Navigate to section route
2. Active scale animation (scale-98)

## Styling

### Card Styles
```css
.ios-card: bg-white/80 backdrop-blur-sm rounded-3xl shadow-md
.transition-ios: transition-all duration-200 ease-out
```

### Hover/Active States
- Hover: shadow-lg
- Active: scale-98

### Spacing
- Container: px-4 py-6 pb-24
- Card padding: p-5
- Gap between cards: space-y-4

## Progress Calculation

### Overall Stats
```typescript
total = vocabulary.length + sentences.length + readings.length
new = items where status === 'new'
learning = items where status === 'learning'
mastered = items where status === 'mastered'
```

### Section Stats
```typescript
total = section items count
new = items where status === 'new'
learning = items where status === 'learning'
review = items where status === 'review'
mastered = items where status === 'mastered'
```

### Progress Percentage
```typescript
progressPercent = Math.round((mastered / total) * 100)
```

## Mobile Optimization
- Touch targets: min 44x44px
- Bottom padding: pb-24 (for navigation bar)
- Container max-width: max-w-2xl
- Responsive grid: grid-cols-2 for stats

---

**See**: [Full Design Spec](./DESIGN_SPEC.md#dashboard-spec) for complete details
