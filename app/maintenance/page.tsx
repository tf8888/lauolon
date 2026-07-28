import Link from "next/link";

import { LauolonIcon } from "@/components/ui/logos/lauolon-icon";

export default function MaintenancePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-4 text-center">
      <Link href="/" aria-label="Lauolon - Go to homepage">
        <LauolonIcon
          height={40}
          className="transition-opacity hover:opacity-70"
        />
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">We&apos;ll be back soon</h1>
      <p className="text-muted-foreground mt-2">
        Lauolon is undergoing scheduled maintenance. Please try again later.
      </p>
    </main>
  );
}
