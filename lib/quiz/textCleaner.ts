/**
 * Cleans the input text by removing excessive whitespace, newlines, and filler words.
 */
export function cleanText(text: string): string {
    if (!text) return "";

    // 1. Remove excessive newlines and spaces
    let cleaned = text.replace(/\n+/g, " "); // Replace newlines with space
    cleaned = cleaned.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space

    // 2. Remove common filler words or phrases that don't add educational value
    const fillerWords = [
        "um", "uh", "like", "you know", "i mean", "basically", "actually",
        "literally", "sort of", "kind of", "so", "well", "right", "okay"
    ];

    // Create a regex to match filler words as whole words, case insensitive
    const fillerRegex = new RegExp(`\\b(${fillerWords.join("|")})\\b`, "gi");
    cleaned = cleaned.replace(fillerRegex, "");

    // 3. Final trim and cleanup
    cleaned = cleaned.replace(/\s{2,}/g, " ").trim();

    return cleaned;
}
