"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Settings,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
  ExternalLink,
  Server,
  Shield,
  Globe,
  Key,
  Save,
  UploadCloud,
} from "lucide-react";
import {
  checkServerHealthApi,
  getSettingsApi,
  updateSettingsApi,
} from "@/lib/api";
import { PortfolioSettings } from "@/types";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<
    "idle" | "checking" | "online" | "offline"
  >("idle");
  const [settings, setSettings] = useState<PortfolioSettings>({
    siteName: "",
    tagline: "",
    contactEmail: "",
    githubUrl: "",
    facebookUrl: "",
    linkedinUrl: "",
    resumeUrl: "/resume.pdf",
    availability: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useState(() => {
    getSettingsApi()
      .then(setSettings)
      .catch(() => toast.error("Failed to load portfolio settings."))
      .finally(() => setSettingsLoading(false));
  });

  const updateField = (field: keyof PortfolioSettings, value: string) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  const handleSettingsSave = async () => {
    setSaving(true);
    try {
      setSettings(await updateSettingsApi(settings));
      toast.success("Portfolio settings saved.");
    } catch {
      toast.error("Failed to save portfolio settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    if (file.type !== "application/pdf" || file.size > 10 * 1024 * 1024) {
      toast.error("Please choose a PDF smaller than 10MB.");
      return;
    }
    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "resume");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.message);
      updateField("resumeUrl", result.url);
      toast.success("Resume uploaded. Save settings to publish it.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Resume upload failed.",
      );
    } finally {
      setUploadingResume(false);
    }
  };

  const handleApiCheck = async () => {
    setApiStatus("checking");
    try {
      const ok = await checkServerHealthApi();
      setApiStatus(ok ? "online" : "offline");
    } catch {
      setApiStatus("offline");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Logout failed.");
    }
  };

  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_NEXT_PUBLIC_API_URL ||
    "https://my-portfolio-backend-ebon.vercel.app";

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B] mb-1">
          <Settings className="w-4 h-4" />
          <span>SYSTEM</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
          Settings
        </h1>
        <p className="text-xs text-[#A1A1A1] mt-1 font-mono">
          API Configuration, Connection Health, Account Management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#7CFF6B]" />
                  <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                    Portfolio Identity
                  </h2>
                </div>
                <p className="text-xs text-[#666] mt-2 font-mono">
                  Manage the content exposed on your public portfolio.
                </p>
              </div>
              <button
                onClick={handleSettingsSave}
                disabled={saving || settingsLoading}
                className="px-4 py-2 rounded-lg bg-[#7CFF6B] text-black font-mono text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  "siteName",
                  "tagline",
                  "contactEmail",
                  "availability",
                  "githubUrl",
                  "facebookUrl",
                  "linkedinUrl",
                ] as const
              ).map((field) => (
                <label key={field} className="space-y-1.5 sm:col-span-1">
                  <span className="text-[11px] text-[#888] font-mono uppercase">
                    {field.replace("Url", " URL")}
                  </span>
                  <input
                    value={settings[field]}
                    onChange={(event) => updateField(field, event.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] focus:outline-none focus:border-[#7CFF6B]"
                  />
                </label>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <label className="cursor-pointer px-3 py-2 rounded-lg border border-[#2A2A2A] text-xs text-[#F5F5F0] flex items-center gap-2 hover:border-[#7CFF6B]">
                <UploadCloud className="w-4 h-4 text-[#7CFF6B]" />{" "}
                {uploadingResume ? "Uploading..." : "Upload resume PDF"}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  disabled={uploadingResume}
                  onChange={(event) =>
                    event.target.files?.[0] &&
                    handleResumeUpload(event.target.files[0])
                  }
                />
              </label>
              <span className="text-[11px] text-[#666] font-mono truncate">
                {settings.resumeUrl || "No resume selected"}
              </span>
            </div>
          </div>

          {/* API Connection Tester */}
          <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-5">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-[#7CFF6B]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                API Connection
              </h2>
            </div>

            <div className="p-4 rounded-lg bg-[#161616] border border-[#222222] font-mono text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#888]">ENDPOINT</span>
                <a
                  href={apiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7CFF6B] hover:underline flex items-center gap-1"
                >
                  <span className="truncate max-w-[200px]">{apiUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#888]">STATUS</span>
                <div className="flex items-center gap-2">
                  {apiStatus === "idle" && (
                    <span className="text-[#666]">Not tested yet</span>
                  )}
                  {apiStatus === "checking" && (
                    <span className="text-[#A1A1A1] flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Checking...
                    </span>
                  )}
                  {apiStatus === "online" && (
                    <span className="text-[#7CFF6B] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                      API ● Connected
                    </span>
                  )}
                  {apiStatus === "offline" && (
                    <span className="text-[#FF5F56] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF5F56]"></span>
                      API ● Unreachable
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleApiCheck}
              disabled={apiStatus === "checking"}
              className="px-5 py-2.5 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Wifi className="w-4 h-4" />
              <span>Test API Connection</span>
            </button>
          </div>

          {/* Environment Configuration */}
          <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-5">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-[#7CFF6B]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Environment Variables
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-between">
                <span className="text-[#888]">
                  NEXT_PUBLIC_NEXT_PUBLIC_API_URL
                </span>
                <span className="text-[#7CFF6B] text-[11px]">✓ Set</span>
              </div>
              <div className="p-3 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-between">
                <span className="text-[#888]">ADMIN_USERNAME</span>
                <span className="text-[#7CFF6B] text-[11px]">
                  ✓ Set (server-only)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-between">
                <span className="text-[#888]">ADMIN_PASSWORD</span>
                <span className="text-[#7CFF6B] text-[11px]">
                  ✓ Set (server-only)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-between">
                <span className="text-[#888]">JWT_SECRET</span>
                <span className="text-[#7CFF6B] text-[11px]">
                  ✓ Set (server-only)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#666] font-mono leading-relaxed">
              Credentials are never exposed to the client bundle. To update
              them, edit <code className="text-[#7CFF6B]">.env.local</code> and
              redeploy on Vercel.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Account Info Card */}
          <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-5">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#7CFF6B]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Session Info
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#161616] border border-[#222222]">
                <div className="w-9 h-9 rounded-full bg-[#7CFF6B] flex items-center justify-center text-black font-bold text-sm shrink-0">
                  S
                </div>
                <div>
                  <div className="text-[#F5F5F0] font-bold">Shofiqul Islam</div>
                  <div className="text-[#888] text-[11px]">Administrator</div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-between text-[11px]">
                <span className="text-[#888]">Session Type</span>
                <span className="text-[#F5F5F0]">HTTP-only cookie (JWT)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-between text-[11px]">
                <span className="text-[#888]">Session Duration</span>
                <span className="text-[#F5F5F0]">7 days</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg bg-[#1A1A1A] border border-[#FF5F56]/30 text-[#FF5F56] font-mono font-semibold text-xs hover:bg-[#FF5F56]/10 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>End Session &amp; Sign Out</span>
            </button>
          </div>

          {/* Dashboard Info */}
          <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#7CFF6B]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                About Dashboard
              </h2>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-[#888]">
              <div className="flex items-center justify-between">
                <span>Framework</span>
                <span className="text-[#F5F5F0]">Next.js 15 (App Router)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Language</span>
                <span className="text-[#F5F5F0]">TypeScript</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Styling</span>
                <span className="text-[#F5F5F0]">Tailwind CSS</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auth</span>
                <span className="text-[#F5F5F0]">HTTP-only cookie (jose)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Port</span>
                <span className="text-[#7CFF6B]">:3001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
