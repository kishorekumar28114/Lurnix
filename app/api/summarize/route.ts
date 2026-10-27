import { NextRequest, NextResponse } from "next/server";
import { extractTextFromBuffer } from "@/lib/summarization/extractText";
import { createGroqChatCompletion, formatGroqError } from "@/lib/groq";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e: any) {
      console.error("Failed to parse form data:", e);
      return NextResponse.json(
        { error: "Failed to parse upload data: " + (e?.message || "Invalid form data") },
        { status: 400 }
      );
    }

    const type = formData.get("type") as string; // 'text', 'file'
    let content = "";

    if (type === "text") {
      content = (formData.get("content") as string) || "";
    } else if (type === "file") {
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      if (file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Image summarization is not supported." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      content = await extractTextFromBuffer(buffer, file.type);
    } else {
      return NextResponse.json({ error: "Invalid type. Must be 'text' or 'file'" }, { status: 400 });
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "No text content found to summarize" }, { status: 400 });
    }

    // Limit content size to avoid token limits
    const truncatedContent = content.slice(0, 30000);

    const completion = await createGroqChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You are an expert academic summarizer. Provide an elegant, well-structured summary of the content using Markdown. You MUST use clear headings (###), bold key terms, and organized bullet points. IMPORTANT: You MUST use double newlines between paragraphs, headings, and lists to ensure proper spacing. Provide a clean, airy structure that is easy to read and logically grouped by topics. Avoid long dense blocks of text.",
        },
        {
          role: "user",
          content: `Please summarize the following content professionally:\n\n${truncatedContent}`,
        },
      ],
      temperature: 0.5,
    });

    const summary = completion.choices[0]?.message?.content || "No summary generated.";

    return NextResponse.json({ summary });
  } catch (error: any) {
    const formatted = formatGroqError(error);
    console.error(`[SUMMARIZATION ERROR] Status: ${formatted.status}, Message: ${formatted.error}`);
    return NextResponse.json(
      { error: formatted.error },
      { status: formatted.status }
    );
  }
}
