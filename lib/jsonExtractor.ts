export function extractJsonArray<T>(rawText: string): T[] {
  let text = rawText.trim();
  
  // 1. Remove markdown code blocks if present
  if (text.startsWith('```')) {
    text = text.replace(/^```(json)?/, '').replace(/```$/, '').trim();
  }

  // 2. Try parsing directly
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data)) return data;
  } catch (e) {
    // ignore and try fallback
  }

  // 3. Fallback: match the last array-like robustly
  const lastArrayMatch = text.match(/\[[\s\S]*\]/);
  if (lastArrayMatch) {
    try {
      const data = JSON.parse(lastArrayMatch[0]);
      if (Array.isArray(data)) return data;
    } catch (e) {
      // ignore
    }
  }

  throw new Error('Failed to extract valid JSON array from response');
}
