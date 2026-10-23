import type { CSSProperties, ReactNode } from "react";
import { Facebook, Globe, MessageCircle } from "lucide-react";
import { useCatalog } from "@/lib/storefront";
import type { SocialLink } from "@/lib/social";
import instagramIcon from "@/assets/social-instagram.png";
import tiktokIcon from "@/assets/social-tiktok.png";

// Flat glyphs on transparency are painted through a CSS mask so they inherit the link's colour
// (red on light, white on dark, white on the red hover). The same treatment is used for an icon
// image the dashboard supplies (`icon_url`).
const BrandGlyph = ({ src, label }: { src: string; label: string }) => (
  <span
    aria-hidden="true"
    className="social-glyph"
    style={{ "--glyph": `url("${src}")` } as CSSProperties}
    data-glyph={label}
  />
);

// Built-in marks for the platforms we ship an icon for; any other platform uses the dashboard's
// `icon_url`, or a generic globe if none was supplied.
const BUILT_IN: Record<string, (label: string) => ReactNode> = {
  facebook: () => <Facebook className="size-4" />,
  instagram: (label) => <BrandGlyph src={instagramIcon} label={label} />,
  tiktok: (label) => <BrandGlyph src={tiktokIcon} label={label} />,
  whatsapp: () => <MessageCircle className="size-4" />,
};

const iconFor = (c: SocialLink): ReactNode =>
  BUILT_IN[c.key]?.(c.label) ?? (c.iconUrl ? <BrandGlyph src={c.iconUrl} label={c.label} /> : <Globe className="size-4" />);

export function SocialLinks({
  label = "Follow us",
  tone = "light",
  className = "",
}: {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const { social } = useCatalog();
  // Only the links the owner has entered in the admin Settings are shown.
  const channels = social;
  if (channels.length === 0) return null;
  return (
    <div className={`social-rail ${tone === "dark" ? "social-rail-dark" : ""} ${className}`.trim()}>
      {label && <p className="social-rail-label">{label}</p>}
      <ul className="flex items-center gap-2">
        {channels.map(channel => (
          <li key={channel.key}>
            {channel.href ? (
              <a
                href={channel.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`KEY-STEL on ${channel.label}`}
                className="social-link"
              >
                {iconFor(channel)}
              </a>
            ) : (
              <span
                className="social-link social-link-pending"
                aria-label={`KEY-STEL on ${channel.label} — page link not added yet`}
                title="Page link coming soon"
              >
                {iconFor(channel)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
