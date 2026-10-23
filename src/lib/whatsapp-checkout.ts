import { formatPrice } from "./catalog";

export type WhatsAppItem = { name: string; qty: number; price: number };

/**
 * Optional extra on the order confirmation page: a WhatsApp message about an order that is ALREADY
 * saved. The customer must press Send in WhatsApp. `whatsappNumber` comes from the admin's Settings.
 */
export function orderWhatsAppUrl(orderId: number, customerName: string, items: WhatsAppItem[], whatsappNumber: string | null | undefined) {
  const phone = (whatsappNumber ?? "").replace(/\D/g, "");
  if (!phone) return null;
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const text = [
    `Hello KEY-STEL, I placed order #${orderId} on your website.`,
    `Name: ${customerName}`,
    "",
    ...items.map((i, n) => `${n + 1}. ${i.name} x ${i.qty} (${formatPrice(i.price * i.qty)})`),
    "",
    `Total: ${formatPrice(total)}`,
    "Please call me to confirm my order and arrange payment.",
  ].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
