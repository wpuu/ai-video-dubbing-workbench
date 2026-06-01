import React, { memo } from 'react';
import { EditableScriptRow, TtsVoice } from '@/types';
import { AiShortenButton } from './AiShortenButton';
import { Mic2, Type, Hash } from 'lucide-react';

interface ScriptRowProps {
  row: EditableScriptRow;
  onChange: (updates: Partial<EditableScriptRow>) => void;
  onShorten: () => void;
}

const VOICES: TtsVoice[] = ['Aoede', 'Charon', 'Fenrir', 'Kore', 'Puck'];

export const ScriptRow = memo(({ row, onChange, onShorten }: ScriptRowProps) => {
  const charCount = row.translated_text.replace(/[\s\n]/g, '').length;
  const maxChars  = row.duration * 4.5;
  const minChars  = row.duration * 4;
  
  type Status = 'over' | 'under' | 'ok';
  const status: Status = charCount > maxChars ? 'over' : charCount < minChars ? 'under' : 'ok';

  const rowBg = {
    over:  'bg-red-950/20 border-red-500/50 hover:bg-red-950/30',
    under: 'bg-amber-950/20 border-amber-500/50 hover:bg-amber-950/30',
    ok:    'bg-zinc-950 hover:bg-zinc-900 border-transparent',
  }[status];
  
  const statusLine = {
    over: 'border-l-4 border-red-500',
    under: 'border-l-4 border-amber-500',
    ok: 'border-l-4 border-green-700',
  }[status];

  return (
    <div className={`p-4 transition-colors flex flex-col lg:flex-row gap-4 border-b ${rowBg} ${statusLine}`}>
      {/* 角色与状态信息区 (宽: 约250px) */}
      <div className="lg:w-64 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-100 text-sm truncate">{row.speaker}</span>
          <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">
            {row.start_time.toFixed(1)}s - {row.end_time.toFixed(1)}s
          </span>
        </div>
        
        <div className="grid grid-cols-[auto_1fr] gap-2 items-center text-xs">
          <Mic2 className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={row.tts_voice}
            onChange={(e) => onChange({ tts_voice: e.target.value as TtsVoice })}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded px-2 py-1 appearance-none focus:ring-1 focus:ring-indigo-500"
          >
            {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          
          <Type className="w-3.5 h-3.5 text-zinc-400 mt-1" />
          <textarea
            value={row.emotion}
            onChange={(e) => onChange({ emotion: e.target.value })}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded px-2 py-1 min-h-[32px] text-xs resize-none focus:ring-1 focus:ring-indigo-500 font-mono"
            rows={1}
            spellCheck={false}
          />
        </div>
      </div>

      {/* 剧本原文与译文区 (弹性的) */}
      <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-4">
        {/* 原文 */}
        <div className="flex-1 bg-zinc-900/50 rounded-lg p-3 border border-zinc-800/80 group">
          <div className="text-[10px] text-zinc-500 mb-1 flex items-center justify-between">
            <span>原始字幕</span>
          </div>
          <p className="text-sm tracking-wide leading-relaxed text-zinc-400 font-serif">
            {row.original_text}
          </p>
        </div>

        {/* 译文编辑区 */}
        <div className="flex-1 flex flex-col relative group">
          <div className="text-[10px] text-zinc-500 mb-1 flex items-center justify-between">
            <span>配音译文</span>
            <div className="flex items-center gap-1 font-mono">
              <Hash className="w-3 h-3" />
              <span className={`${status === 'over' ? 'text-red-400 font-bold' : status === 'under' ? 'text-amber-400 font-bold' : 'text-green-400'}`}>
                {charCount}
              </span> 
              / {Math.floor(maxChars)}
            </div>
          </div>
          <textarea
            value={row.translated_text}
            onChange={(e) => onChange({ translated_text: e.target.value })}
            className="w-full flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed transition-all hidden-scrollbar"
            rows={3}
          />
          {status === 'over' && (
            <div className="absolute right-2 bottom-2">
              <AiShortenButton isLoading={row.isShortening} onClick={onShorten} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
