import { NextResponse } from "next/server";
import clientPromise from "../../_db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth/session";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Generate JWT token
    const token = await signToken({ userId: user._id.toString(), email: user.email, name: user.name });

    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    
    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
