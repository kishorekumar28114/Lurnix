// Text extraction utilities for Lurnix AI

export async function extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
    console.log(`Extracting text for MIME type: ${mimeType}`);
    try {
        switch (mimeType) {
            case 'application/pdf': {
                const pdf = require('pdf-parse');
                const pdfData = await pdf(buffer);
                return pdfData.text;
            }

            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
                const mammoth = require('mammoth');
                const docxData = await mammoth.extractRawText({ buffer });
                return docxData.value;
            }

            case 'text/plain':
                return buffer.toString('utf8');

            // Image OCR removed per user request

            default:
                throw new Error(`Unsupported file type: ${mimeType}`);
        }
    } catch (err: any) {
        console.error(`Extraction failed for ${mimeType}:`, err);
        throw err;
    }
}
