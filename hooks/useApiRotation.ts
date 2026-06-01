import { useRef } from 'react';

export function useApiRotation(apiKeysText: string) {
  const keyIndexRef = useRef(0);
  
  const keys = apiKeysText.split('\n')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const totalKeys = keys.length;

  const getNextKey = () => {
    if (keys.length === 0) {
      throw new Error('未配置 API Key，请在配置面板中填写');
    }
    const idx = keyIndexRef.current % keys.length;
    const key = keys[idx];
    keyIndexRef.current += 1;
    return { key, index: idx };
  };

  return { getNextKey, totalKeys };
}
