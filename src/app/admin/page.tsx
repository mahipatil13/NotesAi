'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSmartStudyStore } from '@/lib/store';
import { LibraryNote, PersonalDocument } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ShieldAlert,
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  FileText, 
  Search, 
  Filter, 
  Lock, 
  Globe, 
  Clock, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  User,
  BookOpen
} from 'lucide-react';

export default function SuperadminPage() {
  const router = useRouter();
  const { 
    user, 
    notes, 
    studyGroups, 
    approveLibraryNote, 
    rejectLibraryNote, 
    deleteLibraryNote,
    switchUserRole 
  } = useSmartStudyStore();

  const isAuthorizedSuperadmin = user.isLoggedIn && user.role === 'superadmin';

  useEffect(() => {
    if (!isAuthorizedSuperadmin) {
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAuthorizedSuperadmin, router]);

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'private' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<LibraryNote | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Rejection modal state
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectingNoteId, setRejectingNoteId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Does not meet syllabus guidelines or duplicate document');

  if (!isAuthorizedSuperadmin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 text-rose-600">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 mb-2">
              Access Restricted
            </span>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Superadmin Access Required</h1>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              This console is restricted to Superadmin accounts. Your current session ({user.isLoggedIn ? user.name : 'Not Signed In'} &bull; {user.isLoggedIn ? user.role : 'Visitor'}) does not have moderation permissions.
            </p>
            <div className="flex flex-col gap-2">
              {!user.isLoggedIn ? (
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Sign In to Superadmin Account
                </button>
              ) : (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Return to Dashboard
                </button>
              )}
              <p className="text-[11px] text-slate-400">Redirecting automatically...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  // Collect all notes including private study group notes
  const allGroupNotes = studyGroups.flatMap((g) => 
    g.sharedNotes.map((n) => ({ ...n, isPrivateGroup: true, groupId: g.id, groupName: g.name }))
  );

  // Combine library notes with group notes
  const allCombinedDocs = [
    ...notes,
    ...allGroupNotes.filter((gn) => !notes.some((n) => n.id === gn.id))
  ];

  // Filtering
  const filteredNotes = allCombinedDocs.filter((note) => {
    // Tab filter
    if (activeTab === 'pending' && (note.status !== 'PENDING' || note.isPrivateGroup)) return false;
    if (activeTab === 'approved' && (note.status !== 'APPROVED' || note.isPrivateGroup)) return false;
    if (activeTab === 'private' && !note.isPrivateGroup) return false;
    if (activeTab === 'rejected' && note.status !== 'REJECTED') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchUploader = (note.uploaderName || '').toLowerCase().includes(q);
      const matchDept = (note.departmentId || '').toLowerCase().includes(q);
      return matchTitle || matchUploader || matchDept;
    }

    return true;
  });

  // Metric counts
  const pendingCount = notes.filter((n) => n.status === 'PENDING' && !n.isPrivateGroup).length;
  const approvedCount = notes.filter((n) => n.status === 'APPROVED' && !n.isPrivateGroup).length;
  const privateCount = allGroupNotes.length;
  const rejectedCount = notes.filter((n) => n.status === 'REJECTED').length;

  const handleApprove = (noteId: string, title: string) => {
    approveLibraryNote(noteId);
    setActionFeedback({
      message: `✅ "${title}" has been approved and pushed to the public server! Everyone can now view it in Community Library.`,
      type: 'success'
    });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleOpenReject = (noteId: string) => {
    setRejectingNoteId(noteId);
    setIsRejectOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectingNoteId) return;
    rejectLibraryNote(rejectingNoteId, rejectReason);
    setIsRejectOpen(false);
    setRejectingNoteId(null);
    setActionFeedback({
      message: `Document rejected with reason: "${rejectReason}"`,
      type: 'error'
    });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleDelete = async (noteId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" permanently from the server?`)) return;
    const res = await deleteLibraryNote(noteId, user);
    if (res.success) {
      setActionFeedback({
        message: `🗑️ "${title}" permanently removed from server storage.`,
        type: 'success'
      });
      if (selectedNote?.id === noteId) setSelectedNote(null);
    } else {
      setActionFeedback({
        message: res.message || 'Failed to delete note',
        type: 'error'
      });
    }
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        
        {/* Superadmin Header Banner */}
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Superadmin Moderation Control</span>
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-300">Logged in as {user.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              PDF Moderation & Server Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              All community-submitted notes must be approved before being pushed to the public server. Private study group documents are exempt and shared directly within circles.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user.role !== 'superadmin' ? (
              <button
                onClick={() => switchUserRole('superadmin')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors"
              >
                Switch to Superadmin Role
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" />
                  <span>Admin Access Active</span>
                </span>
                <Link
                  href="/library"
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                >
                  View Public Library
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Action feedback banner */}
        {actionFeedback && (
          <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between animate-in fade-in ${
            actionFeedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span>{actionFeedback.message}</span>
            <button onClick={() => setActionFeedback(null)} className="opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`text-left p-4 rounded-xl border transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-amber-700 mb-1">
              <span>Pending Review</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Requires approval</div>
          </button>

          <button 
            onClick={() => setActiveTab('approved')}
            className={`text-left p-4 rounded-xl border transition-all ${
              activeTab === 'approved'
                ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 mb-1">
              <span>Live on Server</span>
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{approvedCount}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Public in Library</div>
          </button>

          <button 
            onClick={() => setActiveTab('private')}
            className={`text-left p-4 rounded-xl border transition-all ${
              activeTab === 'private'
                ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-700 mb-1">
              <span>Private Group PDFs</span>
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{privateCount}</div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1">Auto-approved</div>
          </button>

          <button 
            onClick={() => setActiveTab('rejected')}
            className={`text-left p-4 rounded-xl border transition-all ${
              activeTab === 'rejected'
                ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-rose-700 mb-1">
              <span>Rejected</span>
              <XCircle className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{rejectedCount}</div>
            <div className="text-[11px] text-rose-600 font-medium mt-1">Held back from server</div>
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['pending', 'approved', 'private', 'rejected', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab === 'private' ? 'Private Group Notes (Auto-Approved)' : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search note or uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Document Moderation Queue ({filteredNotes.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Rule: Superadmin approval pushes to live server · Owner-only deletion
            </span>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">No documents in this queue</h4>
              <p className="text-xs text-slate-500">All submissions in this category have been processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotes.map((note) => {
                const isGroupDoc = note.isPrivateGroup;
                const isApproved = note.status === 'APPROVED';
                const isPending = note.status === 'PENDING';
                const isRejected = note.status === 'REJECTED';

                return (
                  <div 
                    key={note.id}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isGroupDoc ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Private Study Circle (Auto-Approved)</span>
                          </span>
                        ) : isApproved ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Globe className="w-2.5 h-2.5" />
                            <span>Live on Main Server</span>
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Pending Superadmin Review</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-2.5 h-2.5" />
                            <span>Rejected</span>
                          </span>
                        )}

                        <span className="text-[11px] font-semibold text-slate-500 uppercase">
                          {note.departmentId?.toUpperCase()} · Sem {note.semesterNumber}
                        </span>

                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[11px] text-slate-500 font-mono">{note.pages} pages ({note.fileSize})</span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {note.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-1">
                        {note.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>Uploaded by: <strong>{note.uploaderName || 'Student'}</strong></span>
                        </span>
                        <span>·</span>
                        <span>{note.uploadedAt}</span>
                        {note.rejectionReason && (
                          <>
                            <span>·</span>
                            <span className="text-rose-600 font-medium">Reason: {note.rejectionReason}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Superadmin Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                      <Link
                        href={`/notes/${note.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors"
                        title="View & inspect original uploaded document"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>View Original File</span>
                        <ExternalLink className="w-3 h-3 text-indigo-400" />
                      </Link>

                      <button
                        onClick={() => setSelectedNote(note)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inspect & Preview</span>
                      </button>


                      {isPending && (
                        <>
                          <button
                            onClick={() => handleApprove(note.id, note.title)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Push to Server</span>
                          </button>

                          <button
                            onClick={() => handleOpenReject(note.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <Link
                          href={`/notes/${note.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Live Workspace</span>
                        </Link>
                      )}

                      {/* Universal Superadmin Delete */}
                      <button
                        onClick={() => handleDelete(note.id, note.title)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-medium transition-colors"
                        title="Delete from server"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Note Preview & Inspection Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
                  Moderation Preview
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedNote.title}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Uploaded by {selectedNote.uploaderName} · {selectedNote.pages} pages · {selectedNote.fileSize}
                </div>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Original Document Verification Banner */}
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Original Uploaded File Verification</div>
                    <div className="text-[11px] text-slate-500">Inspect the full original PDF or text file before approving</div>
                  </div>
                </div>
                <Link
                  href={`/notes/${selectedNote.id}`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs shrink-0"
                >
                  <span>Open Full Original PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-700 mb-1">Document Description</h4>
                <p className="text-slate-600">{selectedNote.description || 'No description provided.'}</p>
              </div>


              {selectedNote.examPack?.summary && (
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-indigo-900 mb-1">Auto-Extracted AI Summary</h4>
                  <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedNote.examPack.summary}
                  </div>
                </div>
              )}

              {selectedNote.examPack?.keyConcepts && selectedNote.examPack.keyConcepts.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wide text-slate-700 mb-2">Key Concepts ({selectedNote.examPack.keyConcepts.length})</h4>
                  <div className="space-y-2">
                    {selectedNote.examPack.keyConcepts.map((kc, i) => (
                      <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white">
                        <div className="font-bold text-slate-900">{kc.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{kc.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Status: <strong className="uppercase">{selectedNote.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                {selectedNote.status === 'PENDING' && (
                  <button
                    onClick={() => {
                      handleApprove(selectedNote.id, selectedNote.title);
                      setSelectedNote(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Push Live</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedNote(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 text-slate-900 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Reject Document Submission</h3>
            <p className="text-xs text-slate-500">
              Provide a reason for holding this document back from the live server.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsRejectOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
