import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sendWhatsAppMessage } from "@/lib/wasender";

const bodySchema = z.object({
  to: z.string().min(8),
  message: z.string().min(1)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const result = await sendWhatsAppMessage(parsed.data);
  return res.status(200).json(result);
}
