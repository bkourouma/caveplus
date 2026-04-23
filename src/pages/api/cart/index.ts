import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getCartIdFromRequest, setCartCookie } from "@/lib/server/cart-session";
import {
  addToCartForIdentity,
  getCartItemsForIdentity,
  removeFromCartForIdentity,
  setCartQuantityForIdentity
} from "@/lib/server/catalog";

const mutationSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive()
});

const updateSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0)
});

const deleteSchema = z.object({
  productId: z.string().min(1)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const existingCartId = getCartIdFromRequest(req);
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (req.method === "GET") {
    return res.status(200).json({ items: await getCartItemsForIdentity({ cartId: existingCartId, userId }) });
  }

  if (req.method === "POST") {
    const parsed = mutationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body" });
    }

    const result = await addToCartForIdentity({
      cartId: existingCartId,
      userId,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity
    });

    if (!userId && !existingCartId) {
      setCartCookie(res, result.cartId);
    }

    return res.status(200).json({
      ok: true,
      message: "Produit ajoute au panier",
      items: result.items
    });
  }

  if (req.method === "PATCH") {
    const parsed = updateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body" });
    }

    if (!userId && !existingCartId) {
      return res.status(400).json({ error: "Panier introuvable" });
    }

    const result = await setCartQuantityForIdentity({
      cartId: existingCartId,
      userId,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity
    });

    return res.status(200).json({
      ok: true,
      message: "Panier mis a jour",
      items: result.items
    });
  }

  if (req.method === "DELETE") {
    const parsed = deleteSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body" });
    }

    if (!userId && !existingCartId) {
      return res.status(400).json({ error: "Panier introuvable" });
    }

    const result = await removeFromCartForIdentity({
      cartId: existingCartId,
      userId,
      productId: parsed.data.productId
    });

    return res.status(200).json({
      ok: true,
      message: "Produit retire du panier",
      items: result.items
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
