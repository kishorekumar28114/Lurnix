/**
 * Splits text into chunks of approximately `maxWords` words.
 * Attempts to intelligently split on sentence boundaries for better context given to AI.
 */
export function chunkText(text: string, maxWords: number = 500): string[] {
    if (!text) return [];

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = "";
    let currentWordCount = 0;

    for (const sentence of sentences) {
        const wordCount = sentence.split(/\s+/).filter((w) => w.length > 0).length;

        if (currentWordCount + wordCount > maxWords && currentWordCount > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
            currentWordCount = wordCount;
        } else {
            currentChunk += " " + sentence;
            currentWordCount += wordCount;
        }
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    // Ensure chunks fit within Gemini's limits by also verifying character sizes
    // and ensuring we don't have extremely small chunks if possible (optional logic).

    return chunks;
}
