import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const sql = (process.env.DATABASE_URL);

export async function GET(req) {
  try {
    const { userId } = auth(); // secure user from Clerk

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sql`
      SELECT id, role, type, techstack, created_at AS "createdAt"
      FROM interviews
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error("PAST INTERVIEWS ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}