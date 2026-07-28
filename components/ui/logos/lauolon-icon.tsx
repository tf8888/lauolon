import Image from "next/image";

import { cn } from "@/lib/utils";

import iconAsset from "@/public/images/icon.png";

// The brand mark is a raster asset, so unlike the sibling logos in this folder
// it cannot be recoloured through `currentColor`. Call sites that want a muted
// or hover treatment use opacity utilities instead of text-* colours.
export function LauolonIcon({
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

  // The source asset is square, so whichever dimension is given drives both.
  const size = height ?? width ?? 24;

  return (
    <Image
      src={iconAsset}
      alt="Lauolon"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
