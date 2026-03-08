import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function GET() {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const supabase = getServiceSupabase();
        const body = await req.json();
        const { title, excerpt, content, tags, read_time, published } = body;

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        // Generate strict slug
        let baseSlug = slugify(title, {
            lower: true,
            strict: true,
            trim: true,
        });

        // Check if slug exists
        let slug = baseSlug;
        let counter = 2;
        let slugExists = true;

        while (slugExists) {
            const { data } = await supabase.from("posts").select("id").eq("slug", slug).single();
            if (data) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            } else {
                slugExists = false;
            }
        }

        const { data, error } = await supabase
            .from("posts")
            .insert([
                {
                    title,
                    slug,
                    excerpt,
                    content,
                    tags: tags || [],
                    read_time,
                    published: published !== false, // default true
                },
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        revalidatePath("/");
        revalidatePath(`/blog/${slug}`);

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
