'use client';

import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/hrms';
import { calculateSalaryStructure, formatINR } from '@/utils/salaryCalculator';

interface EmployeeProfileSalaryProps {
  employee: Employee;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onBackToDirectory: () => void;
  onSaveSalary: (employeeId: string, newGross: number) => void;
  onUpdateEmployee: (updated: Employee) => void;
}

export const EmployeeProfileSalary: React.FC<EmployeeProfileSalaryProps> = ({
  employee,
  isAdminMode,
  onToggleAdminMode,
  onBackToDirectory,
  onSaveSalary,
  onUpdateEmployee,
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'private_info' | 'salary_info' | 'security'>('salary_info');
  const [grossInput, setGrossInput] = useState<string>(employee.grossSalary.toString());
  const [currentGross, setCurrentGross] = useState<number>(employee.grossSalary);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setGrossInput(employee.grossSalary.toString());
    setCurrentGross(employee.grossSalary);
  }, [employee]);

  const breakdown = calculateSalaryStructure(currentGross);

  const handleSimulate = () => {
    const parsed = parseFloat(grossInput.replace(/,/g, ''));
    if (!isNaN(parsed) && parsed > 0) {
      setCurrentGross(parsed);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveSalary(employee.id, currentGross);
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDirectory}
          className="flex items-center gap-2 text-sm font-semibold text-[#003c90] hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Directory</span>
        </button>
        <span className="text-xs font-mono text-[#737784]">Employee Profile • {employee.employeeCode}</span>
      </div>

      {/* Contextual Warning (Admin View) */}
      {isAdminMode ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#ffdad6] text-[#93000a] p-4 rounded-xl border border-[#ba1a1a]/20 gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-[#ba1a1a]" data-fill="1">
              admin_panel_settings
            </span>
            <div>
              <p className="text-sm font-bold">Administrative View Active</p>
              <p className="text-xs text-[#93000a] opacity-90">
                You are viewing highly sensitive payroll information. Actions are logged.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleAdminMode}
            className="px-4 py-2 bg-[#ba1a1a] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shadow-2xs"
          >
            Exit Admin Mode
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-[#f3f3fc] text-[#003c90] p-4 rounded-xl border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-[#003c90]">lock</span>
            <div>
              <p className="text-sm font-bold">Standard Employee View</p>
              <p className="text-xs text-[#434653]">Switch to Administrative mode to modify compensation structures.</p>
            </div>
          </div>
          <button
            onClick={onToggleAdminMode}
            className="px-4 py-2 bg-[#003c90] text-white rounded-lg text-xs font-semibold hover:bg-[#0f52ba] transition-colors whitespace-nowrap"
          >
            Enable Admin Mode
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col md:flex-row items-start gap-6 shadow-2xs">
        <img
          className="w-24 h-24 rounded-full object-cover border-2 border-[#e7e7f1] shrink-0"
          alt={employee.name}
          src={employee.avatar}
        />
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h2 className="text-2xl font-bold text-[#191b22] tracking-tight">{employee.name}</h2>
            <span className="bg-[#f3f3fc] text-[#434653] px-3 py-1 rounded-md text-xs font-mono font-semibold border border-[#E5E7EB] flex items-center gap-1.5 w-fit">
              <span className="material-symbols-outlined text-[16px]">badge</span>
              <span>{employee.employeeCode}</span>
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#434653] mb-4 font-medium">{employee.designation}</p>

          {/* Navigation Tabs */}
          <div className="flex gap-6 sm:gap-8 border-b border-[#E5E7EB] overflow-x-auto text-sm font-semibold">
            <button
              onClick={() => setActiveTab('resume')}
              className={`pb-3 transition-colors whitespace-nowrap ${
                activeTab === 'resume' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
              }`}
            >
              Resume
            </button>
            <button
              onClick={() => setActiveTab('private_info')}
              className={`pb-3 transition-colors whitespace-nowrap ${
                activeTab === 'private_info' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
              }`}
            >
              Private Info
            </button>
            <button
              onClick={() => setActiveTab('salary_info')}
              className={`pb-3 transition-colors whitespace-nowrap ${
                activeTab === 'salary_info' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
              }`}
            >
              Salary Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'security' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Security</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'salary_info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input / Simulator Section */}
          <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div>
              <h3 className="text-lg font-bold text-[#191b22] mb-0.5">Monthly Compensation</h3>
              <p className="text-xs text-[#434653]">Update the gross monthly wage to simulate new structures.</p>
            </div>

            <div className="flex items-center gap-3 bg-[#f3f3fc] p-2 rounded-lg border border-[#E5E7EB]">
              <label className="text-xs font-mono font-bold text-[#434653] uppercase tracking-wider pl-2">
                Gross Wage (₹)
              </label>
              <input
                className="bg-white border border-[#c3c6d5] focus:border-[#003c90] text-lg font-bold text-[#191b22] rounded-md px-3.5 py-1.5 w-44 text-right focus:ring-1 focus:ring-[#003c90] outline-none transition-all font-mono"
                type="text"
                disabled={!isAdminMode}
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSimulate();
                }}
              />
              <button
                onClick={handleSimulate}
                title="Recalculate breakdown"
                className="w-9 h-9 bg-[#003c90] text-white rounded-md flex items-center justify-center hover:bg-[#0f52ba] transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Earnings Breakdown (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e7e7f1]">
              <h3 className="text-lg font-bold text-[#191b22] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#22C55E]" data-fill="1">
                  trending_up
                </span>
                <span>Earnings</span>
              </h3>
              <span className="text-xl font-bold font-mono text-[#191b22]">{formatINR(breakdown.totalEarnings)}</span>
            </div>

            <div className="space-y-2">
              {/* Basic Pay */}
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[#191b22]">Basic Pay</p>
                  <p className="text-xs text-[#737784] font-mono">50% of Gross</p>
                </div>
                <p className="text-sm sm:text-base font-bold font-mono text-[#191b22]">{formatINR(breakdown.basicPay)}</p>
              </div>

              {/* HRA */}
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[#191b22]">House Rent Allowance (HRA)</p>
                  <p className="text-xs text-[#737784] font-mono">50% of Basic</p>
                </div>
                <p className="text-sm sm:text-base font-bold font-mono text-[#191b22]">{formatINR(breakdown.hra)}</p>
              </div>

              {/* Standard Allowance */}
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[#191b22]">Standard Allowance</p>
                  <p className="text-xs text-[#737784] font-mono">Fixed Component</p>
                </div>
                <p className="text-sm sm:text-base font-bold font-mono text-[#191b22]">
                  {formatINR(breakdown.standardAllowance)}
                </p>
              </div>

              {/* Performance Bonus */}
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[#191b22]">Performance Bonus</p>
                  <p className="text-xs text-[#737784] font-mono">8.33% of Basic</p>
                </div>
                <p className="text-sm sm:text-base font-bold font-mono text-[#191b22]">
                  {formatINR(breakdown.performanceBonus)}
                </p>
              </div>

              {/* Leave Travel Allowance (LTA) */}
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[#191b22]">Leave Travel Allowance (LTA)</p>
                  <p className="text-xs text-[#737784] font-mono">8.33% of Basic</p>
                </div>
                <p className="text-sm sm:text-base font-bold font-mono text-[#191b22]">{formatINR(breakdown.lta)}</p>
              </div>

              {/* Fixed Allowance (Balancing) */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-[#f3f3fc] border border-[#E5E7EB] mt-3">
                <div>
                  <p className="text-sm font-bold text-[#191b22] flex items-center gap-1.5">
                    <span>Fixed Allowance</span>
                    <span
                      title="Adjusts dynamically to match total gross base"
                      className="material-symbols-outlined text-[16px] text-[#003c90] cursor-help"
                    >
                      info
                    </span>
                  </p>
                  <p className="text-xs text-[#737784] font-mono">Balancing Figure</p>
                </div>
                <p className="text-sm sm:text-base font-bold font-mono text-[#191b22]">
                  {formatINR(breakdown.fixedAllowance)}
                </p>
              </div>
            </div>
          </div>

          {/* Deductions & Summary (1 col) */}
          <div className="flex flex-col gap-6">
            {/* Deductions */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e7e7f1]">
                <h3 className="text-lg font-bold text-[#191b22] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#EF4444]" data-fill="1">
                    trending_down
                  </span>
                  <span>Deductions</span>
                </h3>
                <span className="text-xl font-bold font-mono text-[#EF4444]">
                  -{formatINR(breakdown.totalDeductions)}
                </span>
              </div>

              <div className="space-y-2">
                {/* PF */}
                <div className="flex justify-between items-center p-2 rounded hover:bg-[#F9FAFB]">
                  <div>
                    <p className="text-sm font-bold text-[#191b22]">Provident Fund (PF)</p>
                    <p className="text-xs text-[#737784] font-mono">12% of Basic</p>
                  </div>
                  <p className="text-sm font-bold font-mono text-[#191b22]">{formatINR(breakdown.providentFund)}</p>
                </div>

                {/* Professional Tax */}
                <div className="flex justify-between items-center p-2 rounded hover:bg-[#F9FAFB]">
                  <div>
                    <p className="text-sm font-bold text-[#191b22]">Professional Tax (PT)</p>
                    <p className="text-xs text-[#737784] font-mono">Statutory</p>
                  </div>
                  <p className="text-sm font-bold font-mono text-[#191b22]">{formatINR(breakdown.professionalTax)}</p>
                </div>
              </div>
            </div>

            {/* Estimated Net Pay Summary Card */}
            <div className="bg-[#003c90] border border-[#0f52ba] rounded-xl p-6 text-white flex flex-col justify-between flex-1 relative overflow-hidden shadow-md">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10">
                <p className="text-xs font-mono font-bold text-[#b0c6ff] uppercase tracking-wider mb-1">
                  Estimated Net Pay
                </p>
                <h2 className="text-3xl font-bold font-mono mb-6">{formatINR(breakdown.estimatedNetPay)}</h2>

                <div className="space-y-2.5 border-t border-white/20 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#b0c6ff]">Gross Base</span>
                    <span className="font-mono font-bold">{formatINR(breakdown.grossMonthly)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#b0c6ff]">Total Deductions</span>
                    <span className="font-mono font-bold">-{formatINR(breakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              <button
                disabled={!isAdminMode || isSaving}
                onClick={handleSave}
                className={`mt-6 w-full py-3 rounded-lg text-sm font-bold transition-all relative z-10 flex justify-center items-center gap-2 shadow-sm ${
                  !isAdminMode
                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                    : 'bg-white text-[#003c90] hover:bg-[#f3f3fc] active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>{isSaving ? 'Saving...' : 'Save Structure'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Tab */}
      {activeTab === 'resume' && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
            <h3 className="text-lg font-bold text-[#191b22]">Professional Resume & Credentials</h3>
            <button
              onClick={() => alert(`Downloading verified resume for ${employee.name}...`)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#f3f3fc] text-[#003c90] rounded hover:bg-[#e7e7f1]"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Download PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#191b22] uppercase tracking-wider">Experience Summary</h4>
              <div className="border-l-2 border-[#003c90] pl-4 space-y-3">
                <div>
                  <p className="text-sm font-bold text-[#191b22]">{employee.role} — Dayflow</p>
                  <p className="text-xs text-[#737784]">{employee.joiningDate} to Present • Product Development</p>
                  <p className="text-xs text-[#434653] mt-1 leading-relaxed">
                    Lead architecture for full-stack enterprise portal micro-frontends, high-throughput database sync,
                    and internal developer velocity frameworks.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#191b22]">Full-Stack Software Engineer — NexaCorp</p>
                  <p className="text-xs text-[#737784]">2019 to 2022 • Cloud Solutions</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#191b22] uppercase tracking-wider">Education & Certifications</h4>
              <div className="space-y-3">
                <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <p className="text-sm font-bold text-[#191b22]">B.Tech in Computer Science & Engineering</p>
                  <p className="text-xs text-[#737784]">Indian Institute of Technology (IIT) • 2015-2019</p>
                </div>
                <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <p className="text-sm font-bold text-[#191b22]">AWS Certified Solutions Architect</p>
                  <p className="text-xs text-[#737784]">Professional Level • Valid through 2027</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Private Info Tab */}
      {activeTab === 'private_info' && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-6 shadow-2xs">
          <h3 className="text-lg font-bold text-[#191b22] border-b border-[#E5E7EB] pb-3">Personal & Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-[#737784] font-medium">Work Email</p>
              <p className="text-sm font-semibold text-[#191b22] mt-0.5">{employee.email}</p>
            </div>
            <div>
              <p className="text-xs text-[#737784] font-medium">Contact Phone</p>
              <p className="text-sm font-semibold text-[#191b22] mt-0.5">{employee.phone}</p>
            </div>
            <div>
              <p className="text-xs text-[#737784] font-medium">Location Mode</p>
              <p className="text-sm font-semibold text-[#191b22] mt-0.5">{employee.locationType}</p>
            </div>
            <div>
              <p className="text-xs text-[#737784] font-medium">Reporting Manager</p>
              <p className="text-sm font-semibold text-[#003c90] mt-0.5">{employee.managerName}</p>
            </div>
            <div>
              <p className="text-xs text-[#737784] font-medium">Emergency Contact</p>
              <p className="text-sm font-semibold text-[#191b22] mt-0.5">{employee.emergencyContact}</p>
            </div>
            <div>
              <p className="text-xs text-[#737784] font-medium">Joining Date</p>
              <p className="text-sm font-semibold text-[#191b22] mt-0.5">{employee.joiningDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-6 shadow-2xs">
          <h3 className="text-lg font-bold text-[#191b22] border-b border-[#E5E7EB] pb-3">Account Security & RBAC</h3>
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div>
                <p className="text-sm font-bold text-[#191b22]">Multi-Factor Authentication (MFA)</p>
                <p className="text-xs text-[#737784]">Configured with Authenticator App</p>
              </div>
              <span className="px-2.5 py-1 bg-[#22C55E]/15 text-[#16a34a] text-xs font-bold rounded">Active</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div>
                <p className="text-sm font-bold text-[#191b22]">Role Permissions</p>
                <p className="text-xs text-[#737784]">Standard Engineering Contributor • Self Service Portal</p>
              </div>
              <span className="px-2.5 py-1 bg-[#d9e2ff] text-[#001945] text-xs font-mono font-bold rounded">LEVEL-3</span>
            </div>

            <button
              onClick={() => alert('Password reset link dispatched to ' + employee.email)}
              className="px-4 py-2 border border-[#003c90] text-[#003c90] rounded text-xs font-semibold hover:bg-[#f3f3fc]"
            >
              Dispatch Password Reset Token
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
