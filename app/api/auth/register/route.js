import { NextResponse } from "next/server";
import clientPromise from "../../_db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists." }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const result = await users.insertOne({ name, email, password: hashed, createdAt: new Date() });
    return NextResponse.json({ success: true, user: { name, email } });
  } catch (err) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
