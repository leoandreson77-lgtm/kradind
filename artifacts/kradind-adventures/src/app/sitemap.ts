import { MetadataRoute } from "next";
import { treks } from "@/lib/travel-data";
import { readStore } from "@/lib/cms-store";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kradind.com";
  const now = new Date();

  // Core static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/treks`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic trek detail routes
  treks.forEach((trek) => {
    routes.push({
      url: `${baseUrl}/treks/${trek.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  });

  // Dynamic landing page routes (e.g. Kedarnath, Char Dham, Do Dham)
  try {
    const store = readStore();
    (store.landingPages || []).forEach((lp) => {
      routes.push({
        url: `${baseUrl}/lp/${lp.slug}`,
        lastModified: new Date(lp.updatedAt || now),
        changeFrequency: "weekly",
        priority: 0.95,
      });
    });
  } catch (err) {
    console.error("Error populating landing pages in sitemap:", err);
  }

  return routes;
}
