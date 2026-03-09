import { NextResponse } from "next/server";
import { connectToDatabase } from "../../mongodb";
import { ObjectId } from "mongodb";

// GET: Get single post by id
export async function GET(req, { params }) {
  const { id } = params;
  try {
    const { db } = await connectToDatabase();
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json({ ...post, id: post._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID or failed to fetch post" }, { status: 500 });
  }
}
