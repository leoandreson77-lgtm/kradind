import { MetadataRoute } from "next";
import { readStore, getPublishedTreks } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cancellation-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/booking-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic trek detail routes from CMS store
  const allPublishedTreks = getPublishedTreks();
  allPublishedTreks.forEach((trek) => {
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

  // Clean category & state routes (zero query parameters for high SEO rank)
  const categories = [
    "domestic",
    "uttarakhand",
    "himachal",
    "ladakh",
    "rajasthan",
    "kerala",
    "meghalaya",
    "sikkim",
    "assam",
    "goa",
    "maharashtra",
    "northeast",
    "international",
    "weekend",
    "himalayas",
    "monsoon",
  ];

  categories.forEach((cat) => {
    routes.push({
      url: `${baseUrl}/treks/category/${cat}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    });
  });

  return routes;
}
