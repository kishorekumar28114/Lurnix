export interface TranslationRequest {
    text: string;
    targetLanguage: string;
}

export interface TranslationResponse {
    translatedText: string;
    error?: string;
}

export interface SimplifyRequest {
    text: string;
    language: string;
}

export interface SimplifyResponse {
    simplifiedText: string;
    error?: string;
}
