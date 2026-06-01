import React from 'react';
import { HistoryTask } from '@/types';
import { Plus, Trash2, Clock } from 'lucide-react';

interface SidebarProps {
  historyTasks: HistoryTask[];
  activeHistoryId: string | null;
  onSelectTask: (id: string) => void;
  onNewTask: () => void;
  onDeleteTask: (id: string) => void;
}

export function Sidebar({ historyTasks, activeHistoryId, onSelectTask, onNewTask, onDeleteTask }: SidebarProps) {
  return (
    <div className="h-full flex flex-col pt-4">
      <div className="px-4 mb-4">
        <button
          onClick={onNewTask}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          新建配音任务
        </button>
      </div>

      <div className="px-4 mb-2 flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        <Clock className="w-3 h-3 mr-1" />
        历史任务 ({historyTasks.length})
      </div>

      <div className="flex-1 overflow-y-auto hidden-scrollbar">
        {historyTasks.length === 0 ? (
          <p className="text-xs text-zinc-600 px-4 text-center mt-6">暂无历史记录</p>
        ) : (
          <ul className="space-y-1 px-2">
            {historyTasks.map(task => {
              const isActive = task.id === activeHistoryId;
              return (
                <li key={task.id} className="relative group">
                  <button
                    onClick={() => onSelectTask(task.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border-l-4 transition-all duration-200
                      ${isActive 
                        ? 'border-indigo-500 bg-indigo-950/30' 
                        : 'border-transparent hover:bg-zinc-800/80'}`
                    }
                  >
                    <div className="text-sm font-medium text-zinc-200 truncate pr-6">
                      {task.taskName}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">
                      {new Date(task.createdAt).toLocaleString('zh-CN', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
                    title="删除记录"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
