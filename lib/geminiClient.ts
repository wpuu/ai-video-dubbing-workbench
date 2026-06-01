import { ThinkingLevel } from '@/types';

export const MODEL_MULTIMODAL = 'gemini-3.5-flash';
export const MODEL_LITE_TEXT  = 'gemini-3.1-flash-lite';

export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const buildApiUrl = (model: string, key: string): string =>
  `${GEMINI_BASE_URL}/${model}:generateContent?key=${key}`;

interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

interface GeminiRequestBody {
  system_instruction?: { parts: [{ text: string }] };
  contents: Array<{ parts: GeminiPart[] }>;
  generationConfig?: {
    thinkingConfig?: {
      thinkingLevel: ThinkingLevel;
    };
    responseMimeType?: string;
  };
}

export async function callGemini(
  model: string,
  apiKey: string,
  body: GeminiRequestBody
): Promise<string> {
  const url = buildApiUrl(model, apiKey);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || JSON.stringify(data));
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
