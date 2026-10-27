import { NextResponse } from "next/server";
import { connectToDatabase } from "../../mongodb";
import { ObjectId } from "mongodb";

// POST: Upvote a post (upvote/:postId)
export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { postId } = body || {};
    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Valid postId is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("posts").findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $inc: { upvotes: 1 } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ upvotes: result.upvotes });
  } catch (error) {
    console.error("Failed to upvote post:", error);
    return NextResponse.json({ error: "Failed to upvote post" }, { status: 500 });
  }
}
