import { Department, LibrarySubject, LibraryNote } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'Algorithms, Data Structures, Operating Systems, Networks, and AI.',
    icon: 'Cpu',
    color: 'from-blue-600 to-indigo-600',
    totalNotes: 48,
  },
  {
    id: 'ece',
    name: 'Electronics & Communication',
    code: 'ECE',
    description: 'Semiconductors, Signal Processing, Microcontrollers, and VLSI.',
    icon: 'Radio',
    color: 'from-purple-600 to-pink-600',
    totalNotes: 34,
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'Thermodynamics, Fluid Dynamics, Mechanics of Materials, and CAD.',
    icon: 'Cog',
    color: 'from-amber-600 to-orange-600',
    totalNotes: 29,
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    code: 'CIVIL',
    description: 'Structural Analysis, Concrete Technology, Geotechnical Engineering.',
    icon: 'HardHat',
    color: 'from-emerald-600 to-teal-600',
    totalNotes: 21,
  },
  {
    id: 'it',
    name: 'Information Technology',
    code: 'IT',
    description: 'Cloud Computing, Cybersecurity, Web Architectures, and Database Systems.',
    icon: 'Server',
    color: 'from-cyan-600 to-blue-600',
    totalNotes: 37,
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
    totalNotes: 14,
  },
  {
    id: 'cse-s3-oop',
    departmentId: 'cse',
    semesterNumber: 3,
    name: 'Object-Oriented Programming (C++/Java)',
    code: 'CS302',
    description: 'Encapsulation, inheritance, polymorphism, templates, and exception handling.',
    totalNotes: 9,
  },
  {
    id: 'cse-s3-dld',
    departmentId: 'cse',
    semesterNumber: 3,
    name: 'Digital Logic & Computer Design',
    code: 'CS303',
    description: 'Boolean algebra, logic gates, combinational and sequential circuit design.',
    totalNotes: 8,
  },
  {
    id: 'cse-s3-dm',
    departmentId: 'cse',
    semesterNumber: 3,
    name: 'Discrete Mathematics',
    code: 'CS304',
    description: 'Sets, relations, graph theory, propositional logic, and combinatorics.',
    totalNotes: 7,
  },
  // CSE Sem 5
  {
    id: 'cse-s5-os',
    departmentId: 'cse',
    semesterNumber: 5,
    name: 'Operating Systems',
    code: 'CS501',
    description: 'Process management, concurrency, deadlocks, memory management, and file systems.',
    totalNotes: 12,
  },
  {
    id: 'cse-s5-dbms',
    departmentId: 'cse',
    semesterNumber: 5,
    name: 'Database Management Systems',
    code: 'CS502',
    description: 'Relational algebra, SQL, normalization (1NF-BCNF), ACID properties, and transactions.',
    totalNotes: 11,
  },
  // ECE Sem 2 / 1
  {
    id: 'ece-s2-semi',
    departmentId: 'ece',
    semesterNumber: 2,
    name: 'Semiconductor Physics & Devices',
    code: 'EC201',
    description: 'PN junction diode, BJT, MOSFET, forward/reverse bias, and band diagrams.',
    totalNotes: 16,
  },
  // MECH Sem 2
  {
    id: 'mech-s2-thermo',
    departmentId: 'mech',
    semesterNumber: 2,
    name: 'Engineering Thermodynamics',
    code: 'ME201',
    description: 'First and second laws of thermodynamics, Carnot cycle, entropy, and heat engines.',
    totalNotes: 15,
  },
];

