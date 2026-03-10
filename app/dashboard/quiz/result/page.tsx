"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreCard } from '@/components/quiz/ScoreCard';
import { AnalysisPanel } from '@/components/quiz/AnalysisPanel';
import { Question, UserAnswer, QuizResult, AnalysisReport } from '@/lib/quiz/types';
import { calculateScore } from '@/utils/quiz/scoreCalculator';
import { Loader2, RefreshCcw, Home } from 'lucide-react';
import DashboardLayout from "@/components/dashboard-layout";

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<QuizResult | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            const storedQuestions = sessionStorage.getItem('quiz_questions');
            const storedAnswers = sessionStorage.getItem('quiz_answers');
            const storedAnalysis = sessionStorage.getItem('quiz_analysis');

            if (!storedQuestions || !storedAnswers) {
                router.push('/dashboard/quiz');
                return;
            }

            const questions = JSON.parse(storedQuestions) as Question[];
            const answers = JSON.parse(storedAnswers) as UserAnswer[];

            // Calculate local score
            const calculatedResult = calculateScore(answers, questions.length);
            setResult(calculatedResult);

            if (storedAnalysis) {
                setAnalysis(JSON.parse(storedAnalysis) as AnalysisReport);
            }
        };

        fetchResults();
    }, [router]);

    if (!result) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="py-12 px-4 sm:px-6 lg:px-8 font-sans max-w-6xl mx-auto">
                <div className="max-w-5xl mx-auto">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Performance Overview</h1>
                            <p className="text-slate-500 mt-2 text-lg">Detailed breakdown of your quiz attempt and learning insights.</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push('/dashboard/quiz/take')}
                                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
                            >
                                <RefreshCcw className="w-5 h-5 text-amber-500" />
                                Retake Quiz
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/quiz')}
                                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                <Home className="w-5 h-5" />
                                New Topic
                            </button>
                        </div>
                    </div>

                    <ScoreCard result={result} />

                    {analysis ? (
                        <AnalysisPanel analysis={analysis} />
                    ) : (
                        <div className="p-8 bg-amber-50 text-amber-800 border-2 border-amber-200 rounded-2xl text-center font-medium shadow-sm">
                            AI Analysis could not be generated for this attempt.
                        </div>
                    )}

                </div>
            </div>
        </DashboardLayout>
    );
}
