import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request) {
    const { username } = await request.json();
    const { rows } = await sql`SELECT * FROM users WHERE Username=${username}`;
    const valid = rows.length > 0;
    return NextResponse.json({ valid }, { status: 200 });
}