'use client';

import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-[#003c90] bg-[#ffffff] text-[#191b22]';
        let iconName = 'check_circle';
        let iconColor = 'text-[#22C55E]';

        if (toast.type === 'error') {
          borderClass = 'border-[#ba1a1a] bg-[#ffffff] text-[#191b22]';
          iconName = 'error';
          iconColor = 'text-[#ba1a1a]';
        } else if (toast.type === 'warning') {
          borderClass = 'border-[#F59E0B] bg-[#ffffff] text-[#191b22]';
          iconName = 'warning';
          iconColor = 'text-[#F59E0B]';
        } else if (toast.type === 'info') {
          borderClass = 'border-[#003c90] bg-[#ffffff] text-[#191b22]';
          iconName = 'info';
          iconColor = 'text-[#003c90]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 transition-all transform translate-y-0 ${borderClass}`}
          >
            <span className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${iconColor}`}>
              {iconName}
            </span>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#191b22]">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-[#434653] mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#737784] hover:text-[#191b22] text-sm p-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
