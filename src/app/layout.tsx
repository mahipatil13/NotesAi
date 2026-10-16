import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://smartstudy.app'),
  title: {
    default: "Smart Study | College Exam Preparation & Syllabus Notes",
    template: "%s | Smart Study",
  },
  description: "Distraction-free academic study platform for engineering and college students. Convert lecture PDFs into structured 1-mark definitions, 2-mark conceptual questions, and 10-mark university answers with page citations.",
  keywords: ["engineering notes", "exam preparation", "semester syllabus", "university question bank", "lecture summary", "college study packs"],
  authors: [{ name: "Smart Study Academic Community" }],
  openGraph: {
    title: "Smart Study | College Exam Preparation & Syllabus Notes",
    description: "Convert lecture PDFs into structured 1-mark definitions, 2-mark conceptual questions, and 10-mark university model answers.",
    url: "https://smartstudy.app",
    siteName: "Smart Study",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Study | College Exam Preparation & Syllabus Notes",
    description: "Structured syllabus exam preparation grounded in real lecture PDFs with exact page citations.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
