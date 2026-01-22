import { NextResponse } from "next/server";
import { loadData } from "../_data";

export async function POST(req) {
  const { username, password } = await req.json();
  const data = loadData();
  const user = data.users.find(u => u.username === username && u.password === password);
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  return NextResponse.json({ success: true, username });
}
