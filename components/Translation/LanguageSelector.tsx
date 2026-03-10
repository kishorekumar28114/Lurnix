import React from "react";

export const INDIAN_LANGUAGES = [
    { code: "ta", name: "Tamil" },
    { code: "hi", name: "Hindi" },
    { code: "te", name: "Telugu" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "bn", name: "Bengali" },
    { code: "mr", name: "Marathi" },
];

interface LanguageSelectorProps {
    selectedLanguage: string;
    onLanguageChange: (lang: string) => void;
    disabled?: boolean;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange, disabled = false }: LanguageSelectorProps) {
    return (
        <div className="w-full">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Select Target Language
            </label>
            <select
                id="language"
                name="language"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                disabled={disabled}
                className="mt-1 block w-full rounded-xl border-gray-200 border bg-white py-3 pl-4 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:text-sm transition-shadow shadow-sm disabled:opacity-50 appearance-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 0.5rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`
                }}
            >
                <option value="" disabled>Choose a language</option>
                {INDIAN_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.name}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
