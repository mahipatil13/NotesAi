'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSmartStudyStore } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  Bot, 
  User, 
  Lightbulb
} from 'lucide-react';
import { ChatMessage } from '@/lib/types';

function ChatContent() {
  const { chatMessages, saveChat, incrementUsage, usage } = useSmartStudyStore();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');

  const [input, setInput] = useState(queryParam || '');
  const [selectedMode, setSelectedMode] = useState<'Beginner' | 'Engineering Student' | 'Exam Answer' | 'Last-Minute Revision'>('Engineering Student');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const quickPrompts = [
    'Explain PN junction barrier potential in simple words',
    'How does forward bias differ from reverse bias?',
    'What is the time complexity of Linked List insertion?',
    'Give me a 10-mark university answer for Zener Diode',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
      mode: selectedMode,
    };

    const newMessages = [...chatMessages, userMessage];
    saveChat(newMessages);
    setInput('');
    setIsTyping(true);
    incrementUsage('ai');

    setTimeout(() => {
      let aiResponse = '';
      let sources: string[] = ['Unit 3 — PN Junction Diodes.pdf, Pages 7–12'];

      const lower = text.toLowerCase();
      if (lower.includes('pn junction') || lower.includes('barrier') || lower.includes('forward bias') || lower.includes('reverse bias') || lower.includes('diode')) {
        if (selectedMode === 'Beginner') {
          aiResponse = `Think of a **PN junction** like a one-way security gate between two rooms:
- In the P-room, people have empty seats (holes).
- In the N-room, people have extra tickets (electrons).
When they touch, electrons near the door shake hands with holes and get stuck in place. This forms a "do not cross" zone called the **Depletion Region**, creating an invisible fence of **0.7 Volts** (for Silicon).
When you connect battery power in forward bias, you push through the fence and current floods through easily!`;
        } else if (selectedMode === 'Exam Answer') {
          aiResponse = `### University Examination Model Answer: PN Junction Diode Operation

**1. Formation of Depletion Region & Built-in Potential ($V_0$):**
When p-type and n-type silicon semiconductors form a metallurgical junction, the majority carrier concentration gradient triggers spontaneous diffusion. Free electrons diffuse into the p-region leaving immobile donor ions ($N_D^+$), while holes diffuse into the n-region leaving immobile acceptor ions ($N_A^-$). The resulting internal space charge electric field halts further diffusion.
Formula:
$$V_0 = \\frac{kT}{q} \\ln\\left(\\frac{N_A N_D}{n_i^2}\\right) \\approx 0.7\\text{ V for Si at 300K}$$

**2. Forward Biasing:**
Applying $V > V_0$ with positive terminal to P and negative to N lowers the potential barrier. Depletion width narrows, resulting in exponential current governed by the Shockley Diode Equation:
$$I = I_s \\left(e^{qV / \\eta kT} - 1\\right)$$

**3. Reverse Biasing:**
Applying opposite polarity pulls majority carriers away, widening the depletion region. Only negligible minority saturation current ($I_0$) flows until avalanche or Zener breakdown occurs.`;
        } else if (selectedMode === 'Last-Minute Revision') {
          aiResponse = `⚡ **Last-Minute 4 Key Takeaways:**
1. **Barrier Potential:** $0.7\\text{ V}$ (Silicon), $0.3\\text{ V}$ (Germanium) at $300\\text{ K}$.
2. **Forward Bias:** P $\\rightarrow$ Positive, N $\\rightarrow$ Negative. Depletion layer narrows $\\rightarrow$ High conduction.
3. **Reverse Bias:** P $\\rightarrow$ Negative, N $\\rightarrow$ Positive. Depletion layer widens $\\rightarrow$ Nanoscale leakage current.
4. **Equation to write:** Shockley diode formula $I = I_s (e^{qV/\\eta kT} - 1)$.`;
        } else {
          aiResponse = `In semiconductor physics, a **PN Junction** creates an equilibrium between diffusion drift forces. 
- The immobile ion cores formulate the **depletion layer**, devoid of free mobile carriers.
- Under **forward bias**, the external electric field counteracts the built-in barrier ($0.7\\text{V}$ for Silicon), collapsing the depletion width and facilitating high majority carrier diffusion.
- Under **reverse bias**, the applied potential adds constructively to the built-in barrier, widening the depletion region and permitting only thermally generated minority carriers to cross.`;
        }
      } else {
        aiResponse = `Based on your indexed course notes, here is the syllabus-grounded breakdown for **"${text}"** under **${selectedMode}** mode:
- The fundamental definitions and formulas were verified against your uploaded materials.
- In semester examinations, ensure to explicitly draw schematic block diagrams and write boundary conditions to secure maximum marks.`;
        sources = ['Data Structures — Unit 1.pdf, Page 14', 'Course Syllabus Handout'];
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        sources,
        timestamp: 'Just now',
        mode: selectedMode,
      };

      saveChat([...newMessages, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col">
        
        {/* Header with Mode Toggles */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Tutor Chat</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Answers grounded in your notes with page references.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {(['Beginner', 'Engineering Student', 'Exam Answer', 'Last-Minute Revision'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedMode === mode
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Message Window */}
        <div className="flex-1 min-h-[420px] bg-white rounded-xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-4 mb-4 shadow-xs">
          {chatMessages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    isBot
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] space-y-1.5 ${isBot ? 'text-left' : 'text-right'}`}>
                  {msg.mode && isBot && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block">
                      {msg.mode} Mode
                    </span>
                  )}
                  
                  <div
                    className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                      isBot
                        ? 'bg-slate-50 border border-slate-200 text-slate-800'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-500 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-600" />
                        Source:
                      </span>
                      {msg.sources.map((src, sidx) => (
                        <span key={sidx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span>Searching note chunks and drafting answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative"
        >
          <input
            type="text"
            placeholder={`Ask a question based on your notes (${selectedMode} mode)...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              input.trim() && !isTyping
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </main>

      <Footer />
    </div>
  );
}

import AuthGuard from '@/components/AuthGuard';

export default function ChatPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] text-slate-500 flex items-center justify-center text-xs">Loading AI Tutor...</div>}>
        <ChatContent />
      </Suspense>
    </AuthGuard>
  );
}
