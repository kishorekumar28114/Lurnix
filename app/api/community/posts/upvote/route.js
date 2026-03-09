import { NextResponse } from "next/server";
import { connectToDatabase } from "../../mongodb";
import { ObjectId } from "mongodb";

// POST: Upvote a post (upvote/:postId)
export async function POST(req) {
  try {
    const { postId } = await req.json();
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
    return NextResponse.json({ error: "Failed to upvote post" }, { status: 500 });
  }
}
