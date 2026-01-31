# How to Use Spec Documents with AI

> **Guide for developers working with AI assistants to modify code based on specifications**

## Overview

This project uses a **spec-driven development** approach where all UI/UX and feature requirements are documented in detail. When you need to modify code, you should instruct the AI to read the relevant specification first, then implement changes according to the spec.

---

## Quick Start

### Basic Workflow

```
1. Read the spec → 2. Implement changes → 3. Update spec if needed
```

### Example AI Prompt

```
Please read docs/DESIGN_SPEC.md, specifically the Vocabulary Tab section.
Then add a "Skip" button that allows users to skip the current word 
without marking it as correct or incorrect.
```

The AI will:
1. Read the specification
2. Understand current implementation patterns
3. Implement the feature consistently with existing design
4. Optionally update the spec if the implementation differs

---

## Documentation Structure

### 1. Main Specification - [DESIGN_SPEC.md](./DESIGN_SPEC.md)

**When to use**: 
- Need comprehensive understanding of entire system
- Implementing cross-tab features
- Understanding design system
- Working with data models

**Contents**:
- Complete design system (colors, typography, components)
- All 5 tabs in detail
- Common components
- Data models and localStorage schema
- Spaced repetition algorithms

**Size**: ~15,000 words (comprehensive)

---

### 2. Quick Reference - Tab-Specific Specs

**When to use**:
- Focused on single tab implementation
- Quick reference for specific feature
- Don't need full context

**Available specs**:
- [tabs/DASHBOARD.md](./tabs/DASHBOARD.md) - Dashboard tab
- [tabs/VOCABULARY.md](./tabs/VOCABULARY.md) - Vocabulary learning
- [tabs/SENTENCES.md](./tabs/SENTENCES.md) - Sentence practice
- [tabs/READING.md](./tabs/READING.md) - Reading comprehension
- [tabs/WRITING.md](./tabs/WRITING.md) - Writing practice

**Size**: ~2,000-3,000 words each (focused)

---

## AI Prompt Templates

### Template 1: Small Feature Addition

```
Please read docs/tabs/[TAB_NAME].md, then add [FEATURE_DESCRIPTION].

Requirements:
- Follow existing design patterns
- Use the same color scheme
- Maintain mobile-first approach
- Update the spec if implementation differs
```

**Example**:
```
Please read docs/tabs/VOCABULARY.md, then add a "Favorite" button 
that allows users to mark words they want to review more often.

Requirements:
- Place button in top-right of the card
- Use a heart icon (outline when not favorited, filled when favorited)
- Save favorites to localStorage
- Update the spec to document this feature
```

---

### Template 2: Styling Changes

```
Please read docs/DESIGN_SPEC.md section on [COMPONENT/TAB], 
then change the styling of [ELEMENT] to [NEW_STYLE].

Make sure to:
- Keep consistency with other similar elements
- Maintain accessibility (touch targets, contrast)
- Update the spec to reflect new styling
```

**Example**:
```
Please read docs/DESIGN_SPEC.md section on the Vocabulary Tab,
then change the "I Know" and "Don't Know" buttons to be circular
instead of rectangular.

Make sure to:
- Maintain the same colors and icons
- Keep adequate touch target size (min 60x60px for circles)
- Update the spec to show the new button style
```

---

### Template 3: Complex Feature Implementation

```
Please read docs/DESIGN_SPEC.md completely, focusing on:
1. Design System
2. Data Models
3. [RELEVANT_TAB] Tab Spec

Then implement [FEATURE_DESCRIPTION].

Requirements:
- Follow spaced repetition algorithm if applicable
- Use existing state management patterns
- Maintain localStorage schema compatibility
- Create comprehensive spec documentation for new feature
```

