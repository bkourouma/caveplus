import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/server/auth";

const bodySchema = z.object({
  email: z.string().email()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const result = await requestPasswordReset(parsed.data.email);
  return res.status(200).json(result);
}
