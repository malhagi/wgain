# 包子 HSK 3 - Documentation

> Comprehensive documentation for the 包子 HSK 3 Chinese learning application

## 📚 Documentation Index

### Main Documentation

#### [DESIGN_SPEC.md](./DESIGN_SPEC.md) - **Complete Specification**
The comprehensive single source of truth for all UI/UX specifications and feature requirements.

**Contents**:
- Overview - Application purpose, platform, and key features
- Design System - Colors, typography, components, spacing
- All 5 Tab Specifications (Dashboard, Vocabulary, Sentences, Reading, Writing)
- Common Components - Shared UI elements
- Data Models - TypeScript interfaces and localStorage schema

### Quick Reference - Tab Specifications

For faster reference, each tab has its own dedicated spec file:

#### [tabs/DASHBOARD.md](./tabs/DASHBOARD.md) - **Dashboard**
- Overall progress card
- Section navigation cards
- Progress calculations

#### [tabs/VOCABULARY.md](./tabs/VOCABULARY.md) - **Vocabulary Tab**
- Progressive hint system (TTS → Pinyin → Meaning)
- Spaced repetition algorithm
- I Know / Don't Know flow

#### [tabs/SENTENCES.md](./tabs/SENTENCES.md) - **Sentences Tab**
- Interactive word hints
- Translation & grammar reveals
- Word matching algorithm

#### [tabs/READING.md](./tabs/READING.md) - **Reading Tab**
- Passage with word hints
- Multiple-choice questions
- Answer checking & feedback

#### [tabs/WRITING.md](./tabs/WRITING.md) - **Writing Tab**
- 15 guided topics
- Character count & typing speed
- Vocabulary suggestions

---

## 🎯 Quick Start for Developers

