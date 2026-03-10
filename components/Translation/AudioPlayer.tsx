"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Square } from "lucide-react";

interface AudioPlayerProps {
    text: string;
    language: string; // The selected language name (e.g. "Hindi", "Tamil")
}

// Map language names to appropriate BCP-47 codes for SpeechSynthesis
const getLangCode = (languageName: string) => {
    const map: Record<string, string> = {
        "Tamil": "ta-IN",
        "Hindi": "hi-IN",
        "Telugu": "te-IN",
        "Kannada": "kn-IN",
        "Malayalam": "ml-IN",
        "Bengali": "bn-IN",
        "Marathi": "mr-IN",
    };
    return map[languageName] || "en-US";
};

export function AudioPlayer({ text, language }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    const handlePlay = () => {
        if (!synthRef.current || !text) return;

        if (isPlaying) {
            synthRef.current.cancel();
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = getLangCode(language);

        // Some devices might not have voices for all Indian languages, but this defaults to the closest matching.
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        setIsPlaying(true);
        synthRef.current.speak(utterance);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    return (
        <button
            onClick={handlePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isPlaying
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
            title={isPlaying ? "Stop playing" : "Listen to translation"}
        >
            {isPlaying ? (
                <>
                    <Square className="w-4 h-4 fill-current" />
                    Stop Listening
                </>
            ) : (
                <>
                    <Play className="w-4 h-4 fill-current" />
                    Listen
                </>
            )}
        </button>
    );
}
