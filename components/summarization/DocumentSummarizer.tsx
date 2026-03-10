'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Loader2, Sparkles, X, UploadCloud } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DocumentSummarizerProps {
    onSummarize: (summary: string) => void;
    onError: (error: string) => void;
}

export default function DocumentSummarizer({ onSummarize, onError }: DocumentSummarizerProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
        },
        multiple: false,
    });

    const handleSummarize = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('type', 'file');
            formData.append('file', file);

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

    const removeFile = () => setFile(null);

    return (
        <div className="space-y-4">
            {!file ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer",
                        isDragActive
                            ? "border-amber-500 bg-amber-50/50"
                            : "border-gray-200 hover:border-amber-400 hover:bg-gray-50 bg-white"
                    )}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className={cn("w-12 h-12 mb-4", isDragActive ? "text-amber-500" : "text-gray-400")} />
                    <p className="text-lg font-medium text-gray-700">Drag & drop your document</p>
                    <p className="text-sm text-gray-500 mt-2">Supports PDF, DOCX, TXT (Max 5MB)</p>
                </div>
            ) : (
                <div className="p-6 bg-white border border-gray-200 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <button
                onClick={handleSummarize}
                disabled={loading || !file}
                className="flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:shadow-lg hover:-translate-y-0.5 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:translate-y-0 disabled:opacity-50 font-medium rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Extracting & Summarizing...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Summarize Document
                    </>
                )}
            </button>
        </div>
    );
}
