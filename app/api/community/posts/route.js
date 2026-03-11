import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";
import { getSession } from "@/lib/auth/session";

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
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, category, attachments } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const post = {
    title,
    content,
    author: session.name,       // Extracted reliably from session
    authorId: session.userId,   // Store userId for future isolation/reference if needed
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
