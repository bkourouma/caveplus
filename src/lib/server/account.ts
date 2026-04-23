import { prisma } from "@/lib/prisma";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export type AccountProfile = {
  name: string;
  email: string;
  phone: string;
  whatsappOptIn: boolean;
};

export type AccountOrder = {
  id: string;
  status: string;
  total: number;
  channel: string;
  createdAt: string;
};

export async function getAccountProfileByEmail(email?: string | null): Promise<AccountProfile | null> {
  if (!email) {
    return null;
  }

  if (!hasDatabaseUrl) {
    return {
      name: "Client CavePlus",
      email,
      phone: "",
      whatsappOptIn: true
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        phone: true,
        whatsappOptIn: true
      }
    });

    if (!user) {
      return null;
    }

    return {
      name: user.name ?? "Client CavePlus",
      email: user.email,
      phone: user.phone ?? "",
      whatsappOptIn: user.whatsappOptIn
    };
  } catch {
    return null;
  }
}

export async function getAccountOrdersByEmail(email?: string | null): Promise<AccountOrder[]> {
  if (!email || !hasDatabaseUrl) {
    return [];
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [{ customerEmail: email }, { user: { email } }]
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return orders.map((order) => ({
      id: order.orderNumber,
      status: order.status,
      total: order.total,
      channel: "PayHub + WhatsApp",
      createdAt: new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(order.createdAt)
    }));
  } catch {
    return [];
  }
}

export async function updateAccountProfileByEmail(input: AccountProfile): Promise<AccountProfile> {
  if (!hasDatabaseUrl) {
    return input;
  }

  const user = await prisma.user.update({
    where: { email: input.email },
    data: {
      name: input.name,
      phone: input.phone || null,
      whatsappOptIn: input.whatsappOptIn
    },
    select: {
      name: true,
      email: true,
      phone: true,
      whatsappOptIn: true
    }
  });

  return {
    name: user.name ?? "Client CavePlus",
    email: user.email,
    phone: user.phone ?? "",
    whatsappOptIn: user.whatsappOptIn
  };
}
