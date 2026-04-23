import type { CartItem } from "@/types/catalog";

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getCartShipping(subtotal: number) {
  return subtotal > 150000 ? 0 : 5000;
}

export function getCartTotal(items: CartItem[]) {
  const subtotal = getCartSubtotal(items);
  const shipping = getCartShipping(subtotal);

  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}
