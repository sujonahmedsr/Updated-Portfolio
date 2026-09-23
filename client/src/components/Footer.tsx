"use client";

import Link from "next/link";
import { Terminal, Check, ArrowUp } from "lucide-react";
import type { PortfolioSettings } from "@/actions/revalidateData";

const defaultSettings: PortfolioSettings = {
  siteName: "Shofiqul Islam Sujon",
  tagline: "Shopify Developer & Full-Stack Specialist",
  contactEmail: "",
  githubUrl: "",
  facebookUrl: "",
  linkedinUrl: "",
  resumeUrl: "/resume.pdf",
  availability: "Available for selected Shopify projects",
};

export default function Footer({
  settings = defaultSettings,
}: {
  settings?: PortfolioSettings;
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#070707] border-t border-[#161616] py-12 font-mono text-xs text-[#888]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Footer Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#1A1A1A]">
          <div>
            <Link
              href="/"
              className="font-handwriting text-2xl font-bold text-[#F5F5F0] hover:text-[#7CFF6B] transition-colors"
            >
              {settings.siteName}
            </Link>
            <p className="text-xs text-[#666] mt-1 font-sans">
              {settings.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A1A1A1]">
            <a href="#work" className="hover:text-[#7CFF6B] transition-colors">
              Work
            </a>
            <a
              href="#shopify"
              className="hover:text-[#7CFF6B] transition-colors"
            >
              Services
            </a>
            <a
              href="#experience"
              className="hover:text-[#7CFF6B] transition-colors"
            >
              Experience
            </a>
            <a href="#about" className="hover:text-[#7CFF6B] transition-colors">
              About
            </a>
            <a
              href="#contact"
              className="hover:text-[#7CFF6B] transition-colors"
            >
              Contact
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-lg bg-[#121212] border border-[#222222] text-[#F5F5F0] hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Status & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Decorative Terminal Line */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E0E0E] border border-[#1F1F1F] text-[11px] text-[#A1A1A1]">
            <Terminal className="w-3.5 h-3.5 text-[#7CFF6B]" />
            <span>$ npm run build</span>
            <span className="text-[#7CFF6B] flex items-center gap-1 font-bold">
              <Check className="w-3 h-3" /> Production ready
            </span>
          </div>

          <div className="text-center sm:text-right text-[#555] text-[11px]">
            <span>
              © {new Date().getFullYear()} Shofiqul Islam Sujon — Shopify
              Developer &amp; Full-Stack Specialist.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
