import { ScriptRow } from '@/types';

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJson(data: ScriptRow[], filename = 'script.json'): void {
  const content = JSON.stringify(data, null, 2);
  triggerDownload(content, filename, 'application/json');
}

function formatSrtTime(seconds: number): string {
  const pad = (num: number, size: number) => ('000' + num).slice(size * -1);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(ms, 3)}`;
}

export function downloadSrt(data: ScriptRow[], filename = 'subtitles.srt'): void {
  const srtContent = data.map((row, index) => {
    const start = formatSrtTime(row.start_time);
    const end = formatSrtTime(row.end_time);
    const textWithoutEmotion = row.translated_text.replace(/\[.*?\]/g, '').trim();
    return `${index + 1}\n${start} --> ${end}\n${textWithoutEmotion}\n`;
  }).join('\n');

  triggerDownload(srtContent, filename, 'text/srt');
}
