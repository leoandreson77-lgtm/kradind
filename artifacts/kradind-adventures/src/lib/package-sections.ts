export type PackageSectionType = "Domestic" | "International" | "Fixed" | "Trek";

export function isDomesticPackage(trek?: { category?: string; categories?: string[] } | null): boolean {
  if (!trek) return false;
  const cat = (trek.category || "").toLowerCase().trim();
  const cats = (trek.categories || []).map((c) => c.toLowerCase().trim());
  return cat === "domestic" || cats.includes("domestic") || cats.includes("holiday package");
}

export function isInternationalPackage(trek?: { category?: string; categories?: string[] } | null): boolean {
  if (!trek) return false;
  const cat = (trek.category || "").toLowerCase().trim();
  const cats = (trek.categories || []).map((c) => c.toLowerCase().trim());
  return cat === "international" || (cats.includes("international") && !cats.includes("domestic") && !cats.includes("himalayas"));
}

export function isFixedPackage(trek?: { category?: string; categories?: string[] } | null): boolean {
  if (!trek) return false;
  const cat = (trek.category || "").toLowerCase().trim();
  return cat === "fixed departure" || cat === "fixed departures" || cat === "fixed";
}

export function isTrekPackage(trek?: { category?: string; categories?: string[] } | null): boolean {
  if (!trek) return false;
  return getPackageSection(trek) === "Trek";
}

export function getPackageSection(t?: { category?: string; categories?: string[] } | null): PackageSectionType {
  if (!t) return "Trek";
  const cat = (t.category || "").toLowerCase().trim();
  const cats = (t.categories || []).map((c) => c.toLowerCase().trim());

  if (cat === "international" || (cats.includes("international") && !cats.includes("domestic") && !cats.includes("himalayas"))) {
    return "International";
  }
  if (cat === "fixed departure" || cat === "fixed departures" || cat === "fixed") {
    return "Fixed";
  }
  if (cat === "domestic" || cats.includes("domestic") || cats.includes("holiday package") || cat === "holiday package") {
    return "Domestic";
  }
  return "Trek";
}
