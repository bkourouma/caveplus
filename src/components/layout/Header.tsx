"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, ShoppingBag, UserRound } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const accountHref = session?.user ? "/compte" : "/auth/login";
  const accountLabel = session?.user?.name?.split(" ")[0] || "Connexion";

  return (
    <header className="sticky top-0 z-40 border-b border-mist/70 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-bordeaux">
          CavePlus
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-charcoal md:flex">
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/a-propos">A propos</Link>
          <Link href="/localisation">Localisation</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <div className="flex items-center gap-3 text-charcoal">
          <button aria-label="Rechercher" className="rounded-full border border-mist p-2">
            <Search className="h-4 w-4" />
          </button>
          <Link href="/panier" aria-label="Panier" className="rounded-full border border-mist p-2">
            <ShoppingBag className="h-4 w-4" />
          </Link>
          <Link
            href={accountHref}
            aria-label={accountLabel}
            className="flex items-center gap-2 rounded-full border border-mist px-3 py-2"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden max-w-24 truncate text-sm sm:inline">{accountLabel}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
