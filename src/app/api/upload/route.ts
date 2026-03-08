import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseServer";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const supabase = getServiceSupabase();

        // Generate a unique filename
        const fileExt = file.name.split('.').pop() || "png";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from("blog-images")
            .upload(fileName, file, {
                contentType: file.type || "image/png",
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from("blog-images")
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
