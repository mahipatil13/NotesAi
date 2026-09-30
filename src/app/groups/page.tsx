'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSmartStudyStore } from '@/lib/store';
import { 
  Users, 
  Lock, 
  KeyRound, 
  Plus, 
  FileText, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  Copy,
  Sparkles
} from 'lucide-react';

export default function StudyGroupsPage() {
  const { user, studyGroups, createStudyGroup, joinStudyGroup, departments } = useSmartStudyStore();


  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinStatus, setJoinStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupDept, setNewGroupDept] = useState(departments[0]?.code || 'CSE');
  const [newGroupSem, setNewGroupSem] = useState(3);
  const [newGroupCreator, setNewGroupCreator] = useState(user.name || 'Student');

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    const result = joinStudyGroup(inviteCodeInput.trim(), {
      name: user.name || 'Student',
      email: user.email || 'student@college.edu',
    });

    setJoinStatus(result);
    if (result.success) {
      setTimeout(() => {
        setIsJoinOpen(false);
        setInviteCodeInput('');
        setJoinStatus(null);
      }, 1200);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    createStudyGroup({
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || 'Private study circle for semester exam preparation.',
      departmentCode: newGroupDept,
      semesterNumber: newGroupSem,
      createdByName: newGroupCreator.trim() || user.name || 'Student',
    });

    setIsCreateOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Lock className="w-3 h-3" />
                <span>Invite-Only & Private</span>
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Only invited members can view details & notes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Private Study Groups
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Collaborate exclusively with your squad, share handwritten notes, and discuss university exam questions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsJoinOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Join with Invite Code</span>
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Study Group</span>
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>My Active Groups</span>
              <span className="text-xs font-normal text-slate-500">({studyGroups.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyGroups.map((group) => {
              const isAdmin = group.members.some(m => m.name === 'Mahesh Patil' && m.role === 'Admin');

              return (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Dept, Sem, Private Badge */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-100">
                          {group.departmentCode} · Sem {group.semesterNumber}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Private</span>
                        </span>
                      </div>

                      {isAdmin && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          You are Admin
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                      {group.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {group.description}
                    </p>

                    {/* Quick Stats: Members, Notes, Discussion */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center mb-4">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{group.members.length}</div>
                        <div className="text-[10px] text-slate-500">Members</div>
                      </div>
                      <div className="border-x border-slate-200">
                        <div className="text-xs font-bold text-slate-900">{group.sharedNotes.length}</div>
                        <div className="text-[10px] text-slate-500">Notes</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{group.discussion.length}</div>
                        <div className="text-[10px] text-slate-500">Messages</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Invite Code & Enter Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Invite Code:</span>
                      <button
                        onClick={(e) => handleCopyCode(group.inviteCode, e)}
                        className="inline-flex items-center gap-1 font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-[11px] transition-colors"
                        title="Click to copy invite code"
                      >
                        <span>{group.inviteCode}</span>
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                      {copiedCode === group.inviteCode && (
                        <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:text-indigo-700">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Informational Card */}
        <div className="mt-8 p-5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">How Private Study Groups Work</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Groups are locked by default. Non-members cannot view uploaded documents or discussions without entering your group's private 6-digit invite code.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsJoinOpen(true)}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Have a code? Join
          </button>
        </div>

      </main>

      {/* Modal: Join with Invite Code */}
      {isJoinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Enter Invite Code</h3>
              </div>
              <button onClick={() => setIsJoinOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Ask your study group admin or classmate for their 6-character private invite code (e.g. <strong>CS301X</strong>).
            </p>

            {joinStatus && (
              <div className={`mb-4 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                joinStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {joinStatus.success && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{joinStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleJoinSubmit} className="space-y-4 text-xs">
              <div>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS301X"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-center text-sm font-mono tracking-widest text-slate-900 uppercase focus:outline-none focus:border-indigo-500"
                  maxLength={10}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsJoinOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Unlock Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Study Group */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Create Private Study Group</h3>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE Sem 3 — Algorithms & OS Core"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Department</label>
                  <select
                    value={newGroupDept}
                    onChange={(e) => setNewGroupDept(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.code}>{d.code} — {d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Semester</label>
                  <select
                    value={newGroupSem}
                    onChange={(e) => setNewGroupSem(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Group Description</label>
                <textarea
                  rows={2}
                  placeholder="Syllabus focus, previous year questions, or lab prep..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-600">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-[11px]">A unique private invite code will be generated automatically for this group.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Create Private Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
