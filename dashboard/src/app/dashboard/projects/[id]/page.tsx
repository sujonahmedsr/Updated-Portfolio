"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { getSingleProjectApi, updateProjectApi } from "@/lib/api";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";

const projectSchema = z.object({
  title: z.string().min(2, "Title is required."),
  image: z.string().url("Must be a valid image URL.").or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters."),
  technologies: z.string().min(2, "Technologies list is required."),
  githubLink: z.string().url("Must be a valid URL.").or(z.literal("")),
  liveLink: z.string().url("Must be a valid URL.").or(z.literal("")),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const p = await getSingleProjectApi(id);
        if (p) {
          setValue("title", p.title || "");
          setValue("image", p.image || "");
          setValue("description", p.description || "");
          setValue("technologies", p.technologies || "");
          setValue("githubLink", p.githubLink || "");
          setValue("liveLink", p.liveLink || "");
        } else {
          toast.error("Project not found.");
        }
      } catch (e) {
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    const toastId = toast.loading("Updating project...");
    try {
      await updateProjectApi(id, data);
      toast.success("Project updated successfully!", { id: toastId });
      router.push("/dashboard/projects");
      router.refresh();
    } catch (e) {
      toast.error("Failed to update project.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#666] flex items-center justify-center gap-2 font-mono">
        <RefreshCw className="w-5 h-5 animate-spin text-[#7CFF6B]" />
        <span>Loading project details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-mono text-[#7CFF6B]">PROJECTS / EDIT</span>
            <h1 className="font-heading text-2xl font-bold text-[#F5F5F0]">Edit Project</h1>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-xl bg-[#121212] border border-[#222222] space-y-6 shadow-2xl">
        
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[#A1A1A1] block">PROJECT TITLE</label>
          <input
            {...register("title")}
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-mono"
          />
          {errors.title && (
            <span className="text-xs font-mono text-[#FF5F56]">{errors.title.message}</span>
          )}
        </div>

        {/* Technologies */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[#A1A1A1] block">TECHNOLOGIES</label>
          <input
            {...register("technologies")}
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-mono"
          />
          {errors.technologies && (
            <span className="text-xs font-mono text-[#FF5F56]">{errors.technologies.message}</span>
          )}
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#A1A1A1] block">LIVE DEMO URL</label>
            <input
              {...register("liveLink")}
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-mono"
            />
            {errors.liveLink && (
              <span className="text-xs font-mono text-[#FF5F56]">{errors.liveLink.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#A1A1A1] block">GITHUB REPOSITORY URL</label>
            <input
              {...register("githubLink")}
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-mono"
            />
            {errors.githubLink && (
              <span className="text-xs font-mono text-[#FF5F56]">{errors.githubLink.message}</span>
            )}
          </div>
        </div>

        {/* Cloudinary Image Uploader */}
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUploader
              value={field.value || ""}
              onChange={field.onChange}
              folder="projects"
              label="FEATURED PROJECT IMAGE (HOSTED ON CLOUDINARY)"
              error={errors.image?.message}
            />
          )}
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[#A1A1A1] block">PROJECT DESCRIPTION</label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B] font-sans resize-y"
          />
          {errors.description && (
            <span className="text-xs font-mono text-[#FF5F56]">{errors.description.message}</span>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#1E1E1E] flex items-center justify-end gap-3 font-mono text-xs">
          <Link
            href="/dashboard/projects"
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
            <span>{isSubmitting ? "Saving..." : "Update Project"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
