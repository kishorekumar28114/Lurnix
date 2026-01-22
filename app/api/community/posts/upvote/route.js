import { NextResponse } from "next/server";
import { loadData, saveData } from "../../_data";

// POST: Upvote a post (upvote/:postId)
export async function POST(req) {
  const { postId } = await req.json();
  const data = loadData();
  const post = data.posts.find(p => p.id == postId);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  post.upvotes += 1;
  saveData(data);
  return NextResponse.json({ upvotes: post.upvotes });
}
