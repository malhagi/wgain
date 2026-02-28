# GEMINI.md - Baozi HSK 3 Project Context

## Project Overview
**Baozi HSK 3** is a mobile-first, iOS-inspired Chinese learning application for HSK 3 level mastery. It uses spaced repetition algorithms and a progressive hint system (TTS → Pinyin → Meaning) to optimize vocabulary retention and sentence comprehension.

### Core Technologies
- **Frontend**: Next.js 16+ (App Router), React 19, TypeScript 5 (strict)
- **Styling**: Tailwind CSS 4 (`@tailwindcss/postcss`), Lucide React
- **TTS**: Web Speech API (native browser)
- **State/Storage**: React Hooks + `localStorage` (offline-first)
- **Testing**: Playwright (E2E, multi-browser: Chromium, Mobile Chrome, Mobile Safari)

## Architecture & Logic
The project follows a **spec-driven development** approach with detailed requirements in `/docs`.

### Key Modules
- **Learning Algorithms** (`lib/learning/`): Spaced repetition (`new` → `learning` → `review` → `mastered`), progress tracking, hint usage
- **Data Layer** (`data/`): Static JSON files for HSK 3 vocabulary, sentences, readings, grammar
- **UI System**: iOS glassmorphism, `.ios-card`, `.transition-ios`, min 44x44px touch targets

### Directory Structure
```
app/          → Next.js pages/layouts, (study) route group
components/   → Reusable UI components
lib/          → Business logic (data loading, learning algorithms, TTS)
data/         → HSK 3 learning content (JSON)
docs/         → Design & feature specs (Single Source of Truth)
tests/        → Playwright E2E tests
types/        → TypeScript type definitions
```

## Agentic Coding Infrastructure

### Workflow: Spec → Dev → Verify → Build
1. **Spec**: Read/update `docs/DESIGN_SPEC.md` or `docs/tabs/*.md` before coding
2. **Dev**: Implement from spec + add Playwright E2E tests
3. **Verify**: `npm run verify` (typecheck + lint + test:e2e)
4. **Build**: `npm run build` for production readiness

### Cursor Rules (`.cursor/rules/`)
- `project-context.mdc` - Always: project context & conventions
- `react-nextjs-patterns.mdc` - *.tsx: React/Next.js patterns
- `api-conventions.mdc` - API route rules
- `testing-conventions.mdc` - Playwright test rules

### Cursor Skills (`.cursor/skills/`)
- `spec-first-development` - Spec-driven development workflow
- `verify-and-build` - Verification & build pipeline

### Subagents (`.cursor/agents/`)
- `hsk3-vocabulary-processor` - CSV → vocabulary.json
- `hsk3-sentence-generator` - Practice sentences → sentences.json
- `hsk3-grammar-updater` - Grammar patterns → grammar.json
- `hsk3-writing-updater` - Writing topics & prompts

### Persona: "Baozi" Senior Engineer
Defined in `AGENTS.md` - spec-obsessed, quality-gate enforcer, mobile-first thinker, test advocate.

## Building and Running
| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run test:e2e` | Playwright E2E (headless) |
| `npm run test:e2e:ui` | Playwright UI mode (debug) |
| `npm run verify` | typecheck + lint + test:e2e |

## Development Conventions
1. **Spec-Driven**: Always reference `docs/DESIGN_SPEC.md` before changes
2. **Mobile-First**: Optimized for iOS/Android, functional on desktop
3. **Offline-First**: Progress persisted to `localStorage` (`hsk_learning_progress`)
4. **TypeScript Strict**: All types explicit, no `any`
5. **Design System**: `.ios-card`, color scheme, spacing as specified in DESIGN_SPEC
6. **Accessibility**: Min touch targets, clear visual feedback

## Key Reference Files
- `docs/DESIGN_SPEC.md` - Master specification
- `docs/AI_WORKFLOW.md` - Agentic coding workflow
- `AGENTS.md` - Persona & workflow guide
- `lib/learning/spacedRepetition.ts` - Core learning logic
- `types/index.ts` - Centralized type definitions
