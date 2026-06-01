import { useState, useCallback } from 'react';
import { ToastMessage } from '@/types';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = crypto.randomUUID();
    const newToast: ToastMessage = { ...msg, id };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, [dismissToast]);

  return { toasts, showToast, dismissToast };
}
