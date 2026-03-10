import React from 'react';
import { QuizResult } from '@/lib/quiz/types';
import { Trophy, Target, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

export function ScoreCard({ result }: { result: QuizResult }) {
    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-100">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-8 text-white text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-white drop-shadow-md" />
                <h2 className="text-3xl font-bold mb-1">Quiz Completed!</h2>
                <p className="text-amber-50 font-medium text-lg">You scored {result.score} out of {result.totalQuestions}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 bg-slate-50/50">

                <div className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Accuracy</p>
                        <p className="text-2xl font-bold text-slate-800">{result.accuracy}%</p>
                    </div>
                </div>

                <div className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shrink-0">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Correct</p>
                        <p className="text-2xl font-bold text-slate-800">{result.correctAnswers}</p>
                    </div>
                </div>

                <div className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-2xl text-red-600 shrink-0">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Incorrect</p>
                        <p className="text-2xl font-bold text-slate-800">{result.wrongAnswers}</p>
                    </div>
                </div>

                <div className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
                        <MinusCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Skipped</p>
                        <p className="text-2xl font-bold text-slate-800">{result.skippedAnswers}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
