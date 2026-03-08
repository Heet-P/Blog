"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-[var(--surface)] p-8 md:p-12 brutal-border brutal-shadow brutal-skew w-full max-w-md relative">
                <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--accent)]"></div>

                <div className="flex items-center justify-center w-12 h-12 brutal-border bg-[var(--bg)] mb-6 shadow-[2px_2px_0_var(--text)]">
                    <Lock className="w-5 h-5 text-[var(--text)]" />
                </div>

                <h1 className="text-3xl font-bold mb-2">RESTRICTED<br />ACCESS</h1>
                <p className="text-[var(--muted)] mb-8 font-mono text-sm leading-relaxed">
                    BYTE//BRAIN Admin. Enter passphrase to continue.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="font-mono text-sm font-bold tracking-wider" htmlFor="password">
                            PASSPHRASE
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full bg-[var(--bg)] brutal-border p-3 font-mono focus:outline-none focus:shadow-[4px_4px_0_var(--accent)] focus:border-[var(--accent)] transition-shadow"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 brutal-border p-3 text-sm font-mono flex items-start">
                            <span>!</span>
                            <span className="ml-2">{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--accent)] text-white brutal-border p-4 font-bold tracking-widest shadow-[4px_4px_0_var(--text)] hover:shadow-[7px_7px_0_var(--text)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-[2px_2px_0_var(--text)] active:translate-y-1 active:translate-x-1 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "AUTHENTICATING..." : "ENTER"}
                    </button>
                </form>
            </div>
        </div>
    );
}
