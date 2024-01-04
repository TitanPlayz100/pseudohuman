import { NextResponse } from "next/server";
import { readFileSync } from 'fs'
import { compare } from 'bcrypt';

async function check_password(username, password) {
    const users = JSON.parse(readFileSync('./users.json', 'utf8'));
    let result = false;
    if (users == null) { return result; }
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            result = await compare(password, users[i].password);
        }
    }
    return result;
}

export async function POST(request) {
    const { username, password } = await request.json();
    const result = await check_password(username, password);
    return NextResponse.json({ result }, { status: 200 });
}