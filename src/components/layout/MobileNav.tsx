"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";

export function MobileNav() {
  const { data: session } = useSession();
  const accountLabel = session?.user?.name?.split(" ")[0] || "Connexion";
  const items = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/catalogue", label: "Catalogue", icon: LayoutGrid },
    { href: "/panier", label: "Panier", icon: ShoppingCart },
    { href: session?.user ? "/compte" : "/auth/login", label: accountLabel, icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-mist bg-cream/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4 px-3 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl text-[11px] text-charcoal"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
