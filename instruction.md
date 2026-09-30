# Product Requirements Document (PRD)

## Product Name

**NotePilot AI**

### Product Type

AI-powered SaaS for college students

### Version

MVP v1.0

### Status

Development-ready specification

---

# 1. Product Overview

NotePilot AI is a web-based SaaS platform that helps college students convert their study notes and PDFs into structured exam-preparation material.

Students can upload their notes and use AI to generate:

* Concise summaries
* Key concepts
* Important definitions
* 1-mark questions
* 2-mark questions
* 10-mark questions
* Multiple-choice questions
* Flashcards
* AI explanations and Q&A based on their uploaded notes

The product is designed primarily for **college and engineering students preparing for semester examinations**.

The core value proposition is:

> **Upload your notes. Turn them into an exam-ready study pack.**

---

# 2. Problem Statement

College students commonly have:

* Large PDF notes
* Multiple units and subjects
* Lecture notes
* Question banks
* Previous-year question papers
* Limited preparation time

Students often struggle to identify:

* What is important
* What to revise first
* Which concepts they don't understand
* How to convert notes into questions
* How to revise large documents quickly

Existing generic AI tools require students to manually upload content, write prompts, decide output formats, and organize the results themselves.

NotePilot AI packages this workflow into a dedicated student-focused product.

---

# 3. Product Goals

## Primary Goals

1. Allow students to upload college notes easily.
2. Automatically extract and process document content.
3. Generate structured exam-oriented study material.
4. Allow students to ask questions about their notes.
5. Provide a clean and mobile-friendly interface.
6. Keep generated information traceable to source notes where possible.
7. Build a sustainable SaaS with usage limits and paid plans.

## Secondary Goals

1. Support multiple subjects.
2. Store generated materials for later revision.
3. Enable interactive MCQ practice.
4. Provide flashcards.
5. Provide document and subject-level AI chat.

---

# 4. Non-Goals for MVP

The following are explicitly out of scope for MVP:

* Native Android/iOS application
* Online classes
* Video lectures
* Social network
* Student-to-student messaging
* Complete LMS functionality
* Attendance management
* Payment processing during the first prototype
* Voice-based AI tutor
* AI avatar
* Real-time collaborative notes
* Automatic exam prediction
* Guaranteeing what questions will appear in an examination

---

# 5. Target Users

## Primary User

College student aged approximately 17–25 who uses digital notes and prepares for examinations.

### Example user

A first-year engineering student has:

```text
Engineering Physics
Unit 1.pdf
Unit 2.pdf
Unit 3.pdf
Previous Questions.pdf
```

Instead of manually creating revision material, the student uploads the files to NotePilot AI.

---

# 6. User Personas

## Persona A — Exam-focused student

Needs fast revision and important questions.

Primary features:

* Exam Pack
* Summaries
* Important questions
* MCQs

## Persona B — Concept-focused student

Needs explanations of difficult topics.

Primary features:

* AI Chat
* Explain mode
* Source references

## Persona C — Last-minute revision student

Has limited time before the examination.

Primary features:

* Quick revision
* Key concepts
* Important definitions
* Flashcards

---

# 7. Core User Journey

```text
Landing Page
     ↓
Sign Up
     ↓
Dashboard
     ↓
Create Subject
     ↓
Upload PDF
     ↓
Document Processing
     ↓
Generate Exam Pack
     ↓
Summary / Questions / MCQs / Flashcards
     ↓
Ask AI
     ↓
Review / Practice / Revise
```

---

# 8. MVP Feature Set

## 8.1 Authentication

Users can:

* Sign up
* Log in
* Log out
* Reset password
* Maintain authenticated sessions

### Requirements

* Email/password authentication
* Protected dashboard
* Unauthenticated users redirected to login
* Authenticated users redirected to dashboard

---

# 9. Dashboard

The dashboard is the central home screen after login.

### Dashboard should display

```text
Welcome back, Mahesh

Your Subjects

[ Engineering Physics ]
[ Mathematics ]
[ Programming in C ]

Recent Notes

[ Unit 3.pdf ]
[ Unit 2.pdf ]

Usage

Documents: 2 / 3
AI generations: 4 / 5

[ + Add Subject ]
[ Upload Notes ]
```

