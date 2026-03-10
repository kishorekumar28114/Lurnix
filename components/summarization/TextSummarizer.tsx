'use client';

import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface TextSummarizerProps {
    onSummarize: (summary: string) => void;
    onError: (error: string) => void;
}

export default function TextSummarizer({ onSummarize, onError }: TextSummarizerProps) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        if (!text.trim()) {
            onError('Please enter some text to summarize.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('type', 'text');
            formData.append('content', text);

            const response = await fetch('/api/summarize', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to summarize');

            onSummarize(data.summary);
        } catch (err: any) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your lecture notes or text here..."
                className="w-full h-64 p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all resize-none shadow-sm"
            />
            <button
                onClick={handleSummarize}
                disabled={loading || !text.trim()}
                className="flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:shadow-lg hover:-translate-y-0.5 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:translate-y-0 disabled:opacity-50 font-medium rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Summarizing...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Summarize Text
                    </>
                )}
            </button>
        </div>
    );
}
