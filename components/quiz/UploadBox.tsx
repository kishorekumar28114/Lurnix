import React from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadBoxProps {
    onFileSelect: (file: File) => void;
    isLoading: boolean;
}

export function UploadBox({ onFileSelect, isLoading }: UploadBoxProps) {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") {
                onFileSelect(file);
            } else {
                alert("Please upload a PDF document.");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            if (file.type === "application/pdf") {
                onFileSelect(file);
            } else {
                alert("Please upload a PDF document.");
            }
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors 
        ${isLoading ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' : 'cursor-pointer border-amber-300 hover:border-amber-500 hover:bg-amber-50/50 bg-white'}`}
        >
            <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="file-upload"
                onChange={handleChange}
                disabled={isLoading}
            />
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
                <UploadCloud className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Upload PDF Document</h3>
                <p className="text-sm text-slate-500 mt-2 text-center">
                    Drag and drop your file here, or click to browse.
                </p>
            </label>
        </div>
    );
}
