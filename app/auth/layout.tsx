import Link from "next/link";

import { LauolonLogo } from "@/components/ui/logos/lauolon-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="self-center">
          <LauolonLogo />
        </Link>
        {children}
      </div>
    </div>
  );
}
