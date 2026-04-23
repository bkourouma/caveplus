"use client";

import { useState } from "react";
import { useRouter } from "next/router";

type AddToCartButtonProps = {
  productId: string;
  disabled?: boolean;
};

export function AddToCartButton({ productId, disabled }: AddToCartButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddToCart() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Impossible d'ajouter le produit.");
      }

      await router.push("/panier");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Une erreur est survenue.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={handleAddToCart}
        className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Ajout..." : "Ajouter au panier"}
      </button>
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </div>
  );
}
