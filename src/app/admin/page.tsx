"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Edit, Trash2, Check, X, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [readTime, setReadTime] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [published, setPublished] = useState(true);

    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    // Upload state
    const [uploading, setUploading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/posts");
            const data = await res.json();
            setPosts(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/");
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setTags("");
        setReadTime("");
        setExcerpt("");
        setContent("");
        setPublished(true);
        setMessage("");
        setUploadUrl("");
    };

    const handleEdit = (post: any) => {
        setEditingId(post.id);
        setTitle(post.title);
        setTags(post.tags?.join(", ") || "");
        setReadTime(post.read_time || "");
        setExcerpt(post.excerpt || "");
        setContent(post.content);
        setPublished(post.published);
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await fetch(`/api/posts/${id}`, { method: "DELETE" });
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleTogglePublish = async (post: any) => {
        try {
            await fetch(`/api/posts/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...post, published: !post.published }),
            });
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setMessage("");

        const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
        const payload = {
            title,
            tags: tagsArray,
            read_time: readTime,
            excerpt,
            content,
            published,
        };

        try {
            const url = editingId ? `/api/posts/${editingId}` : "/api/posts";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage(editingId ? "Post updated successfully!" : "Post published successfully!");
                if (!editingId) resetForm();
                fetchPosts();
                router.refresh(); // Refresh client side cache
            } else {
                const data = await res.json();
                setMessage(`Error: ${data.error || "Failed"}`);
            }
        } catch (err) {
            setMessage("An unexpected error occurred.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setUploadUrl(data.url);
                // Auto-insert at cursor position or end of content
                setContent(prev => prev + `\n\n![Image](${data.url})`);
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (err) {
            alert("Upload failed.");
        } finally {
            setUploading(false);
            // clear the input
            e.target.value = '';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-12 border-b-[2.5px] border-[var(--text)] pb-4">
                <h1 className="text-4xl font-bold brutal-skew">COMMAND CENTER</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-[var(--surface)] brutal-border px-4 py-2 brutal-shadow hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_var(--text)] transition-all font-mono text-sm uppercase"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* LEFT COLUMN: Editor */}
                <div className="lg:col-span-7">
                    <div className="bg-[var(--surface)] brutal-border p-6 brutal-shadow relative mb-8">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--accent)]"></div>
                        <h2 className="text-2xl font-bold brutal-skew mb-6">
                            {editingId ? "EDIT POST" : "WRITE NEW POST"}
                        </h2>

                        {message && (
                            <div className={`p-3 brutal-border mb-6 font-mono text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-[var(--accent)] text-white"}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                            <div className="flex flex-col space-y-2">
                                <label className="font-mono text-sm font-bold tracking-wider uppercase">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[var(--bg)] brutal-border p-3 focus:outline-none transition-shadow font-bold text-lg"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-2">
                                    <label className="font-mono text-sm font-bold tracking-wider uppercase">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full bg-[var(--bg)] brutal-border p-2 focus:outline-none font-mono text-sm"
                                        placeholder="react, nextjs, ai"
                                    />
                                    {/* Tag preview chips */}
                                    {tags && (
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                                                <span key={t} className="text-[0.65rem] font-mono tracking-widest uppercase bg-[var(--text)] text-[var(--bg)] px-2 py-0.5 border border-transparent brutal-skew">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="font-mono text-sm font-bold tracking-wider uppercase">Read Time</label>
                                    <input
                                        type="text"
                                        value={readTime}
                                        onChange={(e) => setReadTime(e.target.value)}
                                        className="w-full bg-[var(--bg)] brutal-border p-2 focus:outline-none font-mono text-sm"
                                        placeholder="5 min read"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="font-mono text-sm font-bold tracking-wider uppercase">Excerpt</label>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    className="w-full bg-[var(--bg)] brutal-border p-3 focus:outline-none transition-shadow resize-none h-24"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="font-mono text-sm font-bold tracking-wider uppercase">Content</label>
                                    <label className="cursor-pointer flex items-center gap-2 bg-[var(--surface)] text-[var(--text)] brutal-border px-3 py-1 font-mono text-xs hover:bg-[var(--accent)] hover:text-white transition-colors brutal-skew">
                                        <ImageIcon className="w-3 h-3" />
                                        {uploading ? "UPLOADING..." : "UPLOAD IMAGE"}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} disabled={uploading} />
                                    </label>
                                </div>
                                {uploadUrl && (
                                    <div className="text-xs font-mono text-[var(--accent)] bg-[var(--surface)] p-2 brutal-border mt-1">
                                        Last uploaded: {uploadUrl}
                                    </div>
                                )}
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-[var(--bg)] brutal-border p-3 focus:outline-none transition-shadow font-mono text-sm h-[400px] leading-relaxed"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={published}
                                        onChange={(e) => setPublished(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-[var(--muted)] peer-focus:outline-none brutal-border peer-checked:after:translate-x-full peer-checked:bg-[var(--accent)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-4 after:w-4 after:transition-all rounded-none brutal-skew"></div>
                                    <span className="ml-3 font-mono text-sm font-bold uppercase">Published status</span>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-[var(--accent)] text-white brutal-border p-4 font-bold tracking-widest shadow-[4px_4px_0_var(--text)] hover:shadow-[7px_7px_0_var(--text)] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0_var(--text)] transition-all brutal-skew disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {formLoading ? "SAVING..." : (editingId ? "UPDATE POST →" : "PUBLISH POST →")}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 bg-[var(--bg)] text-[var(--text)] brutal-border font-bold tracking-widest shadow-[4px_4px_0_var(--text)] hover:shadow-[7px_7px_0_var(--text)] hover:-translate-y-1 hover:-translate-x-1 transition-all brutal-skew"
                                    >
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: Manage Posts */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    <div className="bg-[var(--text)] text-[var(--bg)] brutal-border p-4 brutal-shadow brutal-skew relative group">
                        <h2 className="text-xl font-bold uppercase tracking-widest">MANAGE POSTS</h2>
                        <div className="absolute top-2 right-2 text-[var(--surface)] text-opacity-50 font-mono text-4xl font-bold">{posts.length}</div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-[var(--surface)] brutal-border animate-pulse brutal-skew"></div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="border-[2.5px] border-dashed border-[var(--text)] p-8 text-center font-mono brutal-skew">
                            No posts found. Write one!
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 pb-4">
                            {posts.map(post => (
                                <div key={post.id} className="bg-[var(--surface)] brutal-border p-4 brutal-shadow flex flex-col gap-3 group transition-transform hover:-translate-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg leading-tight line-clamp-2 brutal-skew">{post.title}</h3>
                                        {post.published ? (
                                            <span className="bg-[var(--accent)] text-white text-[0.6rem] font-mono px-2 py-0.5 border-t border-b border-[var(--text)] brutal-skew whitespace-nowrap ml-2">PUBLISHED</span>
                                        ) : (
                                            <span className="bg-[var(--muted)] text-white text-[0.6rem] font-mono px-2 py-0.5 border-t border-b border-[var(--text)] brutal-skew whitespace-nowrap ml-2">DRAFT</span>
                                        )}
                                    </div>

                                    <div className="font-mono text-xs text-[var(--muted)]">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </div>

                                    <div className="flex justify-between items-center mt-2 pt-3 border-t-[2.5px] border-dotted border-[var(--text)]">
                                        <button
                                            onClick={() => handleTogglePublish(post)}
                                            className="font-mono text-xs uppercase hover:text-[var(--accent)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 font-bold"
                                        >
                                            {post.published ? "UNPUBLISH" : "PUBLISH"}
                                        </button>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(post)} aria-label="Edit post" className="w-8 h-8 flex justify-center items-center bg-[var(--bg)] brutal-border hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors brutal-skew">
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(post.id)} aria-label="Delete post" className="w-8 h-8 flex justify-center items-center bg-[var(--bg)] brutal-border hover:bg-red-600 hover:text-white hover:border-red-800 transition-colors brutal-skew">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
