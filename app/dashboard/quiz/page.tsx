"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SourceSelector, SourceType } from '@/components/quiz/SourceSelector';
import { UploadBox } from '@/components/quiz/UploadBox';
import { BrainCircuit, Loader2, Wand2 } from 'lucide-react';
import { cleanText } from '@/lib/quiz/textCleaner';
import { chunkText } from '@/lib/quiz/textChunker';
import DashboardLayout from "@/components/dashboard-layout";

export default function Home() {
  const router = useRouter();
  const [source, setSource] = useState<SourceType>('text');
  const [textInput, setTextInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const startQuizGeneration = async (chunks: string[]) => {
    setLoadingStep("AI is crafting your quiz questions...");
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chunks })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz.");

      // Store questions in session storage and navigate
      sessionStorage.setItem('quiz_questions', JSON.stringify(data.questions));
      router.push('/dashboard/quiz/take');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const processContent = (rawText: string) => {
    setLoadingStep("Cleaning and preparing text...");
    const cleaned = cleanText(rawText);
    if (!cleaned || cleaned.length < 50) {
      setError("The provided content is too short to generate a meaningful quiz.");
      setIsLoading(false);
      return;
    }
    const chunks = chunkText(cleaned, 400); // 400 words per chunk to be safe with limits
    startQuizGeneration(chunks);
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (source === 'text') {
        if (!textInput.trim()) {
          throw new Error("Please enter some text.");
        }
        processContent(textInput);
      } else if (source === 'youtube') {
        if (!textInput.trim()) {
          throw new Error("Please paste the YouTube transcript.");
        }
        processContent(textInput);

      } else if (source === 'pdf') {
        if (!pdfFile) {
          throw new Error("Please select a PDF file.");
        }
        setLoadingStep("Reading PDF document...");
        const formData = new FormData();
        formData.append("file", pdfFile);

        const res = await fetch('/api/extract-pdf', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        processContent(data.text);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="py-16 px-4 font-sans text-slate-800 flex flex-col items-center">
        <div className="max-w-3xl w-full text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-full mb-6">
            <BrainCircuit className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            AI Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600">Quiz Generator</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Transform any document, video, or text into an interactive learning experience.
            Master complex topics through AI-powered conceptual questioning.
          </p>
        </div>

        <div className="w-full max-w-3xl bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 mt-2 hover:shadow-2xl transition-all duration-300">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">1. Choose your learning material</h3>
            <SourceSelector selectedSource={source} onSelect={setSource} disabled={isLoading} />
          </div>

          <div className="mb-8 min-h-[150px]">
            {source === 'text' && (
              <textarea
                className="w-full h-48 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all resize-none text-slate-700 placeholder-slate-400"
                placeholder="Paste your study notes, article, or any text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isLoading}
              />
            )}

            {source === 'youtube' && (
              <div className="flex flex-col gap-4">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    How to get a YouTube Transcript:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open your required video on <a href="https://youtube.com" target="_blank" rel="noreferrer" className="underline font-medium hover:text-amber-900">YouTube</a>.</li>
                    <li>Click on the video description.</li>
                    <li>Scroll down and click <b>"Show Transcript"</b>.</li>
                    <li>Select all the transcript text, right-click, and select <b>Copy</b>.</li>
                    <li>Paste the text into the box below.</li>
                  </ol>
                </div>
                <textarea
                  className="w-full h-48 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all resize-none text-slate-700 placeholder-slate-400"
                  placeholder="Paste the YouTube transcript here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {source === 'pdf' && (
              <UploadBox
                onFileSelect={(f) => setPdfFile(f)}
                isLoading={isLoading}
              />
            )}
            {source === 'pdf' && pdfFile && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium flex items-center justify-center border border-emerald-100">
                Selected: {pdfFile.name}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all 
                    ${isLoading ? 'bg-amber-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:shadow-amber-200 hover:-translate-y-0.5'}
                 `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {loadingStep}
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  Generate Interactive Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
