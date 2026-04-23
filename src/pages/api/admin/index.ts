import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminStats } from "@/lib/server/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json(await getAdminStats());
}
