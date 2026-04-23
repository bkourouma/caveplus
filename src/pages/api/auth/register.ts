import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { registerCredentialsUser } from "@/lib/server/auth";

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
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
    const user = await registerCredentialsUser(parsed.data);
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Inscription impossible"
    });
  }
}
