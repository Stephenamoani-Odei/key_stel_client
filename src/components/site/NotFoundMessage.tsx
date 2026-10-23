import { Link } from "@tanstack/react-router";

/** The 404 message shown for unknown pages, and for products/categories that are missing or no longer published. */
export function NotFoundMessage({
  title = "This page isn't here",
  message = "It may have moved or been removed. Try the shop or head home.",
  action = { to: "/shop", label: "Browse products" },
}: {
  title?: string;
  message?: string;
  action?: { to: "/shop" | "/"; label: string };
}) {
  return (
    <div className="container-x py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-black">{title}</h1>
      <p className="mt-3 text-muted-foreground">{message}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn btn-primary">Go home</Link>
        <Link to={action.to} className="btn btn-secondary">{action.label}</Link>
      </div>
    </div>
  );
}
