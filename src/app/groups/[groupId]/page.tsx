'use client';

import React, { useState, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSmartStudyStore } from '@/lib/store';
import { 
  Users, 
  Lock, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  ExternalLink, 
  Send, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  User, 
  KeyRound,
  X,
  MessageSquare
} from 'lucide-react';

import AuthGuard from '@/components/AuthGuard';

export default function GroupWorkspacePage({
  params
}: {
  params: Promise<{ groupId: string }>
}) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.groupId;
  const { user, studyGroups, joinStudyGroup, addGroupMessage, addGroupNote, personalDocs, notes } = useSmartStudyStore();

  const group = studyGroups.find((g) => g.id === groupId);

  const currentUser = user.isLoggedIn
    ? { name: user.name, email: user.email }
    : { name: 'Guest User', email: 'guest@college.edu' };
  const isMember = group?.members.some(
    (m) => m.name === currentUser.name || (currentUser.email && m.email === currentUser.email)
  );


  const [activeTab, setActiveTab] = useState<'notes' | 'discussion' | 'members'>('notes');
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Gate state
  const [unlockCode, setUnlockCode] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Discussion state
  const [messageInput, setMessageInput] = useState('');

  // Share note modal state
  const [isShareNoteOpen, setIsShareNoteOpen] = useState(false);
  const [selectedNoteIdToShare, setSelectedNoteIdToShare] = useState('');

  if (!group) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
          <Navbar />
          <div className="flex-1 max-w-md mx-auto px-4 py-16 text-center">
            <Lock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-900 mb-1">Study Group Not Found</h2>
            <p className="text-xs text-slate-500 mb-4">
              This study group may have been removed or you followed an invalid link.
            </p>
            <Link
              href="/groups"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Study Groups</span>
            </Link>
          </div>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  // Handle invite code gate unlocking
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);

    if (unlockCode.trim().toUpperCase() !== group.inviteCode.toUpperCase()) {
      setUnlockError('Incorrect invite code. Please check with your group admin.');
      return;
    }

    joinStudyGroup(unlockCode.trim(), currentUser);
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    addGroupMessage(group.id, messageInput.trim(), currentUser.name, 'Admin');
    setMessageInput('');
  };

  const handleShareNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNoteIdToShare) return;

    const noteToShare = notes.find((n) => n.id === selectedNoteIdToShare);
    if (noteToShare) {
      addGroupNote(group.id, noteToShare);
    }
    setIsShareNoteOpen(false);
    setSelectedNoteIdToShare('');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
        <Navbar />

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
          
          {/* Back Link */}
          <Link
            href="/groups"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Study Groups</span>
          </Link>

          {/* Access Gate: If not member, show Private Lock Screen */}
          {!isMember ? (
            <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                Private Group
              </span>

              <h2 className="text-xl font-bold text-slate-900 mt-2 mb-1">
                {group.name}
              </h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                This study group is private. Only invited members can view the shared notes, exam packs, and discussion messages.
              </p>

              {unlockError && (
                <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  {unlockError}
                </div>
              )}

              <form onSubmit={handleUnlockSubmit} className="space-y-3.5 text-xs text-left">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Enter Group Invite Code:
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS301X"
                      value={unlockCode}
                      onChange={(e) => setUnlockCode(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 font-mono tracking-widest text-slate-900 uppercase focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  Join Study Group
                </button>
              </form>
            </div>
          ) : (
            /* Member Workspace */
            <div className="space-y-6">
              
              {/* Group Header Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-100">
                        {group.departmentCode} · Semester {group.semesterNumber}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Private · Invite-Only</span>
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {group.name}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  {/* Invite Code Action Button */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                      <span className="text-slate-500 font-medium">Invite Code:</span>
                      <span className="font-mono font-bold text-slate-900">{group.inviteCode}</span>
                      <button
                        onClick={handleCopyInviteCode}
                        className="ml-1 text-slate-400 hover:text-slate-700 p-0.5"
                        title="Copy invite code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedCode && (
                        <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
                      )}
                    </div>

                    <button
                      onClick={() => setIsShareNoteOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Share Note</span>
                    </button>
                  </div>
                </div>

                {/* Group Workspace Navigation Tabs */}
                <div className="flex items-center gap-2 border-t border-slate-100 mt-5 pt-4 text-xs">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'notes'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Shared Notes ({group.sharedNotes.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('discussion')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'discussion'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discussion ({group.discussion.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('members')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'members'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Members ({group.members.length})</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Shared Notes */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Notes & Documents Shared with this Circle</span>
                    </h3>
                    <button
                      onClick={() => setIsShareNoteOpen(true)}
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Share another note</span>
                    </button>
                  </div>

                  {group.sharedNotes.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <h4 className="font-semibold text-sm text-slate-800">No notes shared yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Share unit lecture handouts or personal summaries so everyone in the circle can study together.
                      </p>
                      <button
                        onClick={() => setIsShareNoteOpen(true)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                      >
                        Share First Note
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.sharedNotes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="font-semibold text-indigo-600 text-[11px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                Semester {note.semesterNumber} · {note.pages} pages
                              </span>
                              <span className="text-[11px] text-slate-400">By {note.uploaderName}</span>
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 mb-1 line-clamp-1">
                              {note.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                              {note.description}
                            </p>
                          </div>

                          {/* Actions: Open Original Document & Summarize */}
                          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                            <Link
                              href={`/notes/${note.id}`}
                              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                              <span>Original PDF</span>
                            </Link>

                            <Link
                              href={`/notes/${note.id}?mode=summary`}
                              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Summarize</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Discussion */}
              {activeTab === 'discussion' && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[520px]">
                  {/* Discussion Header */}
                  <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-semibold text-slate-700">Internal Study Board</span>
                    </div>
                    <span>Visible strictly to group members</span>
                  </div>

                  {/* Messages stream */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                    {group.discussion.map((msg) => {
                      const isMe = msg.senderName === currentUser.name;

                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-700">{msg.senderName}</span>
                            {msg.role === 'Admin' && (
                              <span className="text-[9px] px-1 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                                Admin
                              </span>
                            )}
                            <span>·</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div
                            className={`max-w-md p-3 rounded-xl leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input box */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
                    <input
                      type="text"
                      placeholder="Ask a question or post a discussion note..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: Members */}
              {activeTab === 'members' && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900">
                      Group Roster ({group.members.length} Members)
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      Invite Code: {group.inviteCode}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {group.members.map((member) => (
                      <div key={member.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${member.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{member.name}</div>
                            <div className="text-[11px] text-slate-400">{member.email}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Joined {member.joinedAt}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            member.role === 'Admin'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

        {/* Modal: Share Note to Group */}
        {isShareNoteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl text-slate-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-slate-900">Share Note with {group.name}</h3>
                <button onClick={() => setIsShareNoteOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleShareNoteSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Select Document to Share</label>
                  <select
                    required
                    value={selectedNoteIdToShare}
                    onChange={(e) => setSelectedNoteIdToShare(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="">-- Choose a document --</option>
                    {notes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.title} (Sem {n.semesterNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-700">
                  Shared documents are instantly accessible to all members in this private group.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsShareNoteOpen(false)}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                  >
                    Share to Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </AuthGuard>
  );
}
