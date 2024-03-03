import { NextResponse } from "next/server";
import { hash } from 'bcrypt';
import { sql } from "@vercel/postgres";

export async function POST(request) {
    const { username, password } = await request.json();
    const new_pass = await hash(password, 5);
    await sql`INSERT INTO users (Username, Password, Points) VALUES (${username}, ${new_pass}, 0)`;
    return NextResponse.json({ valid: true }, { status: 200 });
}