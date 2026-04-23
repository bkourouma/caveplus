import { getCartTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/catalog";

type OrderSummaryProps = {
  items: CartItem[];
};

export function OrderSummary({ items }: OrderSummaryProps) {
  const { subtotal, shipping, total } = getCartTotal(items);

  return (
    <div className="glass-card rounded-[20px] border border-mist p-5">
      <p className="font-display text-2xl text-ink">Resume</p>
      <div className="mt-5 space-y-4 text-sm text-charcoal">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Livraison</span>
          <span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between border-t border-mist pt-4 text-base font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
