import { cn } from "@/lib/utils";

import { LauolonIcon } from "@/components/ui/logos/lauolon-icon";

// Full lockup: the raster brand mark plus a live text wordmark. The wordmark is
// text rather than part of the image so it inherits the app font and stays
// legible in both themes.
export function LauolonLogo({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  // Ensure at least one dimension is provided
  if (!width && !height) {
    height = 24; // Default height if neither is provided
  }

  const markSize = height ?? width ?? 24;

  return (
    <span
      className={cn(
        "text-foreground inline-flex items-center gap-1.5 leading-none",
        className,
      )}
    >
      <LauolonIcon height={markSize} />
      <span
        className="font-semibold tracking-tight"
        // Sized off the mark so the lockup scales as one unit.
        style={{ fontSize: `${markSize * 0.8}px` }}
      >
        Lauolon
      </span>
    </span>
  );
}
