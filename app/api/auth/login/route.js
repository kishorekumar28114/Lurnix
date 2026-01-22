import { NextResponse } from "next/server";
import clientPromise from "../../_db";
import bcrypt from "bcryptjs";

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
    return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (err) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