### Dashboard requirements

* Show user's subjects
* Show recently uploaded documents
* Show document processing status
* Show current usage
* Provide quick actions

---

# 10. Subject Management

Users can create subjects.

### Subject fields

```text
Subject Name
Semester
Course
Optional description
```

### Actions

* Create
* Edit
* Delete
* Open

### Example

```text
Engineering Physics
Semester 1

4 Notes
8 AI-generated resources
```

---

# 11. Document Upload

Users can upload PDF notes associated with a subject.

### Supported format

Initially:

```text
PDF
```

### Upload requirements

* Drag-and-drop
* File browser
* Upload progress
* File size validation
* File type validation
* Upload cancellation where practical
* Delete document

### Document states

```text
UPLOADING
PROCESSING
COMPLETED
FAILED
```

### UI example

```text
Upload Notes

┌──────────────────────────────┐
│                              │
│     Drag PDF here            │
│                              │
│     or                       │
│                              │
│     [ Browse Files ]         │
│                              │
└──────────────────────────────┘

Maximum file size: X MB
PDF files only
```

---

# 12. Document Processing

After upload, the system extracts text from the PDF.

### Processing pipeline

```text
PDF Upload
    ↓
Storage
    ↓
Text Extraction
    ↓
Text Cleaning
    ↓
Chunking
    ↓
Save Chunks
    ↓
AI Processing
```

### Requirements

The system should:

* Extract text where available
* Preserve page references
* Divide large documents into manageable chunks
* Store chunks separately
* Detect processing failures
* Record processing status

### Important

The application must not assume that every PDF contains extractable text.

Scanned/image-based PDFs should be handled gracefully.

---

# 13. Exam Pack

The primary feature of the product.

A user clicks:

```text
[ Generate Exam Pack ]
```

The system generates a structured study package.

### Output sections

1. Summary
2. Key concepts
3. Important definitions
4. 1-mark questions
5. 2-mark questions
6. 10-mark questions
7. MCQs
8. Quick revision notes
9. Flashcards

---

# 14. Summary Generation

The AI should convert lengthy notes into a concise structured summary.

### Requirements

Summary should:

* Use source document content
* Preserve important terminology
* Avoid unnecessary repetition
* Use headings
* Use concise paragraphs
* Use bullet points where appropriate
* Avoid unsupported facts

### Example

```text
## PN Junction Diode

A PN junction is formed by joining p-type and n-type
semiconductor materials.

### Key points

- Formation of depletion region
- Barrier potential
- Forward bias
- Reverse bias
```

---

# 15. Key Concepts

The system should identify important concepts contained in the notes.

Example:

```text
Key Concepts

1. Depletion Region
2. Barrier Potential
3. Forward Bias
4. Reverse Bias
5. Breakdown
```

Each concept may optionally include:

* Short explanation
* Source page
* Related questions

---

# 16. Important Definitions

Generate definitions of important terms.

Example:

```text
Definition

Doping:
The process of adding controlled impurities to a
pure semiconductor to modify its electrical properties.

Source: Unit 3.pdf, Page 12
```

---

# 17. 1-Mark Questions

Generate short-answer questions suitable for quick revision.

### Requirements

Each question should contain:

* Question
* Answer
* Optional source page

Example:

```text
Q: What is doping?

Answer:
Doping is the process of adding impurities to a
semiconductor to modify its conductivity.
```

---

# 18. 2-Mark Questions

Generate slightly longer questions.

Each question should have:

* Question
* Concise answer
* Key points
* Source reference where available

---

# 19. 10-Mark Questions

Generate long-answer examination questions.

The answer format should be structured.

Example:

```text
Q. Explain the working of a PN junction diode.

Answer Structure

1. Introduction
2. Construction
3. Formation of depletion region
4. Working
5. Forward bias
6. Reverse bias
7. V-I characteristics
8. Applications
9. Conclusion
```

The system should not claim that a generated question is guaranteed to appear in an examination.

---

# 20. MCQ Generator

Users can generate interactive multiple-choice questions.

