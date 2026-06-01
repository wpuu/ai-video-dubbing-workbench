import React from 'react';
import { AppConfig, CharacterEntry } from '@/types';
import { Accordion } from '../ui/Accordion';
import { ApiKeyConfig } from './ApiKeyConfig';
import { LanguageConfig } from './LanguageConfig';
import { CharacterDict } from './CharacterDict';

interface ConfigPanelProps {
  appConfig: AppConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  characterDict: CharacterEntry[];
  setCharacterDict: React.Dispatch<React.SetStateAction<CharacterEntry[]>>;
}

export function ConfigPanel({ appConfig, setAppConfig, characterDict, setCharacterDict }: ConfigPanelProps) {
  return (
    <Accordion title="全局配置" icon="⚙️" defaultOpen={true}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* 左侧 1/5：API 密钥池 */}
        <div className="lg:col-span-1 flex flex-col">
          <ApiKeyConfig
            apiKeysText={appConfig.apiKeysText}
            onUpdate={(val) => setAppConfig(prev => ({ ...prev, apiKeysText: val }))}
          />
        </div>

        {/* 右侧 4/5：任务配置 + 语言配置 + 卡司字典 */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              任务名称
            </label>
            <input
              type="text"
              value={appConfig.taskName}
              onChange={(e) => setAppConfig(prev => ({ ...prev, taskName: e.target.value }))}
              placeholder="如：郭杰瑞游成都"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <LanguageConfig
            sourceLang={appConfig.sourceLang}
            targetLang={appConfig.targetLang}
            customSourceLang={appConfig.customSourceLang}
            customTargetLang={appConfig.customTargetLang}
            onUpdate={(updates) => setAppConfig(prev => ({ ...prev, ...updates }))}
          />

          <CharacterDict
            characterDict={characterDict}
            onUpdate={setCharacterDict}
          />
        </div>
      </div>
    </Accordion>
  );
}
