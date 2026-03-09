import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../mongodb";
import { ObjectId } from "mongodb";

// POST: Add comment to post by ID (RESTful)
export async function POST(req, { params }) {
  const { id } = params;
  try {
    const { author, content, attachments } = await req.json();
    const comment = {
      id: Date.now(),
      author,
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