### Each MCQ contains

```text
Question
Option A
Option B
Option C
Option D
Correct answer
Explanation
```

### Example

```text
What is commonly used as a semiconductor material?

A. Copper
B. Silicon
C. Iron
D. Aluminium

[Submit]
```

After answering:

```text
Correct ✅

Silicon is commonly used in semiconductor devices.
```

---

# 21. Quiz Mode

Users can practice generated MCQs.

### Quiz requirements

* Select number of questions
* One question at a time
* Select answer
* Submit
* Show result
* Show explanations

### Result screen

```text
Quiz Complete

Score: 8 / 10

Correct: 8
Incorrect: 2

[Review Answers]
[Try Again]
```

---

# 22. Flashcards

Generate question-and-answer cards from notes.

Example:

```text
┌──────────────────────────┐
│                          │
│ What is doping?          │
│                          │
│       [Reveal Answer]    │
│                          │
└──────────────────────────┘
```

After reveal:

```text
Doping is the controlled addition
of impurities to a semiconductor.
```

Users can move:

```text
[ Previous ] [ Next ]
```

---

# 23. AI Chat

Users can ask questions about uploaded documents.

### Example

```text
Student:
Explain forward bias in simple words.

AI:
Forward bias means...
```

### Requirements

* Context-aware responses
* Use user's document content
* Provide source references where available
* Support follow-up questions
* Maintain conversation history during a session

---

# 24. RAG / Source-Based AI

AI Chat should eventually use retrieval-augmented generation.

### Flow

```text
User Question
       ↓
Convert query
       ↓
Search relevant document chunks
       ↓
Retrieve top relevant sections
       ↓
Send retrieved context to AI
       ↓
Generate answer
       ↓
Show source references
```

### Example

```text
Answer

A depletion region is the region around a PN junction
where mobile charge carriers are depleted.

Sources:
Unit 3.pdf — Page 14
Unit 3.pdf — Page 15
```

The system should clearly distinguish source-based answers from general AI knowledge.

---

# 25. "Teach Me" Mode

Users can choose an explanation level.

### Modes

```text
Beginner
Engineering Student
Exam Answer
Last-Minute Revision
```

### Example

User:

```text
Explain PN junction.
```

Beginner mode:

```text
Simple explanation...
```

Exam mode:

```text
10-mark university-style answer...
```

Last-minute mode:

```text
5 things to remember...
```

---

# 26. Previous-Year Question Analysis

This should be considered a later MVP+ feature.

Users can upload:

```text
Notes.pdf
2024 Question Paper.pdf
2025 Question Paper.pdf
```

The system can identify:

* Repeated topics
* Frequently asked concepts
* Topic coverage within uploaded notes
* Question frequency

Example:

```text
Topic Analysis

PN Junction
Appeared: 4 times

Transistor
Appeared: 3 times

Logic Gates
Appeared: 2 times
```

The product must present this as **historical frequency analysis**, not a prediction or guarantee of future exam questions.

---

# 27. Syllabus Coverage

Later feature.

User provides syllabus:

```text
Unit 1
Unit 2
Unit 3
Unit 4
Unit 5
```

System compares notes against the syllabus.

Example:

```text
Unit 1     ✅ Covered
Unit 2     ✅ Covered
Unit 3     ⚠ Partially covered
Unit 4     ✅ Covered
Unit 5     ❌ Notes missing
```

---

# 28. Document Page References

Where possible, generated content should identify its source.

Example:

```text
Source:
Unit 3.pdf, Pages 12–14
```

Benefits:

* Increased trust
* Easier verification
* Faster revision
* Reduced hallucination risk

---

# 29. Data Model

## profiles

```text
id
email
full_name
college
course
semester
created_at
updated_at
```

## subjects

```text
id
user_id
name
semester
course
description
created_at
updated_at
```

## documents

```text
id
user_id
subject_id
name
file_url
file_type
file_size
page_count
status
created_at
updated_at
```

## document_chunks

```text
id
document_id
chunk_index
content
page_start
page_end
embedding
created_at
```

## summaries

```text
id
document_id
content
created_at
updated_at
```

## questions

