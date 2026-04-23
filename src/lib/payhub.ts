import { z } from "zod";

const createPaymentSchema = z.object({
  amount: z.number().int().positive(),
  orderNumber: z.string().min(3),
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  returnUrl: z.string().url()
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export async function createPayHubPayment(input: CreatePaymentInput) {
  const payload = createPaymentSchema.parse(input);

  return {
    status: "PENDING",
    gateway: "PayHubSecure",
    paymentUrl: `${process.env.PAYHUB_BASE_URL ?? "https://sandbox.payhubsecure.example"}/pay/${payload.orderNumber}`,
    providerReference: `PAYHUB-${payload.orderNumber}`
  };
}

export async function verifyPayHubIpn(reference: string) {
  return {
    reference,
    verified: true,
    paymentStatus: "PAID"
  };
}
