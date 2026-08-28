import React from "react";
import { Metadata } from "next";
import { TBlog } from "@/components/ForBlogs/BlogsCard";
import BlogsCard from "@/components/ForBlogs/BlogsCard";
import { getBlogs } from "@/actions/revalidateData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Articles & Insights — Shofiqul Islam",
  description: "Technical writings on Shopify development, Liquid architecture, React, Next.js, and web performance.",
};

const BlogsPage = async () => {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] selection:bg-[#7CFF6B] selection:text-black flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-12 flex-1 w-full">
        
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TECHNICAL WRITING</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            Articles &amp; Insights
          </h1>
          <p className="text-sm font-sans text-[#A1A1A1] leading-relaxed">
            Practical tutorials, Shopify optimization breakdowns, full-stack architectural explorations, and development notes.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.length > 0 ? (
            blogs.map((blog: TBlog, index: number) => (
              <BlogsCard key={blog._id || index} blog={blog} />
            ))
          ) : (
            <div className="col-span-full p-16 text-center rounded-xl bg-[#121212] border border-[#222222] space-y-2">
              <p className="text-sm font-mono text-[#888]">No published articles yet.</p>
              <p className="text-xs text-[#555]">New Shopify and Full-Stack deep dives are published regularly.</p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default BlogsPage;