```text
id
document_id
type
question
answer
difficulty
source_pages
created_at
```

Where `type` is:

```text
one_mark
two_mark
ten_mark
```

## mcqs

```text
id
document_id
question
option_a
option_b
option_c
option_d
correct_answer
explanation
difficulty
source_pages
created_at
```

## flashcards

```text
id
document_id
front
back
source_pages
created_at
```

## chat_sessions

```text
id
user_id
subject_id
document_id
title
created_at
updated_at
```

## chat_messages

```text
id
session_id
role
content
source_pages
created_at
```

## usage

```text
id
user_id
period
documents_uploaded
ai_requests
generated_questions
created_at
updated_at
```

---

# 30. Authentication & Authorization

Supabase Auth handles authentication.

### Authorization requirements

Users can access only:

* Their own profile
* Their own subjects
* Their own documents
* Their own generated content
* Their own chat history

Row-Level Security must be enabled on private tables.

Example ownership chain:

```text
Authenticated User
       ↓
Subject.owner_id
       ↓
Document.subject_id
       ↓
Generated content.document_id
```

No user may access another user's private notes or generated content.

---

# 31. Storage

Supabase Storage should store uploaded documents and images where required.

Suggested structure:

```text
documents/
    {user_id}/
        {subject_id}/
            {document_id}.pdf
```

The application should use secure access controls.

Private student documents must not be publicly accessible by default.

---

# 32. Recommended Technology Stack

### Frontend

```text
Next.js
TypeScript
React
Tailwind CSS
shadcn/ui
```

### Backend

```text
Next.js server/API routes
```

### Authentication

```text
Supabase Auth
```

### Database

```text
Supabase PostgreSQL
```

### File storage

```text
Supabase Storage
```

### AI

```text
LLM API
```

The AI provider should be abstracted behind an internal interface to allow switching providers later.

### Hosting

```text
Vercel
```

### Source control

```text
GitHub
```

---

# 33. Application Routes

## Public

```text
/
/login
/signup
/forgot-password
```

## Authenticated

```text
/dashboard
/dashboard/subjects
/dashboard/subjects/[id]
/dashboard/notes
/dashboard/chat
/dashboard/history
/dashboard/settings
```

## Document

```text
/notes/[documentId]
```

## Admin

```text
/admin
/admin/users
/admin/documents
/admin/usage
/admin/errors
```

---

# 34. Main Dashboard Navigation

```text
Dashboard
Subjects
Notes
AI Chat
Quiz
Flashcards
History
Settings
```

---

# 35. UI/UX Requirements

## Design principles

* Simple
* Modern
* Student-focused
* Minimal visual clutter
* Mobile responsive
* Fast interactions
* Clear loading states
* Clear error messages

### Primary CTA

```text
Upload Notes
```

### Secondary CTA

```text
Generate Exam Pack
```

---

# 36. Mobile Requirements

The application should work well on:

```text
360px
390px
412px
```

The mobile experience should support:

* PDF upload
* Reading summaries
* MCQ practice
* Flashcards
* AI chat
* Dashboard navigation

---

# 37. Error Handling

The system must handle:

### Invalid file

```text
Only PDF files are supported.
```

### Oversized file

```text
This file is too large. Please upload a smaller PDF.
```

### Extraction failure

```text
We couldn't extract readable text from this PDF.
The document may be scanned or image-based.
```

### AI failure

```text
We couldn't generate the result right now.
Please try again.
```

### Usage limit

```text
You've reached your monthly AI limit.
Upgrade your plan to continue.
```

---

# 38. Loading States

Never leave users staring at a static screen.

Examples:

```text
Uploading...
Processing PDF...
Extracting text...
Generating summary...
Generating questions...
Generating MCQs...
Searching notes...
```

For long-running processes, display progress/status rather than blocking the entire application.

---

# 39. AI Safety & Reliability Requirements

The AI system should:

1. Prefer uploaded source material.
2. Avoid inventing source references.
3. Clearly indicate uncertainty.
4. Never claim an exam question is guaranteed.
5. Not fabricate page numbers.
6. Avoid unsupported facts when operating in source-only mode.
7. Distinguish between source-based information and general knowledge.

