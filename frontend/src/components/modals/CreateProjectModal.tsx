'use client';

import React, { useState } from 'react';
import { ProjectItem } from '../../types/hrms';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (proj: ProjectItem) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('INTERNAL');
  const [dueDate, setDueDate] = useState('Nov 30');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title,
      description: description || 'Workspace initiative and delivery milestone.',
      tag,
      tagType: tag === 'INTERNAL' ? 'internal' : tag === 'ON HOLD' ? 'on_hold' : 'client',
      progress: 0,
      teamAvatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ04Ptdv60xykekXJXP1EOIsPRqhJuBY9xKQ-Hlo2feFg9ZddnUeUoaARoJNkaV0zTBYIpiAWHjRQ3OkJG6nr6YjShbWGFJRpcMj8ZgZcZZ1rVIBLC9A_5_3lcuB4scLTqOybBG8kl38Md6hM0x9UM9Yaxg7VBLny1z9I-mPtS3fxtaAoU-seHuvE4DsOHTKW8NR7lCgr9zCvTS1i_M5nujq9-Yi7lzhqGu8SPUQsjCqwZ68edqSaU',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBS_YDAHuQ5isFiLyUaHfm3WQUdPHpqJhy-0r9eDpJKqNI26bW02RsxuUsFSNieAIDHO5CQMkq8cHG0sJ0OSlPRW1TqemR2Bc7O5_Kswrohf5NyDrWNaHuKY9MXOWqHKbkSAYy5-saRzpjcUp2fEMq9f_GcCyqA2sDPLN8W2cE2j1IxfA38laSnroHUzI9tXaeVSeb4AElUPEYvYy102obghrxZwvlERtfIEpx_iVoOTMNe_hryOxWX',
      ],
      dueDate,
      status: 'active',
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E5E5E5] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative font-sans">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#A259FF] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">add_box</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1b1b1b]">Create Project</h3>
              <p className="text-xs text-[#4b4454] font-mono">Nexus Workspace Initiative</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#7d7386] hover:text-[#1b1b1b] p-1 rounded">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label className="block text-xs font-bold text-[#1b1b1b] uppercase mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Tokens Engine v2"
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-xs focus:border-[#A259FF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b1b1b] uppercase mb-1">Scope & Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of engineering deliverables..."
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-xs focus:border-[#A259FF] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1b] uppercase mb-1">Classification Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-xs bg-white focus:border-[#A259FF] outline-none"
              >
                <option value="INTERNAL">INTERNAL</option>
                <option value="CLIENT BETA">CLIENT BETA</option>
                <option value="ON HOLD">ON HOLD</option>
                <option value="ACTIVE">ACTIVE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1b1b1b] uppercase mb-1">Target Due Date</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Nov 30"
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-xs focus:border-[#A259FF] outline-none"
              />
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
              Launch Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
