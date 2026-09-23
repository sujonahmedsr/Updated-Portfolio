import { ImageResponse } from "next/og";

export const alt =
  "Shofiqul Islam Sujon — Shopify Developer & Full-Stack Specialist";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0A0A0A",
        padding: "64px 72px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(124, 255, 107, 0.12) 0%, transparent 50%)",
      }}
    >
      {/* Top Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "9999px",
            backgroundColor: "#141414",
            border: "1px solid #282828",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#7CFF6B",
            }}
          />
          <span
            style={{
              color: "#7CFF6B",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            SHOPIFY &amp; E-COMMERCE SPECIALIST
          </span>
        </div>
      </div>

      {/* Center Main Text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#F5F5F0",
            margin: 0,
            letterSpacing: "-1px",
            lineHeight: 1.1,
          }}
        >
          Shofiqul Islam Sujon
        </h1>

        <div
          style={{
            fontSize: "34px",
            fontWeight: 700,
            color: "#7CFF6B",
            letterSpacing: "-0.5px",
          }}
        >
          Shopify Developer &amp; Full-Stack Engineer
        </div>

        <p
          style={{
            fontSize: "20px",
            color: "#A1A1A1",
            maxWidth: "900px",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Custom Liquid themes, storefront speed optimization, API integrations,
          and modern high-converting e-commerce experiences.
        </p>
      </div>

      {/* Bottom Badges */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "24px",
          borderTop: "1px solid #202020",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {[
            "120+ Stores Delivered",
            "Liquid",
            "Next.js",
            "React",
            "Store Speed",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                backgroundColor: "#161616",
                border: "1px solid #262626",
                color: "#D4D4D4",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <span
          style={{
            color: "#7CFF6B",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          shofiqdev81.vercel.app
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
