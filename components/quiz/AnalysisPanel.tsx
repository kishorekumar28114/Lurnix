import React from 'react';
import { AnalysisReport } from '@/lib/quiz/types';
import { TrendingUp, TrendingDown, BookOpen, Compass } from 'lucide-react';

export function AnalysisPanel({ analysis }: { analysis: AnalysisReport }) {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Compass className="w-6 h-6 text-amber-500" />
                    AI Learning Coach Analysis
                </h3>
                <p className="text-slate-500 text-sm mt-1">Based on your performance and specific topic mistakes.</p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="space-y-6 relative z-10">
                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-emerald-800 mb-3 text-lg">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Strengths
                        </h4>
                        <ul className="space-y-2">
                            {analysis.strengths.map((str, i) => (
                                <li key={i} className="flex gap-2 text-slate-600 text-sm leading-relaxed">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                                    {str}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-rose-800 mb-3 text-lg">
                            <TrendingDown className="w-5 h-5 text-rose-500" />
                            Weak Areas
                        </h4>
                        <ul className="space-y-2">
                            {analysis.weakAreas.map((weak, i) => (
                                <li key={i} className="flex gap-2 text-slate-600 text-sm leading-relaxed">
                                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0" />
                                    {weak}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-amber-800 mb-3 text-lg">
                            <BookOpen className="w-5 h-5 text-amber-500" />
                            Topics to Review
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.topicsToFocusOn.map((topic, i) => (
                                <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium rounded-full">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50" />
                        <h4 className="font-semibold text-amber-900 mb-2">Recommended Study Strategy</h4>
                        <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
                            {analysis.suggestedStudyStrategy}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
