import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

/* ── Fonts ─────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* ── Metadata ───────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Herizon — Empowering Every Woman's Career Journey",
    template: "%s | Herizon",
  },
  description:
    "Herizon empowers women with AI-powered career guidance, opportunity discovery, personalized learning and career restart support. Built for the Vibe2Vision Hackathon.",
  keywords: [
    "women empowerment",
    "career guidance",
    "AI career coach",
    "career restart",
    "scholarships",
    "internships",
    "women in tech",
    "Herizon",
  ],
  authors: [{ name: "Team Galaxantic" }],
  creator: "Team Galaxantic",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    siteName: "Herizon",
    title: "Herizon — Empowering Every Woman's Career Journey",
    description:
      "AI-powered career empowerment platform designed to help women confidently restart careers, discover opportunities, and grow.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Herizon — Empowering Every Woman's Career Journey",
    description:
      "AI-powered career empowerment platform for women.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f5e6d1",
  width: "device-width",
  initialScale: 1,
};

/* ── Root Layout ────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
