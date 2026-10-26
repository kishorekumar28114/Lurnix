import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // The session payload contains { userId, email, name }
    return NextResponse.json({ user: session });
  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
