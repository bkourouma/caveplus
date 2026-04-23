import { z } from "zod";

const sendMessageSchema = z.object({
  to: z.string().min(8),
  message: z.string().min(1).max(1000)
});

export async function sendWhatsAppMessage(input: z.infer<typeof sendMessageSchema>) {
  const payload = sendMessageSchema.parse(input);

  return {
    ok: true,
    provider: "WaSender",
    to: payload.to,
    queuedAt: new Date().toISOString()
  };
}
