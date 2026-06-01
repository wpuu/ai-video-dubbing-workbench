import React, { useMemo } from 'react';
import { AppConfig, SupportedLanguage, resolveLanguage } from '@/types';

interface LanguageConfigProps {
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  customSourceLang: string;
  customTargetLang: string;
  onUpdate: (updates: Partial<AppConfig>) => void;
}

const LANGUAGE_OPTIONS: SupportedLanguage[] = [
  '英语', '中文', '西班牙语', '法语', '德语', '日语', '韩语', '自定义'
];

export function LanguageConfig({ sourceLang, targetLang, customSourceLang, customTargetLang, onUpdate }: LanguageConfigProps) {
  
  const mockConfigForLangResolution = useMemo(() => ({
    sourceLang, targetLang, customSourceLang, customTargetLang, apiKeysText: '', taskName: ''
  } as AppConfig), [sourceLang, targetLang, customSourceLang, customTargetLang]);

  const resolvedSourceLang = resolveLanguage(mockConfigForLangResolution, 'source') || '???';
  const resolvedTargetLang = resolveLanguage(mockConfigForLangResolution, 'target') || '???';

  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            源语言（Source）
          </label>
          <select
            value={sourceLang}
            onChange={(e) => onUpdate({ sourceLang: e.target.value as SupportedLanguage })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map(lang => (
              <option key={lang} value={lang} className="bg-zinc-900">{lang}</option>
            ))}
          </select>
          {sourceLang === '自定义' && (
            <input
              type="text"
              value={customSourceLang}
              onChange={(e) => onUpdate({ customSourceLang: e.target.value })}
              placeholder="输入自定义语言，如：粤语"
              className="mt-2 w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            目标语言（Target）
          </label>
          <select
            value={targetLang}
            onChange={(e) => onUpdate({ targetLang: e.target.value as SupportedLanguage })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map(lang => (
              <option key={lang} value={lang} className="bg-zinc-900">{lang}</option>
            ))}
          </select>
          {targetLang === '自定义' && (
            <input
              type="text"
              value={customTargetLang}
              onChange={(e) => onUpdate({ customTargetLang: e.target.value })}
              placeholder="输入自定义语言，如：粤语"
              className="mt-2 w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-zinc-500 font-medium text-center bg-zinc-950 py-1.5 rounded-md border border-zinc-800">
        互译方向： <span className="text-zinc-300">{resolvedSourceLang}</span> <span className="text-indigo-400 mx-1">→</span> <span className="text-zinc-300">{resolvedTargetLang}</span>
      </p>
    </div>
  );
}
