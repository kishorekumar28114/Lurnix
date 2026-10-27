import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// GET: Get all posts from MongoDB
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const posts = await db.collection("posts").find({}).toArray();
    const mappedPosts = posts.map((post) => ({ ...post, id: post._id.toString() }));
    return NextResponse.json(mappedPosts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST: Create a new post in MongoDB
export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { title, content, category, attachments } = body || {};
    if (!title || !content || typeof title !== "string" || typeof content !== "string") {
      return NextResponse.json({ error: "Missing required title or content" }, { status: 400 });
    }

    const post = {
      title: title.trim(),
      content: content.trim(),
      author: session.name || "Anonymous",
      authorId: session.userId,
      category: typeof category === "string" ? category.trim() : "General",
      attachments: Array.isArray(attachments) ? attachments : [],
      upvotes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    const { db } = await connectToDatabase();
    const result = await db.collection("posts").insertOne(post);
    post.id = result.insertedId.toString();
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