**Example**:
```
Please read docs/DESIGN_SPEC.md completely, focusing on:
1. Design System
2. Data Models
3. Dashboard Tab Spec

Then implement a "Daily Streak" feature that tracks consecutive days studied.

Requirements:
- Show streak count on Dashboard
- Award badges for milestones (7 days, 30 days, 100 days)
- Store streak data in localStorage
- Reset streak if user misses a day
- Create comprehensive spec documentation for this feature
```

---

### Template 4: Bug Fix with Context

```
There's a bug in [TAB_NAME] where [BUG_DESCRIPTION].

Please read docs/tabs/[TAB_NAME].md to understand the expected behavior,
then fix the bug while maintaining all existing functionality.
```

**Example**:
```
There's a bug in Sentences tab where clicking a word's info button
sometimes shows the wrong word's meaning.

Please read docs/tabs/SENTENCES.md to understand the word matching algorithm,
then fix the bug while maintaining all existing functionality.
```

---

### Template 5: Refactoring with Spec Preservation

```
Please read docs/DESIGN_SPEC.md section on [COMPONENT],
then refactor [CODE_DESCRIPTION] to improve [ASPECT].

Requirements:
- Maintain exact same visual appearance
- Keep all existing functionality
- Ensure spec remains accurate (update if needed)
- Add comments explaining the refactored code
```

**Example**:
```
Please read docs/DESIGN_SPEC.md section on Progressive Hints,
then refactor the ProgressiveHint component to use a state machine
for better maintainability.

Requirements:
- Maintain exact same visual appearance
- Keep all hint tracking functionality
- Ensure spec remains accurate
- Add comments explaining the state machine
```

---

## Best Practices

### ✅ DO

1. **Always reference the spec** before asking for changes
   ```
   Good: "Read docs/tabs/VOCABULARY.md, then add a skip button"
   Bad: "Add a skip button to the vocabulary page"
   ```

2. **Be specific about which section** to read
   ```
   Good: "Read the 'Progressive Hint System' section in docs/tabs/VOCABULARY.md"
   Bad: "Read the docs"
   ```

3. **Ask AI to update the spec** when implementation differs
   ```
   Good: "If your implementation differs from the spec, update the spec to match"
   Bad: "Just implement it however you think is best"
   ```

4. **Mention consistency requirements**
   ```
   Good: "Follow the same styling patterns as the 'I Know' button"
   Bad: "Make it look good"
   ```

5. **Request mobile testing**
   ```
   Good: "After implementing, verify it works on mobile viewport"
   Bad: "Implement the feature"
   ```

### ❌ DON'T

1. **Don't skip reading the spec**
   ```
   Bad: "Add a new button somewhere on the vocabulary page"
   ```

2. **Don't ask for vague changes**
   ```
   Bad: "Make the app look better"
   ```

3. **Don't ignore design system**
   ```
   Bad: "Add a purple button" (without checking if purple is in the color palette)
   ```

4. **Don't forget about mobile**
   ```
   Bad: "Add a hover effect" (hover doesn't work on mobile)
   ```

5. **Don't leave spec outdated**
   ```
   Bad: "Just change the code, don't worry about docs"
   ```

---

## Spec Update Guidelines

### When to Update the Spec

**Update Required**:
- ✅ Adding new features
- ✅ Changing visual design
- ✅ Modifying behavior flow
- ✅ Adding/changing data models
- ✅ Updating component structure

**Update Optional**:
- ⚠️ Bug fixes (update if behavior changes)
- ⚠️ Performance improvements (no visible change)
- ⚠️ Code refactoring (no functional change)

### How to Update the Spec

Ask AI to update the spec:

```
After implementing this feature, please update docs/tabs/[TAB_NAME].md
to document:
1. The new component structure
2. The behavior flow
3. Any new styling classes
4. Data model changes if any

Also update the version number and changelog in docs/DESIGN_SPEC.md
```

---

## Common Scenarios

### Scenario 1: New Developer Onboarding

**Task**: Understand how the Vocabulary tab works

