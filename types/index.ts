export type TtsVoice = 'Aoede' | 'Charon' | 'Fenrir' | 'Kore' | 'Puck';

export type EmotionTag =
  | '[excited]' | '[calm]' | '[sad]'
  | '[angry]' | '[whispering]' | '[cheerful]' | '[serious]';

export type ThinkingLevel = 'minimal' | 'low' | 'medium' | 'high';

export type SupportedLanguage =
  | '英语' | '中文' | '西班牙语' | '法语'
  | '德语' | '日语' | '韩语' | '自定义';

export interface CharacterEntry {
  id: string;
  name: string;
  voiceDesc: string;
  defaultVoice: TtsVoice;
}

export interface ExtractedSegment {
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
}

export interface ScriptRow {
  speaker: string;
  tts_voice: TtsVoice;
  emotion: string;
  original_text: string;
  translated_text: string;
  start_time: number;
  end_time: number;
  duration: number;
}

export interface EditableScriptRow extends ScriptRow {
  id: string;
  isShortening: boolean;
}

export interface HistoryTask {
  id: string;
  taskName: string;
  createdAt: string;
  finalScriptJson: ScriptRow[];
}

export interface ToastMessage {
  id: string;
  type: 'error' | 'warning' | 'success';
  title: string;
  detail: string;
  keyIndex?: number;
}

export interface AppConfig {
  apiKeysText: string;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  customSourceLang: string;
  customTargetLang: string;
  taskName: string;
}

export function resolveLanguage(config: AppConfig, type: 'source' | 'target'): string {
  const lang = type === 'source' ? config.sourceLang : config.targetLang;
  const custom = type === 'source' ? config.customSourceLang : config.customTargetLang;
  return lang === '自定义' ? custom : lang;
}
