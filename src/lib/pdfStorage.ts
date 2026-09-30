'use client';

import { supabase, isSupabaseConfigured } from './supabase';

const DB_NAME = 'SmartStudyDocsDB';
const STORE_NAME = 'uploaded_pdfs';
const DB_VERSION = 1;
const BUCKET_NAME = 'document-pdfs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Store PDF blob in local IndexedDB AND upload to Supabase Storage (if configured)
 */
export async function storePdfBlob(docId: string, file: Blob): Promise<void> {
  // 1. Save to local IndexedDB first for fast instant playback
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(file, docId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB storage notice:', err);
  }

  // 2. Upload to Supabase Storage Bucket for multi-user global access
  if (isSupabaseConfigured()) {
    try {
      const fileName = `${docId}.pdf`;
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type || 'application/pdf',
        });

      if (error) {
        console.warn('Supabase storage upload notice (local cache active):', error.message);
      }
    } catch (sErr) {
      console.warn('Failed to upload blob to Supabase storage:', sErr);
    }
  }
}

/**
 * Retrieve PDF blob: Check local IndexedDB first, then fallback to Supabase Storage
 */
export async function getPdfBlob(docId: string): Promise<Blob | null> {
  // 1. Try local IndexedDB
  try {
    const db = await openDB();
    const localBlob = await new Promise<Blob | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(docId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    if (localBlob) return localBlob;
  } catch (err) {
    console.warn('IndexedDB read notice:', err);
  }

  // 2. Fallback to Supabase Cloud Storage
  if (isSupabaseConfigured()) {
    try {
      const fileName = `${docId}.pdf`;
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(fileName);

      if (!error && data) {
        // Cache back into IndexedDB for next time
        try {
          const db = await openDB();
          const tx = db.transaction(STORE_NAME, 'readwrite');
          tx.objectStore(STORE_NAME).put(data, docId);
        } catch {}
        return data;
      }
    } catch (sErr) {
      console.warn('Failed to fetch blob from Supabase storage:', sErr);
    }
  }

  return null;
}

/**
 * Delete PDF blob from local IndexedDB and Supabase Storage
 */
export async function deletePdfBlob(docId: string): Promise<void> {
  // 1. Delete from local IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(docId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete notice:', err);
  }

  // 2. Delete from Supabase Storage
  if (isSupabaseConfigured()) {
    try {
      const fileName = `${docId}.pdf`;
      await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    } catch (sErr) {
      console.warn('Failed to delete blob from Supabase storage:', sErr);
    }
  }
}
