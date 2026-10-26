import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../mongodb";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth/session";

// POST: Add comment to post by ID (RESTful)
export async function POST(req, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  try {
    const { content, attachments } = await req.json();
    const comment = {
      id: Date.now(),
      author: session.name,     // Reliable Name
      authorId: session.userId, // ADDED User ID isolation
      content,
      attachments: attachments || [],
      createdAt: new Date().toISOString()
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
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
