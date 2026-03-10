import React from 'react';
import { Lightbulb } from 'lucide-react';

export function HintBox({ hint }: { hint: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100/80 px-4 py-2 rounded-full w-fit transition-colors border border-amber-200 shadow-sm"
            >
                <Lightbulb className="w-4 h-4" />
                <span>Show Hint</span>
            </button>
        )
    }

    return (
        <div className="flex gap-3 text-sm p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm text-amber-900">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
                <span className="font-semibold block mb-1">Hint:</span>
                {hint}
            </p>
        </div>
    );
}
