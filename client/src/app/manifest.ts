import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shofiqul Islam Sujon — Shopify Developer Portfolio",
    short_name: "Shofiqul Sujon",
    description:
      "Official portfolio of Shofiqul Islam Sujon, Professional Shopify Developer & E-Commerce Specialist.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

