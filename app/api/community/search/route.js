import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";

export const dynamic = "force-dynamic";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET: Search posts by title/content/category in MongoDB
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();

    const { db } = await connectToDatabase();
    let query = {};

    if (q && category) {
      const safeQ = escapeRegex(q);
      query = {
        $and: [
          {
            $or: [
              { title: { $regex: safeQ, $options: "i" } },
              { content: { $regex: safeQ, $options: "i" } },
            ],
          },
          { category },
        ],
      };
    } else if (q) {
      const safeQ = escapeRegex(q);
      query = {
        $or: [
          { title: { $regex: safeQ, $options: "i" } },
          { content: { $regex: safeQ, $options: "i" } },
        ],
      };
    } else if (category) {
      query = { category };
    }

    const results = await db.collection("posts").find(query).toArray();
    const mapped = results.map((post) => ({ ...post, id: post._id.toString() }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search posts" }, { status: 500 });
  }
}
