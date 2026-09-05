import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
// import TechMarquee from "@/components/TechMarquee";
import TrustStats from "@/components/TrustStats";
import SelectedWork from "@/components/SelectedWork";
import ShopifyExpertise from "@/components/ShopifyExpertise";
// import DeveloperPlayground from "@/components/DeveloperPlayground";
import ProcessSection from "@/components/ProcessSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import TechStackSection from "@/components/TechStackSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getProjects, getSettings } from "@/actions/revalidateData";
// import BlogsPage from "./blogs/page";

export default async function HomePage() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSettings(),
  ]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] selection:bg-[#7CFF6B] selection:text-black">
      <Navbar />
      <Hero />
      <TrustStats />
      {/* <TechMarquee /> */}
      <SelectedWork initialProjects={projects} />
      <ShopifyExpertise />
      {/* <DeveloperPlayground /> */}
      <ProcessSection />
      <ExperienceTimeline />
      <TechStackSection />
      <AboutSection
        resumeUrl={settings.resumeUrl}
        availability={settings.availability}
      />
      {/* <BlogsPage /> */}
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
