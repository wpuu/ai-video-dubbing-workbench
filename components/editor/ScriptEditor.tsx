import React, { useCallback, useMemo } from 'react';
import { EditableScriptRow, ToastMessage } from '@/types';
import { ScriptRow } from './ScriptRow';
import { callGemini, MODEL_LITE_TEXT } from '@/lib/geminiClient';
import { FileEdit } from 'lucide-react';

interface ScriptEditorProps {
  rows: EditableScriptRow[];
  setRows: React.Dispatch<React.SetStateAction<EditableScriptRow[]>>;
  getNextKey: () => { key: string; index: number };
  showToast: (msg: Omit<ToastMessage, 'id'>) => void;
}

export function ScriptEditor({ rows, setRows, getNextKey, showToast }: ScriptEditorProps) {
  
  const updateRow = useCallback((id: string, updates: Partial<EditableScriptRow>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, [setRows]);

  const handleShorten = useCallback(async (id: string, translatedText: string, maxChars: number) => {
    updateRow(id, { isShortening: true });
    let keyInfo: { key: string; index: number } | null = null;
    
    try {
      keyInfo = getNextKey();
      const prompt = `你一名台词精简师。将以下台词压缩到严格少于 ${Math.floor(maxChars)} 个字符（不含空格，标点计1字），保留情绪标签，直接输出结果：\n${translatedText}`;
      
      const rawText = await callGemini(MODEL_LITE_TEXT, keyInfo.key, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          thinkingConfig: { thinkingLevel: 'minimal' }
        }
      });

      updateRow(id, { translated_text: rawText.trim() });
      showToast({ type: 'success', title: '台词精简成功', detail: '' });
    } catch (err) {
       showToast({
        type: 'error',
        title: '台词压缩失败',
        detail: err instanceof Error ? err.message : String(err),
        keyIndex: keyInfo ? keyInfo.index + 1 : undefined
      });
    } finally {
      updateRow(id, { isShortening: false });
    }
  }, [updateRow, getNextKey, showToast]);

  const stats = useMemo(() => {
    let over = 0, under = 0, ok = 0;
    rows.forEach(r => {
      const chars = r.translated_text.replace(/[\s\n]/g, '').length;
      if (chars > r.duration * 4.5) over++;
      else if (chars < r.duration * 4) under++;
      else ok++;
    });
    return { over, under, ok };
  }, [rows]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden mb-24 lg:mb-8">
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-zinc-400" />
          剧本审查与编辑工作台
        </h2>
        <div className="flex gap-4 text-xs font-medium">
          <span className="text-green-400 bg-green-500/10 px-2 py-1 rounded">合适: {stats.ok} 行</span>
          <span className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded">偏少: {stats.under} 行</span>
          <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded">超长: {stats.over} 行</span>
        </div>
      </div>
      
      <div className="divide-y divide-zinc-800">
        {rows.map(row => (
          <ScriptRow 
            key={row.id} 
            row={row} 
            onChange={(updates) => updateRow(row.id, updates)} 
            onShorten={() => handleShorten(row.id, row.translated_text, row.duration * 4.5)}
          />
        ))}
      </div>
    </div>
  );
}
