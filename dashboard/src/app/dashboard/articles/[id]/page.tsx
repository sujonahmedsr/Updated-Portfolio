"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Eye, Edit3, RefreshCw } from "lucide-react";
import { getSingleArticleApi, updateArticleApi } from "@/lib/api";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";

const articleSchema = z.object({
  title: z.string().min(2, "Title is required."),
  image: z.string().url("Must be a valid image URL.").or(z.literal("")),
  description: z.string().min(20, "Content must be at least 20 characters."),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
  });

  const watchedDescription = watch("description");
  const watchedTitle = watch("title");

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const a = await getSingleArticleApi(id);
        if (a) {
          setValue("title", a.title || "");
          setValue("image", a.image || "");
          setValue("description", a.description || "");
          setValue("seoTitle", a.seoTitle || "");
          setValue("seoDescription", a.seoDescription || "");
        } else {
          toast.error("Article not found.");
        }
      } catch (e) {
        toast.error("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, setValue]);

  const onSubmit = async (data: ArticleFormData) => {
    const toastId = toast.loading("Updating article...");
    try {
      await updateArticleApi(id, {
        title: data.title,
        image: data.image || undefined,
        description: data.description,
      });
      toast.success("Article updated successfully!", { id: toastId });
      router.push("/dashboard/articles");
      router.refresh();
    } catch (e) {
      toast.error("Failed to update article.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#666] flex items-center justify-center gap-2 font-mono">
        <RefreshCw className="w-5 h-5 animate-spin text-[#7CFF6B]" />
        <span>Loading article...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/articles"
            className="p-2 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-mono text-[#7CFF6B]">ARTICLES / EDIT</span>
            <h1 className="font-heading text-2xl font-bold text-[#F5F5F0]">Edit Article</h1>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[#121212] border border-[#222222] w-fit font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all ${
            activeTab === "edit"
              ? "bg-[#7CFF6B] text-black font-semibold"
              : "text-[#888] hover:text-[#F5F5F0]"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all ${
            activeTab === "preview"
              ? "bg-[#7CFF6B] text-black font-semibold"
              : "text-[#888] hover:text-[#F5F5F0]"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {activeTab === "edit" ? (
          <div className="p-8 rounded-xl bg-[#121212] border border-[#222222] space-y-6 shadow-2xl">
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1A1] block">ARTICLE TITLE</label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-mono"
              />
              {errors.title && (
                <span className="text-xs font-mono text-[#FF5F56]">{errors.title.message}</span>
              )}
            </div>

            {/* Cloudinary Image Uploader */}
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  value={field.value || ""}
                  onChange={field.onChange}
                  folder="articles"
                  label="COVER IMAGE (HOSTED ON CLOUDINARY)"
                  error={errors.image?.message}
                />
              )}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1A1] block">ARTICLE CONTENT</label>
              <textarea
                {...register("description")}
                rows={16}
                className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-mono resize-y leading-relaxed"
              />
              {errors.description && (
                <span className="text-xs font-mono text-[#FF5F56]">{errors.description.message}</span>
              )}
            </div>

            <div className="pt-4 border-t border-[#1E1E1E] space-y-4">
              <div className="text-xs font-mono text-[#A1A1A1] uppercase tracking-widest">SEO Settings</div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#666] block">SEO TITLE (Optional)</label>
                <input
                  {...register("seoTitle")}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#666] block">META DESCRIPTION (Optional)</label>
                <textarea
                  {...register("seoDescription")}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-sans resize-none"
                />
              </div>
            </div>

          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[#121212] border border-[#7CFF6B]/30 shadow-2xl">
            <div className="border-b border-[#1E1E1E] pb-4 mb-6">
              <span className="text-xs font-mono text-[#7CFF6B]">ARTICLE PREVIEW</span>
              <h2 className="font-heading text-2xl font-bold text-[#F5F5F0] mt-1">{watchedTitle || "Untitled Article"}</h2>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-[#A1A1A1] font-sans leading-relaxed">
              {watchedDescription || "Article content will appear here..."}
            </pre>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 font-mono text-xs">
          <Link
            href="/dashboard/articles"
            className="px-5 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-[#7CFF6B] text-black font-semibold hover:bg-[#68e057] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : "Update Article"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
