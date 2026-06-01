'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  AppConfig, 
  CharacterEntry, 
  HistoryTask, 
  ExtractedSegment, 
  ScriptRow, 
  EditableScriptRow,
  resolveLanguage
} from '@/types';
import { callGemini, MODEL_MULTIMODAL } from '@/lib/geminiClient';
import { buildPrompt1, buildPrompt2 } from '@/lib/promptBuilder';
import { extractJsonArray } from '@/lib/jsonExtractor';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useApiRotation } from '@/hooks/useApiRotation';
import { useAudioFile } from '@/hooks/useAudioFile';
import { useToast } from '@/hooks/useToast';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ConfigPanel } from '../config/ConfigPanel';
import { AudioUploader } from '../action/AudioUploader';
import { StepButtons } from '../action/StepButtons';
import { ScriptEditor } from '../editor/ScriptEditor';
import { ExportBar } from '../export/ExportBar';
import { Toast } from '../ui/Toast';
import { Accordion } from '../ui/Accordion';

const defaultConfig: AppConfig = {
  apiKeysText: '',
  sourceLang: '英语',
  targetLang: '中文',
  customSourceLang: '',
  customTargetLang: '',
  taskName: ''
};

export function WorkbenchLayout() {
  const [appConfig, setAppConfig] = useLocalStorage<AppConfig>('dubbing_app_config', defaultConfig);
  const [characterDict, setCharacterDict] = useLocalStorage<CharacterEntry[]>('dubbing_char_dict', []);
  const [historyTasks, setHistoryTasks] = useLocalStorage<HistoryTask[]>('dubbing_history', []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [extractedJson, setExtractedJson] = useState<ExtractedSegment[] | null>(null);
  const [editableRows, setEditableRows] = useState<EditableScriptRow[]>([]);
  const [isLoadingStep1, setIsLoadingStep1] = useState(false);
  const [isLoadingStep2, setIsLoadingStep2] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const { audioBase64, audioObjectURL, mimeType, fileName, fileSize, handleFileChange, resetAudio } = useAudioFile();
  const { getNextKey, totalKeys } = useApiRotation(appConfig.apiKeysText || '');
  const { toasts, showToast, dismissToast } = useToast();

  const sourceLangStr = resolveLanguage(appConfig, 'source');
  const targetLangStr = resolveLanguage(appConfig, 'target');

  const handleNewTask = useCallback(() => {
    setExtractedJson(null);
    setEditableRows([]);
    resetAudio();
    setAppConfig(prev => ({ ...prev, taskName: '' }));
    setActiveHistoryId(null);
    setIsHistoryLoaded(false);
  }, [setAppConfig, resetAudio]);

  const handleSelectTask = useCallback((id: string) => {
    const task = historyTasks.find(t => t.id === id);
    if (task) {
      setExtractedJson(null);
      resetAudio();
      setEditableRows(task.finalScriptJson.map(r => ({ ...r, id: crypto.randomUUID(), isShortening: false })));
      setAppConfig(prev => ({ ...prev, taskName: task.taskName }));
      setActiveHistoryId(id);
      setIsHistoryLoaded(true);
    }
  }, [historyTasks, resetAudio, setAppConfig]);

  const handleDeleteTask = useCallback((id: string) => {
    setHistoryTasks(prev => prev.filter(t => t.id !== id));
    if (activeHistoryId === id) handleNewTask();
  }, [activeHistoryId, handleNewTask, setHistoryTasks]);

  const handleStep1 = useCallback(async () => {
    if (!audioBase64) {
      showToast({ type: 'warning', title: '请先上传音频文件', detail: '' });
      return;
    }
    setIsLoadingStep1(true);
    let keyInfo: { key: string; index: number } | null = null;
    try {
      keyInfo = getNextKey();
      const rawText = await callGemini(MODEL_MULTIMODAL, keyInfo.key, {
        system_instruction: { parts: [{ text: buildPrompt1(sourceLangStr, characterDict) }] },
        contents: [{ parts: [
          { inline_data: { mime_type: mimeType, data: audioBase64 } },
          { text: '请按要求处理以上音频。' }
        ] }],
        generationConfig: {
          thinkingConfig: { thinkingLevel: 'medium' }
        }
      });
      const segments = extractJsonArray<ExtractedSegment>(rawText);
      setExtractedJson(segments);
      showToast({ type: 'success', title: `✅ 步骤一完成，提取 ${segments.length} 段`, detail: '' });
    } catch (err) {
      showToast({
        type: 'error',
        title: '步骤一失败：多模态提取出错',
        detail: err instanceof Error ? err.message : String(err),
        keyIndex: keyInfo ? keyInfo.index + 1 : undefined
      });
    } finally {
      setIsLoadingStep1(false);
    }
  }, [audioBase64, mimeType, sourceLangStr, characterDict, getNextKey, showToast]);

  const handleStep2 = useCallback(async () => {
    if (!extractedJson?.length) {
      showToast({ type: 'warning', title: '请先完成步骤一', detail: '' });
      return;
    }
    setIsLoadingStep2(true);
    let keyInfo: { key: string; index: number } | null = null;
    try {
      keyInfo = getNextKey();
      const rawText = await callGemini(MODEL_MULTIMODAL, keyInfo.key, {
        system_instruction: { parts: [{ text: buildPrompt2(targetLangStr, characterDict) }] },
        contents: [{ parts: [{ text: JSON.stringify(extractedJson, null, 2) }] }],
        generationConfig: {
          thinkingConfig: { thinkingLevel: 'medium' },
          responseMimeType: 'application/json'
        }
      });
      const rows = extractJsonArray<ScriptRow>(rawText);
      const editable: EditableScriptRow[] = rows.map(r => ({ ...r, id: crypto.randomUUID(), isShortening: false }));
      setEditableRows(editable);

      const taskId = activeHistoryId ?? crypto.randomUUID();
      const task: HistoryTask = {
        id: taskId,
        taskName: appConfig.taskName || `任务 ${new Date().toLocaleString('zh-CN')}`,
        createdAt: new Date().toISOString(),
        finalScriptJson: rows
      };
      setHistoryTasks(prev => {
        const idx = prev.findIndex(t => t.id === taskId);
        return idx >= 0 ? prev.map(t => t.id === taskId ? task : t) : [task, ...prev];
      });
      setActiveHistoryId(taskId);
      showToast({ type: 'success', title: `✅ 步骤二完成，生成 ${rows.length} 行剧本`, detail: '' });
    } catch (err) {
      showToast({
        type: 'error',
        title: '步骤二失败：翻译与音色绑定出错',
        detail: err instanceof Error ? err.message : String(err),
        keyIndex: keyInfo ? keyInfo.index + 1 : undefined
      });
    } finally {
      setIsLoadingStep2(false);
    }
  }, [extractedJson, targetLangStr, characterDict, getNextKey, activeHistoryId, appConfig.taskName, showToast, setHistoryTasks]);

  // Handle active history update automatically via debounced effect (saving edits)
  useEffect(() => {
    if (activeHistoryId && editableRows.length > 0) {
      const timer = setTimeout(() => {
        setHistoryTasks(prev => prev.map(t => 
          t.id === activeHistoryId 
            ? { ...t, taskName: appConfig.taskName || t.taskName, finalScriptJson: editableRows.map(({ id, isShortening, ...r }) => r) } 
            : t
        ));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [editableRows, activeHistoryId, appConfig.taskName, setHistoryTasks]);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden font-sans text-zinc-100">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        taskName={appConfig.taskName}
        totalKeys={totalKeys}
      />

      <div className="flex w-full pt-12">
        <aside
          className={`fixed left-0 top-12 h-[calc(100vh-3rem)] bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 z-10 ${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full'}`}
          aria-hidden={!isSidebarOpen}
        >
          <Sidebar 
            historyTasks={historyTasks}
            activeHistoryId={activeHistoryId}
            onSelectTask={handleSelectTask}
            onNewTask={handleNewTask}
            onDeleteTask={handleDeleteTask}
          />
        </aside>

        <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-6 md:p-8`}>
          <div className="max-w-7xl mx-auto space-y-8">
            <ConfigPanel
              appConfig={appConfig}
              setAppConfig={setAppConfig}
              characterDict={characterDict}
              setCharacterDict={setCharacterDict}
            />

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span>🎵</span> 操作区
              </h2>
              <div className="space-y-6">
                <AudioUploader
                  isHistoryLoaded={isHistoryLoaded}
                  audioBase64={audioBase64}
                  audioObjectURL={audioObjectURL}
                  fileName={fileName}
                  fileSize={fileSize}
                  onFileChange={handleFileChange}
                />
                
                <StepButtons 
                  onStep1={handleStep1}
                  onStep2={handleStep2}
                  isLoading1={isLoadingStep1}
                  isLoading2={isLoadingStep2}
                  hasAudio={!!audioBase64}
                  hasStep1Result={!!extractedJson?.length}
                />
              </div>
            </div>

            {extractedJson && extractedJson.length > 0 && (
              <Accordion title={`提取结果 (${extractedJson.length}段)`} icon="📋">
                <div className="max-h-60 overflow-y-auto bg-zinc-900 rounded p-3 text-xs font-mono whitespace-pre text-zinc-300 hidden-scrollbar border border-zinc-800">
                  {JSON.stringify(extractedJson, null, 2)}
                </div>
              </Accordion>
            )}

            {editableRows.length > 0 && (
              <div id="editor-section">
                <ScriptEditor 
                  rows={editableRows} 
                  setRows={setEditableRows}
                  getNextKey={getNextKey}
                  showToast={showToast}
                />
                <ExportBar data={editableRows} taskName={appConfig.taskName} />
              </div>
            )}
          </div>
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
