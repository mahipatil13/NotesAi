export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'student';
  avatar?: string;
  isLoggedIn: boolean;
}

export interface TodoItem {
  id: string;
  title: string;
  subject?: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  history: string[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  totalNotes: number;
}

export interface LibrarySubject {
  id: string;
  departmentId: string;
  semesterNumber: number;
  name: string;
  code: string;
  description: string;
  totalNotes: number;
}

export interface ExamPack {
  summary: string;
  keyConcepts: { title: string; description: string; importance: 'High' | 'Medium' | 'Critical' }[];
  definitions: { term: string; definition: string; source: string }[];
  oneMarkQuestions: { question: string; answer: string; source: string }[];
  twoMarkQuestions: { question: string; answer: string; keyPoints: string[]; source: string }[];
  tenMarkQuestions: { question: string; answerStructure: string[]; fullExplanation: string; source: string }[];
  mcqs: { id: string; question: string; options: string[]; correctAnswer: number; explanation: string; source: string }[];
  flashcards: { id: string; front: string; back: string; category: string }[];
}

export interface LibraryNote {
  id: string;
  subjectId: string;
  departmentId: string;
  semesterNumber: number;
  title: string;
  description: string;
  uploaderName: string;
  uploaderId?: string;
  uploaderEmail?: string;
  pages: number;
  fileSize: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  rejectionReason?: string;
  isPrivateGroup?: boolean;
  groupId?: string;
  downloads: number;
  views: number;
  rating: number;
  tags: string[];
  uploadedAt: string;
  fileUrl?: string;
  extractedText?: string;
  examPack?: ExamPack;
}

export interface PersonalSubject {
  id: string;
  name: string;
  semester: number;
  course: string;
  description?: string;
  noteCount: number;
  createdAt: string;
}

export interface PersonalDocument {
  id: string;
  subjectId: string;
  name: string;
  fileSize: string;
  pages: number;
  status: 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  uploadedAt: string;
  uploaderId?: string;
  uploaderName?: string;
  fileUrl?: string;
  extractedText?: string;
  examPack?: ExamPack;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
  mode?: 'Beginner' | 'Engineering Student' | 'Exam Answer' | 'Last-Minute Revision';
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  joinedAt: string;
  avatarColor: string;
}

export interface GroupDiscussionMessage {
  id: string;
  senderName: string;
  senderId: string;
  role: 'Admin' | 'Member';
  text: string;
  timestamp: string;
  fileAttachment?: { name: string; size: string };
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  departmentCode: string;
  semesterNumber: number;
  inviteCode: string;
  isPrivate: boolean;
  createdByName: string;
  createdAt: string;
  members: GroupMember[];
  sharedNotes: LibraryNote[];
  discussion: GroupDiscussionMessage[];
}
