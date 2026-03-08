import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BlogCardProps {
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    date: string;
    readTime: string;
}

export default function BlogCard({ title, slug, excerpt, tags, date, readTime }: BlogCardProps) {
    return (
        <Link
            href={`/blog/${slug}`}
            className="group block relative bg-[var(--surface)] brutal-border brutal-shadow flex flex-col h-full overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)] z-10"></div>

            <div className="p-6 flex flex-col flex-grow pt-8">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map(tag => (
                        <span
                            key={tag}
                            className="text-[0.65rem] font-mono tracking-widest uppercase bg-[var(--text)] text-[var(--bg)] px-2 py-0.5 border border-transparent brutal-skew"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="text-xl lg:text-2xl font-bold mb-3 brutal-skew">{title}</h3>

                <p className="text-[var(--muted)] text-sm mb-6 flex-grow leading-relaxed">
                    {excerpt}
                </p>

                <div className="border-t-[2.5px] border-[var(--text)] pt-4 flex justify-between items-center mt-auto">
                    <div className="font-mono text-xs flex gap-3 text-[var(--muted)]">
                        <span>{date}</span>
                        <span>•</span>
                        <span>{readTime}</span>
                    </div>
                    <div className="w-8 h-8 rounded-none border-[2px] border-[var(--text)] flex items-center justify-center bg-[var(--bg)] shadow-[2px_2px_0_var(--text)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
