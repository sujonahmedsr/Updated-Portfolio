"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Mail, ArrowUpRight, Github, Facebook, Send, Download, Sparkles } from "lucide-react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const toastId = toast.loading("Sending message...");
    try {
      const res = await axios.post("https://my-portfolio-backend-ebon.vercel.app/api/message/create", data);
      if (res.data && res.data.success !== false) {
        toast.success("Message sent successfully! I will respond promptly.", { id: toastId });
        reset();
      } else {
        toast.error("Failed to send message. Please try again.", { id: toastId });
      }
    } catch (err) {
      console.error("Error sending contact message:", err);
      toast.error("Failed to send message. Please try again.", { id: toastId });
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0A0A0A] border-b border-[#1A1A1A] relative">
      
      {/* Background Accent Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#7CFF6B]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Heading & Contact Info */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LET&apos;S CONNECT</span>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#F5F5F0] leading-tight">
                LET&apos;S BUILD SOMETHING USEFUL.
              </h2>
              <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
                Have a Shopify store, web application, or product idea in mind? Let&apos;s turn it into a polished digital experience.
              </p>
            </div>

            {/* Quick Contact Links */}
            <div className="space-y-4 font-mono text-xs">
              
              <a
                href="mailto:sujonahmeds81@gmail.com"
                className="p-4 rounded-lg bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#7CFF6B]" />
                  <span className="text-[#F5F5F0]">sujonahmeds81@gmail.com</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#666] group-hover:text-[#7CFF6B] transition-colors" />
              </a>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://github.com/sujonahmedsr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-lg bg-[#121212] border border-[#222222] hover:border-[#7CFF6B] text-[#F5F5F0] transition-all flex items-center gap-2"
                >
                  <Github className="w-4 h-4 text-[#7CFF6B]" />
                  <span>GitHub</span>
                </a>

                <a
                  href="https://www.facebook.com/sujonahmeds81"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-lg bg-[#121212] border border-[#222222] hover:border-[#7CFF6B] text-[#F5F5F0] transition-all flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4 text-[#7CFF6B]" />
                  <span>Facebook</span>
                </a>

                <a
                  href="/resume.pdf"
                  download="Shofiqul_Islam_Resume.pdf"
                  className="px-4 py-3 rounded-lg bg-[#121212] border border-[#222222] hover:border-[#7CFF6B] text-[#F5F5F0] transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#7CFF6B]" />
                  <span>Resume</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6">
            <div className="p-8 rounded-xl bg-[#121212] border border-[#222222] font-sans shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
                <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">Start a Project</h3>
                <span className="text-xs font-mono text-[#7CFF6B]">GET IN TOUCH</span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#A1A1A1]">FULL NAME</label>
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B] transition-colors"
                  />
                  {errors.fullName && (
                    <span className="text-xs font-mono text-[#FF5F56]">{errors.fullName.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#A1A1A1]">EMAIL ADDRESS</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="your.email@domain.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B] transition-colors"
                  />
                  {errors.email && (
                    <span className="text-xs font-mono text-[#FF5F56]">{errors.email.message}</span>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#A1A1A1]">PROJECT SUBJECT</label>
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="Shopify Store / Full-Stack Project Inquiry"
                    className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B] transition-colors"
                  />
                  {errors.subject && (
                    <span className="text-xs font-mono text-[#FF5F56]">{errors.subject.message}</span>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#A1A1A1]">PROJECT DETAILS / MESSAGE</label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Describe your store goals, timeline, or requirements..."
                    className="w-full px-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B] transition-colors resize-none"
                  />
                  {errors.message && (
                    <span className="text-xs font-mono text-[#FF5F56]">{errors.message.message}</span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-sm hover:bg-[#68e057] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#7CFF6B]/15"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
