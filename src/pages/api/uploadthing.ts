import type { NextApiRequest, NextApiResponse } from "next";
import { getUploadThingConfig } from "@/lib/uploadthing";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(getUploadThingConfig());
}
