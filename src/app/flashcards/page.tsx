'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSmartStudyStore } from '@/lib/store';
import Link from 'next/link';
import { 
  Layers, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

import AuthGuard from '@/components/AuthGuard';

export default function FlashcardsPage() {
  const { notes, personalDocs } = useSmartStudyStore();

  const allNotesWithFlashcards = [
    ...notes.filter((n) => n.examPack?.flashcards && n.examPack.flashcards.length > 0),
    ...personalDocs.filter((d) => d.examPack?.flashcards && d.examPack.flashcards.length > 0).map((d) => ({
      id: d.id,
      title: d.name,
      examPack: d.examPack,
      departmentId: 'personal',
    }))
  ];

  const [selectedNoteId, setSelectedNoteId] = useState(allNotesWithFlashcards[0]?.id || '');
  const activeNote = allNotesWithFlashcards.find((n) => n.id === selectedNoteId) || allNotesWithFlashcards[0];
  const flashcards = activeNote?.examPack?.flashcards || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
  };

  return (
    <AuthGuard>
      <div className="workspace-theme min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col justify-center">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Flashcards
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick recall and active memory revision.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Note:</span>
              <select
                value={selectedNoteId}
                onChange={(e) => {
                  setSelectedNoteId(e.target.value);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 max-w-xs focus:outline-none focus:border-indigo-500 font-medium"
              >
                {allNotesWithFlashcards.map((n) => (
                  <option key={n.id} value={n.id}>{n.title}</option>
                ))}
              </select>
            </div>
          </div>

          {flashcards.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800">No flashcards available</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Select another note or generate a new exam pack.
              </p>
              <Link href="/dashboard" className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Card Counter & Tag */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600">
                  Card {currentIndex + 1} of {flashcards.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">
                  {currentCard.category}
                </span>
              </div>

              {/* Clean White Flashcard */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[260px] sm:min-h-[280px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all border border-slate-200 bg-white shadow-xs hover:border-slate-300"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">
                    {isFlipped ? 'Answer' : 'Question / Concept'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-indigo-600">
                    <RotateCw className="w-3 h-3" />
                    <span>Click to flip</span>
                  </span>
                </div>

                {/* Content */}
                <div className="py-4 text-center">
                  {!isFlipped ? (
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {currentCard.front}
                    </h3>
                  ) : (
                    <p className="text-base sm:text-lg text-indigo-950 font-medium leading-relaxed">
                      {currentCard.back}
                    </p>
                  )}
                </div>

                <div className="text-center pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  {isFlipped ? 'Click to show question' : 'Click to reveal answer'}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold"
                >
                  {isFlipped ? 'Show Question' : 'Reveal Answer'}
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
