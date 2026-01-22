import { NextResponse } from "next/server";
import { loadData, saveData } from "../../_data";

// POST: Add comment to post (comments/:postId)
export async function POST(req) {
  const { postId, author, content, attachments } = await req.json();
  const data = loadData();
  const post = data.posts.find(p => p.id == postId);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  const comment = {
    id: Date.now(),
    author,
    content,
    attachments: attachments || [],
    createdAt: new Date().toISOString()
  };
  post.comments.push(comment);
  saveData(data);
  return NextResponse.json(comment);
}
