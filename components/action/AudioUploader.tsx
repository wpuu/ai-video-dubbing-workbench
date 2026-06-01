import React, { useRef } from 'react';
import { UploadCloud, Music } from 'lucide-react';

interface AudioUploaderProps {
  isHistoryLoaded: boolean;
  audioBase64: string | null;
  audioObjectURL: string | null;
  fileName: string | null;
  fileSize: string | null;
  onFileChange: (file: File) => void;
}

export function AudioUploader({ isHistoryLoaded, audioBase64, audioObjectURL, fileName, fileSize, onFileChange }: AudioUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = () => inputRef.current?.click();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  if (isHistoryLoaded && !audioBase64) {
    return (
      <div className="bg-amber-950/30 border border-amber-700/50 rounded-xl p-4 transition-all">
        <p className="text-amber-300 text-sm font-medium flex items-center gap-2">
          <span>⚠️</span> 历史任务不保存音频文件
        </p>
        <p className="text-amber-400/70 text-xs mt-1">
          步骤二数据已就绪，可直接在下方审查和编辑剧本。
          如需对照原音，请点击下方按钮重新关联音频（不影响已有剧本数据）。
        </p>
        <button 
          onClick={triggerUpload}
          className="mt-3 px-4 py-2 bg-amber-700/20 hover:bg-amber-700/40 text-amber-300 border border-amber-700/50 text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          <Music className="w-4 h-4" />
          重新关联本地音频
        </button>
        <input 
          type="file" 
          accept="audio/*" 
          className="hidden" 
          ref={inputRef} 
          onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])} 
        />
      </div>
    );
  }

  return (
    <div 
      className="border-2 border-dashed border-zinc-700 rounded-xl p-6 transition-all hover:bg-zinc-900/50 hover:border-zinc-500 flex flex-col items-center justify-center gap-3 cursor-pointer"
      onClick={triggerUpload}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input 
        type="file" 
        accept="audio/*" 
        className="hidden" 
        ref={inputRef} 
        onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])} 
      />
      
      {audioObjectURL ? (
        <div className="w-full max-w-lg flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800 w-full">
            <Music className="w-6 h-6 text-indigo-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{fileName}</p>
              <p className="text-xs text-zinc-500">{fileSize}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); triggerUpload(); }}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded transition-colors"
            >
              更换文件
            </button>
          </div>
          <audio src={audioObjectURL} controls className="w-full h-10 outline-none" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
            <UploadCloud className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-300">点击或拖拽上传音频文件</p>
          <p className="text-xs text-zinc-500 mt-1">支持 MP3 / WAV / M4A (由 Gemini 多模态原生解析)</p>
        </div>
      )}
    </div>
  );
}
