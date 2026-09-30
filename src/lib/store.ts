'use client';

import { useState, useEffect } from 'react';
import { 
  Department, 
  LibrarySubject, 
  LibraryNote, 
  PersonalSubject, 
  PersonalDocument, 
  ChatMessage, 
  ExamPack,
  StudyGroup,
  GroupMember,
  GroupDiscussionMessage,
  User,
  TodoItem,
  UserStreak
} from './types';
import { 
  INITIAL_DEPARTMENTS, 
  INITIAL_SUBJECTS, 
  INITIAL_NOTES, 
  INITIAL_STUDY_GROUPS 
} from './mockData';
import { deletePdfBlob } from './pdfStorage';
import { 
  fetchNotesFromSupabase, 
  saveNoteToSupabase, 
  updateNoteStatusInSupabase, 
  deleteNoteFromSupabase, 
  subscribeToSupabaseNotes 
} from './supabaseSync';

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  USER: 'smart_study_user',
  TODOS: 'smart_study_todos',
  STREAK: 'smart_study_streak',
  DEPARTMENTS: 'smart_study_departments',
  SUBJECTS: 'smart_study_subjects',
  NOTES: 'smart_study_notes',
  PERSONAL_SUBJECTS: 'smart_study_personal_subjects',
  PERSONAL_DOCS: 'smart_study_personal_docs',
  CHAT_MESSAGES: 'smart_study_chat_messages',
  STUDY_GROUPS: 'smart_study_groups',
  USAGE: 'smart_study_usage',
};

export const SUPERADMIN_EMAILS = [
  'mahipatil13@gmail.com',
  'mahesh@college.edu',
  'maheshpatil13@gmail.com',
];

export function isSuperadminEmail(email?: string): boolean {
  if (!email) return false;
  return SUPERADMIN_EMAILS.some((e) => e.toLowerCase() === email.trim().toLowerCase());
}

const DEFAULT_USER: User = {
  id: '',
  name: 'Guest User',
  email: '',
  role: 'student',
  isLoggedIn: false,
};


const DEFAULT_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    title: 'Revise PN Junction V-I Characteristics & Barrier Potential',
    subject: 'Semiconductor Physics',
    priority: 'High',
    dueDate: 'Today, 8:00 PM',
    completed: false,
    createdAt: '2026-09-30',
  },
  {
    id: 'todo-2',
    title: 'Practice 10-Mark Stack & Queue Implementation Questions',
    subject: 'Data Structures',
    priority: 'High',
    dueDate: 'Tomorrow',
    completed: false,
    createdAt: '2026-09-30',
  },
  {
    id: 'todo-3',
    title: 'Review Unit 1 Definitions & Formulas for Quiz',
    subject: 'Semiconductor Physics',
    priority: 'Medium',
    dueDate: 'Oct 2',
    completed: true,
    createdAt: '2026-09-29',
  },
];

const DEFAULT_STREAK: UserStreak = {
  currentStreak: 5,
  longestStreak: 12,
  lastActiveDate: '2026-09-30',
  history: ['2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'],
};

const DEFAULT_PERSONAL_SUBJECTS: PersonalSubject[] = [
  {
    id: 'ps-1',
    name: 'Semiconductor Physics',
    semester: 2,
    course: 'B.Tech ECE',
    description: 'Diodes, Transistors, and biasing circuits',
    noteCount: 2,
    createdAt: '2026-09-20',
  },
  {
    id: 'ps-2',
    name: 'Data Structures',
    semester: 3,
    course: 'B.Tech CSE',
    description: 'Stacks, Queues, Trees, Graphs, Sorting algorithms',
    noteCount: 1,
    createdAt: '2026-09-22',
  },
];

const DEFAULT_PERSONAL_DOCS: PersonalDocument[] = [
  {
    id: 'pdoc-1',
    subjectId: 'ps-1',
    name: 'Unit 3 — PN Junction Diodes.pdf',
    fileSize: '2.4 MB',
    pages: 28,
    status: 'COMPLETED',
    uploadedAt: 'Yesterday',
    uploaderId: 'usr-student',
    uploaderName: 'Student',
    examPack: INITIAL_NOTES[0].examPack,
  },
  {
    id: 'pdoc-2',
    subjectId: 'ps-2',
    name: 'Unit 1 — Stacks and Queues.pdf',
    fileSize: '3.1 MB',
    pages: 36,
    status: 'COMPLETED',
    uploadedAt: '3 days ago',
    uploaderId: 'usr-student',
    uploaderName: 'Student',
    examPack: INITIAL_NOTES[1].examPack,
  },
];

