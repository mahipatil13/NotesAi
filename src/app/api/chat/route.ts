import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatRequestBody {
  messages: { role: 'user' | 'assistant'; content: string }[];
  mode?: 'Beginner' | 'Engineering Student' | 'Exam Answer' | 'Last-Minute Revision';
}

function getModePromptInstructions(mode: string): string {
  switch (mode) {
    case 'Beginner':
      return 'Explain concepts with clear, simple analogies and zero unnecessary jargon. Break down ideas step-by-step so a beginner can grasp the core intuition.';
    case 'Exam Answer':
      return 'Format the answer strictly as a University Examination 10-Mark Model Answer. Include: (1) Core Definition, (2) Governing Equations & Derivation, (3) Key Assumptions, (4) Labeled Diagram or Flowchart guidelines, and (5) Summary Conclusion to score maximum marks.';
    case 'Last-Minute Revision':
      return 'Provide high-yield bullet points only: core definitions, critical formulas with variable meanings, key differences/comparisons, and common exam traps to avoid.';
    case 'Engineering Student':
    default:
      return 'Provide a rigorous, college-level technical explanation with standard engineering notations, governing physical laws, and practical system implications.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { messages, mode = 'Engineering Student' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage?.content?.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty.' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey && geminiKey !== 'your-gemini-api-key-here') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: `You are Smart Study Academic Tutor, an expert college engineering and academic tutor. 
Your goal is to help university students master their syllabus and prepare for semester exams.
Style Guidelines:
- Ground your explanations in syllabus fundamentals.
- Do NOT use marketing buzzwords like "supercharge", "seamless", "tapestry", "game-changer", or corporate platitudes.
- Be direct, academically precise, and clear.
${getModePromptInstructions(mode)}`,
        });

        // Format history for Gemini chat
        const history = messages.slice(0, -1).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(latestMessage.content);
        const replyText = result.response.text();

        return NextResponse.json({
          reply: replyText,
          source: 'Gemini AI Academic Tutor',
        });
      } catch (geminiError) {
        console.error('Gemini chat generation failed, using syllabus fallback:', geminiError);
      }
    }

    // Deterministic academic syllabus fallback when API key is missing or quota exceeded
    const query = latestMessage.content.toLowerCase();
    let reply = '';
    const sources = ['Engineering Syllabus Handout', 'Recommended Textbooks'];

    if (query.includes('pn junction') || query.includes('diode')) {
      if (mode === 'Beginner') {
        reply = `Think of a **PN junction** like a one-way turnstile between two rooms:
- In the P-region, there are vacant seats (holes).
- In the N-region, there are free passengers (electrons).
When connected together, charges near the interface combine, creating an insulating **Depletion Region** with a built-in barrier potential of approximately **0.7V** for Silicon (0.3V for Germanium).`;
      } else if (mode === 'Exam Answer') {
        reply = `### University Examination Model Answer: PN Junction Diode

**1. Depletion Layer & Built-In Potential ($V_0$):**
When P-type and N-type silicon semiconductors join, majority carrier concentration gradients trigger spontaneous diffusion across the junction. Free electrons recombine with holes, leaving uncompensated donor ($N_D^+$) and acceptor ($N_A^-$) ions. The resulting internal space charge electric field prevents further diffusion.
Formula:
$$V_0 = \\frac{kT}{q} \\ln\\left(\\frac{N_A N_D}{n_i^2}\\right) \\approx 0.7\\text{ V (Si)}$$

**2. Forward Biasing:**
Applying external voltage $V > V_0$ (P connected to positive, N to negative) opposes the built-in field, narrowing the depletion layer and allowing exponential forward current:
$$I = I_s \\left(e^{\\frac{qV}{\\eta kT}} - 1\\right)$$

**3. Reverse Biasing:**
Applying opposite polarity widens the depletion width. Only negligible minority saturation current ($I_s$) flows until breakdown.`;
      } else if (mode === 'Last-Minute Revision') {
        reply = `**PN Junction Key Exam Facts:**
- **Barrier Potential:** 0.7 V (Silicon), 0.3 V (Germanium) at 300 K.
- **Forward Bias:** P $\\rightarrow$ Positive, N $\\rightarrow$ Negative. Depletion layer narrows, resistance drops.
- **Reverse Bias:** Depletion layer widens, current limited to minority leakage $I_s$.
- **Governing Law:** Shockley diode equation $I = I_s(e^{qV/\\eta kT} - 1)$.`;
      } else {
        reply = `In semiconductor physics, a **PN Junction** creates an equilibrium between diffusion and drift currents. The uncovered ion cores form a depletion region with a built-in potential $V_0 \\approx 0.7\\text{V}$ for Silicon. Under forward bias, the barrier height reduces, giving exponential conduction; under reverse bias, the barrier height increases, leaving only thermal leakage current.`;
      }
    } else {
      reply = `### Academic Review for "${latestMessage.content}"

**Key Concepts & Examination Focus:**
- Verify definitions, boundary conditions, and primary governing formulas from your lecture syllabus.
- When answering in semester exams, always present:
  1. Standard schematic or block diagram
  2. Mathematical statement with variable definitions
  3. Step-by-step derivation or operational explanation
  4. University conclusion highlighting engineering importance

*(Note: Connect your Gemini API key in \`.env.local\` as \`GEMINI_API_KEY\` for dynamic AI tutoring across any subject).*`;
    }

    return NextResponse.json({
      reply,
      sources,
      source: 'Syllabus Knowledge Base',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Chat server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
