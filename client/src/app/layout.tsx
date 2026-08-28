import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Shofiqul Islam — Shopify Developer & Full-Stack Developer",
  description:
    "Shopify Developer and Full-Stack Developer specializing in custom Shopify storefronts, Liquid, React, Next.js, Node.js, performance optimization, and modern web experiences.",
  keywords: [
    "Shopify Developer",
    "Liquid",
    "Shopify Storefronts",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Tailwind CSS",
  ],
  authors: [{ name: "Shofiqul Islam" }],
  openGraph: {
    title: "Shofiqul Islam — Shopify Developer & Full-Stack Developer",
    description:
      "Building premium Shopify storefronts and modern web applications with a focus on performance, usability, and clean development.",
    type: "website",
    url: "https://shofiqul.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning={true}>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#0A0A0A] text-[#F5F5F0] antialiased selection:bg-[#7CFF6B] selection:text-black`}
      >
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
