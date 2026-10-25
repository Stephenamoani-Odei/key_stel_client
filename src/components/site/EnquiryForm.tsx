import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { sendInquiry } from "@/lib/inquiries.functions";
import { whatsappLink } from "@/lib/site";

export interface FieldDef { name: string; label: string; type?: string; required?: boolean; textarea?: boolean; defaultValue?: string | undefined }

// Sends the request to the shop. It lands in the admin dashboard's Messages screen, where staff call or
// WhatsApp the customer back. The form only says "sent" after the database has really saved it.
export function EnquiryForm({ fields, submitLabel, kind = "contact" }: { fields: FieldDef[]; submitLabel: string; kind?: "contact" | "quote" }) {
  const send = useServerFn(sendInquiry);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formErr, setFormErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [whatsappUnavailable, setWhatsappUnavailable] = useState(false);

  const schema = z.object(Object.fromEntries(fields.map((f) => {
    let s: z.ZodTypeAny = z.string().trim().max(f.textarea ? 1500 : 200);
    if (f.type === "email") s = z.string().trim().email("Enter a valid email").max(255).or(f.required ? z.never() : z.literal(""));
    else if (f.name === "phone") s = z.string().trim().regex(/^\+?[0-9 ()-]{9,30}$/, "Enter a valid phone number");
    else if (f.required) s = z.string().trim().min(1, `${f.label} is required`).max(f.textarea ? 1500 : 200);
    return [f.name, s];
  })));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErr(null);
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const r = schema.safeParse(raw);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    const value = (n: string) => (raw[n] ?? "").trim();
    const details = fields
      .filter((f) => f.name !== "name" && f.name !== "phone" && value(f.name))
      .map((f) => (f.textarea ? `${f.label}:\n${value(f.name)}` : `${f.label}: ${value(f.name)}`));
    const message = [kind === "quote" ? "QUOTE REQUEST" : "", ...details].filter(Boolean).join("\n");
    const quoteWhatsApp = kind === "quote"
      ? whatsappLink([
          "QUOTE REQUEST",
          ...fields.filter((f) => value(f.name)).map((f) => `${f.label}: ${value(f.name)}`),
        ].join("\n"))
      : null;
    setBusy(true);
    try {
      const res = await send({ data: { name: value("name"), phone: value("phone"), message, website: raw["website"] ?? "" } });
      if (res.ok && !raw["website"]?.trim() && quoteWhatsApp) {
        window.location.assign(quoteWhatsApp);
      } else if (res.ok) {
        setWhatsappUnavailable(kind === "quote" && !raw["website"]?.trim());
        setDone(true);
      } else {
        setFormErr(res.error);
      }
    } catch {
      setFormErr("We could not send your message right now. Please call us instead.");
    } finally {
      setBusy(false);
    }
  };

  if (done)
    return (
      <div className="rounded-xl border bg-surface p-8">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <h3 className="mt-3 text-xl font-bold">
          {kind === "quote" && whatsappUnavailable ? "Quote request saved" : kind === "quote" ? "Quote request sent" : "Message sent"}
        </h3>
        <p className="mt-1 text-muted-foreground">
          {whatsappUnavailable
            ? "Your quote request was saved, but WhatsApp is not configured. Please call us to follow up."
            : "Thank you. A member of the KEY-STEL team will call you back soon."}
        </p>
        <Button className="btn btn-secondary mt-5" onClick={() => setDone(false)}>Send another</Button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {/* Hidden trap field: people never see it, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {fields.map((f) => (
        <div key={f.name} className={f.textarea ? "sm:col-span-2" : ""}>
          <label htmlFor={f.name} className="mb-1.5 block text-sm font-semibold">{f.label}{f.required && <span className="text-primary"> *</span>}</label>
          {f.textarea
            ? <textarea id={f.name} name={f.name} rows={5} className="field" defaultValue={f.defaultValue} aria-invalid={!!errors[f.name]} />
            : <input id={f.name} name={f.name} type={f.type ?? "text"} className="field" defaultValue={f.defaultValue} aria-invalid={!!errors[f.name]} />}
          {errors[f.name] && <p className="mt-1 text-xs font-semibold text-primary">{errors[f.name]}</p>}
        </div>
      ))}
      {formErr && <p role="alert" className="sm:col-span-2 text-sm font-semibold text-primary">{formErr}</p>}
      <div className="sm:col-span-2"><Button className="btn btn-primary" disabled={busy}>{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : submitLabel}</Button></div>
    </form>
  );
}
