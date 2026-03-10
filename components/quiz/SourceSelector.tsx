import React from 'react';
import { FileText, Youtube, Type } from 'lucide-react';

export type SourceType = 'pdf' | 'youtube' | 'text';

interface SourceSelectorProps {
    selectedSource: SourceType;
    onSelect: (source: SourceType) => void;
    disabled?: boolean;
}

export function SourceSelector({ selectedSource, onSelect, disabled }: SourceSelectorProps) {
    const options = [
        { id: 'pdf', label: 'Upload PDF', icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 'youtube', label: 'YouTube Video', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
        { id: 'text', label: 'Paste Text', icon: Type, color: 'text-blue-500', bg: 'bg-blue-50' },
    ] as const;

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    disabled={disabled}
                    onClick={() => onSelect(opt.id as SourceType)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all 
            ${selectedSource === opt.id
                            ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200 ring-offset-1'
                            : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <div className={`p-2 rounded-lg bg-white shadow-sm ${opt.color}`}>
                        <opt.icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-slate-700">{opt.label}</span>
                </button>
            ))}
        </div>
    );
}
