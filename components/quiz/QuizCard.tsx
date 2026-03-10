import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, UserAnswer, QuizResult } from '@/lib/quiz/types';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';

interface QuizCardProps {
    questions: Question[];
    onFinish: (answers: UserAnswer[]) => void;
}

export function QuizCard({ questions, onFinish }: QuizCardProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [answers, setAnswers] = React.useState<UserAnswer[]>([]);
    const [isFinished, setIsFinished] = React.useState(false);

    // When a user selects an answer we move to the next question automatically after a short delay
    const handleAnswerSelect = (selectedOption: string) => {
        const currentQ = questions[currentIndex];
        const isCorrect = selectedOption === currentQ.correctAnswer;

        // Add the answer, replace if already answered that index
        setAnswers(prev => {
            const newAns = [...prev];
            const existingIdx = newAns.findIndex(a => a.questionIndex === currentIndex);
            if (existingIdx !== -1) {
                newAns[existingIdx] = { questionIndex: currentIndex, selectedOption, isCorrect };
            } else {
                newAns.push({ questionIndex: currentIndex, selectedOption, isCorrect });
            }
            return newAns;
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
            onFinish(answers);
        }
    };

    const handleSkip = () => {
        setAnswers(prev => [
            ...prev,
            { questionIndex: currentIndex, selectedOption: null, isCorrect: false }
        ]);
        handleNext();
    }

    const currentQ = questions[currentIndex];
    // Determine if current question is answered
    const currentAnswer = answers.find(a => a.questionIndex === currentIndex);

    if (isFinished) {
        return (
            <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Quiz Completed!</h2>
                <p className="text-slate-600">Calculating your results and preparing AI analysis...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1 block">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <ProgressBar current={currentIndex + 1} total={questions.length} />
                </div>
                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-500 rounded-full border border-slate-200">
                    {currentQ.topic}
                </span>
            </div>

            <div className="p-8 flex-grow relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col justify-between"
                    >
                        <QuestionCard
                            question={currentQ}
                            onSelect={handleAnswerSelect}
                            selectedAnswer={currentAnswer?.selectedOption}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-between items-center">
                <button
                    onClick={handleSkip}
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors px-4 py-2"
                >
                    Skip
                </button>
                <button
                    onClick={handleNext}
                    disabled={!currentAnswer}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-sm
                        ${currentAnswer
                            ? 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                    {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
}