### Source-only instruction

Example internal instruction:

```text
Use only the supplied document content.
If the answer cannot be found in the supplied material,
say that the information is not available in the notes.
Do not fabricate citations or page numbers.
```

---

# 40. AI Prompt Architecture

Do not use one giant prompt for the entire product.

Create separate prompt modules:

```text
summaryPrompt
keyConceptPrompt
definitionPrompt
oneMarkPrompt
twoMarkPrompt
tenMarkPrompt
mcqPrompt
flashcardPrompt
chatPrompt
```

Each should return structured output.

Prefer JSON/schema-based output where supported.

Example:

```json
{
  "question": "What is doping?",
  "answer": "...",
  "source_pages": [12]
}
```

This makes frontend rendering much more reliable.

---

# 41. Usage Limits

Because AI processing has operating costs, the MVP should enforce limits.

Example:

## Free

```text
3 PDF documents/month
5 AI generations/month
Basic summaries
Basic questions
```

## Student

```text
₹99/month
```

Example benefits:

```text
30 documents/month
More AI generations
Exam Packs
AI Chat
Flashcards
Quiz mode
PDF export
```

These prices should be validated through actual user testing before launch.

---

# 42. Subscription Architecture

Billing is not required for the first prototype.

When introduced, add:

```text
plans
subscriptions
usage
payments
```

The backend should verify subscription status rather than trusting frontend values.

---

# 43. Admin Dashboard

Admin should be able to monitor:

```text
Total users
Active users
Documents uploaded
AI requests
Processing failures
Storage usage
Most-used features
```

Admin should also be able to inspect system errors.

---

# 44. Analytics Events

Track events such as:

```text
signup_completed
subject_created
document_uploaded
document_processing_started
document_processing_completed
exam_pack_generated
summary_generated
mcq_started
quiz_completed
chat_started
subscription_started
```

Do not collect unnecessary personal information.

---

# 45. Performance Requirements

Target:

* Fast landing page
* Fast dashboard loading
* Progressive loading for large content
* Async document processing
* Pagination for large result sets
* Optimized image handling
* Cached public/static content where appropriate

AI generation should not block unrelated dashboard functionality.

---

# 46. Security Requirements

### Authentication

Use Supabase Auth.

### Database

Enable Row-Level Security.

### Storage

Keep student uploads private.

### API

AI API keys must never be exposed in client-side JavaScript.

### Environment variables

Use:

```text
.env.local
```

and never commit secrets to Git.

### Input validation

Validate:

* File type
* File size
* Text input
* Subject IDs
* Document IDs
* API request parameters

---

# 47. MVP Success Criteria

The MVP is considered successful when a new user can complete this entire workflow:

```text
Signup
 ↓
Create Subject
 ↓
Upload PDF
 ↓
PDF processed successfully
 ↓
Generate Exam Pack
 ↓
Read summary
 ↓
View 1-mark questions
 ↓
View 2-mark questions
 ↓
View 10-mark questions
 ↓
Take MCQ quiz
 ↓
Review flashcards
 ↓
Ask AI a question
 ↓
Receive answer based on notes
```

---

# 48. MVP Acceptance Criteria

## Authentication

* User can register.
* User can log in.
* User can log out.
* Protected routes work.
* Session persists after refresh.

## Subjects

* User can create a subject.
* User can edit a subject.
* User can delete a subject.
* Users cannot access another user's subjects.

## Documents

* PDF upload works.
* Invalid files are rejected.
* Processing status is visible.
* Successfully processed files are stored.
* Users cannot access another user's files.

## AI

* Summary generation works.
* Questions generation works.
* MCQ generation works.
* Flashcard generation works.
* Generated data is stored.

## Chat

* User can ask questions about their document.
* Relevant document context is retrieved.
* Answer is displayed.
* Sources are shown when available.

## Quiz

* MCQs are interactive.
* Score is calculated correctly.
* Correct answers can be reviewed.

---

# 49. Development Roadmap

## Phase 1 — Foundation

```text
Next.js
TypeScript
Tailwind
Supabase
GitHub
Vercel
```

## Phase 2 — Authentication

