"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Code2 } from "lucide-react";

const navLinks = [
  { name: "Work", href: "#work" },
  { name: "Shopify", href: "#shopify" },
  { name: "Full-Stack", href: "#fullstack" },
  { name: "Playground", href: "#playground" },
  { name: "Experience", href: "#experience" },
  { name: "Stack", href: "#stack" },
  { name: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#222222]/80 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Availability Indicator */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight text-[#F5F5F0] hover:text-[#7CFF6B] transition-colors flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center text-[#7CFF6B]">
              <Code2 className="w-4 h-4" />
            </span>
            <span>SHOFIQUL</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#A1A1A1]">
            <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
            <span>AVAILABLE</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-mono text-[#A1A1A1]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 hover:text-[#F5F5F0] ${
                  isActive ? "text-[#7CFF6B] font-medium" : ""
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-medium px-4 py-2 rounded-md bg-[#7CFF6B] text-black hover:bg-[#68e057] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#7CFF6B]/10"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg bg-[#161616] border border-[#262626] text-[#F5F5F0] hover:text-[#7CFF6B] focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#222222] px-6 py-6 space-y-4 font-mono animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-2 text-xs text-[#A1A1A1]">
              <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
              <span>Available for projects</span>
            </div>
            <span className="text-xs text-[#555]">MENU</span>
          </div>
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base text-[#F5F5F0] hover:text-[#7CFF6B] py-1 border-b border-[#161616] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-mono font-medium py-3 rounded-md bg-[#7CFF6B] text-black hover:bg-[#68e057] transition-all mt-4"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
}
