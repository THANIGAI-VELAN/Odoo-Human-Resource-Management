'use client';

import React, { useState } from 'react';
import { Employee } from '@/types/hrms';

interface MessageModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (employeeName: string, message: string) => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  employee,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');

  if (!isOpen || !employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(employee.name, message);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB] mb-4">
          <div className="flex items-center gap-3">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
            />
            <div>
              <h3 className="text-base font-bold text-[#191b22]">{employee.name}</h3>
              <p className="text-xs text-[#003c90] font-medium">{employee.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#737784] hover:text-[#191b22] p-1 rounded">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1.5">
              Direct Internal Message
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Send a note to ${employee.name}...`}
              className="w-full p-3 border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:border-[#003c90] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#434653]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#003c90] text-white text-xs font-bold rounded-lg hover:bg-[#0f52ba] flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
