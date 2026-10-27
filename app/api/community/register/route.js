import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth/session";

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { username, email, password } = body || {};
    const name = (username || "").trim();
    const normalizedEmail = (email || `${name.toLowerCase()}@example.com`).trim().toLowerCase();

    if (!name || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");
    const existing = await users.findOne({
      $or: [{ name }, { email: normalizedEmail }],
    });

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      name,
      email: normalizedEmail,
      password: hashed,
      createdAt: new Date(),
    });

    const token = await signToken({
      userId: result.insertedId.toString(),
      email: normalizedEmail,
      name,
    });

    const response = NextResponse.json({ success: true, username: name });
    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Community register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
