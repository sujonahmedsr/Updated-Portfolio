import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shofiqdev81.vercel.app";
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shofiqul81severdb.vercel.app/api";

  try {
    const res = await fetch(`${API_URL}/blogs/${id}`, {
      next: { revalidate: 60, tags: ["blogs"] },
    });

    if (!res.ok) {
      return {
        title: "Article Details | Shofiqul Islam Sujon",
      };
    }

    const blogData = await res.json();
    const blog = blogData?.data?.result || blogData?.data;

    if (!blog) {
      return {
        title: "Article Not Found | Shofiqul Islam Sujon",
      };
    }

    const title = `${blog.title} | Shofiqul Islam Sujon`;
    const plainDesc = blog.description
      ? blog.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
      : `Read this article on Shopify & web engineering by Shofiqul Islam Sujon.`;

    return {
      title,
      description: plainDesc,
      keywords: [
        blog.title,
        "Shofiqul Islam Sujon",
        "Shopify Developer",
        "Shopify Tutorials",
        "Liquid Architecture",
      ],
      alternates: {
        canonical: `/blogs/${id}`,
      },
      openGraph: {
        title,
        description: plainDesc,
        url: `${siteUrl}/blogs/${id}`,
        siteName: "Shofiqul Islam Sujon Portfolio",
        type: "article",
        publishedTime: blog.createdAt,
        authors: ["Shofiqul Islam Sujon"],
        images: blog.image
          ? [
              {
                url: blog.image,
                alt: `${blog.title} — Shofiqul Islam Sujon`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: plainDesc,
        images: blog.image ? [blog.image] : undefined,
      },
    };
  } catch {
    return {
      title: "Article Details | Shofiqul Islam Sujon — Shopify Developer",
    };
  }
}

const BlogDetails = async ({ params }: PageProps) => {
  const { id } = await params;

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shofiqul81severdb.vercel.app/api";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shofiqdev81.vercel.app";

  let blog = null;
  let settings = null;

  try {
    const [blogRes, settingsRes] = await Promise.all([
      fetch(`${API_URL}/blogs/${id}`, {
        next: { revalidate: 60, tags: ["blogs"] },
      }),
      fetch(`${API_URL}/settings`, {
        next: { revalidate: 60, tags: ["settings"] },
      }).catch(() => null),
    ]);

    if (blogRes.ok) {
      const blogsData = await blogRes.json();
      blog = blogsData?.data?.result || blogsData?.data;
    }

    if (settingsRes && settingsRes.ok) {
      const settingsData = await settingsRes.json();
      settings = settingsData?.data?.result || settingsData?.data;
    }
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }

  const safeSettings = settings || {};

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col justify-between">
        <Navbar settings={safeSettings} />
        <div className="max-w-xl mx-auto text-center py-32 px-4 space-y-4">
          <h1 className="font-heading text-2xl font-bold text-[#FF5F56]">
            Article Not Found
          </h1>
          <p className="text-sm font-mono text-[#888]">
            The requested article could not be found or may have been removed.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161616] border border-[#262626] text-[#7CFF6B] font-mono text-xs hover:border-[#7CFF6B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </Link>
        </div>
        <Footer settings={safeSettings} />
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: blog.image ? [blog.image] : undefined,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: "Shofiqul Islam Sujon",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Shofiqul Islam Sujon",
      url: siteUrl,
    },
    description: blog.description
      ? blog.description.replace(/<[^>]*>?/gm, "").slice(0, 200)
      : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blogs/${id}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] selection:bg-[#7CFF6B] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar settings={safeSettings} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#888] hover:text-[#7CFF6B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL ARTICLES</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4 pb-6 border-b border-[#1E1E1E]">
          {blog.createdAt && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B]">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0] leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* Cover Image */}
        {blog.image && (
          <div className="relative rounded-2xl overflow-hidden border border-[#222222] bg-[#121212] aspect-video">
            <Image
              src={blog.image}
              alt={`${blog.title} — Shofiqul Islam Sujon`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <article className="p-6 sm:p-8 rounded-xl bg-[#121212] border border-[#222222]">
          <div
            className="rich-content max-w-full break-words font-sans"
            dangerouslySetInnerHTML={{
              __html: sanitizeRichHtml(blog.description),
            }}
          />
        </article>

        {/* Back button bottom */}
        <div className="pt-6 border-t border-[#1E1E1E]">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#7CFF6B] font-mono text-xs hover:border-[#7CFF6B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </main>

      <Footer settings={safeSettings} />
    </div>
  );
};

export default BlogDetails;
