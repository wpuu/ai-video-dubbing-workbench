import React from 'react';
import { Menu, X, Key } from 'lucide-react';

interface NavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  taskName: string;
  totalKeys: number;
}

export function Navbar({ isSidebarOpen, onToggleSidebar, taskName, totalKeys }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full h-12 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 z-20 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label={isSidebarOpen ? '收起侧边栏' : '展开侧边栏'}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">🎙️</span>
          <span className="text-sm font-medium text-zinc-200">AI 配音工作台 Pro</span>
        </div>
      </div>
      
      <div className="hidden md:flex text-sm text-zinc-400 font-medium">
        {taskName || '未命名任务'}
      </div>

      <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
        <Key className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-xs text-zinc-300">Key 池: <strong className="text-indigo-400">{totalKeys}</strong> 个</span>
      </div>
    </nav>
  );
}
