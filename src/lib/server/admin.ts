import { prisma } from "@/lib/prisma";
import { adminCustomers, adminOrders, broadcastCampaigns, cmsBlocks } from "@/lib/admin-data";
import { categories as categoryFixtures, products as productFixtures } from "@/lib/mock-data";
import type { AdminCustomer, AdminOrder, BroadcastCampaign, CmsBlock } from "@/types/admin";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

async function withFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDatabaseUrl) {
    return fallback;
  }

  try {
    return await query();
  } catch {
    return fallback;
  }
}

export async function getAdminProducts() {
  return withFallback(
    async () => {
      const result = await prisma.product.findMany({
        include: { category: true },
        orderBy: { updatedAt: "desc" }
      });

      return result.map((product: {
        id: string;
        name: string;
        price: number;
        stock: number;
        producer: string | null;
        category: { name: string };
      }) => ({
        id: product.id,
        name: product.name,
        categoryName: product.category.name,
        price: product.price,
        stock: product.stock,
        producer: product.producer ?? "-"
      }));
    },
    productFixtures.map((product) => ({
      id: product.id,
      name: product.name,
      categoryName: product.categoryName,
      price: product.price,
      stock: product.stock,
      producer: product.producer ?? "-"
    }))
  );
}

export async function getAdminCategories() {
  return withFallback(
    async () => {
      const result = await prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
      });

      return result.map((category: { id: string; name: string; slug: string; description: string | null }) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? ""
      }));
    },
    categoryFixtures
  );
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  return withFallback(
    async () => {
      const result = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 20
      });

      return result.map((order: {
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        total: number;
        status: string;
        paymentStatus: string;
        createdAt: Date;
      }) => ({
        id: order.orderNumber,
        customerName: order.customerName,
        phone: order.customerPhone,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: new Intl.DateTimeFormat("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(order.createdAt)
      }));
    },
    adminOrders
  );
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  return withFallback(
    async () => {
      const result = await prisma.user.findMany({
        include: { orders: true },
        orderBy: { createdAt: "desc" },
        take: 20
      });

      return result.map((user: {
        id: string;
        name: string | null;
        email: string;
        phone: string | null;
        whatsappOptIn: boolean;
        orders: Array<{ total: number }>;
      }) => ({
        id: user.id,
        name: user.name ?? "Client",
        email: user.email,
        phone: user.phone ?? "-",
        totalOrders: user.orders.length,
        totalSpent: user.orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0),
        whatsappOptIn: user.whatsappOptIn
      }));
    },
    adminCustomers
  );
}

export async function getAdminCampaigns(): Promise<BroadcastCampaign[]> {
  return withFallback(async () => broadcastCampaigns, broadcastCampaigns);
}

export async function getAdminCmsBlocks(): Promise<CmsBlock[]> {
  return withFallback(
    async () => {
      const result = await prisma.cmsPage.findMany({
        orderBy: { updatedAt: "desc" }
      });

      return result.map((page: { id: string; title: string; updatedAt: Date; isPublished: boolean }) => ({
        id: page.id,
        title: page.title,
        type: "Page",
        updatedAt: new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(page.updatedAt),
        status: page.isPublished ? "Publie" : "Brouillon"
      }));
    },
    cmsBlocks
  );
}

export async function getAdminStats() {
  return withFallback(
    async () => {
      const [ordersCount, customersCount, productsCount] = await Promise.all([
        prisma.order.count(),
        prisma.user.count(),
        prisma.product.count()
      ]);

      return {
        salesToday: 0,
        ordersToday: ordersCount,
        whatsappAudience: customersCount,
        productsCount
      };
    },
    {
      salesToday: 945000,
      ordersToday: adminOrders.length,
      whatsappAudience: adminCustomers.filter((customer) => customer.whatsappOptIn).length,
      productsCount: productFixtures.length
    }
  );
}
