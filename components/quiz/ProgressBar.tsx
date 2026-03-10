import React from 'react';

export function ProgressBar({ current, total }: { current: number; total: number }) {
    const percentage = Math.min(100, Math.round((current / total) * 100));

    return (
        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
            <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
