import React from 'react';
import { Spinner } from '../ui/Spinner';
import { Ear, Languages } from 'lucide-react';

interface StepButtonsProps {
  onStep1: () => void;
  onStep2: () => void;
  isLoading1: boolean;
  isLoading2: boolean;
  hasAudio: boolean;
  hasStep1Result: boolean;
}

export function StepButtons({ onStep1, onStep2, isLoading1, isLoading2, hasAudio, hasStep1Result }: StepButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button 
        onClick={onStep1} 
        disabled={isLoading1 || !hasAudio}
        className={`flex-1 relative flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all overflow-hidden border
          ${hasAudio 
            ? 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600' 
            : 'bg-zinc-900 text-zinc-500 cursor-not-allowed border-zinc-800'}`}
      >
        {isLoading1 ? <Spinner className="text-indigo-400 relative z-10" /> : <Ear className="w-4 h-4 relative z-10" />}
        <span className="relative z-10">第一步：多模态听片提词 {isLoading1 && '(云端解析中...)'}</span>
        {isLoading1 && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />}
      </button>
      
      <button 
        onClick={onStep2} 
        disabled={isLoading2 || !hasStep1Result}
        className={`flex-1 relative flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all shadow-lg overflow-hidden
          ${hasStep1Result 
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/50 shadow-indigo-900/20' 
            : 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800'}`}
      >
        {isLoading2 ? <Spinner className="text-white relative z-10" /> : <Languages className="w-4 h-4 relative z-10" />}
        <span className="relative z-10">第二步：AI翻译与音色分配 {isLoading2 && '(推断中...)'}</span>
        {isLoading2 && <div className="absolute inset-0 bg-indigo-400/20 animate-pulse" />}
      </button>
    </div>
  );
}
