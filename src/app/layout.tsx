import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelX — AI CCTV Surveillance & Evidence Platform",
  description: "Next-generation Explainable AI CCTV monitoring, automated event detection, privacy redaction, and SHA-256 evidence integrity verification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090E] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
