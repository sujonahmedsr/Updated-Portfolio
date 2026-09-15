import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getRichTextExcerpt } from "@/lib/sanitizeHtml";

export type TBlog = {
  _id: string;
  title: string;
  image?: string;
  description: string;
  createdAt?: string;
};

const BlogsCard = ({ blog }: { blog: TBlog }) => {
  return (
    <article className="group rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all overflow-hidden flex flex-col justify-between shadow-xl">
      <div>
        {blog.image && (
          <div className="relative w-full h-48 bg-[#161616] overflow-hidden">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-6 space-y-3">
          {blog.createdAt && (
            <span className="text-[11px] font-mono text-[#7CFF6B] block">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <h3 className="font-heading text-lg font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-xs text-[#888] font-sans line-clamp-3 leading-relaxed">
            {getRichTextExcerpt(blog.description)}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link
          href={`/blogs/${blog._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#7CFF6B] hover:underline"
        >
          <span>Read Article</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};

export default BlogsCard;
