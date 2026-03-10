import React from 'react';
import { Question } from '@/lib/quiz/types';
import { HintBox } from './HintBox';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface QuestionCardProps {
    question: Question;
    selectedAnswer: string | null | undefined;
    onSelect: (option: string) => void;
}

export function QuestionCard({ question, selectedAnswer, onSelect }: QuestionCardProps) {
    const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;

    return (
        <div className="h-full flex flex-col space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-tight">
                {question.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                {question.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === question.correctAnswer;

                    let styleClass = "border-slate-200 hover:border-amber-400 hover:bg-slate-50 bg-white shadow-sm text-slate-700";
                    let Icon = null;

                    if (isAnswered) {
                        if (isCorrect) {
                            styleClass = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500";
                            Icon = CheckCircle2;
                        } else if (isSelected && !isCorrect) {
                            styleClass = "border-red-400 bg-red-50 text-red-800";
                            Icon = XCircle;
                        } else {
                            styleClass = "border-slate-100 bg-slate-50 opacity-50 text-slate-500 cursor-not-allowed";
                        }
                    } else if (isSelected) {
                        styleClass = "border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200 ring-offset-1 text-slate-800";
                    } // Hover states don't apply once answered

                    return (
                        <button
                            key={idx}
                            onClick={() => !isAnswered && onSelect(option)}
                            disabled={isAnswered}
                            className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all leading-snug font-medium w-full text-left
                                ${styleClass}
                            `}
                        >
                            <div className="flex justify-between items-center w-full min-h-[50px]">
                                <span>{option}</span>
                                {Icon && <Icon className={`w-6 h-6 shrink-0 ml-3 ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`} />}
                            </div>
                        </button>
                    )
                })}
            </div>

            {isAnswered && (
                <div className="mt-4 p-5 rounded-xl bg-blue-50/50 border border-blue-100 flex gap-4 text-blue-900 shadow-inner">
                    <AlertCircle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold block mb-1">Explanation:</span>
                        <p className="text-sm leading-relaxed text-blue-800/90">{question.explanation}</p>
                    </div>
                </div>
            )}

            {!isAnswered && <HintBox hint={question.hint} />}
        </div>
    );
}
