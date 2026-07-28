import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { LauolonLogo } from "@/components/ui/logos/lauolon-logo";
import { GithubIcon } from "@/components/ui/logos/github-icon";
import { CTAWrapper } from "@/components/homepage/cta-wrapper";

export async function Header() {
  return (
    <header className="container mx-auto flex max-w-7xl items-center justify-between p-3">
      <Link href="/" aria-label="Lauolon - Go to homepage">
        <LauolonLogo />
      </Link>

      <nav className="flex items-center gap-2">
        <Link
          href="/changelog"
          className="text-sm font-medium transition-opacity hover:opacity-70"
        >
          Changelog
        </Link>
        <Button asChild size="icon-sm" variant="ghost">
          <Link
            href="https://github.com/tf8888/lauolon"
            target="_blank"
            aria-label="Go to GitHub repository"
          >
            <GithubIcon />
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/dashboard">
            <Suspense fallback="Get started">
              <CTAWrapper />
            </Suspense>
          </Link>
        </Button>
      </nav>
    </header>
  );
}
