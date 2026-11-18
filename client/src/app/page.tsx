export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
// import TechMarquee from "@/components/TechMarquee";
import TrustStats from "@/components/TrustStats";
import ShopifyProjectsSection from "@/components/ShopifyProjectsSection";
import ShopifyExpertise from "@/components/ShopifyExpertise";
// import DeveloperPlayground from "@/components/DeveloperPlayground";
import ProcessSection from "@/components/ProcessSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import SelectedWork from "@/components/SelectedWork";
import TechStackSection from "@/components/TechStackSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import {
  getProjects,
  getShopifyProjects,
  getSettings,
} from "@/actions/revalidateData";
// import BlogsPage from "./blogs/page";

export default async function HomePage() {
  const [shopifyProjects, projects, settings] = await Promise.all([
    getShopifyProjects(),
    getProjects(),
    getSettings(),
  ]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] selection:bg-[#7CFF6B] selection:text-black">
      <Navbar settings={settings} />
      <Hero />
      <TrustStats />
      {/* <TechMarquee /> */}

      {/* ─── 1. SHOPIFY PROJECTS SECTION (In place of old Selected Work, 3-col grid, 6 stores, "View All" popup) ─── */}
      <ShopifyProjectsSection initialProjects={shopifyProjects} />

      <ShopifyExpertise />
      {/* <DeveloperPlayground /> */}
      <ProcessSection />

      {/* ─── 2. EXPERIENCE & EDUCATION ─── */}
      <ExperienceTimeline />

      {/* ─── 3. SELECTED CUSTOM WORK (Relocated: Below Experience & Education, Above Technology & Stack) ─── */}
      <SelectedWork initialProjects={projects} />

      {/* ─── 4. TECHNOLOGY & STACK ─── */}
      <TechStackSection />

      <AboutSection
        resumeUrl={settings?.resumeUrl}
        availability={settings?.availability}
      />
      {/* <BlogsPage /> */}
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