```text
Signup
Login
Logout
Protected routes
```

## Phase 3 — Subjects

```text
Create
Read
Update
Delete
```

## Phase 4 — Documents

```text
Upload
Storage
Processing status
Text extraction
Chunking
```

## Phase 5 — AI

```text
Summary
Definitions
Questions
MCQs
Flashcards
```

## Phase 6 — Interactive learning

```text
Quiz mode
Teach Me mode
AI Chat
```

## Phase 7 — RAG

```text
Embeddings
Vector search
Source references
```

## Phase 8 — Monetization

```text
Usage limits
Plans
Payments
Subscription management
```

## Phase 9 — Advanced features

```text
Syllabus coverage
Previous-year question analysis
PDF export
Cross-document chat
```

---

# 50. Future Features

Potential future releases:

### V2

* Previous-year paper analysis
* Syllabus coverage
* PDF export
* Better RAG
* Cross-document chat
* Study planner

### V3

* Personalized revision schedule
* Spaced repetition
* Weak-topic detection
* Performance analytics
* More file formats
* OCR for scanned notes

### V4

* Institution/course-specific workflows
* Shared study packs
* Teacher-created content
* Institutional plans

---

# 51. Business Model

Primary model:

**Freemium SaaS**

```text
Free
   ↓
Experience product
   ↓
Hit usage limits
   ↓
Upgrade
```

Potential paid customers:

* Individual students
* Student communities
* Coaching institutes
* Private colleges
* Tutors

---

# 52. Key Product Metrics

The most important metrics are:

### Activation

Percentage of users who:

```text
Signup
  ↓
Upload first PDF
```

### Core activation

Percentage who:

```text
Upload PDF
  ↓
Generate Exam Pack
```

### Engagement

```text
Documents uploaded / user
AI sessions / user
MCQs completed / user
Flashcards reviewed / user
```

### Retention

```text
7-day retention
30-day retention
```

### Monetization

```text
Free → Paid conversion
Monthly recurring revenue
Average revenue per paid user
```

---

# 53. Biggest Product Risks

## Risk 1 — AI answers are inaccurate

Mitigation:

* Source-based generation
* RAG
* Source references
* Structured prompts
* User feedback

## Risk 2 — AI cost becomes too high

Mitigation:

* Usage limits
* File/page limits
* Smaller models for simpler tasks
* Caching generated content
* Background processing

## Risk 3 — Users see it as "just ChatGPT"

Mitigation:

Build a complete workflow rather than a blank chatbot:

```text
PDF
 ↓
Exam Pack
 ↓
Questions
 ↓
Quiz
 ↓
Flashcards
 ↓
Chat
```

## Risk 4 — Students don't pay

Mitigation:

Validate with real users before investing heavily in advanced functionality.

---

# 54. Competitive Differentiation

The product should not position itself simply as:

> "Chat with PDFs."

Instead:

> **"Turn your college notes into an exam-ready study system."**

Differentiating features include:

* Exam-specific question formats
* 1/2/10-mark question generation
* Interactive quizzes
* Flashcards
* Source-linked explanations
* Syllabus coverage
* Previous-year question analysis
* Student-focused workflow

---

# 55. MVP Final Scope

The first deployable product should contain exactly:

```text
AUTH
├── Signup
├── Login
└── Logout

DASHBOARD
├── Subjects
├── Recent Notes
└── Usage

SUBJECT
├── Create
├── Edit
└── Delete

DOCUMENT
├── PDF Upload
├── Processing
├── Text Extraction
└── Delete

AI
├── Summary
├── Key Concepts
├── Definitions
├── 1-Mark Questions
├── 2-Mark Questions
├── 10-Mark Questions
├── MCQs
└── Flashcards

LEARNING
├── Quiz Mode
└── AI Chat

SYSTEM
├── Supabase
├── RLS
├── Storage
├── AI API
└── Vercel
```

---

# 56. One-Sentence Product Definition

> **NotePilot AI is a SaaS platform that transforms college students' PDFs and notes into structured summaries, exam questions, quizzes, flashcards, and source-based AI explanations.**

---

# 57. MVP Definition of Done

