'use client';

import { useState, useEffect, useRef } from 'react';

// Pinyin mapping for HSK3 vocabulary words
const pinyinMap: Record<string, string> = {
  邻居: 'lín jū',
  认识: 'rèn shi',
  帮忙: 'bāng máng',
  关心: 'guān xīn',
  周末: 'zhōu mò',
  打算: 'dǎ suàn',
  锻炼: 'duàn liàn',
  聊天: 'liáo tiān',
  办公室: 'bàn gōng shì',
  同事: 'tóng shì',
  经理: 'jīng lǐ',
  会议: 'huì yì',
  练习: 'liàn xí',
  复习: 'fù xí',
  提高: 'tí gāo',
  努力: 'nǔ lì',
  旅行: 'lǚ xíng',
  机会: 'jī huì',
  决定: 'jué dìng',
  准备: 'zhǔn bèi',
  习惯: 'xí guàn',
  健康: 'jiàn kāng',
  注意: 'zhù yì',
  选择: 'xuǎn zé',
  影响: 'yǐng xiǎng',
  结果: 'jié guǒ',
  环境: 'huán jìng',
  变化: 'biàn huà',
  重要: 'zhòng yào',
  愿意: 'yuàn yì',
  完成: 'wán chéng',
  相信: 'xiāng xìn',
  文化: 'wén huà',
  了解: 'liǎo jiě',
  不同: 'bù tóng',
};

interface WritingTopic {
  id: number;
  title: string;
  description: string;
  example: string;
  difficulty: 1 | 2 | 3;
  suggestedWords: string[];
}

