'use client';

import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/hrms';

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
  const [activeTab, setActiveTab] = useState<'resume' | 'private_info' | 'salary_info' | 'security'>('resume');

  // Edit states for profile details
  const [isEditingName, setIsEditingName] = useState(false);
  const [editFirstName, setEditFirstName] = useState(employee.name.split(' ')[0] || '');
  const [editLastName, setEditLastName] = useState(employee.name.split(' ')[1] || '');

  const [editPhone, setEditPhone] = useState(employee.phone || '');
  const [editEmail, setEditEmail] = useState(employee.email || '');

  // Salary fields
  const [monthlyWage, setMonthlyWage] = useState<number>(employee.grossSalary || 50000);
  const [workingDays, setWorkingDays] = useState<number>(employee.leaveBalance?.casual || 5); // Fallback
  const [breakTime, setBreakTime] = useState<number>(1.0);

  // Resume section states
  const [aboutText, setAboutText] = useState(employee.about || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
  const [jobLoveText, setJobLoveText] = useState(employee.job_love || 'I love solving complex engineering challenges and creating premium interface systems.');
  const [hobbiesText, setHobbiesText] = useState(employee.hobbies || 'Developing open source software, reading sci-fi, and cycling.');
  
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingJobLove, setIsEditingJobLove] = useState(false);
  const [isEditingHobbies, setIsEditingHobbies] = useState(false);

  const [skillsList, setSkillsList] = useState<string[]>(
    employee.skills ? employee.skills.split(',') : ['React', 'Next.js', 'FastAPI', 'Python', 'TailwindCSS']
  );
  const [newSkill, setNewSkill] = useState('');

  const [certificationsList, setCertificationsList] = useState<string[]>(
    employee.certifications ? employee.certifications.split(',') : ['AWS Cloud Solutions Architect', 'Professional Scrum Master']
  );
  const [newCert, setNewCert] = useState('');

  useEffect(() => {
    // Reset tabs based on admin privileges
    if (!isAdminMode && activeTab === 'salary_info') {
      setActiveTab('resume');
    }
  }, [isAdminMode]);

  useEffect(() => {
    setEditFirstName(employee.name.split(' ')[0] || '');
    setEditLastName(employee.name.split(' ')[1] || '');
    setEditPhone(employee.phone || '');
    setEditEmail(employee.email || '');
    setMonthlyWage(employee.grossSalary || 50000);
    setAboutText(employee.about || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    setJobLoveText(employee.job_love || 'I love solving complex engineering challenges.');
    setHobbiesText(employee.hobbies || 'Developing open source software.');
  }, [employee]);

  // Auto-calculated salary components
  const basicSalary = Math.round(monthlyWage * 0.50 * 100) / 100;
  const hra = Math.round(basicSalary * 0.50 * 100) / 100;
  const stdAllowance = 4167.00;
  const perfBonus = Math.round(basicSalary * 0.0833 * 100) / 100;
  const lta = Math.round(basicSalary * 0.0833 * 100) / 100;
  const fixedAllowance = Math.round(Math.max(0, monthlyWage - (basicSalary + hra + stdAllowance + perfBonus + lta)) * 100) / 100;

  const pfEmployee = Math.round(basicSalary * 0.12 * 100) / 100;
  const pfEmployer = Math.round(basicSalary * 0.12 * 100) / 100;
  const profTax = 200.00;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleSaveProfileHeader = () => {
    const updated = {
      ...employee,
      name: `${editFirstName} ${editLastName}`.trim(),
      phone: editPhone,
      email: editEmail,
    };
    onUpdateEmployee(updated);
    setIsEditingName(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddCert = () => {
    if (newCert.trim() && !certificationsList.includes(newCert.trim())) {
      setCertificationsList([...certificationsList, newCert.trim()]);
      setNewCert('');
    }
  };

  const handleSaveSalaryInfo = () => {
    onSaveSalary(employee.id, monthlyWage);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Back button & Role switch */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDirectory}
          className="flex items-center gap-2 text-sm font-semibold text-[#003c90] hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Directory</span>
        </button>
        
        <button
          onClick={onToggleAdminMode}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold shadow-2xs border transition-all ${
            isAdminMode
              ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20'
              : 'bg-[#f3f3fc] text-[#003c90] border-[#E5E7EB]'
          }`}
        >
          {isAdminMode ? 'HR Officer / Admin View' : 'Standard Employee View'}
        </button>
      </div>

      {/* Main Profile Info Section (Top Half) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-2xs">
        <h2 className="text-xl font-bold text-[#191b22] mb-6">My Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Avatar */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center">
            <div className="relative">
              <img
                className="w-36 h-36 rounded-full object-cover border-4 border-[#f3f3fc] shadow-sm"
                alt={employee.name}
                src={employee.avatar}
              />
              <button
                onClick={() => alert('Change profile photo feature initiated.')}
                className="absolute bottom-1 right-1 w-9 h-9 bg-[#003c90] hover:bg-[#0f52ba] text-white rounded-full flex items-center justify-center border-2 border-white shadow transition-colors"
                title="Edit Avatar"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <p className="mt-3 text-xs font-mono text-[#737784]">{employee.employeeCode}</p>
          </div>

          {/* Middle Column: Personal details */}
          <div className="lg:col-span-5 space-y-4">
            {isEditingName ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-1/2 px-2.5 py-1.5 border rounded text-sm outline-none"
                    placeholder="First Name"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-1/2 px-2.5 py-1.5 border rounded text-sm outline-none"
                    placeholder="Last Name"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfileHeader}
                    className="px-3 py-1 bg-[#22C55E] text-white text-xs rounded font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#191b22]">{employee.name}</h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-[#003c90] p-1"
                  title="Edit Name"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
            )}

            <div className="space-y-2 text-sm text-[#434653]">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="font-semibold text-xs uppercase tracking-wider text-[#737784]">Login ID</span>
                <span className="font-mono text-[#191b22]">{employee.id}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="font-semibold text-xs uppercase tracking-wider text-[#737784]">Email</span>
                {isEditingName ? (
                  <input
                    type="email"
                    className="px-2 py-0.5 border rounded text-xs w-48 text-right outline-none"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                ) : (
                  <span className="text-[#191b22]">{employee.email}</span>
                )}
              </div>
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="font-semibold text-xs uppercase tracking-wider text-[#737784]">Mobile</span>
                {isEditingName ? (
                  <input
                    type="text"
                    className="px-2 py-0.5 border rounded text-xs w-48 text-right outline-none"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                ) : (
                  <span className="text-[#191b22]">{employee.phone || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Organizational details */}
          <div className="lg:col-span-4 space-y-2 text-sm text-[#434653] lg:border-l lg:pl-8">
            <div className="flex items-center justify-between border-b pb-1.5">
              <span className="font-semibold text-xs uppercase tracking-wider text-[#737784]">Company</span>
              <span className="text-[#191b22]">{employee.company || 'Odoo India'}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-1.5">
              <span className="font-semibold text-xs uppercase tracking-wider text-[#737784]">Department</span>
              <span className="text-[#191b22]">{employee.department}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-1.5">
              <span className="font-semibold text-xs uppercase tracking-wider text-[#737784]">Manager</span>
              <span className="text-[#003c90] font-semibold">{employee.managerName || 'Sarah Jenkins'}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-1.5">
              <span className="font-semibold text-xs uppercase tracking-wider text-[#737784]">Location</span>
              <span className="text-[#191b22]">{employee.locationType || 'Headquarters'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto text-sm font-bold gap-6">
        <button
          onClick={() => setActiveTab('resume')}
          className={`pb-3 whitespace-nowrap ${
            activeTab === 'resume' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
          }`}
        >
          Resume
        </button>
        <button
          onClick={() => setActiveTab('private_info')}
          className={`pb-3 whitespace-nowrap ${
            activeTab === 'private_info' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
          }`}
        >
          Private Info
        </button>
        {isAdminMode && (
          <button
            onClick={() => setActiveTab('salary_info')}
            className={`pb-3 whitespace-nowrap ${
              activeTab === 'salary_info' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
            }`}
          >
            Salary Info
          </button>
        )}
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 whitespace-nowrap ${
            activeTab === 'security' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
          }`}
        >
          Security
        </button>
      </div>

      {/* Bottom Half: Tab Content Area */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-2xs">
        {/* RESUME TAB */}
        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Descriptive text areas */}
            <div className="lg:col-span-8 space-y-6">
              {/* About */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider">About</h4>
                  <button
                    onClick={() => setIsEditingAbout(!isEditingAbout)}
                    className="text-gray-400 hover:text-[#003c90]"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
                {isEditingAbout ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full p-2.5 border rounded text-sm outline-none"
                      rows={4}
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                    />
                    <button
                      onClick={() => setIsEditingAbout(false)}
                      className="px-3 py-1 bg-[#22C55E] text-white text-xs rounded font-semibold"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-[#434653] leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-[#E5E7EB]/50">
                    {aboutText}
                  </p>
                )}
              </div>

              {/* What I love about my job */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider">What I love about my job</h4>
                  <button
                    onClick={() => setIsEditingJobLove(!isEditingJobLove)}
                    className="text-gray-400 hover:text-[#003c90]"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
                {isEditingJobLove ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full p-2.5 border rounded text-sm outline-none"
                      rows={3}
                      value={jobLoveText}
                      onChange={(e) => setJobLoveText(e.target.value)}
                    />
                    <button
                      onClick={() => setIsEditingJobLove(false)}
                      className="px-3 py-1 bg-[#22C55E] text-white text-xs rounded font-semibold"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-[#434653] leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-[#E5E7EB]/50">
                    {jobLoveText}
                  </p>
                )}
              </div>

              {/* Hobbies */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider">My interests and hobbies</h4>
                  <button
                    onClick={() => setIsEditingHobbies(!isEditingHobbies)}
                    className="text-gray-400 hover:text-[#003c90]"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
                {isEditingHobbies ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full p-2.5 border rounded text-sm outline-none"
                      rows={3}
                      value={hobbiesText}
                      onChange={(e) => setHobbiesText(e.target.value)}
                    />
                    <button
                      onClick={() => setIsEditingHobbies(false)}
                      className="px-3 py-1 bg-[#22C55E] text-white text-xs rounded font-semibold"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-[#434653] leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-[#E5E7EB]/50">
                    {hobbiesText}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Actionable Lists */}
            <div className="lg:col-span-4 space-y-6">
              {/* Skills */}
              <div className="border border-[#E5E7EB] rounded-lg p-4 bg-gray-50/20">
                <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#f3f3fc] text-[#003c90] text-xs font-semibold rounded-md border border-[#E5E7EB]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-grow px-2 py-1.5 border rounded text-xs outline-none"
                    placeholder="Add skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-[#003c90] hover:bg-[#0f52ba] text-white text-xs rounded font-semibold whitespace-nowrap"
                  >
                    + Add Skills
                  </button>
                </div>
              </div>

              {/* Certifications */}
              <div className="border border-[#E5E7EB] rounded-lg p-4 bg-gray-50/20">
                <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider mb-3">Certifications</h4>
                <div className="space-y-2 mb-4">
                  {certificationsList.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#434653]">
                      <span className="material-symbols-outlined text-[#22C55E] text-base">verified</span>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-grow px-2 py-1.5 border rounded text-xs outline-none"
                    placeholder="Add cert..."
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                  />
                  <button
                    onClick={handleAddCert}
                    className="px-3 py-1.5 bg-[#003c90] hover:bg-[#0f52ba] text-white text-xs rounded font-semibold whitespace-nowrap"
                  >
                    + Add Certification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRIVATE INFO TAB */}
        {activeTab === 'private_info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Personal details */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider mb-2">Personal Details</h4>
              <div className="grid grid-cols-2 gap-y-3.5 text-sm">
                <span className="text-[#737784] font-medium">Date of Birth</span>
                <span className="text-[#191b22] font-semibold">{employee.date_of_birth || '1995-03-14'}</span>

                <span className="text-[#737784] font-medium">Residing Address</span>
                <span className="text-[#191b22] font-semibold">{employee.residing_address || '42 Tech Park, Bangalore'}</span>

                <span className="text-[#737784] font-medium">Nationality</span>
                <span className="text-[#191b22] font-semibold">{employee.nationality || 'Indian'}</span>

                <span className="text-[#737784] font-medium">Personal Email</span>
                <span className="text-[#191b22] font-semibold">{employee.personal_email || 'arjun.personal@gmail.com'}</span>

                <span className="text-[#737784] font-medium">Gender</span>
                <span className="text-[#191b22] font-semibold">{employee.gender || 'Male'}</span>

                <span className="text-[#737784] font-medium">Marital Status</span>
                <span className="text-[#191b22] font-semibold">{employee.marital_status || 'Single'}</span>

                <span className="text-[#737784] font-medium">Date of Joining</span>
                <span className="text-[#191b22] font-semibold">{employee.joiningDate || '2022-01-12'}</span>
              </div>
            </div>

            {/* Right Column: Bank & Compliance details */}
            <div className="space-y-4 md:border-l md:pl-8">
              <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider mb-2">Bank & Compliance Details</h4>
              <div className="grid grid-cols-2 gap-y-3.5 text-sm">
                <span className="text-[#737784] font-medium">Account Number</span>
                <span className="text-[#191b22] font-semibold">{employee.bank_account_number || '1234567890123456'}</span>

                <span className="text-[#737784] font-medium">Bank Name</span>
                <span className="text-[#191b22] font-semibold">{employee.bank_name || 'HDFC Bank'}</span>

                <span className="text-[#737784] font-medium">IFSC Code</span>
                <span className="text-[#191b22] font-semibold">{employee.ifsc_code || 'HDFC0001234'}</span>

                <span className="text-[#737784] font-medium">PAN No</span>
                <span className="text-[#191b22] font-semibold">{employee.pan_no || 'ABCDE1234F'}</span>

                <span className="text-[#737784] font-medium">UAN No</span>
                <span className="text-[#191b22] font-semibold">{employee.uan_no || '100123456789'}</span>

                <span className="text-[#737784] font-medium">Emp Code</span>
                <span className="text-[#191b22] font-semibold font-mono">{employee.employeeCode}</span>
              </div>
            </div>
          </div>
        )}

        {/* SALARY INFO TAB (Admin Only) */}
        {activeTab === 'salary_info' && isAdminMode && (
          <div className="space-y-6">
            {/* Top Section: Overall Salary & Work Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#f3f3fc] border border-[#E5E7EB] rounded-xl text-sm">
              <div>
                <p className="text-[#737784] text-xs font-semibold">Month Wage</p>
                <input
                  type="number"
                  className="font-bold text-[#191b22] bg-white border border-[#E5E7EB] rounded px-2 py-0.5 w-full mt-1 outline-none"
                  value={monthlyWage}
                  onChange={(e) => setMonthlyWage(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div>
                <p className="text-[#737784] text-xs font-semibold">Yearly Wage</p>
                <p className="font-bold text-[#191b22] mt-1.5">{formatCurrency(monthlyWage * 12)} / Yearly</p>
              </div>
              <div>
                <p className="text-[#737784] text-xs font-semibold">No of working days in a week</p>
                <input
                  type="number"
                  className="font-bold text-[#191b22] bg-white border border-[#E5E7EB] rounded px-2 py-0.5 w-full mt-1 outline-none"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(Math.max(1, parseInt(e.target.value) || 5))}
                />
              </div>
              <div>
                <p className="text-[#737784] text-xs font-semibold">Break Time (hrs)</p>
                <input
                  type="number"
                  step="0.5"
                  className="font-bold text-[#191b22] bg-white border border-[#E5E7EB] rounded px-2 py-0.5 w-full mt-1 outline-none"
                  value={breakTime}
                  onChange={(e) => setBreakTime(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Salary Components */}
              <div className="space-y-4">
                <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider border-b pb-1.5 flex justify-between">
                  <span>Salary Components</span>
                  <span className="text-[#003c90] font-mono">{formatCurrency(monthlyWage)} / Mo</span>
                </h4>
                
                <div className="space-y-2 text-sm text-[#434653]">
                  {/* Basic */}
                  <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50 border-b">
                    <div>
                      <p className="font-semibold text-[#191b22]">Basic Salary</p>
                      <p className="text-[10px] text-gray-500">50% of monthly wage</p>
                    </div>
                    <p className="font-bold font-mono text-[#191b22]">{formatCurrency(basicSalary)} | 50.00%</p>
                  </div>

                  {/* HRA */}
                  <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50 border-b">
                    <div>
                      <p className="font-semibold text-[#191b22]">House Rent Allowance (HRA)</p>
                      <p className="text-[10px] text-gray-500">50% of basic salary</p>
                    </div>
                    <p className="font-bold font-mono text-[#191b22]">{formatCurrency(hra)} | 50.00%</p>
                  </div>

                  {/* Standard Allowance */}
                  <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50 border-b">
                    <div>
                      <p className="font-semibold text-[#191b22]">Standard Allowance</p>
                      <p className="text-[10px] text-gray-500">Predetermined, fixed amount</p>
                    </div>
                    <p className="font-bold font-mono text-[#191b22]">{formatCurrency(stdAllowance)} | 16.67%</p>
                  </div>

                  {/* Performance Bonus */}
                  <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50 border-b">
                    <div>
                      <p className="font-semibold text-[#191b22]">Performance Bonus</p>
                      <p className="text-[10px] text-gray-500">8.33% of basic salary</p>
                    </div>
                    <p className="font-bold font-mono text-[#191b22]">{formatCurrency(perfBonus)} | 8.33%</p>
                  </div>

                  {/* LTA */}
                  <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50 border-b">
                    <div>
                      <p className="font-semibold text-[#191b22]">Leave Travel Allowance (LTA)</p>
                      <p className="text-[10px] text-gray-500">Covers travel expenses (8.33% of basic)</p>
                    </div>
                    <p className="font-bold font-mono text-[#191b22]">{formatCurrency(lta)} | 8.33%</p>
                  </div>

                  {/* Fixed Allowance */}
                  <div className="flex justify-between items-center p-2 bg-[#f3f3fc] border border-[#E5E7EB] rounded font-medium">
                    <div>
                      <p className="font-bold text-[#191b22]">Fixed Allowance</p>
                      <p className="text-[10px] text-gray-500">Remainder portion after components</p>
                    </div>
                    <p className="font-bold font-mono text-[#191b22]">{formatCurrency(fixedAllowance)} | 11.67%</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Deductions & Contributions */}
              <div className="space-y-4 md:border-l md:pl-8">
                <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider border-b pb-1.5">
                  Deductions & Contributions
                </h4>
                
                <div className="space-y-3 text-sm text-[#434653]">
                  {/* PF contribution */}
                  <div className="border border-[#E5E7EB] rounded-lg p-3 bg-gray-50/20">
                    <p className="font-bold text-[#191b22] text-xs uppercase tracking-wider mb-2">Provident Fund (PF) Contribution</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Employee contribution (12% of basic)</span>
                        <span className="font-bold font-mono text-[#191b22]">{formatCurrency(pfEmployee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employer contribution (12% of basic)</span>
                        <span className="font-bold font-mono text-[#191b22]">{formatCurrency(pfEmployer)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tax Deductions */}
                  <div className="border border-[#E5E7EB] rounded-lg p-3 bg-gray-50/20">
                    <p className="font-bold text-[#191b22] text-xs uppercase tracking-wider mb-2">Tax Deductions</p>
                    <div className="flex justify-between">
                      <span>Professional Tax (PT)</span>
                      <span className="font-bold font-mono text-red-600">-{formatCurrency(profTax)}</span>
                    </div>
                  </div>

                  {/* Net Pay summary */}
                  <div className="bg-[#003c90] text-white p-4 rounded-lg flex justify-between items-center shadow">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-[#b0c6ff]">Estimated Net Take-home</p>
                      <p className="text-xl font-bold font-mono mt-0.5">
                        {formatCurrency(monthlyWage - pfEmployee - profTax)}
                      </p>
                    </div>
                    <button
                      onClick={handleSaveSalaryInfo}
                      className="px-4 py-2 bg-white text-[#003c90] hover:bg-gray-100 rounded text-xs font-bold transition-colors"
                    >
                      Save Structure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-4 max-w-md">
            <h4 className="font-bold text-[#191b22] text-sm uppercase tracking-wider mb-2">Security Settings</h4>
            <div className="space-y-3">
              <button
                onClick={() => alert(`Password reset request submitted for ${employee.name}`)}
                className="w-full py-2 bg-[#f3f3fc] text-[#003c90] hover:bg-[#e7e7f1] border rounded text-xs font-semibold transition-colors"
              >
                Send Password Reset Email
              </button>
              <button
                onClick={() => alert('MFA settings opened.')}
                className="w-full py-2 bg-[#f3f3fc] text-[#003c90] hover:bg-[#e7e7f1] border rounded text-xs font-semibold transition-colors"
              >
                Manage Multi-Factor Authentication
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