The project is ready for the first real users when:

```text
✅ Authentication works
✅ Database works
✅ RLS is configured
✅ PDF uploads work
✅ Text extraction works
✅ Large documents are chunked
✅ Summary generation works
✅ Question generation works
✅ MCQ generation works
✅ Flashcards work
✅ Quiz works
✅ AI Chat works
✅ Source references work where available
✅ Usage limits work
✅ Mobile UI works
✅ Error handling works
✅ Vercel deployment works
✅ No secret keys are exposed
✅ GitHub repository is clean
```

The first real-world test should be with **actual college notes rather than fabricated demo PDFs**. The product should be judged by whether a student can go from raw notes to useful exam preparation with substantially less manual work.

---

# 58. Library — Public Notes Repository

The Library is a publicly accessible section of NotePilot AI where students can browse and access notes shared by other users, organized by Department, Semester, and Subject.

## Purpose

The Library serves as a community knowledge base:

* Students who have no notes of their own can still benefit from shared notes
* Encourages a culture of collaborative learning
* Increases platform value beyond personal note management
* Drives organic discovery and sign-ups from non-registered visitors

## Access

```text
Public (no login required) — Browse and read
Authenticated — Browse, read, and contribute
```

---

# 59. Library Hierarchy

The Library uses a strict three-level hierarchy:

```text
Library
└── Department
    └── Semester
        └── Subject
            └── Notes (PDFs and generated content)
```

### Example

```text
Library
├── Computer Science & Engineering
│   ├── Semester 1
│   │   ├── Engineering Mathematics
│   │   │   ├── Unit 1.pdf
│   │   │   └── Unit 2.pdf
│   │   └── Engineering Physics
│   │       └── Unit 1.pdf
│   ├── Semester 3
│   │   └── Data Structures
│   │       └── Notes.pdf
│   └── Semester 5
│       └── Operating Systems
│           └── Complete Notes.pdf
├── Mechanical Engineering
│   └── Semester 2
│       └── Engineering Thermodynamics
│           └── Unit 3.pdf
└── Electronics & Communication
    └── Semester 4
        └── Digital Electronics
            └── Full Notes.pdf
```

---

# 60. Library Data Model

## departments

```text
id
name
short_name
description
created_at
```

Example values:

```text
Computer Science & Engineering (CSE)
Mechanical Engineering (MECH)
Electronics & Communication (ECE)
Civil Engineering (CIVIL)
Information Technology (IT)
```

## library_semesters

```text
id
department_id
semester_number
label
created_at
```

Example:

```text
semester_number: 3
label: Semester 3
```

## library_subjects

```text
id
department_id
semester_id
name
description
created_at
```

## library_notes

```text
id
subject_id
uploader_id
title
description
file_url
file_type
file_size
page_count
status
is_approved
download_count
view_count
created_at
updated_at
```

Where `status` is:

```text
PENDING
APPROVED
REJECTED
```

Where `is_approved` controls public visibility.

---

# 61. Library Access Control

## Public access (no login)

* Browse department list
* Browse semesters within a department
* Browse subjects within a semester
* View list of notes within a subject
* View AI-generated summary of a note (read-only)

## Authenticated access

All public access, plus:

* Download original PDF
* Generate their own Exam Pack from a library note
* Upload notes to the Library
* Rate or bookmark a note

## Admin access

* Approve or reject submitted notes
* Delete inappropriate content
* Manage departments and semesters
* Feature notes on the library homepage

---

# 62. Library Routes

## Public

```text
/library
/library/[department]
/library/[department]/[semester]
/library/[department]/[semester]/[subject]
/library/[department]/[semester]/[subject]/[noteId]
```

## Authenticated

```text
/library/upload
/library/my-contributions
```

## Admin

```text
/admin/library
/admin/library/pending
/admin/library/departments
```

---

# 63. Library UI

## Library Home (`/library`)

```text
📚 Library

Search notes...

Browse by Department

[ Computer Science & Engineering ]
[ Mechanical Engineering          ]
[ Electronics & Communication     ]
[ Civil Engineering               ]
[ Information Technology          ]

Featured Notes

[ Data Structures — Semester 3 — CSE ]
[ Thermodynamics — Semester 2 — MECH ]
```