export const INITIAL_NOTES: LibraryNote[] = [
  {
    id: 'note-pn-junction',
    subjectId: 'ece-s2-semi',
    departmentId: 'ece',
    semesterNumber: 2,
    title: 'Unit 3 — PN Junction Diode & V-I Characteristics',
    description: 'Comprehensive college notes covering depletion region formation, barrier potential, biasing, and rectification applications.',
    uploaderName: 'ECE Department',
    pages: 28,

    fileSize: '2.4 MB',
    status: 'APPROVED',
    downloads: 1420,
    views: 4890,
    rating: 4.9,
    tags: ['Semiconductors', 'Diodes', 'Depletion Region', 'Biasing', 'Exam Pack Ready'],
    uploadedAt: '2 days ago',
    examPack: {
      summary: `### PN Junction Diode Overview

A PN junction is formed by intimately joining p-type and n-type semiconductor materials within a single crystal. At the junction, free electrons from the n-side diffuse into the p-side, and holes from the p-side diffuse into the n-side.

#### Key Mechanics:
- **Depletion Region Formation:** Recombination leaves uncompensated positive donor ions on the n-side and negative acceptor ions on the p-side, creating a region void of mobile charge carriers.
- **Barrier Potential ($V_0$):** An internal electric field develops, opposing further diffusion. For Silicon, this barrier is $\\approx 0.7\\text{ V}$, and for Germanium, $\\approx 0.3\\text{ V}$.
- **Forward Biasing:** P-region connected to positive terminal, N-region to negative. The external voltage opposes barrier potential, narrowing the depletion layer and allowing exponential current flow once $V > V_0$.
- **Reverse Biasing:** P-region connected to negative terminal, N-region to positive. Widens the depletion layer, restricting current to a negligible reverse saturation current ($I_0$) until breakdown occurs.`,
      keyConcepts: [
        {
          title: 'Depletion Layer & Barrier Potential',
          description: 'Electric field created by immobile ions that stops spontaneous majority carrier diffusion.',
          importance: 'Critical',
        },
        {
          title: 'Forward vs Reverse Biasing',
          description: 'Mechanism of lowering vs increasing the potential barrier to control current flow.',
          importance: 'Critical',
        },
        {
          title: 'Zener and Avalanche Breakdown',
          description: 'Two distinct breakdown phenomena occurring under strong reverse bias voltages.',
          importance: 'High',
        },
      ],
      definitions: [
        {
          term: 'Doping',
          definition: 'The intentional addition of controlled impurities (trivalent or pentavalent atoms) to an intrinsic semiconductor to modify its electrical conductivity.',
          source: 'Unit 3.pdf, Page 4',
        },
        {
          term: 'Depletion Region',
          definition: 'A narrow region straddling the PN metallurgical junction that has been swept free of mobile charge carriers, populated exclusively by immobile donor and acceptor ions.',
          source: 'Unit 3.pdf, Page 7',
        },
        {
          term: 'Barrier Potential',
          definition: 'The electrostatic potential difference established across the depletion layer that halts further net diffusion of majority carriers across the junction.',
          source: 'Unit 3.pdf, Page 9',
        },
      ],
      oneMarkQuestions: [
        {
          question: 'What is the typical barrier potential for a Silicon PN junction diode at room temperature?',
          answer: 'Approximately 0.7 Volts.',
          source: 'Unit 3.pdf, Page 8',
        },
        {
          question: 'What happens to the width of the depletion region during reverse bias?',
          answer: 'The depletion region widens because majority carriers are pulled away from the junction.',
          source: 'Unit 3.pdf, Page 12',
        },
        {
          question: 'Which charge carriers constitute the reverse saturation current?',
          answer: 'Thermally generated minority carriers.',
          source: 'Unit 3.pdf, Page 14',
        },
      ],
      twoMarkQuestions: [
        {
          question: 'Distinguish between intrinsic and extrinsic semiconductors.',
          answer: 'Intrinsic semiconductors are chemically pure crystals with equal electron and hole densities ($n = p = n_i$). Extrinsic semiconductors are doped with either group-III or group-V atoms to produce either n-type or p-type majority conduction.',
          keyPoints: ['Purity vs Doped', 'Carrier equilibrium', 'Temperature dependency'],
          source: 'Unit 3.pdf, Page 3',
        },
        {
          question: 'Why does a PN junction act as a unidirectional device (rectifier)?',
          answer: 'Under forward bias, the barrier potential is reduced, offering extremely low resistance and allowing high current flow. Under reverse bias, the barrier increases, resulting in virtually infinite resistance and blocking current.',
          keyPoints: ['Low resistance in forward bias', 'High resistance in reverse bias', 'Allows current in one direction only'],
          source: 'Unit 3.pdf, Page 16',
        },
      ],
      tenMarkQuestions: [
        {
          question: 'Explain the complete working and V-I characteristics of a PN junction diode under forward and reverse bias with necessary diagrams.',
          answerStructure: [
            '1. Introduction & Construction of PN Junction',
            '2. Formation of Depletion Layer and Barrier Potential',
            '3. Operation in Forward Bias Condition (with Circuit Diagram)',
            '4. Operation in Reverse Bias Condition (with Circuit Diagram)',
            '5. Detailed V-I Characteristics Curve (Knee Voltage, Breakdown Voltage)',
            '6. Shockley Diode Equation explanation',
            '7. Real-world Engineering Applications (Rectifiers, Clamping, Clipping)',
            '8. Summary Conclusion',
          ],
          fullExplanation: `### Standard University 10-Mark Answer:

**1. Formation & Unbiased State:**
When p-type and n-type silicon are fused, majority electrons diffuse into the p-side leaving fixed positive ions ($N_D^+$), while holes diffuse into n-side leaving fixed negative ions ($N_A^-$). The resulting electric field produces a barrier potential $V_0 = \\frac{kT}{q} \\ln\\left(\\frac{N_A N_D}{n_i^2}\\right)$.

**2. Forward Bias:**
Connecting the positive terminal to p-type and negative to n-type injects carriers that counteract the internal barrier. When $V_{applied} > V_{knee}$ (0.7V for Si), current escalates exponentially according to Shockley equation: $I = I_s \\left(e^{qV/\\eta kT} - 1\\right)$.

**3. Reverse Bias:**
Applying reverse polarity widens the depletion width $W \\propto \\sqrt{V_0 + V_R}$. Only thermally generated minority carriers drift across, yielding nano-ampere leakage until the critical breakdown voltage is breached.`,
          source: 'Unit 3.pdf, Pages 10-18',
        },
      ],
      mcqs: [
        {
          id: 'mcq-1',
          question: 'What is the value of barrier potential for Germanium at 300K?',
          options: ['0.7 V', '0.3 V', '1.1 V', '0.1 V'],
          correctAnswer: 1,
          explanation: 'Germanium has a smaller bandgap (~0.67 eV) and a barrier potential of roughly 0.3 V at room temperature compared to 0.7 V for Silicon.',
          source: 'Unit 3.pdf, Page 9',
        },
        {
          id: 'mcq-2',
          question: 'In forward bias, majority carriers overcome the barrier potential primarily by:',
          options: ['Tunneling', 'Diffusion', 'Drift only', 'Thermionic emission'],
          correctAnswer: 1,
          explanation: 'Forward bias reduces the potential barrier, allowing majority carriers to diffuse in high concentration across the junction.',
          source: 'Unit 3.pdf, Page 11',
        },
        {
          id: 'mcq-3',
          question: 'The reverse saturation current in a silicon diode doubles approximately for every:',
          options: ['10°C rise in temperature', '1°C rise in temperature', '25°C rise in temperature', '50°C rise in temperature'],
          correctAnswer: 0,
          explanation: 'Reverse saturation current is strongly temperature dependent and doubles approximately for every 10°C rise.',
          source: 'Unit 3.pdf, Page 15',
        },
        {
          id: 'mcq-4',
          question: 'Which of the following is commonly used for voltage regulation?',
          options: ['Tunnel Diode', 'Zener Diode', 'Varactor Diode', 'Photodiode'],
          correctAnswer: 1,
          explanation: 'Zener diodes are engineered to operate reliably in their reverse breakdown region, maintaining constant voltage.',
          source: 'Unit 3.pdf, Page 22',
        },
      ],
      flashcards: [
        {
          id: 'fc-1',
          front: 'What is the barrier potential for Silicon vs Germanium?',
          back: 'Silicon: ~0.7 V | Germanium: ~0.3 V at 300K.',
          category: 'Fundamentals',
        },
        {
          id: 'fc-2',
          front: 'What causes the depletion region to form?',
          back: 'Carrier diffusion across the junction leaving behind uncompensated immobile donor (+) and acceptor (-) ions.',
          category: 'Physics',
        },
        {
          id: 'fc-3',
          front: 'What is Knee Voltage (Cut-in Voltage)?',
          back: 'The forward voltage threshold at which diode current begins to increase exponentially (~0.7V for Si).',
          category: 'Characteristics',
        },
        {
          id: 'fc-4',
          front: 'What is Avalanche Breakdown?',
          back: 'Breakdown under high reverse voltage where accelerated carriers knock out lattice electrons in a cumulative chain reaction.',
          category: 'Breakdown',
        },
      ],
    },
  },
  {
    id: 'note-dsa-unit1',
    subjectId: 'cse-s3-dsa',
    departmentId: 'cse',
    semesterNumber: 3,
    title: 'Unit 1 — Linear Data Structures & Asymptotic Notation',
    description: 'Arrays, Stacks, Queues, Linked Lists, Big-O analysis, and practical implementations with memory layouts.',
    uploaderName: 'Ananya Sharma',
    pages: 36,
    fileSize: '3.1 MB',
    status: 'APPROVED',
    downloads: 2150,
    views: 6800,
    rating: 4.85,
    tags: ['Data Structures', 'Stack', 'Queue', 'Linked List', 'Big-O'],
    uploadedAt: '5 days ago',
    examPack: {
      summary: `### Linear Data Structures Core Review

Linear data structures arrange elements sequentially where each element has a unique predecessor and successor (except the first and last).

#### Primary Topics:
- **Asymptotic Complexity:** Big-O ($O$), Big-Omega ($\\Omega$), Big-Theta ($\\Theta$) classifying upper, lower, and tight bounds.
- **Arrays vs Linked Lists:** Contiguous memory allocation ($O(1)$ random access, $O(n)$ insertion/deletion) vs Pointer-based non-contiguous memory ($O(n)$ access, $O(1)$ insertion at known position).
- **Stack (LIFO):** Supports push, pop, peek operations in $O(1)$ time. Applications: Expression evaluation (Infix to Postfix), recursion stack, undo operations.
- **Queue (FIFO):** Enqueue and dequeue in $O(1)$ time. Variants: Circular Queue (resolving false overflow), Double-Ended Queue (Deque), Priority Queue.`,
      keyConcepts: [
        {
          title: 'Asymptotic Analysis & Big-O Notation',
          description: 'Evaluating algorithm scalability independent of hardware specifications.',
          importance: 'Critical',
        },
        {
          title: 'Stack Applications & Infix/Postfix Evaluation',
          description: 'Parentheses matching and arithmetic expression parsing using LIFO order.',
          importance: 'Critical',
        },
        {
          title: 'Circular Queue Memory Management',
          description: 'Modulo arithmetic $(rear + 1) \\% N$ overcoming linear queue space wastage.',
          importance: 'High',
        },
      ],
      definitions: [
        {
          term: 'Time Complexity',
          definition: 'The computational complexity that describes the amount of computer time it takes to run an algorithm as a function of the length of the input.',
          source: 'Unit 1.pdf, Page 5',
        },
        {
          term: 'LIFO Structure',
          definition: 'Last In First Out principle where the most recently inserted element is the first one to be removed, characteristic of Stacks.',
          source: 'Unit 1.pdf, Page 12',
        },
      ],
      oneMarkQuestions: [
        {
          question: 'What is the time complexity of searching an unsorted array of size N?',
          answer: 'O(N) linear time.',
          source: 'Unit 1.pdf, Page 6',
        },
        {
          question: 'What arithmetic operation is used to cycle indices in a circular queue?',
          answer: 'Modulo operator (%).',
          source: 'Unit 1.pdf, Page 22',
        },
      ],
      twoMarkQuestions: [
        {
          question: 'Explain the overflow and underflow conditions in a stack.',
          answer: 'Stack Overflow occurs when attempting to push onto a full stack ($top == MAX - 1$). Stack Underflow occurs when attempting to pop from an empty stack ($top == -1$).',
          keyPoints: ['Top pointer boundary checks', 'Memory limits'],
          source: 'Unit 1.pdf, Page 14',
        },
      ],
      tenMarkQuestions: [
        {
          question: 'Discuss the implementation of singly linked lists with algorithms for insertion and deletion at beginning, middle, and end. Compare linked lists with arrays.',
          answerStructure: [
            '1. Definition & Node Structure (Data + Next Pointer)',
            '2. Algorithm: Insertion at Beginning (O(1))',
            '3. Algorithm: Insertion at Specific Position (O(n))',
            '4. Algorithm: Deletion of a Given Key (O(n))',
            '5. Traversal and Display Routine',
            '6. Comprehensive Tabular Comparison: Array vs Linked List',
            '7. Conclusion & Memory Overhead Analysis',
          ],
          fullExplanation: 'Detailed code, pointer assignments, null checks, and memory allocation tradeoffs.',
          source: 'Unit 1.pdf, Pages 25-34',
        },
      ],
      mcqs: [
        {
          id: 'dsa-1',
          question: 'Which data structure is utilized in recursive function calls?',
          options: ['Queue', 'Stack', 'Tree', 'Deque'],
          correctAnswer: 1,
          explanation: 'The call stack maintains activation records of active functions in LIFO order.',
          source: 'Unit 1.pdf, Page 16',
        },
        {
          id: 'dsa-2',
          question: 'In a circular queue of capacity N, what indicates the full condition?',
          options: ['front == rear', '(rear + 1) % N == front', 'rear == N', 'front == -1'],
          correctAnswer: 1,
          explanation: 'When the next position of rear wraps around and collides with front, circular queue is full.',
          source: 'Unit 1.pdf, Page 23',
        },
      ],
      flashcards: [
        {
          id: 'fc-dsa-1',
          front: 'What is the Big-O for accessing the i-th element of a Linked List?',
          back: 'O(n) because sequential pointer traversal from head is required.',
          category: 'Complexity',
        },
        {
          id: 'fc-dsa-2',
          front: 'Which operation is performed to check matching parentheses in expressions?',
          back: 'Push opening brackets onto stack, pop when matching closing bracket is encountered.',
          category: 'Applications',
        },
      ],
    },
  },
  {
    id: 'note-os-process',
    subjectId: 'cse-s5-os',
    departmentId: 'cse',
    semesterNumber: 5,
    title: 'Unit 2 — CPU Scheduling & Deadlock Prevention',
    description: 'Process states, FCFS, SJF, Round Robin, Banker’s Algorithm, Coffman conditions, and resource allocation graphs.',
    uploaderName: 'Rahul Verma',
    pages: 32,
    fileSize: '2.8 MB',
    status: 'APPROVED',
    downloads: 1890,
    views: 5200,
    rating: 4.92,
    tags: ['Operating Systems', 'CPU Scheduling', 'Deadlocks', 'Bankers Algorithm'],
    uploadedAt: '1 week ago',
  },
  {
    id: 'note-thermo-laws',
    subjectId: 'mech-s2-thermo',
    departmentId: 'mech',
    semesterNumber: 2,
    title: 'Unit 1 — First & Second Laws of Thermodynamics',
    description: 'Closed and open systems, reversible and irreversible processes, Carnot efficiency, and entropy generation equations.',
    uploaderName: 'Suresh Menon',
    pages: 42,
    fileSize: '3.6 MB',
    status: 'APPROVED',
    downloads: 1120,
    views: 3100,
    rating: 4.78,
    tags: ['Thermodynamics', 'Carnot Cycle', 'Entropy', 'Heat Engines'],
    uploadedAt: '2 weeks ago',
  },
];

