'use client';

import { useToastStore } from '@/lib/toast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useEffect } from 'react';

export default function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Card
          key={toast.id}
          className={`w-80 animate-in slide-in-from-right duration-300 ${
            toast.type === 'error'
              ? 'border-destructive bg-destructive/10'
              : toast.type === 'success'
              ? 'border-green-500 bg-green-500/10'
              : 'border-primary bg-primary/10'
          }`}
        >
          <CardContent className="p-4 flex items-start gap-3">
            {toast.type === 'success' && (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            )}
            {toast.type === 'error' && (
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
