import Link from "next/link";

import { LauolonLogo } from "@/components/ui/logos/lauolon-logo";
import { LauolonIcon } from "@/components/ui/logos/lauolon-icon";

export function Branding() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Link href="/" aria-label="Lauolon - Go to homepage">
        <LauolonLogo
          height={24}
          className="group-data-[state=collapsed]:hidden"
        />
        <LauolonIcon
          height={24}
          className="hidden group-data-[state=collapsed]:block"
        />
      </Link>
      <p className="text-muted-foreground truncate text-center text-xs group-data-[state=collapsed]:hidden">
        {/* Copyright © {new Date().getFullYear()}. All rights reserved. */}
        v0.1.0-beta
      </p>
    </div>
  );
}