export const INITIAL_STUDY_GROUPS: import('./types').StudyGroup[] = [
  {
    id: 'group-cse-algos',
    name: 'CSE Sem 3 — Algorithms & OS Core Circle',
    description: 'Private revision squad for semester end exams. We solve 10-mark questions and share handwritten formula sheets.',
    departmentCode: 'CSE',
    semesterNumber: 3,
    inviteCode: 'CS301X',
    isPrivate: true,
    createdByName: 'Rahul Verma',
    createdAt: '2026-09-15',
    members: [
      { id: 'm-1', name: 'Rahul Verma', email: 'rahul@college.edu', role: 'Admin', joinedAt: 'Sep 15, 2026', avatarColor: 'bg-indigo-600' },
      { id: 'm-2', name: 'Priya Sharma', email: 'priya@college.edu', role: 'Member', joinedAt: 'Sep 16, 2026', avatarColor: 'bg-emerald-600' },
      { id: 'm-3', name: 'Aryan Nair', email: 'aryan@college.edu', role: 'Member', joinedAt: 'Sep 18, 2026', avatarColor: 'bg-amber-600' },
      { id: 'm-4', name: 'Rohit Joshi', email: 'rohit@college.edu', role: 'Member', joinedAt: 'Sep 21, 2026', avatarColor: 'bg-purple-600' },
    ],
    sharedNotes: [
      INITIAL_NOTES[1], // Tree Traversals & AVL Trees
      INITIAL_NOTES[2], // CPU Scheduling
    ],
    discussion: [
      {
        id: 'msg-1',
        senderName: 'Rahul Verma',
        senderId: 'm-1',
        role: 'Admin',
        text: 'Welcome to our private group! Uploaded the AVL rotation derivations and Banker’s algorithm summary in the shared files tab.',
        timestamp: 'Sep 22, 10:15 AM',
      },
      {
        id: 'msg-2',
        senderName: 'Priya Sharma',
        senderId: 'm-2',
        role: 'Member',
        text: 'Thanks! For tomorrow’s mock test, are we focusing on RR CPU scheduling with context switch overhead?',
        timestamp: 'Sep 22, 11:30 AM',
      },
      {
        id: 'msg-3',
        senderName: 'Aryan Nair',
        senderId: 'm-3',
        role: 'Member',
        text: 'Yes! The 10-mark question usually asks to draw Gantt chart and calculate average turnaround time.',
        timestamp: 'Sep 22, 12:05 PM',
      },
    ],
  },
  {
    id: 'group-ece-analog',
    name: 'ECE Sem 4 — Analog Circuits & Signals Squad',
    description: 'Strictly invite-only group for solving university previous year question papers and lab derivations.',
    departmentCode: 'ECE',
    semesterNumber: 4,
    inviteCode: 'EC402S',
    isPrivate: true,
    createdByName: 'Ananya Rao',
    createdAt: '2026-09-18',
    members: [
      { id: 'm-10', name: 'Ananya Rao', email: 'ananya@college.edu', role: 'Admin', joinedAt: 'Sep 18, 2026', avatarColor: 'bg-rose-600' },
      { id: 'm-1', name: 'Kavya Sen', email: 'kavya@college.edu', role: 'Member', joinedAt: 'Sep 19, 2026', avatarColor: 'bg-indigo-600' },
      { id: 'm-11', name: 'Vikram Singh', email: 'vikram@college.edu', role: 'Member', joinedAt: 'Sep 20, 2026', avatarColor: 'bg-sky-600' },
    ],
    sharedNotes: [
      INITIAL_NOTES[0], // PN Junction Diodes
    ],
    discussion: [
      {
        id: 'msg-10',
        senderName: 'Ananya Rao',
        senderId: 'm-10',
        role: 'Admin',
        text: 'Reminder: Only members with invite code EC402S can join. Please keep shared solutions internal to our study circle.',
        timestamp: 'Sep 20, 04:45 PM',
      },
      {
        id: 'msg-11',
        senderName: 'Kavya Sen',
        senderId: 'm-1',
        role: 'Member',
        text: 'Just uploaded the diode clipping & clamping circuit diagrams with page citations from Boylestad.',
        timestamp: 'Sep 21, 09:10 AM',
      },
    ],
  },

];
