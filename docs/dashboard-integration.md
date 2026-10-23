# Admin dashboard integration

The KEY-STEL website and the admin dashboard share **one Supabase project and one database**. The dashboard
(DataLens' `keystel-admin`) owns the schema. The website only reads what visitors may read and writes through
two safe doors. **No product, price, category, photo, phone number, social link or order is hard-coded in this
repository.**

## Connection

Server environment (see `.env.example`): `SUPABASE_URL` (the project URL, no `/rest/v1`) and
`SUPABASE_PUBLISHABLE_KEY`. They are public values. **The website never uses a secret or service-role key.**
If you ever need one, stop and ask DataLens: it means the design is going wrong.

## What the website reads (row-level security allows visitors to read these only)

| Table | Used for |
|---|---|
| `categories` (`id`, `name`, `group_name`) | Shop filters and category pages. The slug is made from `name`. `group_name` is the owner's parent group and appears in the category description. |
| `products` (`id`, `category_id`, `name`, `description`, `price`, `sizes[]`, `images[]`, `stock`, `available`, `created_at`) | Shop, product pages, home page. Doors the owner switched to Hidden are not readable at all. In stock means `stock > 0`. |
| `settings` (row `id = 1`: `store_name`, `phone`, `whatsapp`, `address`, `map_url`, `email`, `facebook`, `instagram`, `tiktok`, `delivery_note`) | Header, footer, contact page, WhatsApp buttons, social icons. An empty value is hidden. Nothing is substituted. |

`src/lib/catalog.functions.ts` loads all three in one server call; `src/lib/storefront-data.ts` maps rows to what
the pages render (pure functions, unit-tested). The root route loads it so pages are server-rendered with real data.

## What the website writes

| Action | How |
|---|---|
| Place an order | Server function `placeOrder` calls the database function `place_order` with the customer's details and **door ids and quantities only**. The database looks up prices, checks stock, calculates the total, lowers stock and returns the order number. The order lands in the dashboard's **Orders** screen as Pending and Unpaid. |
| Contact and quote requests | Server function `sendInquiry` inserts into `inquiries` (name, phone, message). They appear in the dashboard's **Messages** screen. |

The website cannot read or change `orders`, `order_items`, `staff` or `inquiries`. That is intentional.

## Payment

There is **no online payment**. Checkout does not ask how the customer will pay. After the order is placed, staff call
the customer from the dashboard, agree the delivery charge, take payment, and record it in the dashboard.
`p_payment` is always the placeholder text `"Pay on Delivery"`.

## Things the dashboard does not have (so the website does not show them)

SKU, sale price, "price on request", made to order, material, colour, dimensions, spec tables, featured flags,
per-door size selection (sizes are listed on the product page but are not recorded on the order). If the owner wants
one of these, DataLens adds the column and an admin field first; then it can be shown.

Branch locations (Kwabenya, Kasoa) are the one set of details still kept in `src/lib/site.ts` because the dashboard
has no branches screen yet. Their phone number comes from Settings.

## Changing the database

Do not change it from here. There are no migrations in this repository. Ask DataLens.

## Checklist: "no mock data"

- [ ] An empty database shows friendly empty states, never broken pages.
- [ ] A door added in the dashboard appears on the site within about 30 seconds, with its price and photo.
- [ ] A door switched to Hidden disappears; its link shows not found.
- [ ] Stock 0 shows Out of stock and cannot be added to the cart.
- [ ] A test order appears in the dashboard's Orders as Pending and Unpaid and reduces stock.
- [ ] A contact message appears in the dashboard's Messages.
- [ ] Changing the phone number in the dashboard's Settings changes the site.
