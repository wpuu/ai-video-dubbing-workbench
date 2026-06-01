import React from 'react';
import { Spinner } from '../ui/Spinner';
import { Sparkles } from 'lucide-react';

interface AiShortenButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export function AiShortenButton({ isLoading, onClick }: AiShortenButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      title="一键调用 3.1-flash-lite 精简台词"
      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-md text-xs font-medium shadow-md shadow-black/50 transition-colors disabled:opacity-50 border border-indigo-400/30"
    >
      {isLoading ? <Spinner className="text-white w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-200" />}
      <span>AI 压缩</span>
    </button>
  );
}
