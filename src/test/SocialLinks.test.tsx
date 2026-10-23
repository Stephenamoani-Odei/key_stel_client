import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toSocialLink } from "@/lib/social";

const { useCatalog } = vi.hoisted(() => ({ useCatalog: vi.fn() }));
vi.mock("@/lib/storefront", () => ({ useCatalog }));

import { SocialLinks } from "@/components/site/SocialLinks";

describe("SocialLinks", () => {
  beforeEach(() => useCatalog.mockReturnValue({ social: [] }));

  it("shows nothing when the owner has not entered any social links", () => {
    const { container } = render(<SocialLinks />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows only the links the owner entered, each as a real link", () => {
    useCatalog.mockReturnValue({ social: [toSocialLink({ platform: "instagram", url: "instagram.com/keystel" })] });
    render(<SocialLinks />);
    expect(screen.getByRole("link", { name: "KEY-STEL on Instagram" })).toHaveAttribute("href", "https://instagram.com/keystel");
    expect(screen.queryByLabelText(/Facebook/)).not.toBeInTheDocument();
  });
});
