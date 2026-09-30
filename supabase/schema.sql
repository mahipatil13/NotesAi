-- ========================================================
-- Smart Study AI — Supabase PostgreSQL Schema & Security
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked with Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  college text,
  course text,
  semester int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- 2. Personal Subjects Table
create table if not exists public.subjects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  semester int not null,
  course text not null,
  description text,
  created_at timestamptz default now()
);

alter table public.subjects enable row level security;
create policy "Users can manage own subjects" on public.subjects for all using (auth.uid() = user_id);

-- 3. Personal Documents Table
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  name text not null,
  file_url text not null,
  file_size text,
  page_count int default 0,
  status text check (status in ('UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED')) default 'UPLOADING',
  created_at timestamptz default now()
);

alter table public.documents enable row level security;
create policy "Users can manage own documents" on public.documents for all using (auth.uid() = user_id);

-- 4. Document Chunks (for RAG vector search)
create table if not exists public.document_chunks (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  chunk_index int not null,
  content text not null,
  page_start int,
  page_end int,
  created_at timestamptz default now()
);

alter table public.document_chunks enable row level security;
create policy "Users can access chunks of own documents" on public.document_chunks
  for all using (
    exists (
      select 1 from public.documents
      where documents.id = document_chunks.document_id and documents.user_id = auth.uid()
    )
  );

-- 5. Exam Packs Table
create table if not exists public.exam_packs (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  summary text not null,
  key_concepts jsonb default '[]'::jsonb,
  definitions jsonb default '[]'::jsonb,
  one_mark_questions jsonb default '[]'::jsonb,
  two_mark_questions jsonb default '[]'::jsonb,
  ten_mark_questions jsonb default '[]'::jsonb,
  mcqs jsonb default '[]'::jsonb,
  flashcards jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.exam_packs enable row level security;
create policy "Users can access exam packs of own documents" on public.exam_packs
  for all using (
    exists (
      select 1 from public.documents
      where documents.id = exam_packs.document_id and documents.user_id = auth.uid()
    )
  );

-- 6. Public Community Library
create table if not exists public.library_notes (
  id uuid default gen_random_uuid() primary key,
  department_id text not null,
  semester int not null,
  subject_name text not null,
  title text not null,
  description text,
  uploader_name text,
  uploader_id uuid references public.profiles(id) on delete set null,
  file_url text not null,
  pages int default 0,
  file_size text,
  status text check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'APPROVED',
  downloads int default 0,
  views int default 0,
  rating numeric(3, 2) default 4.8,
  tags jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.library_notes enable row level security;
-- Anyone (even unauthenticated visitors) can read approved library notes!
create policy "Public can view approved library notes" on public.library_notes
  for select using (status = 'APPROVED');

-- Authenticated users can insert new library notes
create policy "Authenticated users can submit library notes" on public.library_notes
  for insert with check (auth.role() = 'authenticated');
