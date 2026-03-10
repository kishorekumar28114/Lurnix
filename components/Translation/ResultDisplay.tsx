import React from "react";

interface ResultDisplayProps {
    text: string;
    language: string;
}

export function ResultDisplay({ text, language }: ResultDisplayProps) {
    if (!text) return null;

    return (
        <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Result ({language})
                </label>

            </div>
            <div className="flex-grow w-full bg-amber-50/50 p-6 rounded-xl border border-amber-100 text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[250px] shadow-inner font-medium text-[15px]">
                {text}
            </div>
        </div>
    );
}
