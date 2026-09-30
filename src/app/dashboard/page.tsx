'use client';

import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { useSmartStudyStore } from '@/lib/store';

import { PersonalDocument } from '@/lib/types';
import Link from 'next/link';
import { 
  Upload, 
  FileText, 
  FolderPlus, 
  Trash2, 
  Sparkles, 
  Plus, 
  X,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  Flame,
  CheckSquare,
  Square,
  Clock,
  Calendar,
  Layers,
  Users,
  Check,
  ShieldCheck
} from 'lucide-react';
import { storePdfBlob } from '@/lib/pdfStorage';

export default function DashboardPage() {
  const { 
    user,
    todos,
    streak,
    personalSubjects, 
    personalDocs, 
    addTodo,
    toggleTodo,
    deleteTodo,
    checkInStreak,
    addPersonalSubject, 
    deletePersonalSubject, 
    addPersonalDoc,
    deletePersonalDoc
  } = useSmartStudyStore();

  // Streak check-in feedback state
  const [streakClaimMessage, setStreakClaimMessage] = useState<string | null>(null);

  // Todo filter & modal state
  const [todoFilter, setTodoFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoSubject, setNewTodoSubject] = useState(personalSubjects[0]?.name || 'General Study');
  const [newTodoPriority, setNewTodoPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTodoDueDate, setNewTodoDueDate] = useState('Today, 8:00 PM');

  // New Subject Modal state
  const [isNewSubjectOpen, setIsNewSubjectOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subSemester, setSubSemester] = useState(3);
  const [subCourse, setSubCourse] = useState('B.Tech CSE');
  const [subDesc, setSubDesc] = useState('');

  // Upload Modal State (clean modal instead of inline clutter)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(personalSubjects[0]?.id || '');
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [docCustomTitle, setDocCustomTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccessDoc, setUploadSuccessDoc] = useState<PersonalDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Streak check-in handler
  const handleCheckInStreak = () => {
    const res = checkInStreak();
    if (res.alreadyChecked) {
      setStreakClaimMessage("You've already claimed today's streak! Come back tomorrow.");
    } else {
      setStreakClaimMessage(`🔥 Streak updated! You are now on a ${res.streak.currentStreak}-day study streak!`);
    }
    setTimeout(() => setStreakClaimMessage(null), 3000);
  };

  // Add todo handler
  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    addTodo({
      title: newTodoTitle.trim(),
      subject: newTodoSubject,
      priority: newTodoPriority,
      dueDate: newTodoDueDate.trim() || 'Today',
    });
    setNewTodoTitle('');
    setIsAddTodoOpen(false);
  };

  // Create subject handler
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    const created = addPersonalSubject({
      name: subName,
      semester: subSemester,
      course: subCourse,
      description: subDesc,
    });
    setSelectedSubjectId(created.id);
    setIsNewSubjectOpen(false);
    setSubName('');
    setSubDesc('');
  };

  // Upload handlers for clean modal
  const stageFileForUpload = (file: File) => {
    const isPdfOrDoc = 
      file.type === 'application/pdf' || 
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.txt') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.md');

    if (!isPdfOrDoc) {
      setUploadError('Please select a PDF document (or .txt, .docx, .md file).');
      return;
    }

    setStagedFile(file);
    setDocCustomTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    setUploadError('');
    setUploadSuccessDoc(null);
  };

  const handleExecuteUpload = async () => {
    if (!stagedFile) return;

    const targetSubId = selectedSubjectId || personalSubjects[0]?.id;
    if (!targetSubId) {
      setUploadError('Please create or select a subject first.');
      return;
    }

    const selectedSub = personalSubjects.find((s) => s.id === targetSubId);
    const assignedDocId = `pdoc-${Date.now()}`;

    setUploadedFileName(stagedFile.name);
    setUploadError('');
    setIsProcessing(true);

    const steps = [
      'Uploading PDF to document repository...',
      'Extracting text & page markers...',
      'Analyzing content & generating AI Exam Pack...',
      'Finalizing study materials and workspace...'
    ];

    let stepIdx = 0;
    setProcessingStep(steps[stepIdx]);
    const stepInterval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1);
      setProcessingStep(steps[stepIdx]);
    }, 1200);

    try {
      await storePdfBlob(assignedDocId, stagedFile);

      const formData = new FormData();
      formData.append('file', stagedFile);
      formData.append('title', docCustomTitle.trim() || stagedFile.name.replace(/\.[^/.]+$/, ''));
      formData.append('department', selectedSub?.course || 'Engineering');
      formData.append('semester', String(selectedSub?.semester || 3));
      formData.append('documentId', assignedDocId);

      const res = await fetch('/api/generate-exam-pack', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (data.success && data.examPack) {
        setIsProcessing(false);
        const finalPages = data.pages || Math.max(1, Math.round(stagedFile.size / 75000));
        const finalTitle = docCustomTitle.trim() || stagedFile.name;
        const fileSizeStr = stagedFile.size > 1024 * 1024 
          ? `${(stagedFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(stagedFile.size / 1024)} KB`;

        const newDoc = addPersonalDoc(
          targetSubId,
          finalTitle,
          fileSizeStr,
          finalPages,
          data.examPack,
          data.fileUrl || `/api/documents/${assignedDocId}`,
          data.previewText || '',
          assignedDocId
        );

        setUploadSuccessDoc(newDoc);
        setStagedFile(null);
        setProcessingStep(`Generated via ${data.source}`);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    }
  };

  const filteredTodos = todos.filter((t) => {
    if (todoFilter === 'pending') return !t.completed;
    if (todoFilter === 'completed') return t.completed;
    return true;
  });

  const completedTodosCount = todos.filter((t) => t.completed).length;

  // Days of week for streak visualizer
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">

      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Academic Workspace
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{streak.currentStreak} Day Streak</span>
              </span>
              {user.role === 'superadmin' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full transition-colors"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  <span>Superadmin Portal</span>
                </Link>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Focus on your semester targets. Track your daily study habits, manage your exam to-do list, and review your subjects.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/library"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Library</span>
            </Link>
            <Link
              href="/groups"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Study Groups</span>
            </Link>
          </div>

        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 block">Enrolled Subjects</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{personalSubjects.length}</div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1">Active courses</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 block">Study Materials</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{personalDocs.length}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Notes indexed</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 block">Current Streak</span>
            <div className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-1">
              <span>{streak.currentStreak}</span>
              <span className="text-xs text-slate-400 font-normal">days</span>
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Best: {streak.longestStreak} days</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 block">Tasks Completed</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {completedTodosCount} <span className="text-xs text-slate-400 font-normal">/ {todos.length}</span>
            </div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1">
              {todos.length > 0 ? Math.round((completedTodosCount / todos.length) * 100) : 0}% progress
            </div>
          </div>
        </div>

        {/* Daily Streak Tracker & Quick Shortcuts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Daily Streak Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Flame className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Daily Study Streak</h3>
                    <p className="text-[11px] text-slate-500">Log activity every day to build momentum</p>
                  </div>
                </div>
              </div>

              {/* Big Streak Display */}
              <div className="my-4 p-4 rounded-xl bg-linear-to-br from-amber-50 via-orange-50 to-white border border-amber-200 text-center">
                <div className="inline-flex items-center justify-center gap-2">
                  <Flame className="w-7 h-7 text-amber-500 fill-amber-500 animate-pulse" />
                  <span className="text-3xl font-extrabold text-amber-900">{streak.currentStreak}</span>
                  <span className="text-sm font-semibold text-amber-800">Days Active</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1 font-medium">
                  {streak.currentStreak >= 7 
                    ? "🌟 Incredible dedication! You've achieved your weekly study badge." 
                    : `🔥 Only ${7 - (streak.currentStreak % 7)} days to your next Consistency Badge!`
                  }
                </p>
              </div>

              {/* Weekly Day Indicators */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[11px] font-semibold text-slate-600 block">Weekly Progress</span>
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {weekDays.map((day, idx) => {
                    const isPastOrToday = idx <= todayDayIndex;
                    const isActive = isPastOrToday && streak.currentStreak > 0;
                    return (
                      <div 
                        key={day}
                        className={`p-1.5 rounded-lg border text-xs transition-all ${
                          isActive
                            ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                            : 'bg-slate-50 border-slate-100 text-slate-400'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-semibold">{day}</div>
                        <div className="mt-1 flex items-center justify-center">
                          {isActive ? (
                            <Check className="w-3 h-3 text-amber-600 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              {streakClaimMessage && (
                <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2 text-center animate-in fade-in">
                  {streakClaimMessage}
                </div>
              )}
              <button
                onClick={handleCheckInStreak}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>Check in for Today</span>
              </button>
            </div>
          </div>

          {/* Study To-Do Table / Planner */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                    <span>Study Goals & To-Do Planner</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Plan out chapters, question practice, and revision targets</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Filter tabs */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                    {(['all', 'pending', 'completed'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setTodoFilter(tab)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                          todoFilter === tab 
                            ? 'bg-white text-slate-900 font-bold shadow-2xs' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsAddTodoOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>

              {/* Task list table */}
              {filteredTodos.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No {todoFilter !== 'all' ? todoFilter : ''} study tasks found</p>
                  <p className="text-[11px] mt-0.5">Click "+ Add Task" to set a study target for today.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                  {filteredTodos.map((todo) => (
                    <div 
                      key={todo.id}
                      className="py-2.5 flex items-center justify-between gap-3 group hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="text-slate-400 hover:text-indigo-600 shrink-0"
                        >
                          {todo.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-medium truncate ${
                            todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}>
                            {todo.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="font-semibold text-indigo-600">{todo.subject}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5 text-slate-400">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{todo.dueDate}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          todo.priority === 'High' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : todo.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {todo.priority}
                        </span>

                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between mt-3">
              <span>{completedTodosCount} of {todos.length} tasks completed</span>
              <button 
                onClick={() => setIsAddTodoOpen(true)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                + New Goal
              </button>
            </div>
          </div>

        </div>

        {/* Subjects Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Your Course Subjects ({personalSubjects.length})</h2>
              <p className="text-xs text-slate-500">Organized curriculum and syllabus units</p>
            </div>
            <button
              onClick={() => setIsNewSubjectOpen(true)}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {personalSubjects.map((sub) => {
              const count = personalDocs.filter((d) => d.subjectId === sub.id).length;
              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Semester {sub.semester}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete subject "${sub.name}"?`)) deletePersonalSubject(sub.id);
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{sub.name}</h3>
                    <div className="text-xs text-slate-500 mt-1">{sub.course}</div>
                    {sub.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{sub.description}</p>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>{count} notes</span>
                    <Link
                      href="/library"
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Browse Library &rarr;
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Add Study Task Modal */}
      {isAddTodoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 text-slate-900">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add Study Target</h3>
              <button
                onClick={() => setIsAddTodoOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTodo} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Task / Topic Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 5 problems on Binary Search Trees"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Subject</label>
                  <select
                    value={newTodoSubject}
                    onChange={(e) => setNewTodoSubject(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {personalSubjects.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="General Study">General Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Priority</label>
                  <select
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Due Target</label>
                <input
                  type="text"
                  placeholder="e.g. Today, 9:00 PM or Oct 2"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTodoOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Subject Modal */}
      {isNewSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 text-slate-900">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Create New Subject</h3>
              <button
                onClick={() => setIsNewSubjectOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Semester</label>
                  <select
                    value={subSemester}
                    onChange={(e) => setSubSemester(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Course</label>
                  <input
                    type="text"
                    value={subCourse}
                    onChange={(e) => setSubCourse(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Topics covered..."
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSubjectOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Notes Modal (Clean on-demand popup) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Upload PDF & Compile Exam Pack</h3>
                  <p className="text-[11px] text-slate-500">Auto-generates summaries, definitions & questions</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setStagedFile(null);
                  setUploadSuccessDoc(null);
                  setUploadError('');
                }}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf,.txt,.docx,.md"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) stageFileForUpload(file);
                e.target.value = '';
              }}
            />

            {isProcessing ? (
              <div className="py-8 px-4 text-center space-y-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div>
                  <h4 className="font-bold text-sm text-indigo-900">{processingStep}</h4>
                  <p className="text-xs text-indigo-600 mt-0.5">Please wait while AI indexes your document...</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-md border border-indigo-100 text-[11px] text-slate-600 font-mono max-w-sm truncate">
                  <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span className="truncate">{uploadedFileName}</span>
                </div>
              </div>
            ) : uploadSuccessDoc ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Upload Successful!</h4>
                    <p className="text-xs text-emerald-700">Exam Pack generated and ready in workspace.</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Link
                    href={`/notes/${uploadSuccessDoc.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                  >
                    <span>Open in Document Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setUploadSuccessDoc(null)}
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-xs hover:bg-slate-50"
                  >
                    Upload Another
                  </button>
                </div>
              </div>
            ) : stagedFile ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 border border-indigo-200">
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">{stagedFile.name}</span>
                  </div>
                  <span className="text-slate-500 shrink-0 font-mono">
                    {(stagedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Notes Title</label>
                  <input
                    type="text"
                    value={docCustomTitle}
                    onChange={(e) => setDocCustomTitle(e.target.value)}
                    placeholder="Enter document title..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assign to Subject</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {personalSubjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} (Sem {s.semester})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStagedFile(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteUpload}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Generate Exam Pack</span>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30 rounded-xl p-8 text-center cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-2 text-indigo-600">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">Click to choose a PDF note</p>
                <p className="text-xs text-slate-400">PDF, Word, or Text notes · up to 25 MB</p>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
    </AuthGuard>
  );

}
