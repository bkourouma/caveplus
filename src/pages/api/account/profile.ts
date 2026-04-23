import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getAccountProfileByEmail, updateAccountProfileByEmail } from "@/lib/server/account";

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().max(30),
  whatsappOptIn: z.boolean()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const profile = await getAccountProfileByEmail(session.user.email);
    return res.status(200).json({ profile });
  }

  if (req.method === "PATCH") {
    const parsed = bodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body" });
    }

    const profile = await updateAccountProfileByEmail({
      email: session.user.email,
      ...parsed.data
    });

    return res.status(200).json({ profile });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
