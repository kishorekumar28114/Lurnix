import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";

export const dynamic = 'force-dynamic';

// GET: Get all posts from MongoDB
export async function GET() {
  const { db } = await connectToDatabase();
  const posts = await db.collection("posts").find({}).toArray();
  const mappedPosts = posts.map(post => ({ ...post, id: post._id.toString() }));
  return NextResponse.json(mappedPosts);
}

// POST: Create a new post in MongoDB
export async function POST(req) {
  const { title, content, author, category, attachments } = await req.json();
  if (!title || !content || !author) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const post = {
    title,
    content,
    author,
    category: category || "General",
    attachments: attachments || [],
    upvotes: 0,
    comments: [],
    createdAt: new Date().toISOString()
  };
  const { db } = await connectToDatabase();
  const result = await db.collection("posts").insertOne(post);
  post.id = result.insertedId.toString();
  return NextResponse.json(post);
}
