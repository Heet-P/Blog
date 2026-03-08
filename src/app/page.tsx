import { getServiceSupabase } from "@/lib/supabaseServer";
import BlogCard from "@/components/BlogCard";

export const revalidate = 0; // force dynamic if needed, but Next handles ISR mostly

export default async function Home() {
  const supabase = getServiceSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const tagsList = posts?.flatMap(p => p.tags) || [];
  const uniqueTags = new Set(tagsList).size;
  const totalPosts = posts?.length || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-24">
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
        <div className="flex flex-col justify-center relative">
          <div className="inline-block px-3 py-1 bg-[var(--text)] text-[var(--bg)] font-mono text-sm uppercase tracking-widest w-max mb-6 brutal-skew">
            Welcome to the terminal
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black brutal-skew leading-[0.9] mb-8 uppercase">
            BYTE<br /><span className="text-[var(--accent)]">BRAIN</span>
          </h1>
          <p className="text-xl text-[var(--muted)] mb-10 max-w-md leading-relaxed">-Heet Parikh</p>
          <p className="text-xl text-[var(--muted)] mb-10 max-w-md leading-relaxed">
            Tech advice / rants, and  deep dives in my learnings as a developer.<br></br>
            Documenting what i find interesting and explore in this ever changing AI Era.
          </p>

          <div className="flex gap-6">
            <div className="bg-[var(--surface)] p-4 brutal-border brutal-shadow brutal-skew w-32 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
              <span className="text-4xl font-black font-mono">{totalPosts}</span>
              <span className="text-xs font-mono uppercase text-[var(--muted)] tracking-wider mt-1">Posts</span>
            </div>
            <div className="bg-[var(--surface)] p-4 brutal-border brutal-shadow brutal-skew w-32 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
              <span className="text-4xl font-black font-mono text-[var(--accent)]">{uniqueTags}</span>
              <span className="text-xs font-mono uppercase text-[var(--muted)] tracking-wider mt-1">Tags</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="bg-[var(--text)] text-[var(--bg)] p-8 brutal-border brutal-shadow brutal-skew w-full h-full min-h-[400px] flex flex-col relative group">
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-none bg-red-500"></div>
              <div className="w-3 h-3 rounded-none bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-none bg-green-500"></div>
            </div>
            <pre className="font-mono text-sm leading-relaxed overflow-x-hidden text-emerald-400 opacity-90 transition-transform group-hover:scale-[1.02]">
              <code>{`export async function getBrain() {
  const thoughts = await db
    .select(entropy)
    .from('mind')
    .where('monster', '>', 0);
    
  return {
    status: 200,
    body: generateAesthetic(thoughts)
  };
}

// System diagnostic: OK
// Caffeine level: OPTIMAL
// Style: SKEWBRUTAL`}</code>
            </pre>
            <div className="absolute bottom-4 right-4 text-[var(--bg)] opacity-30 font-bold text-6xl">＊</div>
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-black uppercase brutal-skew">Latest Logs</h2>
          <div className="h-[2.5px] bg-[var(--text)] flex-grow mt-2"></div>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="border-[2.5px] bg-[var(--surface)] border-dashed border-[var(--text)] p-12 text-center font-mono brutal-skew">
            Initiating sequence... awaiting first transmission.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <BlogCard
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt || ""}
                  tags={post.tags}
                  date={new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  readTime={post.read_time || "5 min read"}
                />
              </div>
            ))}
          </div>
        )
        }
      </section >
    </div >
  );
}
