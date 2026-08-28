import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import SelectedWork from "@/components/SelectedWork";
import ShopifyExpertise from "@/components/ShopifyExpertise";
import FullStackCapabilities from "@/components/FullStackCapabilities";
import DeveloperPlayground from "@/components/DeveloperPlayground";
import ProcessSection from "@/components/ProcessSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import TechStackSection from "@/components/TechStackSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
// import BlogsPage from "./blogs/page";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] selection:bg-[#7CFF6B] selection:text-black">
      <Navbar />
      <Hero />
      <TechMarquee />
      <SelectedWork />
      <ShopifyExpertise />
      <FullStackCapabilities />
      <DeveloperPlayground />
      <ProcessSection />
      <ExperienceTimeline />
      <TechStackSection />
      <AboutSection />
      {/* <BlogsPage /> */}
      <ContactSection />
      <Footer />
    </main>
  );
}