export default function WritingPage() {
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [typingSpeed, setTypingSpeed] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const writingTopics: WritingTopic[] = [
    {
      id: 1,
      title: '自我介绍',
      description: 'Write about yourself.',
      example: '我叫...，我是...，我喜欢...',
      difficulty: 1,
      suggestedWords: [],
    },
    {
      id: 2,
      title: '我的家人',
      description: 'Write about your family.',
      example: '我家有...个人，他们是...',
      difficulty: 1,
      suggestedWords: [],
    },
    {
      id: 3,
      title: '我的爱好',
      description: 'Write about your hobbies.',
      example: '我的爱好是...，因为...',
      difficulty: 1,
      suggestedWords: [],
    },
    {
      id: 4,
      title: '我的学校',
      description: 'Write about your school.',
      example: '我的学校很...，我在学校...',
      difficulty: 1,
      suggestedWords: [],
    },
    {
      id: 5,
      title: '周末计划',
      description: 'Write about your weekend plans.',
      example: '这个周末，我想...，因为...',
      difficulty: 1,
      suggestedWords: ['周末', '打算'],
    },
    {
      id: 6,
      title: '我的邻居',
      description: 'My neighbor',
      example: '我的邻居是...，他/她经常...',
      difficulty: 1,
      suggestedWords: ['邻居', '认识', '帮忙', '关心'],
    },
    {
      id: 7,
      title: '周末活动',
      description: 'Weekend activities',
      example: '这个周末我打算...，因为...',
      difficulty: 1,
      suggestedWords: ['周末', '打算', '锻炼', '聊天'],
    },
    {
      id: 8,
      title: '我的工作',
      description: 'My job',
      example: '我在...工作，我的同事...',
      difficulty: 2,
      suggestedWords: ['办公室', '同事', '经理', '会议'],
    },
    {
      id: 9,
      title: '学习经历',
      description: 'Learning experience',
      example: '我在学习...，虽然...但是...',
      difficulty: 2,
      suggestedWords: ['练习', '复习', '提高', '努力'],
    },
    {
      id: 10,
      title: '旅行计划',
      description: 'Travel plans',
      example: '我打算去...旅行，因为...',
      difficulty: 2,
      suggestedWords: ['旅行', '机会', '决定', '准备'],
    },
    {
      id: 11,
      title: '健康生活',
      description: 'Healthy life',
      example: '为了健康，我每天...',
      difficulty: 2,
      suggestedWords: ['锻炼', '习惯', '健康', '注意'],
    },
    {
      id: 12,
      title: '一次重要的决定',
      description: 'An important decision',
      example: '我曾经做了一个重要的决定...',
      difficulty: 3,
      suggestedWords: ['决定', '选择', '影响', '结果'],
    },
    {
      id: 13,
      title: '环境保护',
      description: 'Environmental protection',
      example: '现在环境问题越来越...',
      difficulty: 3,
      suggestedWords: ['环境', '变化', '注意', '重要'],
    },
    {
      id: 14,
      title: '我的理想',
      description: 'My ideal',
      example: '我的理想是...，为了实现它...',
      difficulty: 3,
      suggestedWords: ['愿意', '努力', '完成', '相信'],
    },
    {
      id: 15,
      title: '文化差异',
      description: 'Cultural differences',
      example: '不同国家的文化...',
      difficulty: 3,
      suggestedWords: ['文化', '习惯', '了解', '不同'],
    },
  ];

  const [selectedTopic, setSelectedTopic] = useState(writingTopics[0]);

  const getDifficultyLabel = (difficulty: 1 | 2 | 3) => {
    switch (difficulty) {
      case 1:
        return '初级';
      case 2:
        return '中级';
      case 3:
        return '高级';
    }
  };

  const getDifficultyColor = (difficulty: 1 | 2 | 3) => {
    switch (difficulty) {
      case 1:
        return 'bg-green-100 text-green-800 border-green-300';
      case 2:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 3:
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

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

  useEffect(() => {
    // Auto-save (localStorage)
    const savedText = localStorage.getItem(`writing_${selectedTopic.id}`);
    if (savedText) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(savedText);
      setWordCount(savedText.length);
    }
  }, [selectedTopic]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.length);

    // Record typing start time
    if (!startTime && newText.length > 0) {
      setStartTime(Date.now());
    }

    // Calculate typing speed (characters per minute)
    if (startTime && newText.length > 0) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const speed = Math.round(newText.length / elapsedMinutes);
      setTypingSpeed(speed);
    }

    // Auto-save
    localStorage.setItem(`writing_${selectedTopic.id}`, newText);
  };

  const handleTopicChange = (topic: WritingTopic) => {
    setSelectedTopic(topic);
    setText('');
    setWordCount(0);
    setStartTime(null);
    setTypingSpeed(null);
    localStorage.removeItem(`writing_${selectedTopic.id}`);
  };

  const handleClear = () => {
    setText('');
    setWordCount(0);
    setStartTime(null);
    setTypingSpeed(null);
    localStorage.removeItem(`writing_${selectedTopic.id}`);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const wordCountGoal = getWordCountGoal(selectedTopic.difficulty);
  const isWordCountInRange = wordCount >= wordCountGoal.min && wordCount <= wordCountGoal.max;

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black tracking-tight">✍️ Writing</h1>
        <p className="text-sm text-blue-600 font-medium mt-1">Practice Chinese writing</p>
      </div>

      <div className="ios-card p-5 mb-5 transition-ios shadow-lg">
        <h2 className="text-base font-bold mb-3 text-black">Select Topic</h2>
        <div className="grid grid-cols-1 gap-3">
          {writingTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicChange(topic)}
              className={`p-4 border-2 rounded-2xl text-left transition-ios shadow-sm ${
                selectedTopic.id === topic.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md scale-[1.02]'
                  : 'border-blue-200 bg-white active:scale-98'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-black">{topic.title}</div>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-full border ${getDifficultyColor(
                    topic.difficulty
                  )}`}
                >
                  {getDifficultyLabel(topic.difficulty)}
                </span>
              </div>
              <div className="text-sm text-black/70">{topic.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {/* Main Writing Area */}
        <div className="ios-card p-5 transition-ios shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-black">{selectedTopic.title}</h2>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded border ${getDifficultyColor(
                  selectedTopic.difficulty
                )}`}
              >
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

          <div className="mb-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200/50 shadow-sm">
            <div className="text-sm font-bold mb-2 text-yellow-900">💡 Example:</div>
            <div className="text-sm text-black">{selectedTopic.example}</div>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="在这里用中文写作..."
            className="w-full h-48 p-4 border-2 border-blue-300 rounded-2xl resize-none focus:outline-none focus:border-blue-500 text-black text-base shadow-sm transition-ios"
            style={{ fontSize: '16px' }}
          />

          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-black">
              <div>Characters: {wordCount}</div>
              {typingSpeed !== null && (
                <div>Speed: {typingSpeed} chars/min</div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-black">Goal:</span>
              <span
                className={
                  wordCount >= wordCountGoal.min && wordCount <= wordCountGoal.max
                    ? 'text-green-600 font-semibold'
                    : wordCount < wordCountGoal.min
                    ? 'text-orange-600'
                    : 'text-red-600'
                }
              >
                {wordCountGoal.min}-{wordCountGoal.max} characters
              </span>
              {wordCount > 0 && (
                <span
                  className={
                    isWordCountInRange
                      ? 'text-green-600 font-bold'
                      : 'text-orange-500 font-semibold'
                  }
                >
                  {isWordCountInRange ? '✓' : ''}
                </span>
              )}
            </div>
            {wordCount > 0 && typingSpeed !== null && (
              <div className={typingSpeed >= 20 ? 'text-green-600 text-sm' : 'text-orange-600 text-sm'}>
                {typingSpeed >= 20 ? '✓ Goal Achieved!' : 'Goal: 20 chars/min'}
              </div>
            )}
          </div>
        </div>

        {text.length > 0 && (
          <div className="ios-card p-5 transition-ios shadow-lg">
            <h3 className="font-bold mb-3 text-black">预览</h3>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 whitespace-pre-wrap text-black text-base shadow-sm">
              {text}
            </div>
          </div>
        )}

        {/* Suggested Vocabulary */}
        {selectedTopic.suggestedWords.length > 0 && (
          <div className="ios-card p-5 transition-ios shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-black">📝 推荐词汇</h3>
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
      </div>
    </div>
  );
}