### Reading the Spec
1. **New to the project?** Start with [DESIGN_SPEC.md - Overview](./DESIGN_SPEC.md#overview)
2. **Implementing a feature?** Jump to the relevant tab spec:
   - [tabs/DASHBOARD.md](./tabs/DASHBOARD.md) - Dashboard
   - [tabs/VOCABULARY.md](./tabs/VOCABULARY.md) - Vocabulary tab
   - [tabs/SENTENCES.md](./tabs/SENTENCES.md) - Sentences tab
   - [tabs/READING.md](./tabs/READING.md) - Reading tab
   - [tabs/WRITING.md](./tabs/WRITING.md) - Writing tab
3. **Styling components?** Reference [DESIGN_SPEC.md - Design System](./DESIGN_SPEC.md#design-system)
4. **Working with data?** Check [DESIGN_SPEC.md - Data Models](./DESIGN_SPEC.md#data-models)

### Using Spec with AI Agent

**Read the comprehensive guide**: [HOW_TO_USE_SPECS.md](./HOW_TO_USE_SPECS.md)

**Quick example**:

```
"Please read docs/tabs/VOCABULARY.md first, 
then update the Vocabulary tab to add a 'Skip' button
that follows the same styling as the 'I Know' button."
```

The AI will:
1. Read the specification
2. Understand current implementation
3. Make changes consistent with existing patterns
4. Update the spec if needed

---

## 📋 Tab Specifications Summary

### 1. Dashboard
**Purpose**: Central hub showing overall progress and navigation

**Key Features**:
- Overall stats (Total, New, Learning, Mastered)
- Section cards with progress bars
- Navigation to all learning tabs

**Status**: ✅ Implemented

---

### 2. Vocabulary Tab
**Purpose**: Learn individual Chinese words using spaced repetition

**Key Features**:
- Progressive hint system (TTS → Pinyin → Meaning)
- Incorrect count badge
- Example sentences (always visible)
- Spaced repetition algorithm
- I Know / Don't Know buttons with TTS playback

**Learning States**: 
- new → learning (after first attempt)
- learning → review (3 consecutive correct)
- review → mastered (5 consecutive correct)

**Status**: ✅ Implemented

---

### 3. Sentences Tab
**Purpose**: Practice full Chinese sentences with word-level hints

**Key Features**:
- TTS for full sentence
- Interactive word hints (click info icon)
- Translation reveal on "Don't Know"
- Grammar explanations
- Clickable word tooltips (pinyin + meaning)

**Status**: ✅ Implemented

---

### 4. Reading Tab
**Purpose**: Reading comprehension with passages and questions

**Key Features**:
- Full passage with word hints
- TTS for entire passage
- Multiple-choice questions
- Color-coded answer feedback
- Submit answers → Next reading flow

**Status**: ✅ Implemented

---

### 5. Writing Tab
**Purpose**: Free-form Chinese writing practice

**Key Features**:
- 15 guided topics (3 difficulty levels)
- Character count and goal tracking
- Typing speed calculation
- Auto-save to localStorage
- Vocabulary suggestions per topic
- Live preview

**Difficulty Levels**:
- 初级 (Beginner): 50-100 characters
- 中级 (Intermediate): 100-150 characters
- 高级 (Advanced): 150-200 characters

**Status**: ✅ Implemented

---

## 🎨 Design System Quick Reference

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F97316)
- **Error**: Red (#EF4444)
- **Accent**: Purple (#A855F7)

### Component Patterns
```css
/* iOS Card */
.ios-card {
  @apply bg-white/80 backdrop-blur-sm rounded-3xl 
         shadow-md border border-black/5;
}

/* Transition */
.transition-ios {
  @apply transition-all duration-200 ease-out;
}

/* Active States */
.active:scale-95 { transform: scale(0.95); }
.active:scale-98 { transform: scale(0.98); }
```

### Typography
- **H1**: `text-3xl font-bold text-black tracking-tight`
- **H2**: `text-xl font-bold text-black`
- **Body**: `text-base text-black`
- **Small**: `text-sm text-black`

---

## 💾 Data Architecture

### localStorage Keys
- `hsk3_user_progress`: Main progress object (UserProgress)
- `writing_1`, `writing_2`, etc.: Writing drafts per topic

### Learning Progress Tracking
```typescript
interface LearningProgress {
  itemId: string;
  itemType: 'vocabulary' | 'sentence' | 'reading';
  status: 'new' | 'learning' | 'review' | 'mastered';
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  lastStudiedAt: string;
  nextReviewAt: string;
  hintUsage: HintUsage;
}
```

### Spaced Repetition Intervals
- **new**: Immediate
- **learning**: 1 day
- **review**: 3 days
- **mastered**: 7 days

---

## 🔄 Workflow for Code Changes

### 1. Spec-Driven Development
```
1. Read DESIGN_SPEC.md for the relevant section
2. Understand current implementation
3. Implement changes following spec patterns
4. Update spec if implementation differs
```

### 2. Consistency Checklist
- [ ] Follows design system (colors, typography, spacing)
- [ ] Uses iOS-style components (.ios-card, .transition-ios)
- [ ] Maintains accessibility (proper button sizes, labels)
- [ ] Updates localStorage correctly
- [ ] Handles loading and error states
- [ ] Mobile-first responsive design

### 3. Testing Checklist
- [ ] Test on mobile viewport
- [ ] Test TTS functionality
- [ ] Test localStorage persistence
- [ ] Test spaced repetition logic
- [ ] Test hint progression
- [ ] Test navigation between tabs

---

## 📱 Platform Requirements

### Target Devices
- **Primary**: Mobile (iOS/Android)
- **Secondary**: Desktop browsers
- **Minimum touch target**: 44x44px

### Browser Compatibility
- Modern browsers (Chrome, Safari, Firefox, Edge)
- iOS Safari (WebKit)
- Android Chrome

### Performance
- Offline-first (localStorage-based)
- No backend required
- Fast TTS (Web Speech API)

---

## 🚀 Future Enhancements

See [DESIGN_SPEC.md - Future Enhancements](#future-enhancements) for planned features:
- Grammar Tab
- Statistics Dashboard
- Daily Goals & Streaks
- Dark Mode
- Custom Topics
- Audio Recording
- And more...

---

## 📞 Support & Maintenance

### Updating the Spec
When code changes require spec updates:
1. Edit `DESIGN_SPEC.md`
2. Update version number and changelog
3. Commit with descriptive message
4. Keep spec and code in sync

### Version History
- **v1.0.0** (2026-01-31): Initial specification

---

## 📖 Additional Resources

### Learning Algorithms
- [Spaced Repetition](https://en.wikipedia.org/wiki/Spaced_repetition)
- [Progressive Hints in Language Learning](https://en.wikipedia.org/wiki/Scaffolding_(education))

### Design Inspiration
- iOS Human Interface Guidelines
- Material Design (adapted for iOS style)

### Technologies
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - TTS

---

**Last Updated**: 2026-01-31  
**Spec Version**: 1.0.0
