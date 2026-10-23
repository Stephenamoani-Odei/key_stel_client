// Social and WhatsApp links come from the Settings screen of the admin dashboard (`settings` table).
// A link appears only when the owner has entered it, so there are never dead or invented links.
export interface SocialLink {
  /** Lower-case platform key, e.g. "facebook", "instagram", "tiktok", "whatsapp". */
  key: string;
  label: string;
  /** Safe https URL, or null when no link was supplied. */
  href: string | null;
  /** Custom icon image, or null to use the built-in icon. */
  iconUrl: string | null;
  /** WhatsApp only: the international number in digits (used for the WhatsApp buttons). */
  phone: string | null;
}

export interface SocialRow {
  platform: string;
  label?: string | null | undefined;
  url?: string | null | undefined;
  icon_url?: string | null | undefined;
}

const KNOWN_LABELS: Record<string, string> = {
  facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", whatsapp: "WhatsApp",
  youtube: "YouTube", x: "X", twitter: "X", linkedin: "LinkedIn", telegram: "Telegram",
};

/**
 * Accepts an absolute http(s) URL or a root-relative path and returns a normalised, safe URL, or
 * null. Anything else (javascript:, data:, protocol-relative, junk) is dropped so stored data can
 * never inject a script or break out of a CSS `url("…")`.
 */
export function safeUrl(value: unknown, { absoluteOnly = false }: { absoluteOnly?: boolean } = {}): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (!s) return null;
  if (!absoluteOnly && /^\/(?!\/)[^\s"'\\()<>]*$/.test(s)) return s;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

/** A page link entered without a scheme ("instagram.com/keystel") is treated as https. */
function pageHref(value: string | null | undefined): string | null {
  const s = (value ?? "").trim();
  if (!s) return null;
  return safeUrl(/^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`, { absoluteOnly: true });
}

/**
 * WhatsApp number in international digits from a number ("233541954924", "+233 54 195 4924"), a
 * Ghana local number ("0541954924") or a wa.me link. Returns null when it cannot be a real number.
 */
export function parseWhatsAppNumber(value: string | null | undefined): string | null {
  const s = (value ?? "").trim();
  if (!s) return null;
  let digits: string;
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      const host = u.hostname.replace(/^www\./, "");
      digits = (host === "wa.me" ? u.pathname : u.searchParams.get("phone") ?? "").replace(/\D/g, "");
    } catch {
      return null;
    }
  } else {
    digits = s.replace(/\D/g, "");
  }
  if (/^0\d{9}$/.test(digits)) digits = `233${digits.slice(1)}`; // Ghana local format
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

export function toSocialLink(row: SocialRow): SocialLink {
  const key = row.platform.toLowerCase();
  const label = row.label?.trim() || KNOWN_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
  const iconUrl = safeUrl(row.icon_url);
  if (key === "whatsapp") {
    const phone = parseWhatsAppNumber(row.url);
    return { key, label, href: phone ? `https://wa.me/${phone}` : null, iconUrl, phone };
  }
  return { key, label, href: pageHref(row.url), iconUrl, phone: null };
}

/** The social rows to show, built from the owner's Settings. Empty entries are left out. */
export function socialRowsFromSettings(s: { whatsapp?: string | null | undefined; facebook?: string | null | undefined; instagram?: string | null | undefined; tiktok?: string | null | undefined } | null | undefined): SocialRow[] {
  if (!s) return [];
  return (["facebook", "instagram", "tiktok", "whatsapp"] as const)
    .map((platform) => ({ platform, url: s[platform] }))
    .filter((r) => (r.url ?? "").trim() !== "");
}

/** The WhatsApp number the WhatsApp buttons should message. */
export const whatsappNumberFrom = (links: SocialLink[]) => links.find((l) => l.key === "whatsapp")?.phone ?? null;
