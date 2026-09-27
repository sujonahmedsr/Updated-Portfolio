"use client";

import { useEffect, useState } from "react";
import { Article, Message, Project } from "@/types";
import { getArticlesApi, getMessagesApi, getProjectsApi } from "@/lib/api";

export default function ReadOnlyDashboardPage() {
  const [data, setData] = useState<{
    projects: Project[];
    articles: Article[];
    messages: Message[];
  }>({ projects: [], articles: [], messages: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getProjectsApi(), getArticlesApi(), getMessagesApi()])
      .then(([projects, articles, messages]) =>
        setData({ projects, articles, messages }),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <header className="border-b border-[#242424] pb-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#7CFF6B]">
          Read-only preview
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold">
          Dashboard overview
        </h1>
        <p className="mt-2 text-sm text-[#A1A1A1]">
          Demo access cannot change portfolio content. Personal finance, notes,
          and goals are not available in demo mode.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          ["Projects", data.projects.length],
          ["Articles", data.articles.length],
          ["Messages", data.messages.length],
        ].map(([label, count]) => (
          <div key={label} className="border-y border-[#292929] py-4">
            <p className="font-mono text-xs uppercase text-[#858585]">
              {label}
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {loading ? "…" : count}
            </p>
          </div>
        ))}
      </div>
      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="border-b border-[#292929] pb-3 font-heading text-lg font-semibold">
            Projects
          </h2>
          <div className="divide-y divide-[#242424]">
            {data.projects.map((project) => (
              <article key={project._id} className="py-4">
                <h3 className="font-medium">{project.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-[#9A9A9A]">
                  {project.description}
                </p>
                <p className="mt-2 font-mono text-[11px] text-[#7CFF6B]">
                  {project.technologies}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2 className="border-b border-[#292929] pb-3 font-heading text-lg font-semibold">
            Articles
          </h2>
          <div className="divide-y divide-[#242424]">
            {data.articles.map((article) => (
              <article key={article._id} className="py-4">
                <h3 className="font-medium">{article.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-[#9A9A9A]">
                  {article.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
