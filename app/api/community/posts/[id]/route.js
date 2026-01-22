import { NextResponse } from "next/server";
import { loadData } from "../../_data";

// GET: Get single post by id
export async function GET(req, { params }) {
  const { id } = params;
  const data = loadData();
  const post = data.posts.find(p => p.id == id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(post);
}
