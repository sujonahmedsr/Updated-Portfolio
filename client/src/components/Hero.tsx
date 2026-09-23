"use client";

import Image from "next/image";
import { ArrowUpRight, Zap, Check, ShoppingBag, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-0 lg:min-h-screen pt-28 pb-10 sm:pt-32 sm:pb-14 overflow-hidden bg-grid-pattern bg-radial-gradient flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8 min-w-0">
            {/* Availability Badge */}
            <div className="inline-flex max-w-full flex-wrap items-center gap-2.5 rounded-full border border-[#222222] bg-[#121212] px-3.5 py-1.5 text-[10px] font-mono text-[#A1A1A1] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
              <span className="text-[#F5F5F0]">STATUS:</span>
              <span className="text-[#7CFF6B]">AVAILABLE</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <span className="block font-mono text-xs sm:text-sm text-[#7CFF6B] font-semibold tracking-wider uppercase">
                Hello, I&apos;m Shofiqul Islam Sujon
              </span>
              <h1 className="font-heading text-[clamp(2.25rem,7.5vw,3.5rem)] font-bold tracking-tight text-[#F5F5F0] leading-[1.08] break-words [text-wrap:balance]">
                SHOPIFY DEVELOPER &amp;
                <span className="block text-[#7CFF6B] font-mono text-[clamp(1.55rem,5.2vw,2.75rem)] mt-2 font-semibold break-words">
                  E-COMMERCE SPECIALIST
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#A1A1A1] max-w-2xl leading-relaxed font-sans font-light">
              I&apos;m{" "}
              <strong className="text-[#F5F5F0] font-medium">
                Shofiqul Islam Sujon
              </strong>
              , a specialized{" "}
              <strong className="text-[#F5F5F0] font-medium">
                Shopify Developer
              </strong>
              . I build and customize high-performing Shopify storefronts with{" "}
              <span className="text-[#7CFF6B] font-medium">
                custom Liquid development
              </span>
              , theme architecture, speed optimization, and seamless business
              integrations.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#work"
                aria-label="View Shopify projects by Shofiqul Islam Sujon"
                className="px-6 py-3.5 rounded-md bg-[#7CFF6B] text-black font-mono font-semibold text-sm hover:bg-[#68e057] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#7CFF6B]/15 inline-flex items-center gap-2"
              >
                <span>View My Work</span>
              </a>

              <a
                href="#contact"
                aria-label="Contact Shopify Developer Shofiqul Islam Sujon"
                className="px-6 py-3.5 rounded-md bg-[#121212] border border-[#262626] text-[#F5F5F0] font-mono font-medium text-sm hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-all inline-flex items-center gap-2"
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Credibility Metadata */}
            <div className="pt-6 border-t border-[#1A1A1A] grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs text-[#A1A1A1]">
              <div>
                <span className="block text-[#7CFF6B] font-bold text-sm">
                  120+ PROJECTS
                </span>
                <span className="text-[#666]">Shopify &amp; E-commerce</span>
              </div>

              <div>
                <span className="block text-[#F5F5F0] font-bold text-sm">
                  SHOPIFY &amp; LIQUID
                </span>
                <span className="text-[#666]">
                  Themes, Sections &amp; Features
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[#F5F5F0] font-bold text-sm">
                  PERFORMANCE &amp; UX
                </span>
                <span className="text-[#666]">
                  Responsive &amp; Optimized Stores
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Profile Showcase */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#7CFF6B]/20 via-transparent to-[#7CFF6B]/10 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

            <div className="relative rounded-2xl bg-[#121212]/90 border border-[#262626] shadow-2xl overflow-hidden font-mono p-3 sm:p-4 hover:border-[#7CFF6B]/40 transition-all duration-300 group">
              {/* Window Header */}
              <div className="bg-[#161616] px-4 py-2.5 rounded-xl border border-[#222222] flex items-center justify-between gap-3 mb-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]/80"></span>
                  <span className="ml-2 truncate text-xs text-[#888]">
                    shofiqul-islam-sujon.profile
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#7CFF6B] bg-[#7CFF6B]/10 px-2 py-0.5 rounded border border-[#7CFF6B]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Main Image Frame */}
              <div className="relative aspect-[5/5] w-full rounded-xl overflow-hidden border border-[#222222] bg-[#0E0E0E]">
                <Image
                  src="/facebook-profile.jpg"
                  alt="Shofiqul Islam Sujon — Shopify Developer & E-Commerce Specialist"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette / gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-transparent to-transparent opacity-50" />

                {/* Floating Badge 1 (Top Left): Status Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121212]/85 backdrop-blur-md border border-white/10 text-[11px] text-[#F5F5F0] shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-ping" />
                  <span className="font-semibold">Shopify Specialist</span>
                </div>

                {/* Floating Badge 2 (Top Right): Verified Badge */}
                {/* <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#121212]/85 backdrop-blur-md border border-[#7CFF6B]/30 text-[10px] text-[#7CFF6B] shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  <span>Verified Dev</span>
                </div> */}

                {/* Floating Badge 3 (Bottom Left): Experience / Project count */}
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto flex items-center gap-3 p-3 rounded-xl bg-[#121212]/90 backdrop-blur-md border border-[#262626] shadow-xl">
                  <div className="w-9 h-9 rounded-lg bg-[#181818] border border-[#333] flex items-center justify-center text-[#7CFF6B] shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#F5F5F0]">
                      120+ Completed Stores
                    </div>
                    <div className="text-[10px] text-[#7CFF6B]">
                      Custom Liquid &amp; Themes
                    </div>
                  </div>
                </div>

                {/* Floating Badge 4 (Bottom Right on sm+): Speed & UX */}
                <div className="hidden sm:flex absolute bottom-3 right-3 items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#121212]/90 backdrop-blur-md border border-[#262626] shadow-xl text-right">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#7CFF6B]">
                      95+ Score
                    </div>
                    <div className="text-[10px] text-[#A1A1A1]">
                      Speed &amp; UX
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#333] flex items-center justify-center text-[#7CFF6B] shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              {/* <div className="mt-3 p-2.5 rounded-xl bg-[#161616]/80 border border-[#222222] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#888]">
                <div className="flex items-center gap-1.5 text-[#F5F5F0]">
                  <Check className="w-3.5 h-3.5 text-[#7CFF6B]" />
                  <span>Liquid • Storefront 2.0 • Headless</span>
                </div>
                <span className="text-[#7CFF6B] font-semibold text-[10px]">
                  OPEN FOR WORK
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
