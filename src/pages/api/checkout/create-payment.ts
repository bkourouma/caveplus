import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getCartIdFromRequest } from "@/lib/server/cart-session";
import { createCheckout } from "@/lib/server/checkout";

const bodySchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerEmail: z.string().email(),
  deliveryNote: z.string().max(500).optional(),
  returnUrl: z.string().url()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  try {
    const payment = await createCheckout({
      ...parsed.data,
      cartId: getCartIdFromRequest(req),
      userId: session?.user?.id
    });
    return res.status(200).json(payment);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Checkout impossible"
    });
  }
}
