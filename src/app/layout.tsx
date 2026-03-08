import type { Metadata } from "next";
import { Syne, Space_Mono as Commit_Mono } from "next/font/google"; // Fallback to Space Mono if Commit_Mono isn't supported by next/font/google
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
});

const commitMono = Commit_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-commit-mono",
});

export const metadata: Metadata = {
  title: "BYTE//BRAIN",
  description: "Tech advice blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${commitMono.variable} antialiased`}>
        <div className="pinstripe-top"></div>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
        >
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="border-t-[2.5px] border-[var(--text)] py-8 mt-16 bg-[var(--surface)] text-center">
            <div className="font-mono text-sm uppercase tracking-wider brutal-skew inline-block px-4 py-2 border-[2.5px] border-[var(--text)] shadow-[4px_4px_0_var(--text)] bg-[var(--bg)]">
              BYTE//BRAIN &copy; 2026 - Heet Parikh<br />
              No cookies. Just bytes.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
