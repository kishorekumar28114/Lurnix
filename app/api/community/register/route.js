import { NextResponse } from "next/server";
import { loadData, saveData } from "../_data";

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password) return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
  const data = loadData();
  if (data.users.find(u => u.username === username)) return NextResponse.json({ error: "Username taken" }, { status: 409 });
  data.users.push({ username, password });
  saveData(data);
  return NextResponse.json({ success: true });
}
