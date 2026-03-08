"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation"; // Added import for useRouter

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const clickCountRef = useRef(0);
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSecretClick = (e: React.MouseEvent) => {
        e.preventDefault();

        clickCountRef.current += 1;
        const currentCount = clickCountRef.current;

        if (currentCount === 1) {
            router.push('/');
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (currentCount >= 5) {
            clickCountRef.current = 0;
            router.push('/admin/login');
        } else {
            timeoutRef.current = setTimeout(() => {
                clickCountRef.current = 0;
                timeoutRef.current = null;
            }, 1500);
        }
    };

    return (
        <nav className="sticky top-0 z-40 bg-[var(--bg)] border-b-[2.5px] border-[var(--text)]">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
                {/* Modified Link to span for secret click functionality */}
                <span
                    onClick={handleSecretClick}
                    className="font-mono text-2xl font-bold brutal-skew hover:pr-1 cursor-pointer select-none"
                    title="BYTE//BRAIN"
                >
                    BYTE//BRAIN
                </span>
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-10 h-10 border-[2.5px] border-[var(--text)] bg-[var(--surface)] shadow-[4px_4px_0_var(--text)] flex items-center justify-center brutal-skew transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[7px_7px_0_var(--text)] active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0_var(--text)] focus:outline-none focus:shadow-[4px_4px_0_var(--accent)] focus:border-[var(--accent)]"
                    aria-label="Toggle theme"
                >
                    {mounted ? (
                        theme === 'dark' ? <Sun className="w-5 h-5 text-[var(--accent)]" /> : <Moon className="w-5 h-5 text-[var(--accent)]" />
                    ) : (
                        <div className="w-5 h-5" /> // placeholder to prevent layout shift
                    )}
                </button>
            </div>
        </nav>
    );
}
