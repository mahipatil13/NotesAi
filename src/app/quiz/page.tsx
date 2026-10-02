'use client';

import React, { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSmartStudyStore } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award
} from 'lucide-react';

function QuizContent() {
  const { notes, personalDocs } = useSmartStudyStore();
  const searchParams = useSearchParams();
  const noteIdParam = searchParams.get('noteId');
  const personalDocIdParam = searchParams.get('personalDocId');

  const allAvailableNotes = [
    ...notes.filter((n) => n.examPack?.mcqs && n.examPack.mcqs.length > 0),
    ...personalDocs.filter((d) => d.examPack?.mcqs && d.examPack.mcqs.length > 0).map((d) => ({
      id: d.id,
      title: d.name,
      examPack: d.examPack,
      departmentId: 'personal',
      semesterNumber: 1,
    }))
  ];

  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    noteIdParam || personalDocIdParam || allAvailableNotes[0]?.id || ''
  );

  const activeNote = allAvailableNotes.find((n) => n.id === selectedNoteId) || allAvailableNotes[0];
  const mcqs = activeNote?.examPack?.mcqs || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = mcqs[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsCompleted(false);
  };

  const totalCorrect = Object.entries(userAnswers).filter(
    ([index, opt]) => mcqs[Number(index)]?.correctAnswer === opt
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              MCQ Practice Quiz
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Self-testing grounded in your semester notes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Note:</span>
            <select
              value={selectedNoteId}
              onChange={(e) => {
                setSelectedNoteId(e.target.value);
                handleRestart();
              }}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 max-w-xs focus:outline-none focus:border-indigo-500 font-medium"
            >
              {allAvailableNotes.map((n) => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quiz Body */}
        {mcqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No MCQs available</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Select another note with an exam pack or upload a new PDF.
            </p>
            <Link href="/dashboard" className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
              Go to Dashboard
            </Link>
          </div>
        ) : !isCompleted ? (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Header progress */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
              <span className="font-semibold text-indigo-600">
                Question {currentIndex + 1} of {mcqs.length}
              </span>
              <span className="line-clamp-1 max-w-xs">{activeNote.title}</span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = currentQuestion.correctAnswer === idx;

                let buttonStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                  } else {
                    buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  buttonStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">Explanation</div>
                <p className="text-slate-600 leading-relaxed">{currentQuestion.explanation}</p>
                {currentQuestion.source && (
                  <span className="text-[11px] text-slate-400 block pt-1">
                    Source: {currentQuestion.source}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Score: {totalCorrect} / {currentIndex + (isAnswerSubmitted ? 1 : 0)}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs shadow-xs transition-colors ${
                    selectedOption !== null
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <span>{currentIndex < mcqs.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Results Screen */
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-5 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Quiz Completed</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Your Score: {totalCorrect} / {mcqs.length}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {totalCorrect === mcqs.length
                  ? 'Great job! You mastered all questions in this unit.'
                  : 'Good practice! Review the flashcards for any concepts you missed.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <Link
                href="/flashcards"
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium"
              >
                Study Flashcards
              </Link>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

import AuthGuard from '@/components/AuthGuard';

export default function QuizPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] text-slate-500 flex items-center justify-center text-xs">Loading Quiz...</div>}>
        <QuizContent />
      </Suspense>
    </AuthGuard>
  );
}
