"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Code2,
  ChevronRight,
  Wifi,
  WifiOff,
} from "lucide-react";
import { checkServerHealthApi } from "@/lib/api";

const sidebarNav = [
  { section: "MAIN", items: [{ label: "Overview", href: "/dashboard", icon: LayoutDashboard }] },
  {
    section: "CONTENT",
    items: [
      { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
      { label: "Articles / Blog", href: "/dashboard/articles", icon: FileText },
    ],
  },
  {
    section: "COMMUNICATION",
    items: [{ label: "Messages Inbox", href: "/dashboard/messages", icon: Mail }],
  },
  {
    section: "SYSTEM",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const ok = await checkServerHealthApi();
      setApiOnline(ok);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully.");
      router.push("/login");
      router.refresh();
    } catch (e) {
      toast.error("Logout failed.");
    }
  };

  // Breadcrumbs text
  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.includes("/dashboard/projects/new")) return "Projects / Create Project";
    if (pathname.includes("/dashboard/projects")) return "Projects";
    if (pathname.includes("/dashboard/articles/new")) return "Articles / New Article";
    if (pathname.includes("/dashboard/articles")) return "Articles / Blog";
    if (pathname.includes("/dashboard/messages")) return "Messages Inbox";
    if (pathname.includes("/dashboard/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-[#1E1E1E] bg-[#0E0E0E] sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left: Mobile Menu & Logo & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B]"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 font-heading text-lg font-bold">
            <span className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center text-[#7CFF6B]">
              <Code2 className="w-4 h-4" />
            </span>
            <span className="hidden sm:inline text-[#F5F5F0]">SHOFIQUL <span className="text-[#7CFF6B]">ADMIN</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#777] border-l border-[#222] pl-4">
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#A1A1A1]">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Right: API Health Status Badge & Profile Menu */}
        <div className="flex items-center gap-4 font-mono text-xs">
          
          {/* API Connection Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#222222]">
            {apiOnline === true ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                <span className="text-[#7CFF6B]">API CONNECTED</span>
              </>
            ) : apiOnline === false ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#FF5F56]"></span>
                <span className="text-[#FF5F56]">API OFFLINE</span>
              </>
            ) : (
              <span className="text-[#666]">Checking API...</span>
            )}
          </div>

          {/* Admin Tag */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-[#161616] border border-[#262626] text-[#A1A1A1]">
            <span className="w-2 h-2 rounded-full bg-[#7CFF6B]"></span>
            <span>Shofiqul (Admin)</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#FF5F56] hover:border-[#FF5F56]/40 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 border-r border-[#1E1E1E] bg-[#0C0C0C] p-4 justify-between font-mono text-xs shrink-0">
          <div className="space-y-6">
            {sidebarNav.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-[10px] text-[#555] tracking-widest block uppercase px-3">
                  {sec.section}
                </span>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? "bg-[#7CFF6B]/10 text-[#7CFF6B] border border-[#7CFF6B]/30 font-medium"
                            : "text-[#888] hover:text-[#F5F5F0] hover:bg-[#141414]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1E1E1E] space-y-2">
            <div className="p-3 rounded bg-[#121212] border border-[#222222] text-[11px] text-[#666] space-y-1">
              <span className="text-[#A1A1A1] block font-bold">Standalone CMS</span>
              <span>Next.js 15 App Router</span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex">
            <div className="w-64 bg-[#0C0C0C] border-r border-[#222222] p-5 flex flex-col justify-between font-mono text-xs animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
                  <span className="text-xs font-bold text-[#F5F5F0]">ADMIN MENU</span>
                  <button onClick={() => setMobileOpen(false)} className="text-[#888]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {sidebarNav.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <span className="text-[10px] text-[#555] tracking-widest block uppercase">
                        {sec.section}
                      </span>
                      <div className="space-y-1">
                        {sec.items.map((item) => {
                          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                isActive
                                  ? "bg-[#7CFF6B]/10 text-[#7CFF6B] border border-[#7CFF6B]/30 font-medium"
                                  : "text-[#888] hover:text-[#F5F5F0] hover:bg-[#141414]"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded bg-[#161616] border border-[#262626] text-[#FF5F56] flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0A0A0A]">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}
