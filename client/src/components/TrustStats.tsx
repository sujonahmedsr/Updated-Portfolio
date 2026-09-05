import { CheckCircle2, Code2, Gauge, ShoppingBag } from "lucide-react";

const trustItems = [
  {
    icon: ShoppingBag,
    label: "SHOPIFY PROJECTS",
    detail: "Custom storefront work",
  },
  {
    icon: Code2,
    label: "CUSTOM STOREFRONTS",
    detail: "Liquid sections & templates",
  },
  {
    icon: Gauge,
    label: "PERFORMANCE FOCUSED",
    detail: "Mobile UX & Core Web Vitals",
  },
  {
    icon: CheckCircle2,
    label: "CLIENT-FOCUSED",
    detail: "Clear, practical development",
  },
];

export default function TrustStats() {
  return (
    <section className="border-b border-[#1A1A1A] bg-[#0E0E0E] py-5 sm:py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 sm:px-6 lg:px-8">
        {trustItems.map(({ icon: Icon, label, detail }) => (
          <div
            key={label}
            className="flex min-w-0 items-start gap-2.5 font-mono"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#7CFF6B]" />
            <div className="min-w-0">
              <span className="block break-words text-[10px] font-bold text-[#F5F5F0] sm:text-xs">
                {label}
              </span>
              <span className="mt-1 block text-[10px] leading-relaxed text-[#666] sm:text-[11px]">
                {detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
