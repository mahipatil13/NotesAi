import { Department, LibrarySubject, LibraryNote } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'Algorithms, Data Structures, Operating Systems, Networks, and AI.',
    icon: 'Cpu',
    color: 'from-blue-600 to-indigo-600',
    totalNotes: 0,
  },
  {
    id: 'ece',
    name: 'Electronics & Communication',
    code: 'ECE',
    description: 'Semiconductors, Signal Processing, Microcontrollers, and VLSI.',
    icon: 'Radio',
    color: 'from-purple-600 to-pink-600',
    totalNotes: 0,
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'Thermodynamics, Fluid Dynamics, Mechanics of Materials, and CAD.',
    icon: 'Cog',
    color: 'from-amber-600 to-orange-600',
    totalNotes: 0,
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    code: 'CIVIL',
    description: 'Structural Analysis, Concrete Technology, Geotechnical Engineering.',
    icon: 'HardHat',
    color: 'from-emerald-600 to-teal-600',
    totalNotes: 0,
  },
  {
    id: 'it',
    name: 'Information Technology',
    code: 'IT',
    description: 'Cloud Computing, Cybersecurity, Web Architectures, and Database Systems.',
    icon: 'Server',
    color: 'from-cyan-600 to-blue-600',
    totalNotes: 0,
  },
];

export const INITIAL_SUBJECTS: LibrarySubject[] = [
  // CSE Sem 3
  {
    id: 'cse-s3-dsa',
    departmentId: 'cse',
    semesterNumber: 3,
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    description: 'Linear & Non-linear data structures, trees, graphs, sorting, and complexity analysis.',
    totalNotes: 0,
  },
  {
    id: 'cse-s3-oop',
    departmentId: 'cse',
    semesterNumber: 3,
    name: 'Object-Oriented Programming (C++/Java)',
    code: 'CS302',
    description: 'Encapsulation, inheritance, polymorphism, templates, and exception handling.',
    totalNotes: 0,
  },
  {
    id: 'cse-s3-dld',
    departmentId: 'cse',
    semesterNumber: 3,
    name: 'Digital Logic & Computer Design',
    code: 'CS303',
    description: 'Boolean algebra, logic gates, combinational and sequential circuit design.',
    totalNotes: 0,
  },
  {
    id: 'cse-s3-dm',
    departmentId: 'cse',
    semesterNumber: 3,
    name: 'Discrete Mathematics',
    code: 'CS304',
    description: 'Sets, relations, graph theory, propositional logic, and combinatorics.',
    totalNotes: 0,
  },
  // CSE Sem 5
  {
    id: 'cse-s5-os',
    departmentId: 'cse',
    semesterNumber: 5,
    name: 'Operating Systems',
    code: 'CS501',
    description: 'Process management, concurrency, deadlocks, memory management, and file systems.',
    totalNotes: 0,
  },
  {
    id: 'cse-s5-dbms',
    departmentId: 'cse',
    semesterNumber: 5,
    name: 'Database Management Systems',
    code: 'CS502',
    description: 'Relational algebra, SQL, normalization (1NF-BCNF), ACID properties, and transactions.',
    totalNotes: 0,
  },
  // ECE Sem 2
  {
    id: 'ece-s2-semi',
    departmentId: 'ece',
    semesterNumber: 2,
    name: 'Semiconductor Physics & Devices',
    code: 'EC201',
    description: 'PN junction diode, BJT, MOSFET, forward/reverse bias, and band diagrams.',
    totalNotes: 0,
  },
  // MECH Sem 2
  {
    id: 'mech-s2-thermo',
    departmentId: 'mech',
    semesterNumber: 2,
    name: 'Engineering Thermodynamics',
    code: 'ME201',
    description: 'First and second laws of thermodynamics, Carnot cycle, entropy, and heat engines.',
    totalNotes: 0,
  },
];

// No fake/demo notes — community notes are populated from Supabase only
export const INITIAL_NOTES: LibraryNote[] = [];

// No fake study groups — groups are created by real users only
export const INITIAL_STUDY_GROUPS: import('./types').StudyGroup[] = [];
