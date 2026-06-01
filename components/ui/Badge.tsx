import React from 'react';

// Common badge
export function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' }) {
  const styles = {
    default: 'bg-zinc-800 text-zinc-300',
    success: 'bg-green-900 text-green-300',
    warning: 'bg-amber-900 text-amber-300',
    error: 'bg-red-900 text-red-300',
    outline: 'border border-zinc-700 text-zinc-400'
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium leading-none ${styles[variant]}`}>
      {children}
    </span>
  );
}
