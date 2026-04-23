import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminCampaigns, getAdminStats } from "@/lib/server/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const [stats, campaigns] = await Promise.all([getAdminStats(), getAdminCampaigns()]);

  return res.status(200).json({
    audience: stats.whatsappAudience,
    templates: 12,
    campaigns
  });
}
