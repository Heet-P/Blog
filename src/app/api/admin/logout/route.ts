import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
    await clearAdminSession();
    return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
    await clearAdminSession();
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
}
