/**
 * Parses the raw Buffer representation of a PDF document and extracts its text.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        // Dynamically import pdf-parse to avoid Next.js static collection trying to evaluate
        // its test directory structures during build.
        // @ts-ignore
        const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default || (await import("pdf-parse"));

        let parseFn = pdfParse;
        if (typeof pdfParse !== "function" && typeof pdfParse.default === "function") {
            parseFn = pdfParse.default;
        }

        const data = await parseFn(buffer);
        return data.text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF document.");
    }
}
