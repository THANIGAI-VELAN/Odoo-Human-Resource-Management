'use client';

import React, { useState } from 'react';
import { ProjectItem } from '@/types/hrms';

interface NexusProjectsProps {
  projects: ProjectItem[];
  onOpenCreateProject: () => void;
  onUpdateProjectProgress: (projectId: string, newProgress: number) => void;
}

export const NexusProjects: React.FC<NexusProjectsProps> = ({
  projects,
  onOpenCreateProject,
  onUpdateProjectProgress,
}) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Archived'>('All');
  const [search, setSearch] = useState<string>('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    if (filter === 'All') return matchesSearch;
    if (filter === 'Active') return matchesSearch && p.status === 'active';
    if (filter === 'Completed') return matchesSearch && p.status === 'completed';
    if (filter === 'Archived') return matchesSearch && p.status === 'archived';
    return matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b] tracking-tight">Projects</h1>
          <p className="text-xs sm:text-sm text-[#4b4454] mt-1 font-mono">
            Manage and track all ongoing initiatives across the organization.
          </p>
        </div>

        <button
          onClick={onOpenCreateProject}
          className="flex items-center gap-2 bg-[#A259FF] text-white px-4 py-2 rounded font-mono text-[13px] font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#E5E5E5] p-3 rounded-xl shadow-2xs">
        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['All', 'Active', 'Completed', 'Archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                filter === tab ? 'bg-[#944af1] text-white' : 'text-[#4b4454] hover:bg-[#f3f3f3]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7386] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#f9f9f9] border border-[#E5E5E5] rounded text-xs font-mono focus:bg-white focus:outline-none focus:border-[#A259FF] transition-colors placeholder:text-[#7d7386]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          let tagBg = 'bg-[#f3f3f3] text-[#4b4454]';
          let progressColor = 'bg-[#A259FF]';

          if (project.tagType === 'on_hold') {
            tagBg = 'bg-[#fff0ed] text-[#F24E1E]';
            progressColor = 'bg-[#F24E1E]';
          } else if (project.tagType === 'completed') {
            tagBg = 'bg-[#ebfbf2] text-[#22C55E]';
            progressColor = 'bg-[#22C55E]';
          }

          return (
            <div
              key={project.id}
              className="bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col justify-between hover:border-[#A259FF] transition-all shadow-2xs group"
            >
              <div>
                {/* Header with Title & Tag */}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-[#1b1b1b] group-hover:text-[#7a2ad6] transition-colors">
                      {project.title}
                    </h3>
                    <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded mt-1.5 uppercase ${tagBg}`}>
                      {project.tag}
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`Project Options for ${project.title}`)}
                    className="text-[#7d7386] hover:text-[#1b1b1b] p-1 rounded hover:bg-[#f3f3f3]"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-[#4b4454] mt-2.5 font-mono leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Blocked notification banner */}
                {project.isBlocked && (
                  <div className="mt-3 p-2.5 bg-[#fff3f0] border border-[#ffcfc4] rounded-md flex items-center gap-2 text-xs font-mono text-[#F24E1E]">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    <span>{project.blockedReason || 'Blocked by dependencies'}</span>
                  </div>
                )}
              </div>

              {/* Progress & Footer */}
              <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#4b4454]">Progress</span>
                    <span className="font-bold text-[#1b1b1b]">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-[#f3f3f3] h-2 rounded-full overflow-hidden">
                    <div
                      className={`${progressColor} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Team Avatars & Due Date */}
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2 overflow-hidden">
                    {project.teamAvatars.map((av, idx) => (
                      <img
                        key={idx}
                        alt="Team Member"
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                        src={av}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#7d7386]">
                    <span className="material-symbols-outlined text-[16px]">event</span>
                    <span>{project.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
