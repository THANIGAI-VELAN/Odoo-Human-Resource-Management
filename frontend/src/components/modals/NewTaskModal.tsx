'use client';

import React, { useState } from 'react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { title: string; assignee: string; priority: string; sprint: string }) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('Sarah Chen');
  const [priority, setPriority] = useState('High');
  const [sprint, setSprint] = useState('Sprint 42');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({ title, assignee, priority, sprint });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E5E5E5] rounded-2xl max-w-md w-full p-6 shadow-2xl relative font-sans">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#A259FF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">add_task</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1b1b1b]">New Task</h3>
              <p className="text-xs text-[#4b4454] font-mono">Create sprint ticket</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#7d7386] hover:text-[#1b1b1b] p-1 rounded">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label className="block text-xs font-bold text-[#1b1b1b] uppercase mb-1">Task Summary *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Refactor table pagination query"
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-xs focus:border-[#A259FF] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1b] uppercase mb-1">Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-xs bg-white focus:border-[#A259FF] outline-none"
              >
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Marcus Johnson">Marcus Johnson</option>
                <option value="Elena Rodriguez">Elena Rodriguez</option>
                <option value="Arjun Desai">Arjun Desai</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1b1b1b] uppercase mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-xs bg-white focus:border-[#A259FF] outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E5E5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#4b4454] hover:bg-[#f3f3f3] rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#A259FF] text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
