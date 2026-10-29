# Key-Stel Website

**Key-Stel: "Your Secured Partner!"**

The public website for Key-Stel, a door shop. Customers can browse doors, see prices and availability, place an order, and send messages to the shop.

- **Website:** https://key-stel.com
- **Staff dashboard:** https://admin.key-stel.com (separate project, used by the shop team to manage everything you see here)

---

## What customers can do

- **Browse doors** by category, with photos, sizes and prices.
- **See availability.** Doors marked as hidden in the dashboard do not appear, and stock levels are kept up to date automatically.
- **Place an order** by entering their name, phone number and delivery address.
- **Contact the shop** through the contact form. Messages arrive in the dashboard under **Messages**.
- **View store details** such as phone numbers and contact information, which the shop can change at any time from the dashboard's **Settings** page.

---

## How ordering works

1. The customer chooses their doors and submits an order with their name, phone number and delivery address.
2. The order appears instantly in the staff dashboard as **Pending** and **Unpaid**, and stock is reduced automatically.
3. The Key-Stel team contacts the customer by phone or WhatsApp to confirm details and arrange payment.
4. **There is no online payment on the website.** Payment is collected directly by the shop.
5. Staff update the order to **Dispatched**, then **Delivered**, and mark it **Paid**.

---

## How the website and dashboard connect

The website and the staff dashboard share one database (Supabase). This means:

| If staff do this in the dashboard | The website shows |
|-----------------------------------|-------------------|
| Add or edit a door, price or photo | The updated door and price |
| Change stock levels | Updated availability |
| Hide a door | The door disappears from the site |
| Edit store contact details | The new details |

| If a customer does this on the website | Staff see in the dashboard |
|----------------------------------------|----------------------------|
| Places an order | A new Pending order, with stock reduced |
| Sends a contact message | A new unread message |

No manual syncing is needed.

---

## Managing the content

Customers never log in. To change anything on the site (products, prices, photos, stock, contact details), the shop team uses the dashboard at **https://admin.key-stel.com**.

---

## Technical details (for developers)

**Stack:** _[fill in: e.g. React + Vite, Next.js, etc.]_, Supabase (Postgres, Row Level Security, Storage).

**Run locally**

```bash
npm install
npm run dev
```

**Production build**

```bash
npm run build
```

**Environment variables:** the Supabase URL and public (anon) key are required. Never commit a service-role key or a `.env` file.

**Deployment:** hosted on Vercel and connected to GitHub. Pushing to `main` deploys automatically. The domain `key-stel.com` points to Vercel through DNS records set at the domain registrar.

**Database:** shared with the admin dashboard (`key_stel_admin`). Changes to table structure or Row Level Security policies affect both projects, so test both after any change.

**Supabase auth settings:** if the site uses any sign-in or email links, make sure `https://key-stel.com/**` is listed under Redirect URLs.
