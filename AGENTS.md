# AGENTS

Read before changing anything. The website is the public face of the **KEY-STEL admin dashboard's database**.
See `docs/dashboard-integration.md` for the data contract.

## Rules

1. **No mock data, ever.** Do not add products, prices, categories, photos, contact numbers, social links, orders or
   fake counts to this repository. Everything comes from the dashboard's database. If a screen would be empty, show
   an honest empty state.
2. **The dashboard owns the schema.** Do not add migrations or tables here. Do not invent columns. Ask DataLens.
3. **Public key only.** Use `SUPABASE_PUBLISHABLE_KEY`. Never add or request a secret or service-role key.
4. **Never trust the browser for money.** Orders send door ids and quantities only; the database calculates prices
   and stock. Prices on screen are for display.
5. **No online payment.** Checkout saves the order; staff call the customer to confirm it and arrange payment.
   Do not add card, MoMo or "pay now" UI without a decision from DataLens and the owner.
6. **Hidden or out-of-stock doors cannot be bought.** The database enforces it; the UI should match.
7. Product and category URLs: `/product/<name>-<8 id characters>` and `/category/<name slug>`. A renamed door's old
   link still resolves through its id part.

## Where things live

- `src/lib/catalog.ts`: types and pure helpers (no data).
- `src/lib/catalog.functions.ts`, `storefront-data.ts`, `storefront.ts`: load and map dashboard data.
- `src/lib/orders.functions.ts`: live price check and `placeOrder`.
- `src/lib/inquiries.functions.ts`: contact and quote messages.
- `src/lib/site.ts`: contact details applied from Settings, plus the two branch cards.
- `src/test/`: unit tests. Run `npm test`.

## Verify

`npm run build`, `npx tsc --noEmit`, `npx vitest run`.
