import React from 'react';
import { ToastMessage } from '@/types';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => {
        const bg = {
          success: 'bg-green-950 border-green-700',
          error: 'bg-red-950 border-red-700',
          warning: 'bg-amber-950 border-amber-700'
        }[toast.type];

        const Icon = {
          success: CheckCircle,
          error: AlertCircle,
          warning: Info
        }[toast.type];

        const iconColor = {
          success: 'text-green-500',
          error: 'text-red-500',
          warning: 'text-amber-500'
        }[toast.type];

        return (
          <div 
            key={toast.id}
            className={`w-80 border rounded-lg p-4 shadow-xl flex items-start gap-3 relative animate-[slide-in-right_0.3s_ease-out] ${bg}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                {toast.title}
                {toast.keyIndex !== undefined && (
                  <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                    Key #{toast.keyIndex}
                  </span>
                )}
              </h4>
              {toast.detail && (
                <p className="text-xs text-zinc-400 mt-1 line-clamp-3">{toast.detail}</p>
              )}
            </div>
            <button 
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 animate-[shrink-width_5s_linear] origin-left" />
          </div>
        );
      })}
    </div>
  );
}
