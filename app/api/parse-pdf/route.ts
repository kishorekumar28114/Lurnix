import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFParser = require("pdf2json");

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file || file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "A valid PDF file is required" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const pdfParser = new PDFParser(null, 1);

        const text = await new Promise<string>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pdfParser.on("pdfParser_dataError", (errData: any) =>
                reject(errData.parserError)
            );
            pdfParser.on("pdfParser_dataReady", () => {
                resolve(pdfParser.getRawTextContent());
            });
            pdfParser.parseBuffer(buffer);
        });

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "No readable text found in this PDF." },
                { status: 422 }
            );
        }

        return NextResponse.json({ text });
    } catch (error) {
        console.error("PDF Parsing error:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Failed to parse PDF";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
