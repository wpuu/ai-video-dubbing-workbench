import React from 'react';
import { ScriptRow } from '@/types';
import { downloadJson, downloadSrt } from '@/lib/exportHelper';
import { Download, FileJson, FileText } from 'lucide-react';

interface ExportBarProps {
  data: ScriptRow[];
  taskName: string;
}

export function ExportBar({ data, taskName }: ExportBarProps) {
  const safeName = (taskName || 'untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase();

  return (
    <div className="fixed bottom-0 lg:bottom-6 left-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-auto p-4 lg:p-0 z-30 pointer-events-none">
      <div className="bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl p-2 lg:px-4 lg:py-3 flex flex-row items-center justify-center gap-3 backdrop-blur-xl pointer-events-auto">
        <span className="hidden lg:flex items-center gap-2 text-sm font-medium text-zinc-300 border-r border-zinc-700 pr-4 mr-2">
          <Download className="w-4 h-4" /> 导出交付物
        </span>
        
        <button
          onClick={() => downloadJson(data, `${safeName}_script.json`)}
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition-colors border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <FileJson className="w-4 h-4 text-indigo-400" /> JSON 数据集
        </button>
        
        <button
          onClick={() => downloadSrt(data, `${safeName}_subtitles.srt`)}
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition-colors border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <FileText className="w-4 h-4 text-amber-400" /> SRT 纯字幕
        </button>
      </div>
    </div>
  );
}
