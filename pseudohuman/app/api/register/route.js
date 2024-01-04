import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { hash } from 'bcrypt';

async function add_user(username, password) {
    let users = [];
    if (existsSync('./users.json')) { users = JSON.parse(readFileSync('./users.json', 'utf8')); } // check if file exists then read file
    const new_pass = await hash(password, 5);
    const newdata =
    {
        "username": username,
        "password": new_pass
    }
    users.push(newdata);
    writeFileSync('./users.json', JSON.stringify(users, null, 2));
}

export async function POST(request) {
    const { username, password } = await request.json();
    await add_user(username, password);
    return NextResponse.json({ valid: true }, { status: 200 });
}