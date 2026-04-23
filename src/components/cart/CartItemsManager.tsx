"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/catalog";

type CartItemsManagerProps = {
  initialItems: CartItem[];
};

type CartResponse = {
  items: CartItem[];
  error?: string;
};

export function CartItemsManager({ initialItems }: CartItemsManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isBusyId, setIsBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function mutateCart(method: "PATCH" | "DELETE", body: Record<string, unknown>, busyId: string) {
    setIsBusyId(busyId);
    setError(null);

    try {
      const response = await fetch("/api/cart", {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const payload = (await response.json()) as CartResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Impossible de mettre a jour le panier.");
      }

      setItems(payload.items);
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Une erreur est survenue.");
    } finally {
      setIsBusyId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-[24px] border border-mist p-6">
        <h1 className="font-display text-4xl text-ink">Votre panier</h1>
        <p className="mt-3 text-sm leading-6 text-charcoal/74">
          Votre panier est vide pour le moment. Retournez au catalogue pour ajouter vos bouteilles.
        </p>
        <Link
          href="/catalogue"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream"
        >
          Explorer le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <h1 className="font-display text-4xl text-ink">Votre panier</h1>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        {items.map((item) => (
          <article
            key={item.product.id}
            className="glass-card flex gap-4 rounded-[20px] border border-mist p-4"
          >
            <div className="relative h-28 w-24 overflow-hidden rounded-2xl">
              <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-4">
              <div>
                <p className="font-display text-2xl text-ink">{item.product.name}</p>
                <p className="mt-1 text-sm text-charcoal/70">{item.product.shortDesc}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-charcoal/75">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isBusyId === item.product.id}
                    onClick={() =>
                      mutateCart("PATCH", { productId: item.product.id, quantity: item.quantity - 1 }, item.product.id)
                    }
                    className="h-9 w-9 rounded-full border border-mist bg-white"
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center">Quantite: {item.quantity}</span>
                  <button
                    type="button"
                    disabled={isBusyId === item.product.id}
                    onClick={() =>
                      mutateCart("PATCH", { productId: item.product.id, quantity: item.quantity + 1 }, item.product.id)
                    }
                    className="h-9 w-9 rounded-full border border-mist bg-white"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    disabled={isBusyId === item.product.id}
                    onClick={() => mutateCart("DELETE", { productId: item.product.id }, item.product.id)}
                    className="rounded-full border border-mist px-3 py-2 text-xs font-medium text-charcoal"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="space-y-4">
        <OrderSummary items={items} />
        <Link
          href="/checkout"
          className="block rounded-full bg-ink px-6 py-4 text-center text-sm font-semibold text-cream"
        >
          Passer au paiement
        </Link>
      </div>
    </div>
  );
}
