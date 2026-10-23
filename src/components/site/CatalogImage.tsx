// Renders a dashboard-supplied photo, or a quiet placeholder while the dashboard has not pushed
// one yet — so a product or category without an image never shows a broken picture.
export function CatalogImage({ src, alt, className = "", ...rest }: { src?: string | null | undefined; alt: string; className?: string; loading?: "lazy" | "eager"; width?: number; height?: number }) {
  if (!src) {
    return (
      <div role="img" aria-label={`${alt} — photo coming soon`} className={`grid place-items-center bg-surface px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${className}`}>
        Photo coming soon
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} {...rest} />;
}
