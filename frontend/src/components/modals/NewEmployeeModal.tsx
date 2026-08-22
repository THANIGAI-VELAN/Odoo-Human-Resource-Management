'use client';

import React, { useState } from 'react';
import { Employee } from '../../types/hrms';

interface NewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Employee) => void;
}

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) ');
  const [locationType, setLocationType] = useState<'HQ Office' | 'Remote' | 'Branch Office'>('HQ Office');
  const [grossSalary, setGrossSalary] = useState(55000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeCode: `OIJODO2023${randomNum}`,
      name,
      role: role || 'Team Member',
      designation: `${role || 'Team Member'} • ${department}`,
      department,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@dayflow.internal`,
      phone: phone || '+1 (555) 000-0000',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkaTMHB-WWSu5jAS3_qGSusLU_KB4Jw3zP1qfgQxgqerkcoYk_EWcZWNwDmkZYAc-WBeC6jmDyv_lTR6hXyNCPK5byLXqV7timYDP0VgGKdk8W8Y0qkerGQAnYnblfx7KjrKZ-xPh9ybaQP8_GwoHN0SgdBeBZnMESlqYh_0sdSXVcCFpq8iWtrEnrE98pu2wyseB3WW7JqtTq0mXUvTyybX1t7GMRj-n6FkwB8WwF-xRqmcVCvBA3',
      status: 'present',
      locationType,
      grossSalary: Number(grossSalary) || 50000,
      joiningDate: 'Today',
      managerName: 'Sarah Jenkins',
      emergencyContact: 'Primary Contact (+1 555 123-4567)',
      leaveBalance: {
        casual: 12,
        sick: 10,
        annual: 15,
      },
    };

    onAddEmployee(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#003c90] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191b22]">Add New Employee</h3>
              <p className="text-xs text-[#434653]">Provision a new team member in Dayflow HRMS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#737784] hover:text-[#191b22] p-1 rounded-md hover:bg-[#f3f3fc]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:border-[#003c90] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                Job Title / Role *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Cloud Engineer"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:border-[#003c90] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:border-[#003c90] outline-none bg-white"
              >
                <option value="Product Development">Product Development</option>
                <option value="Product Team">Product Team</option>
                <option value="Engineering">Engineering</option>
                <option value="Design Team">Design Team</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Quality Assurance">Quality Assurance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya.sharma@dayflow.internal"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:border-[#003c90] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                Location Mode
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:border-[#003c90] outline-none bg-white"
              >
                <option value="HQ Office">HQ Office</option>
                <option value="Remote">Remote</option>
                <option value="Branch Office">Branch Office</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
              Gross Monthly Wage (₹)
            </label>
            <input
              type="number"
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:border-[#003c90] outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#434653] hover:bg-[#f3f3fc] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#003c90] hover:bg-[#0f52ba] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
            >
              Create Employee Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
