import { useState, useCallback, useEffect } from 'react';

export function useAudioFile() {
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioObjectURL, setAudioObjectURL] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const resetAudio = useCallback(() => {
    setAudioBase64(null);
    setAudioObjectURL(null);
    setMimeType('');
    setFileName(null);
    setFileSize(null);
  }, []);

  const handleFileChange = useCallback((file: File) => {
    resetAudio();

    // Mapping MIME type
    let determinedMime = file.type;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'mp3') determinedMime = 'audio/mpeg';
    else if (ext === 'wav') determinedMime = 'audio/wav';
    else if (ext === 'm4a') determinedMime = 'audio/mp4';

    if (!determinedMime) {
      determinedMime = 'audio/mpeg'; // fallback
    }

    setMimeType(determinedMime);
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');

    // Object URL for preview
    const url = URL.createObjectURL(file);
    setAudioObjectURL(url);

    // Read as Base64 for Gemini
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // result is "data:audio/mp3;base64,....."
      const base64Data = result.split(',')[1];
      if (base64Data) {
        setAudioBase64(base64Data);
      }
    };
    reader.readAsDataURL(file);
  }, [resetAudio]);

  useEffect(() => {
    return () => {
      if (audioObjectURL) {
        URL.revokeObjectURL(audioObjectURL);
      }
    };
  }, [audioObjectURL]);

  return {
    audioBase64,
    audioObjectURL,
    mimeType,
    fileName,
    fileSize,
    handleFileChange,
    resetAudio
  };
}
