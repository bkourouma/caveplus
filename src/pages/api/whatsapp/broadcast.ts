import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const bodySchema = z.object({
  segment: z.string().min(2),
  message: z.string().min(1)
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  return res.status(200).json({
    ok: true,
    queued: 1248,
    ...parsed.data
  });
}
