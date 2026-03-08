const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    console.error("Run this script with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.js");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const defaultPosts = [
    {
        title: "Next.js 16 Performance Optimization Strategies",
        slug: "nextjs-16-performance-optimization-strategies",
        excerpt: "A deep dive into the compiler changes and caching heuristics that make App Router insanely fast in Next 16.",
        content: "If you thought Next.js 14 was fast, wait until you profile 16.\n\nHere we outline the biggest changes: \n\n**1. Turbopack by Default**\nTurbopack is no longer experimental for builds. The caching layer has been rewritten in Rust...\n\n**2. Fine-grained ISR**\n`revalidatePath` now aggressively diffs React components to send minimal RSC payloads to the client.",
        tags: ["nextjs", "performance", "react"],
        read_time: "5 min read",
        published: true,
    },
    {
        title: "AI Tooling Stacks in 2026: Beyond the Hype",
        slug: "ai-tooling-stacks-in-2026",
        excerpt: "Why orchestration layers are dead and how native LLM runtimes are reshaping the full-stack ecosystem.",
        content: "Everyone spent 2023 building wrappers, 2024 building agents, and 2025 realizing we over-engineered everything.\n\nNow, the AI stack is just the **Native Stack**.\n\nWith edge runtimes running optimized smaller models and `window.ai` in browsers, we don't need heavy Python orchestrators for simple generative features. Let's look at how to build an AI feature using only Next.js Edge and an on-device model.",
        tags: ["ai", "architecture", "trends"],
        read_time: "8 min read",
        published: true,
    },
    {
        title: "Understanding Supabase RLS in Simple Terms",
        slug: "understanding-supabase-rls",
        excerpt: "Row Level Security isn't magic, it's just Postgres. Here's how to write policies without shooting yourself in the foot.",
        content: "Postgres Row Level Security (RLS) is the absolute best way to secure your data in a Supabase project.\n\nInstead of checking `if (user_id === req.user.id)` in your Node router, you enforce it at the database level! \n\n`CREATE POLICY \"Public can read published posts\" ON posts FOR SELECT USING (published = true);`\n\nIf you use the `service_role` key, you bypass this completely (which is what we did in our Admin API routes). This isolates the complex permissions entirely within the DB.",
        tags: ["supabase", "postgres", "security"],
        read_time: "4 min read",
        published: true,
    }
];

async function seed() {
    console.log("Seeding BYTE//BRAIN posts...");
    for (const post of defaultPosts) {
        const { data, error } = await supabase.from("posts").insert([post]).select().single();
        if (error) {
            if (error.code === '23505') { // unique violation
                console.log(`Skipped (already exists): ${post.slug}`);
            } else {
                console.error(`Error inserting ${post.slug}:`, error.message);
            }
        } else {
            console.log(`✓ Inserted: ${post.slug}`);
        }
    }
    console.log("Seeding complete!");
}

seed();