**Prompt**:
```
I'm new to this project. Please explain how the Vocabulary tab works
by referencing docs/tabs/VOCABULARY.md. Include:
1. The purpose of the tab
2. The progressive hint system
3. How spaced repetition works
4. The data flow when user clicks "I Know"
```

---

### Scenario 2: Design Consistency Check

**Task**: Ensure new feature matches existing design

**Prompt**:
```
I want to add a "Settings" button to the Dashboard.

Please read docs/tabs/DASHBOARD.md and docs/DESIGN_SPEC.md (Design System),
then tell me:
1. What color should the button be?
2. What icon style should I use?
3. Where should I place it?
4. What size should it be?

Then implement it following those guidelines.
```

---

### Scenario 3: Cross-Tab Feature

**Task**: Add feature that affects multiple tabs

**Prompt**:
```
I want to add a "Dark Mode" toggle that affects all tabs.

Please read docs/DESIGN_SPEC.md (Design System section),
then:
1. Create a dark color palette following the existing pattern
2. Implement the toggle on the Dashboard
3. Apply dark mode styles to all 5 tabs
4. Store preference in localStorage
5. Update the spec to document dark mode styles

Make sure all components remain consistent in dark mode.
```

---

### Scenario 4: Algorithm Modification

**Task**: Change spaced repetition intervals

**Prompt**:
```
Please read docs/tabs/VOCABULARY.md section on "Spaced Repetition",
then change the review intervals to:
- learning: 2 days (currently 1 day)
- review: 5 days (currently 3 days)
- mastered: 14 days (currently 7 days)

After implementing, update the spec to reflect new intervals.
```

---

## Troubleshooting

### Problem: AI doesn't follow the spec

**Solution**: Be more explicit
```
Bad: "Read the docs and add a button"
Good: "Read docs/tabs/VOCABULARY.md sections 1-5, then add a button 
that follows the exact same styling as the 'I Know' button 
(green gradient, CheckCircle2 icon, shadow-lg, etc.)"
```

---

### Problem: Spec becomes outdated

**Solution**: Always request spec updates
```
Add to every prompt: "After implementing, update the relevant spec 
file to document your changes."
```

---

### Problem: AI makes inconsistent design choices

**Solution**: Reference design system explicitly
```
Add to every prompt: "Follow the color palette and component styles 
defined in docs/DESIGN_SPEC.md Design System section."
```

---

## Version Control

### Committing Changes

When committing code changes that modify functionality:

```bash
git add .
git commit -m "feat: Add skip button to vocabulary tab

- Add skip button with blue gradient styling
- Skip doesn't affect progress stats
- Update docs/tabs/VOCABULARY.md with new feature
- Spec version: 1.1.0"
```

### Spec Versioning

Update version in `docs/DESIGN_SPEC.md`:

```markdown
## Version History

### v1.1.0 (2026-02-01)
- Added skip button to Vocabulary tab
- Updated button styling guidelines

### v1.0.0 (2026-01-31)
- Initial specification document
```

---

## Summary

### The Spec-Driven Workflow

```
┌─────────────────────────────────────────┐
│ 1. Read Spec                            │
│    docs/tabs/[TAB].md or DESIGN_SPEC.md │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 2. Understand Current Implementation    │
│    - Components                          │
│    - Styling                             │
│    - Behavior                            │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 3. Implement Changes                    │
│    - Follow design system                │
│    - Maintain consistency                │
│    - Test on mobile                      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 4. Update Spec                          │
│    - Document new features               │
│    - Update version                      │
│    - Add to changelog                    │
└─────────────────────────────────────────┘
```

### Key Takeaways

1. **Always read the spec first** - Don't guess implementation details
2. **Be specific in prompts** - Reference exact sections and requirements
3. **Maintain consistency** - Follow existing patterns and styles
4. **Update the spec** - Keep documentation in sync with code
5. **Test on mobile** - This is a mobile-first application

---

**Last Updated**: 2026-01-31  
**Guide Version**: 1.0.0