const DEFAULT_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-1',
    role: 'assistant',
    content: 'Hello! I am your Smart Study AI assistant. I have indexed your notes from **Unit 3 — PN Junction Diodes** and **Data Structures**. Ask me anything, or toggle the "Teach Me" mode to adjust explanation depth!',
    timestamp: 'Just now',
  },
];


export function useSmartStudyStore() {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [todos, setTodos] = useState<TodoItem[]>(DEFAULT_TODOS);
  const [streak, setStreak] = useState<UserStreak>(DEFAULT_STREAK);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [subjects, setSubjects] = useState<LibrarySubject[]>(INITIAL_SUBJECTS);
  const [notes, setNotes] = useState<LibraryNote[]>(INITIAL_NOTES);
  const [personalSubjects, setPersonalSubjects] = useState<PersonalSubject[]>(DEFAULT_PERSONAL_SUBJECTS);
  const [personalDocs, setPersonalDocs] = useState<PersonalDocument[]>(DEFAULT_PERSONAL_DOCS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(DEFAULT_CHAT_MESSAGES);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(INITIAL_STUDY_GROUPS);
  const [usage, setUsage] = useState({ docsCount: 2, maxDocs: 3, aiCount: 4, maxAi: 5, plan: 'Free Plan' });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedTodos = localStorage.getItem(STORAGE_KEYS.TODOS);
      if (storedTodos) setTodos(JSON.parse(storedTodos));

      const storedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (storedStreak) setStreak(JSON.parse(storedStreak));

      const storedDepts = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      if (storedDepts) setDepartments(JSON.parse(storedDepts));

      const storedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (storedSubjects) setSubjects(JSON.parse(storedSubjects));

      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (storedNotes) setNotes(JSON.parse(storedNotes));

      const storedPersonalSubjects = localStorage.getItem(STORAGE_KEYS.PERSONAL_SUBJECTS);
      if (storedPersonalSubjects) setPersonalSubjects(JSON.parse(storedPersonalSubjects));

      const storedPersonalDocs = localStorage.getItem(STORAGE_KEYS.PERSONAL_DOCS);
      if (storedPersonalDocs) setPersonalDocs(JSON.parse(storedPersonalDocs));

      const storedChat = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (storedChat) setChatMessages(JSON.parse(storedChat));

      const storedGroups = localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS);
      if (storedGroups) setStudyGroups(JSON.parse(storedGroups));

      const storedUsage = localStorage.getItem(STORAGE_KEYS.USAGE);
      if (storedUsage) setUsage(JSON.parse(storedUsage));
    } catch (e) {
      console.error('Error loading stored Smart Study state', e);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  const saveUser = (updated: User) => {
    setUser(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  };

  const saveTodos = (updated: TodoItem[]) => {
    setTodos(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(updated));
  };

  const saveStreak = (updated: UserStreak) => {
    setStreak(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
  };

  const saveDepartments = (updated: Department[]) => {
    setDepartments(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(updated));
  };

  const saveSubjects = (updated: LibrarySubject[]) => {
    setSubjects(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(updated));
  };

  const saveNotes = (updated: LibraryNote[]) => {
    setNotes(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
  };

  const savePersonalSubjects = (updated: PersonalSubject[]) => {
    setPersonalSubjects(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.PERSONAL_SUBJECTS, JSON.stringify(updated));
  };

  const savePersonalDocs = (updated: PersonalDocument[]) => {
    setPersonalDocs(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.PERSONAL_DOCS, JSON.stringify(updated));
  };

  const saveChat = (updated: ChatMessage[]) => {
    setChatMessages(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(updated));
  };

  const saveStudyGroups = (updated: StudyGroup[]) => {
    setStudyGroups(updated);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(updated));
  };

  const incrementUsage = (type: 'docs' | 'ai') => {
    setUsage((prev) => {
      const next = {
        ...prev,
        docsCount: type === 'docs' ? prev.docsCount + 1 : prev.docsCount,
        aiCount: type === 'ai' ? prev.aiCount + 1 : prev.aiCount,
      };
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(next));
      return next;
    });
  };

  // Sync state with Supabase Cloud Database & listen for real-time multi-user changes
  useEffect(() => {
    let isMounted = true;

    async function loadSupabaseNotes() {
      const remoteNotes = await fetchNotesFromSupabase();
      if (remoteNotes && remoteNotes.length > 0 && isMounted) {
        setNotes((prevLocalNotes) => {
          const map = new Map<string, LibraryNote>();
          remoteNotes.forEach((n) => map.set(n.id, n));
          prevLocalNotes.forEach((n) => {
            if (!map.has(n.id)) map.set(n.id, n);
          });
          const merged = Array.from(map.values());
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(merged));
          }
          return merged;
        });
      }
    }

    loadSupabaseNotes();

    // Subscribe to real-time changes across all active sessions
    const unsubscribe = subscribeToSupabaseNotes(() => {
      loadSupabaseNotes();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Supabase Auth session listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.full_name || userEmail.split('@')[0] || 'Student';
          const role = isSuperadminEmail(userEmail) ? 'superadmin' : 'student';
          const u: User = {
            id: session.user.id,
            name: userName,
            email: userEmail,
            role,
            isLoggedIn: true,
          };
          saveUser(u);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.full_name || userEmail.split('@')[0] || 'Student';
          const role = isSuperadminEmail(userEmail) ? 'superadmin' : 'student';
          const u: User = {
            id: session.user.id,
            name: userName,
            email: userEmail,
            role,
            isLoggedIn: true,
          };
          saveUser(u);
        } else {
          // If no local custom session exists, reset to logged-out guest
          const stored = localStorage.getItem(STORAGE_KEYS.USER);
          if (!stored || JSON.parse(stored).email === '') {
            setUser(DEFAULT_USER);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Auth actions
  const loginUser = (email: string, name?: string, role?: 'student' | 'superadmin') => {
    const userRole = role || (isSuperadminEmail(email) ? 'superadmin' : 'student');
    const userName = name || (email.split('@')[0] ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'Student');
    const updated: User = {
      id: `usr-${Date.now()}`,
      name: userName,
      email,
      role: userRole,
      isLoggedIn: true,
    };
    saveUser(updated);
    return updated;
  };

  const logoutUser = () => {
    if (isSupabaseConfigured()) {
      try {
        supabase.auth.signOut();
      } catch (e) {
        console.error('Error signing out of Supabase', e);
      }
    }
    const updated: User = {
      id: '',
      name: 'Guest User',
      email: '',
      role: 'student',
      isLoggedIn: false,
    };
    saveUser(updated);
  };

  const switchUserRole = (newRole: 'student' | 'superadmin') => {
    const updated = { ...user, role: newRole };
    saveUser(updated);
  };

  // Todo actions
  const addTodo = (todo: { title: string; subject?: string; priority?: 'High' | 'Medium' | 'Low'; dueDate?: string }) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      title: todo.title,
      subject: todo.subject || 'General Study',
      priority: todo.priority || 'Medium',
      dueDate: todo.dueDate || 'Today',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveTodos([newTodo, ...todos]);
    return newTodo;
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    saveTodos(updated);
  };

  // Streak actions
  const checkInStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    if (streak.lastActiveDate === today) {
      return { alreadyChecked: true, streak };
    }
    const nextStreak = streak.currentStreak + 1;
    const updated: UserStreak = {
      currentStreak: nextStreak,
      longestStreak: Math.max(nextStreak, streak.longestStreak),
      lastActiveDate: today,
      history: [...streak.history, today],
    };
    saveStreak(updated);
    return { alreadyChecked: false, streak: updated };
  };

  // Helper actions
  const addLibraryNote = (newNote: Omit<LibraryNote, 'id' | 'downloads' | 'views' | 'rating' | 'uploadedAt'> & { id?: string }) => {
    const fullNote: LibraryNote = {
      ...newNote,
      id: newNote.id || `note-${Date.now()}`,
      uploaderId: newNote.uploaderId || user.id,
      uploaderName: newNote.uploaderName || user.name,
      uploaderEmail: newNote.uploaderEmail || user.email,
      // If inside a private group, it is auto-approved. Otherwise public uploads start as PENDING.
      status: newNote.isPrivateGroup ? 'APPROVED' : (newNote.status || 'PENDING'),
      downloads: 0,
      views: 1,
      rating: 5.0,
      uploadedAt: 'Just now',
    };
    saveNotes([fullNote, ...notes]);
    saveNoteToSupabase(fullNote); // Async push to Supabase Cloud PostgreSQL
    return fullNote;
  };

  // Superadmin Moderation Actions
  const approveLibraryNote = (noteId: string) => {
    const updated = notes.map((n) => (n.id === noteId ? { ...n, status: 'APPROVED' as const } : n));
    saveNotes(updated);
    updateNoteStatusInSupabase(noteId, 'APPROVED'); // Async sync to Supabase Cloud
  };

  const rejectLibraryNote = (noteId: string, reason = 'Did not meet quality standards') => {
    const updated = notes.map((n) => (n.id === noteId ? { ...n, status: 'REJECTED' as const, rejectionReason: reason } : n));
    saveNotes(updated);
    updateNoteStatusInSupabase(noteId, 'REJECTED', reason); // Async sync to Supabase Cloud
  };

  // Owner-Only / Superadmin Delete Action
  const deleteLibraryNote = async (noteId: string, requestedBy?: User) => {
    const target = notes.find((n) => n.id === noteId);
    if (!target) return { success: false, message: 'Note not found' };

    const actor = requestedBy || user;
    const isSuperAdmin = actor.role === 'superadmin';
    const isUploader = 
      (target.uploaderId && target.uploaderId === actor.id) ||
      (target.uploaderName && target.uploaderName.toLowerCase() === actor.name.toLowerCase());

    if (!isSuperAdmin && !isUploader) {
      return { 
        success: false, 
        message: 'Permission denied: Only the original uploader or a Superadmin can delete this PDF.' 
      };
    }

    // Remove from notes
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    saveNotes(updatedNotes);
    deleteNoteFromSupabase(noteId); // Async delete from Supabase Cloud

    // Remove from any study group shared notes
    const updatedGroups = studyGroups.map((g) => ({
      ...g,
      sharedNotes: g.sharedNotes.filter((n) => n.id !== noteId)
    }));
    saveStudyGroups(updatedGroups);

    // Clean up IndexedDB & server disk
    try {
      await deletePdfBlob(noteId);
      await fetch(`/api/documents/${noteId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Error clearing document file cache:', e);
    }

    return { success: true, message: 'Document deleted successfully' };
  };

  const deletePersonalDoc = async (docId: string, requestedBy?: User) => {
    const target = personalDocs.find((d) => d.id === docId);
    if (!target) return { success: false, message: 'Document not found' };

    const actor = requestedBy || user;
    const isSuperAdmin = actor.role === 'superadmin';
    const isUploader = !target.uploaderId || target.uploaderId === actor.id || (target.uploaderName && target.uploaderName.toLowerCase() === actor.name.toLowerCase());

    if (!isSuperAdmin && !isUploader) {
      return { 
        success: false, 
        message: 'Permission denied: Only the uploader or a Superadmin can delete this PDF.' 
      };
    }

    const updated = personalDocs.filter((d) => d.id !== docId);
    savePersonalDocs(updated);

    try {
      await deletePdfBlob(docId);
      await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Error clearing document file cache:', e);
    }

    return { success: true };
  };

  const addPersonalSubject = (data: { name: string; semester: number; course: string; description?: string }) => {
    const newSubject: PersonalSubject = {
      id: `ps-${Date.now()}`,
      ...data,
      noteCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    savePersonalSubjects([...personalSubjects, newSubject]);
    return newSubject;
  };

  const deletePersonalSubject = (id: string) => {
    savePersonalSubjects(personalSubjects.filter((s) => s.id !== id));
    savePersonalDocs(personalDocs.filter((d) => d.subjectId !== id));
  };

  const addPersonalDoc = (
    subjectId: string, 
    name: string, 
    fileSize: string, 
    pages: number, 
    examPack?: ExamPack,
    fileUrl?: string,
    extractedText?: string,
    customId?: string
  ) => {
    const newDoc: PersonalDocument = {
      id: customId || `pdoc-${Date.now()}`,
      subjectId,
      name,
      fileSize,
      pages,
      status: 'COMPLETED',
      uploadedAt: 'Just now',
      uploaderId: user.id,
      uploaderName: user.name,
      fileUrl,
      extractedText,
      examPack,
    };
    savePersonalDocs([newDoc, ...personalDocs]);
    incrementUsage('docs');
    return newDoc;
  };

  const addDepartment = (data: { name: string; code: string; description?: string }) => {
    const newDept: Department = {
      id: data.code.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: data.name,
      code: data.code.toUpperCase(),
      description: data.description || `${data.name} department syllabus and notes.`,
      icon: 'BookOpen',
      color: 'from-indigo-500 to-blue-600',
      totalNotes: 0,
    };
    saveDepartments([...departments, newDept]);
    return newDept;
  };

  const addSubject = (data: { departmentId: string; semesterNumber: number; name: string; code: string; description?: string }) => {
    const newSub: LibrarySubject = {
      id: `sub-${Date.now()}`,
      departmentId: data.departmentId,
      semesterNumber: data.semesterNumber,
      name: data.name,
      code: data.code.toUpperCase(),
      description: data.description || `${data.name} university exam preparation materials.`,
      totalNotes: 0,
    };
    saveSubjects([...subjects, newSub]);
    return newSub;
  };

  const createStudyGroup = (data: {
    name: string;
    description: string;
    departmentCode: string;
    semesterNumber: number;
    createdByName?: string;
  }) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      name: data.name,
      description: data.description,
      departmentCode: data.departmentCode,
      semesterNumber: data.semesterNumber,
      inviteCode: code,
      isPrivate: true,
      createdByName: data.createdByName || user.name,
      createdAt: new Date().toISOString().split('T')[0],
      members: [
        {
          id: user.id,
          name: data.createdByName || user.name,
          email: user.email,
          role: 'Admin',
          joinedAt: 'Today',
          avatarColor: 'bg-indigo-600',
        },
      ],
      sharedNotes: [],
      discussion: [
        {
          id: `msg-${Date.now()}`,
          senderName: data.createdByName || user.name,
          senderId: user.id,
          role: 'Admin',
          text: `Welcome to ${data.name}! Share your invite code "${code}" with your classmates to study together.`,
          timestamp: 'Just now',
        },
      ],
    };
    saveStudyGroups([newGroup, ...studyGroups]);
    return newGroup;
  };

  const joinStudyGroup = (inviteCode: string, groupUser?: { name: string; email: string }) => {
    const trimmed = inviteCode.trim().toUpperCase();
    const group = studyGroups.find((g) => g.inviteCode === trimmed);
    if (!group) {
      return { success: false, message: 'Invalid invite code. Please check with your group admin.' };
    }

    const userName = groupUser?.name || user.name;
    const userEmail = groupUser?.email || user.email;

    if (group.members.some((m) => m.name === userName || m.email === userEmail)) {
      return { success: true, group, message: 'You are already a member of this study group.' };
    }

    const updatedGroup: StudyGroup = {
      ...group,
      members: [
        ...group.members,
        {
          id: `usr-${Date.now()}`,
          name: userName,
          email: userEmail,
          role: 'Member',
          joinedAt: 'Today',
          avatarColor: 'bg-emerald-600',
        },
      ],
      discussion: [
        ...group.discussion,
        {
          id: `msg-${Date.now()}`,
          senderName: 'System',
          senderId: 'sys',
          role: 'Member',
          text: `${userName} joined the study group using invite code.`,
          timestamp: 'Just now',
        },
      ],
    };

    saveStudyGroups(studyGroups.map((g) => (g.id === group.id ? updatedGroup : g)));
    return { success: true, group: updatedGroup, message: `Successfully joined ${group.name}!` };
  };

  const addGroupNote = (groupId: string, note: LibraryNote) => {
    const groupNote: LibraryNote = {
      ...note,
      isPrivateGroup: true,
      groupId,
      status: 'APPROVED', // Private group notes are auto-approved
      uploaderId: user.id,
      uploaderName: user.name,
    };
    saveStudyGroups(
      studyGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          sharedNotes: [groupNote, ...g.sharedNotes],
        };
      })
    );
  };

  const addGroupMessage = (groupId: string, text: string, senderName = user.name, role: 'Admin' | 'Member' = 'Member') => {
    saveStudyGroups(
      studyGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          discussion: [
            ...g.discussion,
            {
              id: `msg-${Date.now()}`,
              senderName,
              senderId: user.id,
              role,
              text,
              timestamp: 'Just now',
            },
          ],
        };
      })
    );
  };

  return {
    user,
    todos,
    streak,
    departments,
    subjects,
    notes,
    personalSubjects,
    personalDocs,
    chatMessages,
    studyGroups,
    usage,
    isLoaded,
    loginUser,
    logoutUser,
    switchUserRole,
    addTodo,
    toggleTodo,
    deleteTodo,
    checkInStreak,
    saveDepartments,
    addDepartment,
    saveSubjects,
    addSubject,
    saveNotes,
    addLibraryNote,
    approveLibraryNote,
    rejectLibraryNote,
    deleteLibraryNote,
    deletePersonalDoc,
    addPersonalSubject,
    deletePersonalSubject,
    addPersonalDoc,
    savePersonalDocs,
    saveChat,
    saveStudyGroups,
    createStudyGroup,
    joinStudyGroup,
    addGroupNote,
    addGroupMessage,
    incrementUsage,
  };
}

