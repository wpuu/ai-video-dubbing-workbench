import React from 'react';
import { CharacterEntry, TtsVoice } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface CharacterDictProps {
  characterDict: CharacterEntry[];
  onUpdate: React.Dispatch<React.SetStateAction<CharacterEntry[]>>;
}

const VOICES: TtsVoice[] = ['Aoede', 'Charon', 'Fenrir', 'Kore', 'Puck'];

export function CharacterDict({ characterDict, onUpdate }: CharacterDictProps) {
  const handleAdd = () => {
    onUpdate(prev => [...prev, {
      id: crypto.randomUUID(),
      name: '',
      voiceDesc: '',
      defaultVoice: 'Aoede'
    }]);
  };

  const handleChange = (id: string, field: keyof CharacterEntry, value: string) => {
    onUpdate(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleRemove = (id: string) => {
    onUpdate(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="bg-zinc-900/30 rounded-lg border border-zinc-800 p-4">
      <div className="flex justify-between items-center mb-3">
        <label className="block text-xs font-medium text-zinc-400">IP 卡司字典</label>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded"
        >
          <Plus className="w-3 h-3" /> 添加角色
        </button>
      </div>

      <div className="space-y-2">
        {characterDict.map((char) => (
          <div key={char.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_auto] gap-2 items-center bg-zinc-950 p-2 rounded-md border border-zinc-800 focus-within:border-indigo-500/50 transition-colors">
            <input
              type="text"
              placeholder="角色名 (如: Jarry)"
              value={char.name}
              onChange={e => handleChange(char.id, 'name', e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="音色特征描述 (如: 年轻男性，口音略重)"
              value={char.voiceDesc}
              onChange={e => handleChange(char.id, 'voiceDesc', e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none px-2 border-l border-zinc-800"
            />
            <select
              value={char.defaultVoice}
              onChange={e => handleChange(char.id, 'defaultVoice', e.target.value)}
              className="w-full bg-zinc-900 text-sm text-zinc-300 rounded border border-zinc-700 focus:outline-none px-2 py-1 appearance-none cursor-pointer"
            >
              {VOICES.map(v => <option key={v} value={v} className="bg-zinc-900">{v}</option>)}
            </select>
            <button
              onClick={() => handleRemove(char.id)}
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {characterDict.length === 0 && (
          <div className="text-center py-4 border border-dashed border-zinc-800 rounded-md">
            <p className="text-xs text-zinc-500">词典为空，AI 将根据声音特征自由推断角色。</p>
          </div>
        )}
      </div>
    </div>
  );
}
