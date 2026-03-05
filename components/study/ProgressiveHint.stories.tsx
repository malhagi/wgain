import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProgressiveHint from './ProgressiveHint';

const meta: Meta<typeof ProgressiveHint> = {
  title: 'Study/ProgressiveHint',
  component: ProgressiveHint,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    onHintUsed: { action: 'hintUsed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    characters: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Hello',
    examples: [
      'A: 你好！|A: 안녕하세요!',
      'B: 你好！见到你很高兴。|B: 안녕하세요! 만나서 반가워요.',
    ],
  },
};

export const WithoutExamples: Story = {
  args: {
    characters: '谢谢',
    pinyin: 'xiè xie',
    meaning: 'Thank you',
  },
};

export const LongWord: Story = {
  args: {
    characters: '不客气',
    pinyin: 'bú kè qì',
    meaning: "You're welcome",
    examples: [
      'A: 谢谢你帮助我。|A: 도와줘서 감사합니다.',
      'B: 不客气，这是我应该做的。|B: 천만에요, 이건 제가 해야 할 일이에요.',
    ],
  },
};
