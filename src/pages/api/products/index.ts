import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getProductsByCategory } from "@/lib/server/catalog";

const querySchema = z.object({
  category: z.string().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = querySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query" });
  }

  return res.status(200).json({
    items: await getProductsByCategory(parsed.data.category)
  });
}
