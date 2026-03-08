import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = getServiceSupabase();
    const identifier = (await params).id;

    // Try fetching by ID (if UUID format) or by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    let query = supabase.from("posts").select("*");
    if (isUuid) {
        query = query.eq("id", identifier);
    } else {
        query = query.eq("slug", identifier);
    }

    const { data, error } = await query.single();

    if (error || !data) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = getServiceSupabase();
        const id = (await params).id;
        const body = await req.json();

        // Explicitly destructure to prevent updating slug or id directly if not intended
        // Usually slug is never updated to not break URLs, but if requested, it's possible.
        const { title, excerpt, content, tags, read_time, published } = body;

        const { data, error } = await supabase
            .from("posts")
            .update({
                title,
                excerpt,
                content,
                tags,
                read_time,
                published,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        revalidatePath("/");
        if (data?.slug) revalidatePath(`/blog/${data.slug}`);

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = getServiceSupabase();
        const id = (await params).id;

        const { error } = await supabase.from("posts").delete().eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
