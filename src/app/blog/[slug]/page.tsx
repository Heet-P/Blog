import { getServiceSupabase } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug
    const supabase = getServiceSupabase();
    const { data: post } = await supabase.from("posts").select("title, excerpt").eq("slug", slug).single();

    return {
        title: post ? `${post.title} | BYTE//BRAIN` : 'Post Not Found',
        description: post?.excerpt || 'Read this post on BYTE//BRAIN',
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const supabase = getServiceSupabase();

    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!post || !post.published) {
        notFound();
    }

    // Split content on double newlines to render formatted paragraphs
    const renderContent = (content: string) => {
        const blocks = content.split('\n\n').filter(Boolean);

        return blocks.map((block, i) => {
            // Very basic image markdown parser: ![alt](url)
            const imgMatch = block.match(/!\[([^\]]*)\]\(([^)]+)\)/);
            if (imgMatch) {
                return (
                    <figure key={i} className="my-12 brutal-border brutal-shadow brutal-skew relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--accent)] z-10"></div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
                    </figure>
                )
            }

            // Basic bold and code inline parser
            let parsedHtml = block
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code class="bg-[var(--surface)] text-[var(--accent)] border border-[var(--muted)] px-1.5 py-0.5 font-mono text-sm">$1</code>');

            return (
                <p key={i} dangerouslySetInnerHTML={{ __html: parsedHtml }} className="mb-6 leading-relaxed text-lg text-[var(--text)]"></p>
            );
        });
    };

    return (
        <article className="max-w-4xl mx-auto px-4 lg:px-8 py-12 lg:py-24">
            <Link href="/" className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest hover:text-[var(--accent)] transition-colors mb-12 brutal-skew font-bold">
                <ArrowLeft className="w-4 h-4" /> BACK TO TERMINAL
            </Link>

            <header className="mb-16">
                <div className="flex flex-wrap gap-3 mb-8">
                    {post.tags?.map((tag: string) => (
                        <span
                            key={tag}
                            className="text-xs font-mono tracking-widest uppercase bg-[var(--text)] text-[var(--bg)] px-3 py-1 brutal-border brutal-skew"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h1 className="text-5xl lg:text-7xl font-black brutal-skew leading-[1.1] mb-8 uppercase">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 font-mono text-sm uppercase tracking-wider text-[var(--muted)] border-t-[2.5px] border-b-[2.5px] border-[var(--text)] py-4 brutal-skew bg-[var(--surface)] px-4">
                    <span>LOG_DATE: {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>EST_TIME: {post.read_time || "5 min read"}</span>
                </div>
            </header>

            <div className="prose prose-lg max-w-none 
          prose-headings:font-syne prose-headings:font-bold prose-headings:brutal-skew prose-headings:uppercase 
          prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-[var(--text)]
          prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-[var(--text)]
          font-syne">
                {renderContent(post.content)}
            </div>

            <div className="mt-20 pt-8 border-t-[2.5px] border-dashed border-[var(--text)] flex justify-between items-center brutal-skew">
                <p className="font-mono text-sm text-[var(--muted)]">// END OF TRANSMISSION</p>
                <Link href="/" className="bg-[var(--text)] text-[var(--bg)] px-6 py-3 font-mono font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0_var(--surface)] hover:shadow-[7px_7px_0_var(--surface)] transition-all">
                    Return Home
                </Link>
            </div>
        </article>
    );
}
