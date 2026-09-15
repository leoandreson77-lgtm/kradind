/**
 * SEO Image Alt Text Definitions and Utilities
 * Standardized for KRAD Global tour and travel services
 */

export const DEFAULT_ALT_TEXTS = {
  heroBanner: "Domestic and international tour packages by KRAD Global in Dehradun",
  travelDestination: "Popular India holiday destination featured by KRAD Global",
  domesticTour: "Domestic tour package in India by KRAD Global",
  internationalTour: "International tour package by KRAD Global",
  trekking: "Himalayan trekking package by KRAD Global",
  customizedHoliday: "Customized holiday package by KRAD Global",
  dehradunImage: "Dehradun travel and tour services by KRAD Global",
  logo: "KRAD Global tour and travel company logo",
} as const;

export const ALT_TEXT_PRESETS = [
  {
    label: "Hero Banner",
    value: DEFAULT_ALT_TEXTS.heroBanner,
    description: "For homepage & top campaign banners",
  },
  {
    label: "Travel Destination",
    value: DEFAULT_ALT_TEXTS.travelDestination,
    description: "For India holiday & sightseeing destinations",
  },
  {
    label: "Domestic Tour",
    value: DEFAULT_ALT_TEXTS.domesticTour,
    description: "For India domestic travel packages",
  },
  {
    label: "International Tour",
    value: DEFAULT_ALT_TEXTS.internationalTour,
    description: "For global & overseas packages",
  },
  {
    label: "Himalayan Trekking",
    value: DEFAULT_ALT_TEXTS.trekking,
    description: "For mountain, pass & summit treks",
  },
  {
    label: "Customized Holiday",
    value: DEFAULT_ALT_TEXTS.customizedHoliday,
    description: "For tailor-made, family & honeymoon tours",
  },
  {
    label: "Dehradun Service",
    value: DEFAULT_ALT_TEXTS.dehradunImage,
    description: "For local Dehradun tours & office photos",
  },
  {
    label: "Company Logo",
    value: DEFAULT_ALT_TEXTS.logo,
    description: "For KRAD Global brand identity logos",
  },
];

export interface AltTextItem {
  imageAlt?: string;
  name?: string;
  title?: string;
  category?: string;
  categories?: string[];
  location?: string;
  region?: string;
  slug?: string;
}

/**
 * Returns the exact custom alt text if specified by admin,
 * or derives the compliant KRAD Global SEO alt text based on content category.
 */
export function getImageAlt(
  item?: AltTextItem | null,
  fallbackType?: keyof typeof DEFAULT_ALT_TEXTS
): string {
  if (!item) {
    return fallbackType ? DEFAULT_ALT_TEXTS[fallbackType] : DEFAULT_ALT_TEXTS.travelDestination;
  }

  // 1. Explicit admin override
  if (item.imageAlt && item.imageAlt.trim()) {
    return item.imageAlt.trim();
  }

  // 2. Identify by category / context
  const text = [
    item.name || "",
    item.title || "",
    item.category || "",
    ...(item.categories || []),
    item.location || "",
    item.region || "",
    item.slug || "",
  ]
    .join(" ")
    .toLowerCase();

  if (text.includes("dehradun")) {
    return DEFAULT_ALT_TEXTS.dehradunImage;
  }

  if (
    text.includes("international") ||
    text.includes("dubai") ||
    text.includes("bali") ||
    text.includes("thailand") ||
    text.includes("vietnam") ||
    text.includes("maldives")
  ) {
    return DEFAULT_ALT_TEXTS.internationalTour;
  }

  if (
    text.includes("trek") ||
    text.includes("himalaya") ||
    text.includes("pass") ||
    text.includes("summit") ||
    text.includes("chopta") ||
    text.includes("hampta") ||
    text.includes("kheerganga") ||
    text.includes("kedarkantha") ||
    text.includes("expedition") ||
    text.includes("altitude")
  ) {
    return DEFAULT_ALT_TEXTS.trekking;
  }

  if (
    text.includes("custom") ||
    text.includes("honeymoon") ||
    text.includes("holiday package") ||
    text.includes("family") ||
    text.includes("luxury")
  ) {
    return DEFAULT_ALT_TEXTS.customizedHoliday;
  }

  if (
    text.includes("domestic") ||
    text.includes("road trip") ||
    text.includes("rajasthan") ||
    text.includes("jaipur") ||
    text.includes("jaisalmer") ||
    text.includes("kerala") ||
    text.includes("goa") ||
    text.includes("maharashtra")
  ) {
    return DEFAULT_ALT_TEXTS.domesticTour;
  }

  if (
    text.includes("destination") ||
    text.includes("northeast") ||
    text.includes("meghalaya") ||
    text.includes("sikkim") ||
    text.includes("assam") ||
    text.includes("nainital") ||
    text.includes("ladakh")
  ) {
    return DEFAULT_ALT_TEXTS.travelDestination;
  }

  if (fallbackType && DEFAULT_ALT_TEXTS[fallbackType]) {
    return DEFAULT_ALT_TEXTS[fallbackType];
  }

  return DEFAULT_ALT_TEXTS.travelDestination;
}
