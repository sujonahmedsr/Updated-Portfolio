export default function StructuredData() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shofiqdev81.vercel.app";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Shofiqul Islam Sujon",
    givenName: "Shofiqul Islam",
    familyName: "Sujon",
    additionalName: "Shofiqul",
    alternateName: [
      "Shofiqul Islam",
      "Sujon",
      "Shopify Developer Shofiqul Islam Sujon",
      "shofiqdev81",
    ],
    jobTitle: "Shopify Developer & Full-Stack Developer",
    description:
      "Shofiqul Islam Sujon is a dedicated Shopify Developer and Full-Stack Developer specializing in custom Shopify theme development, Liquid engineering, store performance optimization, and modern web applications.",
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    sameAs: [
      "https://github.com/sujonahmedsr",
      "https://www.facebook.com/sujonahmeds81",
    ],
    knowsAbout: [
      "Shopify Development",
      "Shopify Liquid",
      "Shopify Theme Customization",
      "E-commerce Store Optimization",
      "Shopify App Integrations",
      "Headless Shopify",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "Web Performance & Core Web Vitals",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Shopify Developer",
      skills:
        "Shopify, Liquid, Theme Development, Store Speed Optimization, E-commerce, Next.js, React",
      occupationalCategory: "15-1254.00",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Shofiqul Islam Sujon",
    alternateName: [
      "Shofiqul Islam",
      "Shofiqul Sujon",
      "Sujon",
      "Shopify Developer Shofiqul Islam Sujon",
    ],
    description:
      "Official portfolio of Shofiqul Islam Sujon, specialized Shopify Developer and Full-Stack Web Developer with 120+ projects delivered.",
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    inLanguage: "en-US",
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: "Shofiqul Islam Sujon Profile & Portfolio",
    description:
      "Explore Shopify storefront case studies, custom Liquid solutions, and technical articles by Shofiqul Islam Sujon.",
    mainEntity: {
      "@id": `${siteUrl}/#person`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  );
}
