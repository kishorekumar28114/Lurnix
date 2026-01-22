import { NextResponse } from "next/server";
import { loadData } from "../_data";

// GET: Search posts by title/content/category
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const data = loadData();
  let results = data.posts;
  if (q) results = results.filter(p => p.title.includes(q) || p.content.includes(q));
  if (category) results = results.filter(p => p.category === category);
  return NextResponse.json(results);
}
