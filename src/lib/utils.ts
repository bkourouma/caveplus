import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const DEFAULT_SITE_URL = "https://caveplus.allianceconsultants.net";
const DEFAULT_DEV_URL = "http://localhost:3000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0
  }).format(value);
}

function resolveUrl(candidates: Array<string | undefined>, fallback: string) {
  for (const candidate of candidates) {
    const value = candidate?.trim();

    if (!value) {
      continue;
    }

    try {
      return new URL(value).toString().replace(/\/$/, "");
    } catch {
      continue;
    }
  }

  return fallback;
}

export function getSiteUrl() {
  return resolveUrl([process.env.NEXT_PUBLIC_SITE_URL, process.env.SITE_URL], DEFAULT_SITE_URL);
}

export function getAuthBaseUrl() {
  const fallback = process.env.NODE_ENV === "production" ? DEFAULT_SITE_URL : DEFAULT_DEV_URL;
  return resolveUrl(
    [process.env.SITE_URL, process.env.NEXTAUTH_URL, process.env.NEXT_PUBLIC_SITE_URL],
    fallback
  );
}

export function buildCanonical(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString();
}
