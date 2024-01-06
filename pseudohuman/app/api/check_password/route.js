import { NextResponse } from "next/server";
import { compare } from 'bcrypt';
import { sql } from "@vercel/postgres";

export async function POST(request) {
    const { username, password } = await request.json();
    const { rows } = await sql`SELECT * FROM users WHERE Username=${username}`;
    const result = await compare(password, rows[0].password);
    return NextResponse.json({ result }, { status: 200 });
}