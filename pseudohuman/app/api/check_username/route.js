import { NextResponse } from "next/server";
import { readFileSync } from 'fs'

function check_username(username) {
    const users = JSON.parse(readFileSync('./users.json', 'utf8'));
    let result = false;
    if (users == null) { return result; }
    users.forEach((user) => {
        if (user.username == username) {
            result = true;
        }
    });
    return result;
}

export async function POST(request) {
    const { username } = await request.json();
    const valid = check_username(username);
    return NextResponse.json({ valid }, { status: 200 });
}