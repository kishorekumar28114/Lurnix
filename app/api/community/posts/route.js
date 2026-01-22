import { NextResponse } from "next/server";
import { loadData, saveData } from "../_data";

// GET: Get all posts
export async function GET() {
  const data = loadData();
  return NextResponse.json(data.posts);
}

// POST: Create a new post
export async function POST(req) {
  const { title, content, author, category, attachments } = await req.json();
  if (!title || !content || !author) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const data = loadData();
  const post = {
    id: Date.now(),
    title,
    content,
    author,
    category: category || "General",
    attachments: attachments || [],
    upvotes: 0,
    comments: [],
    createdAt: new Date().toISOString()
  };
  data.posts.push(post);
  saveData(data);
  return NextResponse.json(post);
}
