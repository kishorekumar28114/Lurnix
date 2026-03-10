import React from "react";

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function TextInput({ value, onChange, placeholder = "Paste your educational text here...", disabled = false }: TextInputProps) {
    return (
        <div className="w-full h-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Input
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full flex-grow min-h-[250px] p-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none shadow-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
        </div>
    );
}
