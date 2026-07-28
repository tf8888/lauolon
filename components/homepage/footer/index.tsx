import Link from "next/link";
import { Mail } from "lucide-react";

import { PUBLIC_LEGAL_LINKS } from "@/lib/legal/registry";

export async function Footer() {
  "use cache";

  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-muted-foreground container mx-auto mt-8 grid max-w-7xl grid-cols-3 gap-4 p-3 py-6 text-sm font-medium">
      <div className="col-span-full sm:col-span-1">
        <a
          href="mailto:support@lauolon.com"
          aria-label="Contact support"
          className="hover:text-foreground flex items-center gap-1.5 justify-self-start transition-colors"
        >
          <Mail size={18} />
          <p>Contact support</p>
        </a>
      </div>
      <div className="col-span-full sm:col-span-1">
        <p className="sm:text-center">
          Copyright © {currentYear}. All rights reserved.
          <br />
          v0.1.0-beta
        </p>
      </div>
      <nav className="col-span-full space-y-4 sm:col-span-1 sm:text-end">
        {PUBLIC_LEGAL_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
