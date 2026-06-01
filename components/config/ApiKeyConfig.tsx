import React from 'react';

interface ApiKeyConfigProps {
  apiKeysText: string;
  onUpdate: (val: string) => void;
}

export function ApiKeyConfig({ apiKeysText, onUpdate }: ApiKeyConfigProps) {
  const activeCount = apiKeysText.split('\n').filter(k => k.trim()).length;

  return (
    <div className="flex flex-col h-full">
      <label className="block text-xs font-medium text-zinc-400 mb-1">
        Gemini API Key 池
        <span className="ml-1 text-zinc-500">（每行一个）</span>
      </label>
      <textarea
        value={apiKeysText}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={"AIzaSy...\nAIzaSy...\nAIzaSy..."}
        className="flex-1 min-h-[180px] font-mono text-xs bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-green-400 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none hidden-scrollbar"
        spellCheck={false}
      />
      <p className="mt-1 text-xs text-zinc-500">
        已配置 {activeCount} 个 Key
      </p>
    </div>
  );
}
