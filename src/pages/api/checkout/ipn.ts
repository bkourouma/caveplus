import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { verifyPayHubIpn } from "@/lib/payhub";
import { applyPaymentConfirmation } from "@/lib/server/checkout";

const ipnSchema = z.object({
  reference: z.string().min(1)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = ipnSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const result = await verifyPayHubIpn(parsed.data.reference);
  const update = await applyPaymentConfirmation(parsed.data.reference);

  return res.status(200).json({
    ...result,
    ...update
  });
}
