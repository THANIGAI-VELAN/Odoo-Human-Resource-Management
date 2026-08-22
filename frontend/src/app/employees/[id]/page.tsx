'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, User, Briefcase, FileText, Plus, Calendar, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'notes'>('personal');

  // Mock employee database
  const employeeData = {
    id: id || 'EMP-001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@prohrms.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    role: 'Frontend Lead',
    status: 'Active',
    dateJoined: '2024-03-15',
    salary: '6,200',
    birthDate: '1995-08-12',
    address: '123 Developer Way, San Francisco, CA',
    emergencyContact: 'John Johnson (Father) - +1 (555) 987-6543',
    manager: 'Sarah Jenkins (VP of Engineering)',
    shift: 'General Day Shift (09:00 AM - 05:00 PM)'
  };

  const [notes, setNotes] = useState([
    { id: 1, author: 'Sarah Jenkins', content: 'Promoted to Frontend Lead following successful Q2 launch.', date: '2025-07-10 14:30' },
    { id: 2, author: 'Admin User', content: 'Completed annual security compliance training.', date: '2025-03-20 09:15' }
  ]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const note = {
      id: notes.length + 1,
      author: 'Admin User',
      content: newNote,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center gap-4">
          <Link href="/employees">
            <button className="p-2 text-gray-400 hover:text-gray-650 hover:bg-gray-150 rounded-full transition-all">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
            <p className="text-sm text-gray-500">View and update employment records for {employeeData.firstName}.</p>
          </div>
        </div>

        {/* Profile Card split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Profile Quick Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="text-center">
              <div className="flex flex-col items-center py-4">
                <div className="h-24 w-24 rounded-full bg-indigo-100 text-indigo-750 flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100">
                  {employeeData.firstName[0]}{employeeData.lastName[0]}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {employeeData.firstName} {employeeData.lastName}
                </h2>
                <p className="text-sm text-gray-500 font-medium">{employeeData.role}</p>
                <p className="text-xs text-gray-450 mt-0.5">{employeeData.department}</p>
                
                <span className="mt-4 px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
                  {employeeData.status}
                </span>

                <div className="mt-6 w-full border-t border-gray-100 pt-6 space-y-3.5 text-left text-sm text-gray-650">
                  <div className="flex items-center gap-2.5">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span>ID: {employeeData.id}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{employeeData.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{employeeData.phone}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel: Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Selector */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'personal'
                    ? 'border-indigo-650 text-indigo-650'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <User className="h-4 w-4" />
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('job')}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'job'
                    ? 'border-indigo-650 text-indigo-650'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Employment details
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'notes'
                    ? 'border-indigo-650 text-indigo-650'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <FileText className="h-4 w-4" />
                HR Notes ({notes.length})
              </button>
            </div>

            {/* Tab content */}
            {activeTab === 'personal' && (
              <Card title="Personal Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-sm text-gray-700">
                  <div>
                    <p className="text-xs font-semibold text-gray-450 uppercase tracking-wider mb-1">Date of Birth</p>
                    <p className="font-medium text-gray-900">{employeeData.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-450 uppercase tracking-wider mb-1">Gender</p>
                    <p className="font-medium text-gray-900">Female</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-450 uppercase tracking-wider mb-1">Home Address</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {employeeData.address}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-450 uppercase tracking-wider mb-1">Emergency Contact</p>
                    <p className="font-medium text-gray-900">{employeeData.emergencyContact}</p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'job' && (
              <Card title="Employment Parameters">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-sm text-gray-700">
                  <div>
                    <p className="text-xs font-semibold text-gray-450 uppercase tracking-wider mb-1">Date of Joining</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {employeeData.dateJoined}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-450 uppercase tracking-wider mb-1">Base Salary Structure</p>
                    <p className="font-medium text-gray-900">${employeeData.salary} / month</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-450 uppercase tracking-wider mb-1">Reporting Manager</p>
                    <p className="font-medium text-gray-900">{employeeData.manager}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-450 uppercase tracking-wider mb-1">Work Shift Rotation</p>
                    <p className="font-medium text-gray-900">{employeeData.shift}</p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                {/* Add Note Form */}
                <Card>
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Add HR Note
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Write a timestamped record about this employee (e.g. compliance updates, promotion remarks)..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" className="flex items-center gap-1.5">
                        <Plus className="h-4 w-4" />
                        Add Note
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Notes List */}
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <div className="flex items-center justify-between text-xs text-gray-450 mb-2">
                        <span className="font-semibold text-gray-700">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{note.content}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
