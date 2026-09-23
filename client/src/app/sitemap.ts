import type { MetadataRoute } from "next";
import { getProjects, getBlogs } from "@/actions/revalidateData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shofiqdev81.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const [projects, blogs] = await Promise.all([
      getProjects().catch(() => []),
      getBlogs().catch(() => []),
    ]);

    const projectRoutes: MetadataRoute.Sitemap = (projects || [])
      .filter((p: { _id?: string }) => Boolean(p?._id))
      .map((p: { _id: string; updatedAt?: string; createdAt?: string }) => ({
        url: `${siteUrl}/projects/${p._id}`,
        lastModified: p.updatedAt || p.createdAt || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));

    const blogRoutes: MetadataRoute.Sitemap = (blogs || [])
      .filter((b: { _id?: string }) => Boolean(b?._id))
      .map((b: { _id: string; updatedAt?: string; createdAt?: string }) => ({
        url: `${siteUrl}/blogs/${b._id}`,
        lastModified: b.updatedAt || b.createdAt || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...projectRoutes, ...blogRoutes];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return staticRoutes;
  }
}

