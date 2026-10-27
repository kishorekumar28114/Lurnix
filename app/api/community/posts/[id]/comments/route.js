import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../mongodb";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth/session";

// POST: Add comment to post by ID (RESTful)
export async function POST(req, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params || {};
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { content, attachments } = body || {};
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    const comment = {
      id: Date.now(),
      author: session.name || "Anonymous",
      authorId: session.userId,
      content: content.trim(),
      attachments: Array.isArray(attachments) ? attachments : [],
      createdAt: new Date().toISOString(),
    };

    const { db } = await connectToDatabase();
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: comment } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Failed to add comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
