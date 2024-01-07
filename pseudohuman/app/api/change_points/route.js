
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request) {
    const { username, type, amount } = await request.json();
    if (type == 'add') {
        await sql`UPDATE users SET points = points + ${amount} WHERE Username = ${username}`;
    } else if (type = 'remove') {
        await sql`UPDATE users SET points = points - ${amount} WHERE Username = ${username}`;
    }
    return NextResponse.json({ valid: true }, { status: 200 });
}