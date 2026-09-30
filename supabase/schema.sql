-- ========================================================
-- Smart Study AI — Supabase Complete Schema & Auth Fix
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked with Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  college text default 'Engineering College',
  course text default 'B.Tech CSE',
  semester int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Drop old policies if existing to avoid conflict
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;

-- RLS Policies for Profiles
create policy "Users can read own profile" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id or auth.role() = 'authenticated' or auth.role() = 'anon');
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, college, course, semester)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'college', 'Engineering College'),
    coalesce(new.raw_user_meta_data->>'course', 'B.Tech CSE'),
    coalesce((new.raw_user_meta_data->>'semester')::int, 1)
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name);
  return new;
exception when others then
  -- Fail-safe: never block user signup if profile creation encounters an error
  return new;
end;
$$;

-- Drop existing trigger if any and attach to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
drop policy if exists "Users can manage own subjects" on public.subjects;
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
drop policy if exists "Users can manage own documents" on public.documents;
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
drop policy if exists "Users can access chunks of own documents" on public.document_chunks;
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
drop policy if exists "Users can access exam packs of own documents" on public.exam_packs;
create policy "Users can access exam packs of own documents" on public.exam_packs
  for all using (
    exists (
      select 1 from public.documents
      where documents.id = exam_packs.document_id and documents.user_id = auth.uid()
    )
  );

-- 6. Public Community Library Notes Table
create table if not exists public.library_notes (
  id uuid default gen_random_uuid() primary key,
  department_id text not null,
  semester int not null,
  subject_name text not null,
  title text not null,
  description text,
  uploader_name text,
  uploader_id text,
  uploader_email text,
  file_url text not null,
  pages int default 0,
  file_size text,
  status text check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'APPROVED',
  downloads int default 0,
  views int default 0,
  rating numeric(3, 2) default 4.8,
  tags jsonb default '[]'::jsonb,
  exam_pack jsonb,
  created_at timestamptz default now()
);

alter table public.library_notes enable row level security;
drop policy if exists "Public can view approved library notes" on public.library_notes;
drop policy if exists "Authenticated users can submit library notes" on public.library_notes;
drop policy if exists "Anyone can read library notes" on public.library_notes;
drop policy if exists "Anyone can insert library notes" on public.library_notes;
drop policy if exists "Anyone can update library notes" on public.library_notes;
drop policy if exists "Anyone can delete library notes" on public.library_notes;

-- Public library RLS permissions
create policy "Anyone can read library notes" on public.library_notes for select using (true);
create policy "Anyone can insert library notes" on public.library_notes for insert with check (true);
create policy "Anyone can update library notes" on public.library_notes for update using (true);
create policy "Anyone can delete library notes" on public.library_notes for delete using (true);

-- Realtime publication for multi-user sync
alter publication supabase_realtime add table public.library_notes;
