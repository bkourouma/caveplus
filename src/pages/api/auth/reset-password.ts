import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { resetPasswordWithToken } from "@/lib/server/auth";

const bodySchema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  password: z.string().min(8).max(100)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  try {
    await resetPasswordWithToken(parsed.data);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Reinitialisation impossible"
    });
  }
}
