import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/quiz/pdfParser";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert the file to a buffer for parsing
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const extractedText = await extractTextFromPDF(buffer);

        return NextResponse.json({ text: extractedText });
    } catch (error: any) {
        console.error("PDF Extraction Error in API Route:", error);
        return NextResponse.json(
            { error: "Failed to extract text from the provided PDF." },
            { status: 500 }
        );
    }
}
