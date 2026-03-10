"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizCard } from '@/components/quiz/QuizCard';
import { Question, UserAnswer } from '@/lib/quiz/types';
import { Loader2 } from 'lucide-react';
import DashboardLayout from "@/components/dashboard-layout";

export default function QuizPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Load questions from session storage
        const stored = sessionStorage.getItem('quiz_questions');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setQuestions(parsed);
                } else {
                    router.push('/dashboard/quiz');
                }
            } catch (e) {
                router.push('/dashboard/quiz');
            }
        } else {
            router.push('/dashboard/quiz');
        }
    }, [router]);

    const handleQuizFinish = async (answers: UserAnswer[]) => {
        setIsSubmitting(true);
        try {
            // Save answers to session storage for the results page
            sessionStorage.setItem('quiz_answers', JSON.stringify(answers));

            // Generate the AI analysis report
            const res = await fetch('/api/analyse-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions, userAnswers: answers })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to analyze results.");
            }

            const data = await res.json();
            sessionStorage.setItem('quiz_analysis', JSON.stringify(data.analysis));

            // Navigate to results page
            router.push('/dashboard/quiz/result');
        } catch (error) {
            console.error("Error finishing quiz:", error);
            alert("Error analyzing quiz results. However, your score will still be calculated.");
            router.push('/dashboard/quiz/result');
        }
    };

    if (questions.length === 0) {
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
            <div className="py-12 px-4 font-sans max-w-5xl mx-auto">
                <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center px-4">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Interactive Quiz
                    </h1>
                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to end this quiz? Your progress will be lost.")) {
                                router.push('/dashboard/quiz');
                            }
                        }}
                        className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                    >
                        Exit Quiz
                    </button>
                </div>

                {isSubmitting ? (
                    <div className="w-full max-w-2xl mx-auto mt-20 p-12 bg-white rounded-3xl shadow-xl border border-slate-100 text-center flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Your Performance...</h2>
                        <p className="text-slate-500">Our AI coach is reviewing your answers to provide personalized feedback.</p>
                    </div>
                ) : (
                    <QuizCard
                        questions={questions}
                        onFinish={handleQuizFinish}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
