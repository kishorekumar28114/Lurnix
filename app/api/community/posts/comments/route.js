
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../mongodb";
import { getSession } from "@/lib/auth/session";

// POST: Add comment to post in MongoDB
export async function POST(req) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, content, attachments } = await req.json();
  if (!postId || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const comment = {
    _id: new ObjectId(),
    author: session.name,
    authorId: session.userId,
    content,
    attachments: attachments || [],
    createdAt: new Date().toISOString()
  };
  const { db } = await connectToDatabase();
  const result = await db.collection("posts").updateOne(
    { _id: typeof postId === "string" ? new ObjectId(postId) : postId },
    { $push: { comments: comment } }
  );
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json(comment);
}
