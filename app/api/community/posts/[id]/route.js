import { NextResponse } from "next/server";
import { connectToDatabase } from "../../mongodb";
import { ObjectId } from "mongodb";

// GET: Get single post by id
export async function GET(req, { params }) {
  const { id } = params || {};
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ ...post, id: post._id.toString() });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
