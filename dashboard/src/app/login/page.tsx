"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Code2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const res = await axios.post("/api/auth/login", data);
      if (res.data?.success) {
        toast.success("Welcome back, Shofiqul!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid username or password.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Subtle Ambient Light */}
      <div className="absolute w-[500px] h-[500px] bg-[#7CFF6B]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full relative space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#121212] border border-[#222222] text-[#7CFF6B] mb-2 shadow-xl">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F0]">
            SHOFIQUL <span className="text-[#7CFF6B]">ADMIN</span>
          </h1>
          <p className="text-xs font-mono text-[#A1A1A1]">
            Authorized Personnel Content Management Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="p-8 rounded-xl bg-[#121212] border border-[#222222] shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
            <span className="text-xs font-mono text-[#7CFF6B] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>AUTHENTICATION</span>
            </span>
            <span className="text-[11px] font-mono text-[#555]">v1.0.0</span>
          </div>

          {serverError && (
            <div className="p-3 rounded bg-[#FF5F56]/10 border border-[#FF5F56]/30 text-xs font-mono text-[#FF5F56]">
              ⚠ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1A1] block">USERNAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#555] absolute left-3 top-3.5" />
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B] transition-colors font-mono"
                />
              </div>
              {errors.username && (
                <span className="text-xs font-mono text-[#FF5F56]">{errors.username.message}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1A1] block">PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#555] absolute left-3 top-3.5" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-[#555] hover:text-[#A1A1A1] focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs font-mono text-[#FF5F56]">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-sm hover:bg-[#68e057] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#7CFF6B]/15"
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

        </div>

        {/* Footer info */}
        <div className="text-center font-mono text-xs text-[#555]">
          <span>Protected Single-Admin Environment</span>
        </div>

      </div>
    </div>
  );
}
