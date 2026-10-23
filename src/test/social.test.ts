import { describe, expect, it } from "vitest";
import { parseWhatsAppNumber, safeUrl, toSocialLink, whatsappNumberFrom } from "@/lib/social";

const link = (platform: string, url: string | null, extra: { label?: string | null; icon_url?: string | null } = {}) =>
  toSocialLink({ platform, url, label: extra.label ?? null, icon_url: extra.icon_url ?? null });

describe("social icon links pushed from the dashboard", () => {
  it("links an icon to the page the dashboard supplied", () => {
    expect(link("facebook", "https://www.facebook.com/keystel")).toMatchObject({ key: "facebook", label: "Facebook", href: "https://www.facebook.com/keystel" });
  });
  it("shows an icon without a link as non-clickable rather than a dead link", () => {
    expect(link("instagram", null).href).toBeNull();
    expect(link("tiktok", "").href).toBeNull();
  });
  it("assumes https when a link was entered without a scheme", () => {
    expect(link("instagram", "instagram.com/keystel").href).toBe("https://instagram.com/keystel");
  });
  it("never produces a script or non-web link", () => {
    expect(link("facebook", "javascript:alert(1)").href).toBeNull();
    expect(link("facebook", "data:text/html,hi").href).toBeNull();
    expect(link("facebook", "mailto:a@b.c").href).toBeNull();
  });
  it("supports any platform, with the dashboard's label and custom icon", () => {
    expect(link("youtube", "https://youtube.com/@keystel")).toMatchObject({ label: "YouTube", iconUrl: null });
    expect(link("pinterest", "https://pinterest.com/k", { label: "Our boards", icon_url: "https://cdn.example.com/pin.png" }))
      .toMatchObject({ label: "Our boards", iconUrl: "https://cdn.example.com/pin.png" });
    expect(link("pinterest", "https://pinterest.com/k").label).toBe("Pinterest");
  });
  it("drops a custom icon URL that could break out of the CSS mask", () => {
    expect(link("x", "https://x.com/k", { icon_url: 'https://a.example/i.png");background:url("//evil' }).iconUrl).not.toContain('"');
    expect(link("x", "https://x.com/k", { icon_url: "javascript:alert(1)" }).iconUrl).toBeNull();
  });
});

describe("WhatsApp number", () => {
  it.each([
    ["233541954924", "233541954924"],
    ["+233 54 195 4924", "233541954924"],
    ["0541954924", "233541954924"], // Ghana local format
    ["https://wa.me/233541954924", "233541954924"],
    ["https://wa.me/233541954924?text=Hello%20there%2012345", "233541954924"],
    ["https://api.whatsapp.com/send?phone=233541954924", "233541954924"],
  ])("reads %s", (input, expected) => expect(parseWhatsAppNumber(input)).toBe(expected));

  it.each([[""], [null], [undefined], ["abc"], ["123"], ["https://example.com/x"]])("rejects %s", (input) =>
    expect(parseWhatsAppNumber(input as string | null | undefined)).toBeNull());

  it("is exposed for checkout from the dashboard's WhatsApp row", () => {
    expect(whatsappNumberFrom([link("facebook", "https://f.example"), link("whatsapp", "233541954924")])).toBe("233541954924");
    expect(whatsappNumberFrom([link("facebook", "https://f.example")])).toBeNull();
    expect(link("whatsapp", "233541954924").href).toBe("https://wa.me/233541954924");
  });
});

describe("safeUrl", () => {
  it("allows web URLs and root-relative paths only", () => {
    expect(safeUrl("https://a.example/x.jpg")).toBe("https://a.example/x.jpg");
    expect(safeUrl("/assets/x.jpg")).toBe("/assets/x.jpg");
    expect(safeUrl("//a.example/x.jpg")).toBeNull();
    expect(safeUrl("/assets/x.jpg", { absoluteOnly: true })).toBeNull();
    expect(safeUrl(42)).toBeNull();
  });
});
