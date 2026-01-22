
import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";

// GET: Search posts by title/content/category in MongoDB
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const { db } = await connectToDatabase();
  let query = {};
  if (q && category) {
    query = {
      $and: [
        { $or: [
          { title: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } }
        ] },
        { category }
      ]
    };
  } else if (q) {
    query = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } }
      ]
    };
  } else if (category) {
    query = { category };
  }
  const results = await db.collection("posts").find(query).toArray();
  return NextResponse.json(results);
}