## Department Page (`/library/[department]`)

```text
📚 Library > Computer Science & Engineering

Select Semester

[ Semester 1 ]  [ Semester 2 ]  [ Semester 3 ]
[ Semester 4 ]  [ Semester 5 ]  [ Semester 6 ]
[ Semester 7 ]  [ Semester 8 ]
```

## Semester Page (`/library/[department]/[semester]`)

```text
📚 Library > CSE > Semester 3

Subjects

[ Data Structures            5 notes ]
[ Object-Oriented Programming 3 notes ]
[ Discrete Mathematics       2 notes ]
[ Digital Logic Design       4 notes ]
```

## Subject Page (`/library/[department]/[semester]/[subject]`)

```text
📚 Library > CSE > Semester 3 > Data Structures

Notes

Unit 1 — Arrays and Linked Lists
Uploaded by @mahesh · 24 pages · 1.2 MB
★ 4.8 · 340 views

[ View Summary ]  [ Download PDF ]  [ Generate Exam Pack ]

Unit 2 — Stacks and Queues
Uploaded by @priya · 18 pages · 890 KB
★ 4.5 · 210 views

[ View Summary ]  [ Download PDF ]  [ Generate Exam Pack ]
```

## Note Detail Page (`/library/.../[noteId]`)

```text
📄 Unit 1 — Arrays and Linked Lists
Data Structures · Semester 3 · CSE

Uploaded by @mahesh
Pages: 24 · Size: 1.2 MB · Views: 340

[ Download PDF ]
[ Generate My Exam Pack ]

AI Summary (Preview)

Arrays are linear data structures...

[Login to see full summary and generate questions]
```

---

# 64. Library Upload Flow

Authenticated users can contribute notes to the Library.

## Upload steps

```text
1. Go to /library/upload
2. Select Department
3. Select Semester
4. Select or create Subject
5. Add note title and optional description
6. Upload PDF
7. Submit for review
```

## After submission

```text
Status: PENDING

Your note has been submitted for review.
It will appear in the Library once approved.
```

## Approval flow

```text
Admin reviews note
    ↓
Approve → note appears publicly in Library
    ↓
OR
    ↓
Reject → uploader notified with reason
```

## Upload requirements

* PDF files only
* Maximum file size enforced
* Title required
* Department, Semester, Subject required
* One note per upload

---

# 65. Library and Personal Notes — Distinction

| Aspect | Personal Notes | Library Notes |
|--------|---------------|---------------|
| Access | Private (owner only) | Public (everyone) |
| Purpose | Personal study | Community sharing |
| Upload | Direct, no approval | Requires admin approval |
| AI features | Full (owner) | Summary preview (public), full (authenticated) |
| Storage path | `documents/{user_id}/...` | `library/{department}/{semester}/{subject}/...` |

---

# 66. Updated MVP Final Scope

The Library is included in the MVP with the following scope:

```text
LIBRARY
├── Public browsing (Department → Semester → Subject)
├── Note viewing and summary preview
├── PDF download (authenticated users)
├── Note upload and submission (authenticated users)
└── Admin approval workflow
```

Advanced library features deferred to V2:

```text
V2 LIBRARY
├── Note ratings and reviews
├── Bookmarks / saved notes
├── Featured notes curation
├── Search across all library notes
└── Cross-department subject linking
```

---

# 67. Updated Route Map (with Library)

## Public routes (including Library)

```text
/
/login
/signup
/forgot-password
/library
/library/[department]
/library/[department]/[semester]
/library/[department]/[semester]/[subject]
/library/[department]/[semester]/[subject]/[noteId]
```

## Authenticated routes

```text
/dashboard
/dashboard/subjects
/dashboard/subjects/[id]
/dashboard/notes
/dashboard/chat
/dashboard/history
/dashboard/settings
/library/upload
/library/my-contributions
/notes/[documentId]
```

## Admin routes

```text
/admin
/admin/users
/admin/documents
/admin/usage
/admin/errors
/admin/library
/admin/library/pending
/admin/library/departments
```

