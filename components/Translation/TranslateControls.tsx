import React from "react";
import { Languages, Loader2 } from "lucide-react";

interface TranslateControlsProps {
    onTranslate: () => void;
    isTranslating: boolean;
    disabled: boolean;
    hasResult: boolean;
}

export function TranslateControls({
    onTranslate,
    isTranslating,
    disabled,
    hasResult,
}: TranslateControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
            <button
                onClick={onTranslate}
                disabled={disabled || isTranslating}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all focus:ring-4 focus:ring-amber-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none shadow-sm"
            >
                {isTranslating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Languages className="w-5 h-5" />
                )}
                {isTranslating ? "Translating..." : "Translate Text"}
            </button>
        </div>
    );
}
