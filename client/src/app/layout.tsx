import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Spotlight from "@/components/Spotlight";
import StructuredData from "@/components/StructuredData";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shofiqdev81.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shofiqul Islam Sujon — Shopify Developer & E-Commerce Expert",
    template: "%s | Shofiqul Islam Sujon",
  },
  description:
    "Official portfolio of Shofiqul Islam Sujon — Professional Shopify Developer & E-Commerce Specialist. 120+ custom Shopify stores built with Liquid, Next.js, and speed optimization.",
  applicationName: "Shofiqul Islam Sujon Portfolio",
  authors: [{ name: "Shofiqul Islam Sujon", url: siteUrl }],
  creator: "Shofiqul Islam Sujon",
  publisher: "Shofiqul Islam Sujon",
  keywords: [
    "Shofiqul Islam Sujon",
    "Shopify Developer Shofiqul Islam Sujon",
    "Shopify Developer",
    "Shopify Expert",
    "Liquid Developer",
    "Shopify Store Speed Optimization",
    "Custom Shopify Theme Development",
    "Headless Shopify Next.js",
    "Full-Stack Developer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "Shofiqul Islam",
    "Sujon Shopify",
    "Ecommerce Specialist Bangladesh",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Shofiqul Islam Sujon — Portfolio",
    title: "Shofiqul Islam Sujon — Shopify Developer & E-Commerce Expert",
    description:
      "Explore 120+ Shopify projects, custom Liquid themes, performance optimization case studies, and full-stack solutions by Shofiqul Islam Sujon.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Shofiqul Islam Sujon — Shopify Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shofiqul Islam Sujon — Shopify Developer & E-Commerce Expert",
    description:
      "Professional Shopify Developer & Full-Stack Specialist with 120+ stores built. Custom Liquid, theme customization, and speed optimization.",
    images: ["/opengraph-image"],
    creator: "@shofiqdev81",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark scroll-smooth"
      suppressHydrationWarning={true}
    >
      <head>
        <StructuredData />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#0A0A0A] text-[#F5F5F0] antialiased selection:bg-[#7CFF6B] selection:text-black`}
      >
        <Spotlight />
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
