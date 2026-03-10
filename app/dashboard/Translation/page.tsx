"use client";

import React, { useState } from "react";
import axios from "axios";
import { FileUpload } from "@/components/Translation/FileUpload";
import { TextInput } from "@/components/Translation/TextInput";
import { LanguageSelector } from "@/components/Translation/LanguageSelector";
import { ResultDisplay } from "@/components/Translation/ResultDisplay";
import { TranslateControls } from "@/components/Translation/TranslateControls";
import DashboardLayout from "@/components/dashboard-layout";

export default function TranslationPage() {
    const [inputText, setInputText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState("");

    const [translatedText, setTranslatedText] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [error, setError] = useState("");

    const handleFileSelect = async (file: File) => {
        setSelectedFile(file);
        setError("");
        setIsExtracting(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("/api/parse-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.text) {
                setInputText(response.data.text);
            } else {
                setError("Could not extract text from the PDF.");
            }
        } catch (err) {
            console.error(err);
            const errorMessage =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : "Error reading PDF file.";
            setError(errorMessage);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setError("Please provide some text to translate.");
            return;
        }
        if (!selectedLanguage) {
            setError("Please select a target language.");
            return;
        }

        setError("");
        setIsTranslating(true);
        setTranslatedText("");

        try {
            const response = await axios.post("/api/translate", {
                text: inputText,
                targetLanguage: selectedLanguage,
            });

            if (response.data.translatedText) {
                setTranslatedText(response.data.translatedText);
            } else {
                setError("Failed to get translation from server.");
            }
        } catch (err) {
            console.error(err);
            const errorMessage =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : "Translation failed. Please try again.";
            setError(errorMessage);
        } finally {
            setIsTranslating(false);
        }
    };

    const canTranslate = inputText.trim().length > 0 && selectedLanguage.length > 0;

    return (
        <DashboardLayout>
            <div className="p-6 w-full max-w-6xl mx-auto flex flex-col gap-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-3xl border border-amber-100 shadow-sm">
                    <h1 className="text-4xl font-extrabold text-amber-900 tracking-tight mb-4 flex items-center justify-center gap-3">
                        <span className="text-5xl">🌍</span>
                        Multilingual AI Translation
                    </h1>
                    <p className="text-lg text-amber-700/80 font-medium">
                        Upload a PDF or paste educational text, and seamlessly translate it into your native Indian language.
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl shadow-sm flex items-start">
                        <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-bold text-sm">Action Needed</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Translation Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel: Input & Settings */}
                    <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">1</div>
                            <h2 className="text-xl font-bold text-gray-800">Source Content</h2>
                        </div>

                        <div className="bg-gray-50/50 p-2 rounded-2xl border border-gray-100 p-4">
                            <FileUpload
                                onFileSelect={handleFileSelect}
                                selectedFile={selectedFile}
                                isLoading={isExtracting}
                            />
                        </div>

                        <div className="flex-grow min-h-[250px] relative">
                            <TextInput
                                value={inputText}
                                onChange={setInputText}
                                disabled={isTranslating || isExtracting}
                            />
                            {isExtracting && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-10 transition-all">
                                    <div className="bg-white p-4 rounded-full shadow-lg border border-gray-100 flex items-center gap-3">
                                        <svg className="animate-spin text-amber-500 h-6 w-6" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        <span className="font-medium text-gray-700">Reading PDF...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Output & Actions */}
                    <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">2</div>
                            <h2 className="text-xl font-bold text-gray-800">Target Settings</h2>
                        </div>

                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mb-2">
                            <LanguageSelector
                                selectedLanguage={selectedLanguage}
                                onLanguageChange={setSelectedLanguage}
                                disabled={isTranslating}
                            />
                        </div>

                        <TranslateControls
                            onTranslate={handleTranslate}
                            isTranslating={isTranslating}
                            disabled={!canTranslate}
                            hasResult={!!translatedText}
                        />

                        {/* Translation Result Divider */}
                        {translatedText && (
                            <div className="flex items-center my-4">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Result</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>
                        )}

                        {/* Translation Result View */}
                        <div className={`transition-all duration-500 flex-grow flex flex-col ${translatedText ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 h-0 overflow-hidden'}`}>
                            {translatedText && (
                                <ResultDisplay
                                    text={translatedText}
                                    language={selectedLanguage}
                                />
                            )}
                        </div>

                        {/* Placeholder when empty */}
                        {!translatedText && (
                            <div className="flex-grow flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30 p-8 min-h-[250px]">
                                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                <p className="text-center font-medium">Your translation will appear here.</p>
                                <p className="text-center text-sm mt-1">Select a language and click translate.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
