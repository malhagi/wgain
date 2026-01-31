# 包子 HSK 3

> A mobile-first Chinese learning application for HSK 3 level, featuring spaced repetition, progressive hints, and comprehensive practice across vocabulary, sentences, reading, and writing.

## 🎯 Features

### 📚 Vocabulary Learning
- **Progressive Hint System**: TTS → Pinyin → Meaning
- **Spaced Repetition**: Smart review scheduling based on performance
- **Example Sentences**: Real-world usage for every word
- **Progress Tracking**: Track your journey from 'new' to 'mastered'

### 💬 Sentence Practice
- **Interactive Word Hints**: Click any word for pinyin and meaning
- **Grammar Explanations**: Understand the patterns behind sentences
- **TTS Support**: Listen to native pronunciation
- **Context Learning**: Learn words in real sentences

### 📖 Reading Comprehension
- **Full Passages**: HSK 3-level reading texts
- **Multiple Choice Questions**: Test your understanding
- **Word-Level Support**: Click any word for help
- **Instant Feedback**: Color-coded answer checking

### ✍️ Writing Practice
- **15 Guided Topics**: From beginner to advanced
- **Character Goals**: Track your writing progress
- **Typing Speed**: Improve your input speed
- **Vocabulary Suggestions**: Use relevant HSK 3 words
- **Auto-Save**: Never lose your work

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser (Chrome, Safari, Firefox, Edge)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd baozi

# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 Documentation

**📚 Complete documentation is available in the [`/docs`](./docs) folder.**

### Core Documentation

1. **[Design Specification](./docs/DESIGN_SPEC.md)** - The single source of truth
   - Complete UI/UX specifications
   - All 5 tabs in detail
   - Design system and components
   - Data models and algorithms

2. **[Documentation Index](./docs/README.md)** - Quick navigation
   - Tab specifications summary
   - Quick reference guide
   - Development workflow

3. **[How to Use Specs](./docs/HOW_TO_USE_SPECS.md)** - AI workflow guide
   - Spec-driven development approach
   - AI prompt templates
   - Best practices
   - Common scenarios

### Quick References - Individual Tab Specs

For faster access, each tab has its own dedicated spec:

- **[Dashboard](./docs/tabs/DASHBOARD.md)** - Progress overview and navigation
- **[Vocabulary](./docs/tabs/VOCABULARY.md)** - Progressive hints & spaced repetition
- **[Sentences](./docs/tabs/SENTENCES.md)** - Interactive word hints & grammar
- **[Reading](./docs/tabs/READING.md)** - Comprehension with questions
- **[Writing](./docs/tabs/WRITING.md)** - Guided topics & vocabulary

### Using Documentation with AI

When working with AI to modify code, always reference the spec:

```
"Please read docs/tabs/VOCABULARY.md, then add a 'Skip' button..."
```

See [How to Use Specs](./docs/HOW_TO_USE_SPECS.md) for detailed guidance.

## 🎨 Design System

### iOS-Inspired UI
- Glassmorphism effects with backdrop blur
- Smooth transitions and animations
- Touch-friendly button sizes (min 44x44px)
- Native-feeling interactions

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F97316)
- **Error**: Red (#EF4444)
- **Accent**: Purple (#A855F7)

## 🧠 Learning Algorithm

### Spaced Repetition
Items progress through 4 stages based on performance:
1. **New**: Never studied
2. **Learning**: In progress (1-day interval)
3. **Review**: Making progress (3-day interval)
4. **Mastered**: Completed (7-day interval)

### Progressive Hints
Vocabulary learning uses a 3-stage hint system:
1. **TTS Only**: Test your recognition
2. **+ Pinyin**: Need pronunciation help
3. **+ Meaning**: Full reveal

## 💾 Data Storage

- **Offline-First**: All progress stored in localStorage
- **No Backend Required**: Works completely offline
- **Persistent**: Your progress is saved automatically

### localStorage Keys
- `hsk3_user_progress`: Main progress tracking
- `writing_{topicId}`: Writing drafts per topic

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Language**: TypeScript
- **TTS**: Web Speech API
- **State**: React Hooks + localStorage

## 📱 Platform Support

### Target Devices
- **Primary**: Mobile (iOS/Android)
- **Secondary**: Desktop browsers

### Browser Requirements
- Modern browsers with Web Speech API support
- iOS Safari (WebKit)
- Android Chrome

## 🔄 Development Workflow

### Spec-Driven Development
All code changes should follow the design specification:

1. **Read**: Check `docs/DESIGN_SPEC.md` for the relevant section
2. **Implement**: Follow the specified patterns and components
3. **Update**: Modify spec if implementation differs
4. **Test**: Verify on mobile viewport

### Using with AI
When asking AI to modify code, reference the spec:

```
"Please read docs/DESIGN_SPEC.md first, 
then update the [feature] according to the spec..."
```

## 📊 Project Structure

```
baozi/
├── app/                    # Next.js app directory
│   ├── (study)/           # Study-related pages
│   │   ├── vocabulary/
│   │   ├── sentences/
│   │   ├── reading/
│   │   └── writing/
│   ├── page.tsx           # Dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   └── study/            # Study components
├── lib/                   # Utility libraries
│   ├── data/             # Data loaders
│   ├── learning/         # Learning algorithms
│   ├── tts/              # Text-to-speech
│   └── utils/            # Utilities
├── data/                  # JSON data files
│   ├── vocabulary.json
│   ├── sentences.json
│   ├── readings.json
│   └── grammar.json
├── docs/                  # Documentation
│   ├── DESIGN_SPEC.md    # Main specification
│   └── README.md         # Documentation index
├── types/                 # TypeScript types
└── public/                # Static assets
```

## 🚀 Future Enhancements

Planned features (see [DESIGN_SPEC.md](./docs/DESIGN_SPEC.md) for details):
- Grammar Tab with dedicated practice
- Statistics Dashboard with charts
- Daily Goals & Streak Tracking
- Dark Mode
- Custom Writing Topics
- Audio Recording for pronunciation
- Export/Import Progress
- Search functionality

## 🤝 Contributing

When contributing:
1. Read the [Design Specification](./docs/DESIGN_SPEC.md)
2. Follow existing patterns and styles
3. Maintain mobile-first approach
4. Update documentation if needed
5. Test on multiple devices

## 📝 License

[Your License Here]

## 📞 Contact

[Your Contact Info]

---

**Documentation Version**: 1.0.0  
**Last Updated**: 2026-01-31
