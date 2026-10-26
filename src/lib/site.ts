// Business contact details. Phone, WhatsApp, email and address come from the Settings screen of the
// admin dashboard (applied by the root route through applySettings). Nothing is invented here:
// when a value is empty the site simply hides it.
import { parseWhatsAppNumber } from "./social";
import type { StoreSettings } from "./storefront-data";

export const SITE = {
  name: "KEY-STEL",
  tagline: "Your Secured Partner.",
  whatsapp: "", // digits only, set from Settings
  phone: "",
  email: "",
  address: "",
  mapUrl: "",
  deliveryNote: "",
};

export function applySettings(s: StoreSettings | null | undefined) {
  SITE.phone = s?.phone ?? "";
  SITE.whatsapp = parseWhatsAppNumber(s?.whatsapp) ?? "";
  SITE.email = s?.email ?? "";
  SITE.address = s?.address ?? "";
  SITE.mapUrl = s?.mapUrl ?? "";
  SITE.deliveryNote = s?.deliveryNote ?? "";
}

export type Branch = {
  name: string;
  area: string;
  phone: string;
  main?: boolean;
  mapQuery: string;
  mapUrl?: string;
};

// The two branch locations are not editable in the admin yet. Their phone is the store phone from Settings.
export const BRANCHES: Branch[] = [
  { name: "Kwabenya", area: "Pokuase - Kwabenya Road, opposite Rhema Hospital", get phone() { return SITE.phone; }, main: true, mapQuery: "Pokuase - Kwabenya Road, opposite Rhema Hospital, Ghana" },
  { name: "Kasoa", area: "Near Nurses on the Obom Road", get phone() { return SITE.phone; }, mapQuery: "5.591426,-0.418920", mapUrl: "https://goo.gl/maps/WiWuvqDbzgc5dUYA9?g_st=awb" },
];

export const telLink = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return `tel:+${d.startsWith("233") ? d : d.startsWith("0") ? `233${d.slice(1)}` : d}`;
};
export const mapEmbed = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
export const mapLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const whatsappLink = (text: string) =>
  SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}` : null;
