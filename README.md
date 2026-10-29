# Key-Stel Admin

**The staff dashboard for Key-Stel, "Your Secured Partner!"**

Key-Stel Admin is where your team manages the doors you sell, your stock, online orders, walk-in sales, customers and reports, all in one place.

- **Dashboard address:** https://admin.key-stel.com
- **Works on:** computers, tablets and phones

Everything you see is live data. There is no demo data. The public Key-Stel website uses the same database, so **any change to a door, price or stock level here appears on the website automatically.**

---

## What you can do

| Page | What it is for |
|------|----------------|
| **Overview** | A quick look at the last 7 days: revenue, best-selling doors, and sales by category group. |
| **Point of Sale** | Record a sale made in the shop. Choose Cash, MoMo or Card, apply a discount, add a note and print a receipt. Stock reduces automatically. |
| **Products** | Add, edit or delete doors: price, sizes, photos, stock, low-stock alert level, and whether a door is available or hidden. |
| **Categories** | Organise doors into categories and category groups. |
| **Inventory** | Update stock counts as doors come in and go out. Low stock is highlighted. |
| **Orders** | Follow online and walk-in orders from Pending to Dispatched to Delivered. Mark orders paid or unpaid, print receipts, and search by order number, name or phone. |
| **Customers** | A customer list built from orders, showing number of orders and total spent. Can be exported to CSV. |
| **Messages** | Messages sent through the website contact form, with an unread counter. |
| **Sales & Analytics** | Revenue by day, top products by revenue, and a payment method breakdown. |
| **Reports** | Download sales, items sold, stock and customer reports as CSV files that open in Excel. |
| **Staff & Access Control** | Add or remove staff and admins and reset passwords (admins only). |
| **Settings** | Update store contact details shown on the website, receipt footer text, and your own sign-in name and password. |

**Also included**

- **Global search** across products, orders and customers.
- **Notification bell** for pending orders, unread messages and low stock.
- **Flexible sign-in** with either a short username or an email address.
- **Forced password change** the first time new staff sign in.

---

## Getting started

1. Open **https://admin.key-stel.com**.
2. Sign in with your username (or email) and password.
3. If this is your first time signing in, you will be asked to choose a new password.
4. Forgot your password? Ask an admin to reset it from **Staff & Access Control**.

### Who can do what

| Role | Access |
|------|--------|
| **Superadmin** | Full access, including managing admins and staff. |
| **Admin** | Full day-to-day access, including adding staff and resetting passwords. |
| **Staff** | Day-to-day work such as sales, orders and stock. Cannot manage other users. |

---

## How orders work

### Online orders

1. A customer places an order on the website with their name, phone number and delivery address.
2. The order appears in **Orders** as **Pending** and **Unpaid**, and stock is reduced automatically.
3. Your team calls or messages the customer on WhatsApp, agrees the details and collects payment directly. *There is no online payment on the website.*
4. Update the order to **Dispatched**, then **Delivered**, and mark it **Paid** once payment is received.

### Walk-in sales

Record these in **Point of Sale**. They are saved automatically as **Paid** and **Delivered**, and a receipt can be printed straight away.

---

## Everyday tips

- **Keep stock accurate.** Use **Inventory** whenever doors arrive or leave outside of a recorded sale. The website relies on these numbers.
- **Hide instead of delete.** If a door is temporarily unavailable, set it to hidden in **Products** rather than deleting it.
- **Set a low-stock alert level** on each door so you get warned before you run out.
- **Check the notification bell** at the start of each day for pending orders and unread messages.
- **Use Reports** at the end of the week or month for sales, stock and customer records you can open in Excel.
- **Protect accounts.** Give each staff member their own login, never share passwords, and remove staff who leave.

---

## Technical details (for developers)

**Stack:** React 18, Vite 5, Supabase (Postgres, Auth, Row Level Security, Storage), lucide-react icons, plain CSS.



The output is created in `dist/`.

**Environment variables:** the Supabase URL and public (anon) key are configured in the project. Never commit a service-role key.

**Deployment:** hosted on Vercel and connected to the GitHub repository. Pushing to `main` deploys automatically. The domain `admin.key-stel.com` is set up through a CNAME record in the domain's DNS.

**Supabase auth settings:** Site URL is `https://admin.key-stel.com`, and the same address with `/**` is listed under Redirect URLs.

**Related project:** the public storefront is a separate project that shares this Supabase database.
