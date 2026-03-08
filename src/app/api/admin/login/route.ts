import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: "Password is required" }, { status: 400 });
        }

        if (password === process.env.ADMIN_PASSWORD) {
            await setAdminSession();
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
