import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Limits match the database (name 100, phone 30, message 2000). `website` is a hidden trap field for bots.
export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{9,30}$/, "Enter a valid phone number"),
  message: z.string().trim().min(1, "Write your message").max(2000),
  website: z.string().max(200).optional(),
});

export type InquiryResult = { ok: true } | { ok: false; error: string };
type Inquiry = z.infer<typeof inquirySchema>;

/** Saves a contact or quote request. It shows up in the admin dashboard's Messages screen. */
export async function sendInquiryWith(db: SupabaseClient<Database>, data: Inquiry): Promise<InquiryResult> {
  if (data.website) return { ok: true }; // a bot filled the hidden field: pretend it worked, store nothing
  const { error } = await db.from("inquiries").insert({ name: data.name, phone: data.phone, message: data.message });
  if (error) {
    console.error("[inquiry] insert failed:", error.message);
    return { ok: false, error: "We could not send your message right now. Please call us instead." };
  }
  return { ok: true };
}

export const sendInquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inquirySchema.parse(d))
  .handler(async ({ data }): Promise<InquiryResult> => {
    const { publicClient } = await import("./supabase-public.server");
    return sendInquiryWith(publicClient(), data);
  });
