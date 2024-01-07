
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request) {
    const { username, amount } = await request.json();
    await sql`UPDATE users SET points = points + ${amount} WHERE Username = ${username}`;
    return NextResponse.json({ valid: true }, { status: 200 });
}