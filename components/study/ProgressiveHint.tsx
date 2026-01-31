'use client';

import { useState } from 'react';
import { Volume2, Info } from 'lucide-react';
import type { HintStage } from '@/types';
import { speakChinese } from '@/lib/tts/chineseTTS';

interface ProgressiveHintProps {
  characters: string;
  pinyin: string;
  meaning: string;
  onHintUsed?: (stage: HintStage) => void;
  onReset?: () => void;
  className?: string;
}

export default function ProgressiveHint({
  characters,
  pinyin,
  meaning,
  onHintUsed,
  onReset,
  className = '',
}: ProgressiveHintProps) {
  const [showHints, setShowHints] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Speaker 버튼: TTS 재생
  const handleSpeaker = async () => {
    if (isPlaying) return; // 이미 재생 중이면 무시
    
    setIsPlaying(true);
    try {
      await speakChinese(characters);
      onHintUsed?.('tts');
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  // More 버튼: Pinyin과 Meaning 표시
  const handleMore = () => {
    if (!showHints) {
      setShowHints(true);
      onHintUsed?.('pinyin');
      onHintUsed?.('meaning');
    }
  };

  // Reset: 외부에서 호출되어 힌트 상태 초기화
  const reset = () => {
    setShowHints(false);
    setIsPlaying(false);
    onReset?.();
  };

  // 외부에서 reset을 호출할 수 있도록 ref로 노출
  // 그러나 React 18+에서는 useImperativeHandle을 사용해야 하므로,
  // 대신 부모 컴포넌트에서 key prop을 변경하여 컴포넌트를 리마운트하는 방식을 권장

  return (
    <div className={`relative ${className}`}>
      {/* Chinese Characters with Buttons */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="text-5xl font-bold text-black tracking-tight">{characters}</div>
        
        {/* Speaker Button */}
        <button
          onClick={handleSpeaker}
          disabled={isPlaying}
          className={`w-14 h-14 rounded-2xl transition-ios shadow-lg flex items-center justify-center ${
            isPlaying 
              ? 'bg-blue-200 cursor-wait' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600 active:scale-95'
          }`}
          aria-label="Play pronunciation"
        >
          <Volume2 className="w-7 h-7 text-white" strokeWidth={2.5} />
        </button>

        {/* More Button */}
        <button
          onClick={handleMore}
          className={`w-14 h-14 rounded-2xl transition-ios shadow-lg flex items-center justify-center ${
            showHints
              ? 'bg-blue-200 cursor-default'
              : 'bg-gradient-to-br from-green-500 to-green-600 active:scale-95'
          }`}
          disabled={showHints}
          aria-label="Show hints"
        >
          <Info className="w-7 h-7 text-white" strokeWidth={2.5} />
        </button>
      </div>
      
      {/* Hints Display */}
      {showHints && (
        <div className="space-y-3 mt-4 p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200/50 shadow-md transition-ios">
          <div className="text-2xl font-bold text-black">{pinyin}</div>
          <div className="text-xl font-bold text-orange-600">{meaning}</div>
        </div>
      )}
    </div>
  );
}
