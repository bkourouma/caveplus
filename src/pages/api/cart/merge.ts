import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { clearCartCookie, getCartIdFromRequest, setCartCookie } from "@/lib/server/cart-session";
import { mergeGuestCartToUser } from "@/lib/server/catalog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  const cartId = getCartIdFromRequest(req);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!cartId) {
    return res.status(200).json({ ok: true, merged: false });
  }

  const finalCartId = await mergeGuestCartToUser(cartId, userId);

  if (finalCartId !== cartId) {
    setCartCookie(res, finalCartId);
  } else if (!finalCartId) {
    clearCartCookie(res);
  }

  return res.status(200).json({
    ok: true,
    merged: true,
    cartId: finalCartId
  });
}
