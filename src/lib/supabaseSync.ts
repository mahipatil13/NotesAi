import { supabase, isSupabaseConfigured } from './supabase';
import { LibraryNote } from './types';

// Map database row to LibraryNote interface
export function mapSupabaseToLibraryNote(row: any): LibraryNote {
  return {
    id: row.id,
    subjectId: row.subject_id || row.subjectId || 'sub-1',
    departmentId: row.department_id || row.departmentId || 'cse',
    semesterNumber: Number(row.semester_number || row.semesterNumber || 3),
    title: row.title || 'Untitled Note',
    description: row.description || '',
    uploaderName: row.uploader_name || row.uploaderName || 'Community Member',
    uploaderId: row.uploader_id || row.uploaderId,
    uploaderEmail: row.uploader_email || row.uploaderEmail,
    pages: Number(row.pages || 12),
    fileSize: row.file_size || row.fileSize || '2.4 MB',
    status: (row.status as 'APPROVED' | 'PENDING' | 'REJECTED') || 'PENDING',
    rejectionReason: row.rejection_reason || row.rejectionReason,
    isPrivateGroup: Boolean(row.is_private_group || row.isPrivateGroup),
    tags: Array.isArray(row.tags) ? row.tags : ['Syllabus', 'Exam Pack'],
    downloads: Number(row.downloads || 0),
    views: Number(row.views || 1),
    rating: Number(row.rating || 5.0),
    uploadedAt: row.uploaded_at || row.uploadedAt || 'Recently',
    examPack: row.exam_pack || row.examPack || undefined,
  };
}

// Map LibraryNote to Supabase PostgreSQL schema
export function mapLibraryNoteToSupabase(note: LibraryNote): any {
  return {
    id: note.id,
    subject_id: note.subjectId,
    department_id: note.departmentId,
    semester_number: note.semesterNumber,
    title: note.title,
    description: note.description,
    uploader_name: note.uploaderName,
    uploader_id: note.uploaderId,
    uploader_email: note.uploaderEmail,
    pages: note.pages,
    file_size: note.fileSize,
    status: note.status,
    rejection_reason: note.rejectionReason || null,
    is_private_group: Boolean(note.isPrivateGroup),
    tags: note.tags,
    downloads: note.downloads || 0,
    views: note.views || 1,
    rating: note.rating || 5.0,
    uploaded_at: note.uploadedAt,
    exam_pack: note.examPack || null,
  };
}

/**
 * Fetch all shared notes from Supabase Cloud PostgreSQL
 */
export async function fetchNotesFromSupabase(): Promise<LibraryNote[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch query notice (using local storage fallback):', error.message);
      return null;
    }

    if (data && Array.isArray(data)) {
      return data.map(mapSupabaseToLibraryNote);
    }
    return null;
  } catch (err) {
    console.warn('Supabase network error during fetch:', err);
    return null;
  }
}

/**
 * Save or insert a note to Supabase Cloud Database
 */
export async function saveNoteToSupabase(note: LibraryNote): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const payload = mapLibraryNoteToSupabase(note);
    const { error } = await supabase.from('notes').upsert(payload);

    if (error) {
      console.warn('Supabase upsert note error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save note to Supabase:', err);
    return false;
  }
}

/**
 * Update moderation status of a note (Superadmin action)
 */
export async function updateNoteStatusInSupabase(
  noteId: string, 
  status: 'APPROVED' | 'REJECTED' | 'PENDING', 
  rejectionReason?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const updateData: any = { status };
    if (rejectionReason !== undefined) {
      updateData.rejection_reason = rejectionReason;
    }

    const { error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', noteId);

    if (error) {
      console.warn('Supabase status update error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to update note status in Supabase:', err);
    return false;
  }
}

/**
 * Delete a note from Supabase Cloud Database
 */
export async function deleteNoteFromSupabase(noteId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    if (error) {
      console.warn('Supabase delete note error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete note from Supabase:', err);
    return false;
  }
}

/**
 * Real-time subscription listener for multi-user instant updates
 */
export function subscribeToSupabaseNotes(onUpdate: () => void) {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const channel = supabase
      .channel('public:notes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Failed to subscribe to Supabase realtime channel:', err);
    return () => {};
  }
}
