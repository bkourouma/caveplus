import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createPayHubPayment } from "@/lib/payhub";
import { getCartItemsForIdentity } from "@/lib/server/catalog";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export type CheckoutInput = {
  cartId?: string | null;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryNote?: string;
  returnUrl: string;
};

export type CheckoutResult = {
  orderNumber: string;
  subtotal: number;
  shippingAmount: number;
  total: number;
  paymentUrl: string;
  providerReference: string;
};

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `CMD-${y}${m}${d}-${suffix}`;
}

function getShippingAmount(subtotal: number) {
  return subtotal > 150000 ? 0 : 5000;
}

export async function createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const items = await getCartItemsForIdentity({
    cartId: input.cartId,
    userId: input.userId
  });

  if (items.length === 0) {
    throw new Error("Le panier est vide.");
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingAmount = getShippingAmount(subtotal);
  const total = subtotal + shippingAmount;
  const orderNumber = generateOrderNumber();

  const payment = await createPayHubPayment({
    amount: total,
    orderNumber,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    returnUrl: input.returnUrl
  });

  if (hasDatabaseUrl) {
    await prisma.order.create({
      data: {
        orderNumber,
        userId: input.userId ?? undefined,
        cartId: input.cartId ?? undefined,
        status: OrderStatus.PENDING_PAYMENT,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        shippingAmount,
        total,
        paymentRef: payment.providerReference,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        deliveryNote: input.deliveryNote,
        items: {
          create: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.product.price * item.quantity
          }))
        }
      }
    });
  }

  return {
    orderNumber,
    subtotal,
    shippingAmount,
    total,
    paymentUrl: payment.paymentUrl,
    providerReference: payment.providerReference
  };
}

export async function applyPaymentConfirmation(reference: string) {
  if (!hasDatabaseUrl) {
    return {
      reference,
      updated: false
    };
  }

  const order = await prisma.order.findFirst({
    where: { paymentRef: reference },
    select: { id: true, cartId: true }
  });

  if (!order) {
    return {
      reference,
      updated: false
    };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.PAID
    }
  });

  if (order.cartId) {
    await prisma.cartItem.deleteMany({
      where: { cartId: order.cartId }
    });
  }

  return {
    reference,
    updated: true
  };
}
