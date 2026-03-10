import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/summarization/openai';
import { extractTextFromBuffer } from '@/lib/summarization/extractText';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        let formData;
        try {
            formData = await req.formData();
        } catch (e: any) {
            console.error('Failed to parse form data:', e);
            return NextResponse.json({ error: 'Failed to parse upload data: ' + e.message }, { status: 400 });
        }

        const type = formData.get('type') as string; // 'text', 'file'
        let content = '';

        if (type === 'text') {
            content = formData.get('content') as string;
        } else if (type === 'file') {
            const file = formData.get('file') as File;
            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }

            if (file.type.startsWith('image/')) {
                return NextResponse.json({ error: 'Image summarization is not supported.' }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            content = await extractTextFromBuffer(buffer, file.type);
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: 'No text content found to summarize' }, { status: 400 });
        }

        // Limit content size to avoid token limits (gpt-4o-mini has large window but let's be safe)
        const truncatedContent = content.slice(0, 30000);

        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "openai/gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert academic summarizer. Provide an elegant, well-structured summary of the content using Markdown. You MUST use clear headings (###), bold key terms, and organized bullet points. IMPORTANT: You MUST use double newlines between paragraphs, headings, and lists to ensure proper spacing. Provide a clean, airy structure that is easy to read and logically grouped by topics. Avoid long dense blocks of text.",
                },
                {
                    role: "user",
                    content: `Please summarize the following content professionally:\n\n${truncatedContent}`,
                },
            ],
            temperature: 0.5,
        });

        const summary = response.choices[0]?.message?.content || 'No summary generated.';

        return NextResponse.json({ summary });
    } catch (error: any) {
        console.error('SUMMARIZATION ERROR:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred during summarization' },
            { status: 500 }
        );
    }
}
