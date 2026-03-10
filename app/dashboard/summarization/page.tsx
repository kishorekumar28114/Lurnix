'use client';

import React, { useState } from 'react';
import Tabs from '@/components/summarization/Tabs';
import TextSummarizer from '@/components/summarization/TextSummarizer';
import DocumentSummarizer from '@/components/summarization/DocumentSummarizer';
import SummaryCard from '@/components/summarization/SummaryCard';
import { Sparkles, GraduationCap, AlertCircle } from 'lucide-react';
import DashboardLayout from "@/components/dashboard-layout";

export default function SummarizationPage() {
    const [activeTab, setActiveTab] = useState('text');
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSummarize = (result: string) => {
        setSummary(result);
        setError(null);
        // Smooth scroll to summary
        setTimeout(() => {
            document.getElementById('summary-output')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleError = (err: string) => {
        setError(err);
        setSummary(null);
    };

    return (
        <DashboardLayout>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-2xl mb-4">
                        <GraduationCap className="w-8 h-8 text-amber-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-slate-800">
                        Summarization <span className="text-amber-500">AI</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        The ultimate summarization tool for students and educators. Extract insights from any content in seconds.
                    </p>
                </div>

                <div className="bg-card rounded-xl shadow-sm border p-6 md:p-10 mb-12">
                    <Tabs activeTab={activeTab} setActiveTab={(id) => {
                        setActiveTab(id);
                        setError(null);
                    }} />

                    <div className="min-h-[300px]">
                        {activeTab === 'text' && (
                            <TextSummarizer onSummarize={handleSummarize} onError={handleError} />
                        )}
                        {activeTab === 'document' && (
                            <DocumentSummarizer onSummarize={handleSummarize} onError={handleError} />
                        )}
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start space-x-3 text-destructive animate-in fade-in zoom-in-95 duration-200">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>

                {summary && (
                    <div id="summary-output" className="space-y-6">
                        <div className="flex items-center space-x-2 text-amber-600 font-semibold mb-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <span>Generated Result</span>
                        </div>
                        <SummaryCard summary={summary} />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
