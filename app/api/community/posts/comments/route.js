import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../mongodb";
import { getSession } from "@/lib/auth/session";

// POST: Add comment to post in MongoDB
export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { postId, content, attachments } = body || {};
    if (!postId || !content || typeof content !== "string" || !ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Valid postId and content are required" }, { status: 400 });
    }

    const comment = {
      _id: new ObjectId(),
      author: session.name || "Anonymous",
      authorId: session.userId,
      content: content.trim(),
      attachments: Array.isArray(attachments) ? attachments : [],
      createdAt: new Date().toISOString(),
    };

    const { db } = await connectToDatabase();
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
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
