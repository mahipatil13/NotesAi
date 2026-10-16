'use client';

import React, { useState, use, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSmartStudyStore } from '@/lib/store';
import Link from 'next/link';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  ArrowLeft,
  Columns,
  ExternalLink,
  Upload,
  Download,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { getPdfBlob, storePdfBlob } from '@/lib/pdfStorage';
import { useRouter } from 'next/navigation';

import AuthGuard from '@/components/AuthGuard';

export default function DocumentWorkspacePage({
  params
}: {
  params: Promise<{ documentId: string }>
}) {
  const resolvedParams = use(params);
  const documentId = resolvedParams.documentId;
  const router = useRouter();
  const { user, notes, personalDocs, deletePersonalDoc, deleteLibraryNote } = useSmartStudyStore();
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  // Find document either in library notes or personal documents
  const currentDoc = 
    notes.find((n) => n.id === documentId) || 
    personalDocs.find((d) => d.id === documentId) || 
    notes[0] ||
    personalDocs[0];

  const docTitle = currentDoc ? ('title' in currentDoc ? currentDoc.title : (currentDoc as { name: string }).name) : '';
  const examPack = currentDoc?.examPack;

  // Workspace layout mode: split (side-by-side) | pdf (original only) | summary (ai summarize only)
  const [viewMode, setViewMode] = useState<'split' | 'pdf' | 'summary'>('split');

  // PDF Viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'summary' | 'keyConcepts' | 'definitions' | 'questions'>('summary');

  // Real PDF document source
  const [pdfSourceUrl, setPdfSourceUrl] = useState<string | null>(null);
  const [isAttachingPdf, setIsAttachingPdf] = useState(false);
  const attachInputRef = useRef<HTMLInputElement>(null);

  const totalPages = (currentDoc as { pages?: number }).pages || 28;

  useEffect(() => {
    let isCancelled = false;
    let createdBlobUrl: string | null = null;

    async function resolveDocumentPdf() {
      // 1. Check IndexedDB for client-stored blob (highest fidelity)
      try {
        const blob = await getPdfBlob(documentId);
        if (blob && !isCancelled) {
          createdBlobUrl = URL.createObjectURL(blob);
          setPdfSourceUrl(createdBlobUrl);
          return;
        }
      } catch (err) {
        console.warn('Error reading from IndexedDB:', err);
      }

      // 2. Check server-stored file at /api/documents/[documentId]
      try {
        const res = await fetch(`/api/documents/${documentId}`, { method: 'HEAD' });
        if (res.ok && !isCancelled) {
          setPdfSourceUrl(`/api/documents/${documentId}`);
          return;
        }
      } catch {
        // server endpoint head check error ignored
      }

      // 3. Fallback to doc's fileUrl property if set
      if (currentDoc && (currentDoc as { fileUrl?: string }).fileUrl && !isCancelled) {
        setPdfSourceUrl((currentDoc as { fileUrl?: string }).fileUrl!);
      }
    }

    resolveDocumentPdf();

    return () => {
      isCancelled = true;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [documentId, currentDoc]);

  const handleAttachPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAttachingPdf(true);
    try {
      await storePdfBlob(documentId, file);
      const newUrl = URL.createObjectURL(file);
      setPdfSourceUrl(newUrl);

      // Upload to server so it is also saved on disk
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', docTitle);
      formData.append('documentId', documentId);
      await fetch('/api/generate-exam-pack', {
        method: 'POST',
        body: formData
      });
    } catch {
      console.error('Failed to attach PDF:');
    } finally {
      setIsAttachingPdf(false);
      e.target.value = '';
    }
  };

  const handlePageJump = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Delete handler with ownership check
  const handleDelete = async () => {
    const isPersonal = personalDocs.some((d) => d.id === documentId);
    const isLibrary = notes.some((n) => n.id === documentId);
    const title = docTitle;

    if (!confirm(`Are you sure you want to delete "${title}" permanently?`)) return;

    let result: { success: boolean; message?: string };
    if (isPersonal) {
      result = await deletePersonalDoc(documentId, user);
    } else if (isLibrary) {
      result = await deleteLibraryNote(documentId, user);
    } else {
      result = { success: false, message: 'Document not found in your workspace.' };
    }

    if (result.success) {
      router.push(isPersonal ? '/dashboard' : '/library');
    } else {
      setDeleteError(result.message || 'Delete failed');
      setTimeout(() => setDeleteError(null), 4000);
    }
  };

  const canDelete = (() => {
    if (user.role === 'superadmin') return true;
    const personalDoc = personalDocs.find((d) => d.id === documentId);
    const libraryNote = notes.find((n) => n.id === documentId);
    if (personalDoc) {
      return !personalDoc.uploaderId || personalDoc.uploaderId === user.id ||
        (personalDoc.uploaderName && personalDoc.uploaderName.toLowerCase() === user.name.toLowerCase());
    }
    if (libraryNote) {
      return (libraryNote.uploaderId && libraryNote.uploaderId === user.id) ||
        (libraryNote.uploaderName && libraryNote.uploaderName.toLowerCase() === user.name.toLowerCase());
    }
    return false;
  })();

  if (!currentDoc) {
    return (
      <AuthGuard>
        <div className="workspace-theme min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h1 className="text-lg font-bold text-slate-900 mb-1">Document Not Found</h1>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                This study pack is not available in your workspace or may have been deleted.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs"
                >
                  Return to Dashboard
                </Link>
                <Link
                  href="/library"
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs"
                >
                  Browse Library
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="workspace-theme min-h-screen flex flex-col">
        <Navbar />

        {/* Top Workspace Toolbar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* Document Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/library"
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Library</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {docTitle}
              </span>
            </div>
          </div>

          {/* View Mode & Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            
            {/* Mode Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'split' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3 h-3" />
                <span>Side-by-Side</span>
              </button>

              <button
                onClick={() => setViewMode('pdf')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'pdf' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Original PDF</span>
              </button>

              <button
                onClick={() => setViewMode('summary')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'summary' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Summarize</span>
              </button>
            </div>

            {/* Open Original Document Action */}
            <button
              onClick={() => {
                if (pdfSourceUrl) {
                  window.open(pdfSourceUrl, '_blank');
                } else {
                  setViewMode('pdf');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors"
              title="Open or focus original document"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Open Original Document</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
              title="Print exam pack"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            {/* Owner-only or Superadmin Delete */}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition-colors"
                title="Delete this document (owner or superadmin only)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

        </div>

        {/* Delete Error Banner */}
        {deleteError && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-700 font-semibold flex items-center justify-between">
            <span>⚠️ {deleteError}</span>
            <button onClick={() => setDeleteError(null)} className="text-rose-500 hover:text-rose-700 ml-3">✕</button>
          </div>
        )}

        {/* Main Workspace Layout */}
        <main className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
          
          {/* LEFT PANEL: Original PDF Document (shown in split or pdf mode) */}
          {(viewMode === 'split' || viewMode === 'pdf') && (
            <div className={`${
              viewMode === 'split' ? 'lg:w-1/2' : 'w-full'
            } flex flex-col border-r border-slate-200 bg-slate-100/70 p-3 sm:p-4 overflow-hidden min-h-[600px] h-[calc(100vh-112px)]`}>
              
              {/* PDF Controls Bar */}
              <div className="bg-white rounded-lg border border-slate-200 p-2 flex items-center justify-between mb-3 text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Original Document</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  {pdfSourceUrl ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Uploaded PDF Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <span>Syllabus Guide Preview</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {pdfSourceUrl && (
                    <>
                      <a
                        href={pdfSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        title="Open PDF in new tab"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                        <span>Pop Out</span>
                      </a>
                      <a
                        href={pdfSourceUrl}
                        download={`${docTitle}.pdf`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        title="Download original file"
                      >
                        <Download className="w-3 h-3 text-slate-500" />
                        <span>Download</span>
                      </a>
                    </>
                  )}

                  <button
                    onClick={() => attachInputRef.current?.click()}
                    disabled={isAttachingPdf}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors disabled:opacity-50"
                    title={pdfSourceUrl ? "Replace with different PDF" : "Attach real PDF"}
                  >
                    <Upload className="w-3 h-3" />
                    <span>{isAttachingPdf ? 'Uploading...' : pdfSourceUrl ? 'Replace PDF' : 'Upload PDF'}</span>
                  </button>
                  <input
                    ref={attachInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleAttachPdf}
                  />
                </div>
              </div>

              {/* Main Document Viewer Container */}
              <div className="flex-1 w-full h-full relative overflow-hidden bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
                {pdfSourceUrl ? (
                  /* AUTHENTIC ORIGINAL PDF EMBEDDED IN NATIVE BROWSER VIEWER */
                  <iframe
                    src={`${pdfSourceUrl}#page=${currentPage}&toolbar=1&navpanes=1`}
                    className="w-full h-full border-0 rounded-xl bg-white"
                    title={docTitle}
                  />
                ) : (
                  /* FALLBACK SYLLABUS DOCUMENT WHEN ORIGINAL PDF IS NOT YET ATTACHED */
                  <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-slate-50/50">
                    <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <p className="font-bold text-amber-900 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-amber-700" />
                          <span>Original PDF not attached to this demo note</span>
                        </p>
                        <p className="text-amber-800 mt-1">
                          Upload your lecture or syllabus PDF to display the authentic original document directly here.
                        </p>
                      </div>
                      <button
                        onClick={() => attachInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload PDF Document</span>
                      </button>
                    </div>

                    {/* Tailored syllabus document reflecting THIS note's actual title and content */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs text-slate-400 font-mono">
                        <span>STUDY GUIDE DOCUMENT</span>
                        <span>PAGE 1 OF {totalPages}</span>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                          Curriculum Unit Overview
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 leading-snug">
                          {docTitle}
                        </h2>
                        {'description' in currentDoc && currentDoc.description && (
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            {currentDoc.description}
                          </p>
                        )}
                      </div>

                      {examPack?.summary && (
                        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                          <h4 className="font-bold text-slate-900 mb-2 uppercase text-[11px] text-indigo-600 tracking-wide">
                            Key Exam Summary & Objectives
                          </h4>
                          {examPack.summary}
                        </div>
                      )}

                      {examPack?.keyConcepts && examPack.keyConcepts.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <h4 className="font-bold text-slate-900 uppercase text-[11px] text-indigo-600 tracking-wide">
                            Primary Concepts in this Document
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {examPack.keyConcepts.map((kc, idx) => (
                              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-bold text-slate-900">{kc.title}</span>
                                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-indigo-50 text-indigo-700">
                                    {kc.importance}
                                  </span>
                                </div>
                                <p className="text-slate-600">{kc.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* RIGHT PANEL: AI Summarize & Exam Pack (shown in split or summary mode) */}
          {(viewMode === 'split' || viewMode === 'summary') && (
            <div className={`${
              viewMode === 'split' ? 'lg:w-1/2' : 'w-full'
            } flex flex-col bg-white overflow-hidden`}>
              
              {/* Tab Navigation */}
              <div className="border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none bg-slate-50/50">
                <span className="font-bold text-slate-700 text-xs mr-1 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Exam Pack:</span>
                </span>

                {(['summary', 'keyConcepts', 'definitions', 'questions'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab === 'questions' ? '1, 2 & 10-Mark Qs' : tab === 'keyConcepts' ? 'Key Concepts' : tab}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
                
                {/* Unit Summary */}
                {activeTab === 'summary' && examPack && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Unit Summary & Key Takeaways</span>
                      <button 
                        onClick={() => handlePageJump(1)}
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <span>Jump to Page 1 in PDF</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                      {examPack.summary}
                    </div>
                  </div>
                )}

                {/* Key Concepts */}
                {activeTab === 'keyConcepts' && examPack && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">High-Yield Exam Concepts</span>
                    {examPack.keyConcepts.map((kc, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{kc.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {kc.importance} Priority
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{kc.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Definitions with Page Jump */}
                {activeTab === 'definitions' && examPack && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Key Definitions with Direct PDF Page Jump</span>
                    {examPack.definitions.map((def, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-indigo-600 text-xs sm:text-sm">{def.term}</span>
                          <button
                            onClick={() => handlePageJump(Math.min(totalPages, idx + 1))}
                            className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline font-semibold bg-indigo-50 px-2 py-0.5 rounded"
                          >
                            <span>{def.source}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{def.definition}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 1, 2, and 10-Mark Questions */}
                {activeTab === 'questions' && examPack && (
                  <div className="space-y-5">
                    {/* 1-Mark */}
                    {examPack.oneMarkQuestions.length > 0 && (
                      <div>
                        <h4 className="font-bold text-xs text-indigo-600 mb-2 uppercase tracking-wide">1-Mark Definition Questions</h4>
                        <div className="space-y-2">
                          {examPack.oneMarkQuestions.map((q, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-slate-900">{idx + 1}. {q.question}</p>
                                <button
                                  onClick={() => handlePageJump(Math.min(totalPages, idx + 2))}
                                  className="text-[10px] text-indigo-600 hover:underline shrink-0 ml-2"
                                >
                                  {q.source}
                                </button>
                              </div>
                              <p className="text-slate-600 leading-relaxed"><strong className="text-indigo-600">Ans:</strong> {q.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2-Mark */}
                    {examPack.twoMarkQuestions.length > 0 && (
                      <div>
                        <h4 className="font-bold text-xs text-indigo-600 mb-2 uppercase tracking-wide">2-Mark Conceptual Questions</h4>
                        <div className="space-y-2">
                          {examPack.twoMarkQuestions.map((q, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-slate-900">{idx + 1}. {q.question}</p>
                                <button
                                  onClick={() => handlePageJump(Math.min(totalPages, idx + 3))}
                                  className="text-[10px] text-indigo-600 hover:underline shrink-0 ml-2"
                                >
                                  {q.source}
                                </button>
                              </div>
                              <p className="text-slate-600 whitespace-pre-line leading-relaxed mb-2">{q.answer}</p>
                              <div className="flex flex-wrap gap-1">
                                {q.keyPoints.map((kp, kidx) => (
                                  <span key={kidx} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                    ✓ {kp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 10-Mark */}
                    {examPack.tenMarkQuestions.length > 0 && (
                      <div>
                        <h4 className="font-bold text-xs text-indigo-600 mb-2 uppercase tracking-wide">10-Mark University Long Answer & Derivations</h4>
                        <div className="space-y-3">
                          {examPack.tenMarkQuestions.map((q, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs text-xs">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-bold text-slate-900 text-xs sm:text-sm">{idx + 1}. {q.question}</p>
                                <button
                                  onClick={() => handlePageJump(Math.min(totalPages, idx + 4))}
                                  className="text-[10px] text-indigo-600 hover:underline shrink-0 ml-2 font-mono"
                                >
                                  {q.source}
                                </button>
                              </div>

                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed mb-3">
                                {q.fullExplanation}
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {q.answerStructure.map((step, sidx) => (
                                  <span key={sidx} className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                                    {step}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
