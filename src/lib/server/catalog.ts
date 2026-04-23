import { prisma } from "@/lib/prisma";
import { createCartId } from "@/lib/server/cart-session";
import { categories as categoryFixtures, mockCart, products as productFixtures } from "@/lib/mock-data";
import type { CartItem, Category, Product } from "@/types/catalog";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

type CategoryRecord = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  volumeMl: number | null;
  alcoholPct: number | null;
  origin: string | null;
  vintage: number | null;
  producer: string | null;
  isFeatured: boolean;
  category: {
    slug: string;
    name: string;
  };
  images: Array<{
    url: string;
  }>;
};

function mapCategory(record: CategoryRecord): Category {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description ?? "",
    imageUrl: record.imageUrl ?? ""
  };
}

function mapProduct(record: ProductRecord): Product {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    shortDesc: record.shortDesc ?? "",
    description: record.description ?? "",
    price: record.price,
    compareAtPrice: record.compareAtPrice ?? undefined,
    stock: record.stock,
    volumeMl: record.volumeMl ?? undefined,
    alcoholPct: record.alcoholPct ?? undefined,
    origin: record.origin ?? undefined,
    vintage: record.vintage ?? undefined,
    producer: record.producer ?? undefined,
    imageUrl: record.images[0]?.url ?? "",
    categorySlug: record.category.slug,
    categoryName: record.category.name,
    isFeatured: record.isFeatured
  };
}

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

export async function getCategories(): Promise<Category[]> {
  return withFallback(
    async () => {
      const result = await prisma.category.findMany({
        where: { isVisible: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
      });
      return result.map(mapCategory);
    },
    categoryFixtures
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return withFallback(
    async () => {
      const result = await prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
        orderBy: { updatedAt: "desc" }
      });
      return result.map((product: ProductRecord) => mapProduct(product));
    },
    productFixtures.filter((product) => product.isFeatured)
  );
}

export async function getProductsByCategory(slug?: string): Promise<Product[]> {
  return withFallback(
    async () => {
      const result = await prisma.product.findMany({
        where: {
          isActive: true,
          ...(slug ? { category: { slug } } : {})
        },
        include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
      });
      return result.map((product: ProductRecord) => mapProduct(product));
    },
    slug ? productFixtures.filter((product) => product.categorySlug === slug) : productFixtures
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return withFallback(
    async () => {
      const result = await prisma.category.findUnique({
        where: { slug }
      });
      return result ? mapCategory(result) : null;
    },
    categoryFixtures.find((category) => category.slug === slug) ?? null
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return withFallback(
    async () => {
      const result = await prisma.product.findUnique({
        where: { slug },
        include: { category: true, images: { orderBy: { sortOrder: "asc" } } }
      });
      return result ? mapProduct(result) : null;
    },
    productFixtures.find((product) => product.slug === slug) ?? null
  );
}

export async function getProductSlugs(): Promise<string[]> {
  return withFallback(
    async () => {
      const result = await prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true }
      });
      return result.map((product: { slug: string }) => product.slug);
    },
    productFixtures.map((product) => product.slug)
  );
}

export async function getCategorySlugs(): Promise<string[]> {
  return withFallback(
    async () => {
      const result = await prisma.category.findMany({
        where: { isVisible: true },
        select: { slug: true }
      });
      return result.map((category: { slug: string }) => category.slug);
    },
    categoryFixtures.map((category) => category.slug)
  );
}

export async function getCartItems(cartId?: string | null): Promise<CartItem[]> {
  return withFallback(
    async () => {
      if (!cartId) {
        return [];
      }

      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  images: { orderBy: { sortOrder: "asc" } }
                }
              }
            }
          }
        }
      });

      if (!cart) {
        return [];
      }

      return cart.items.map((item: { quantity: number; product: ProductRecord }) => ({
        quantity: item.quantity,
        product: mapProduct(item.product)
      }));
    },
    cartId ? [] : mockCart
  );
}

async function getUserCartId(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    select: { id: true }
  });

  return cart?.id ?? null;
}

export async function getCartItemsForIdentity(input: { cartId?: string | null; userId?: string | null }) {
  if (input.userId && hasDatabaseUrl) {
    const userCartId = await getUserCartId(input.userId);
    if (userCartId) {
      return getCartItems(userCartId);
    }
  }

  return getCartItems(input.cartId);
}

export async function addToCart(cartId: string, productId: string, quantity: number) {
  return withFallback(
    async () => {
      await prisma.cart.upsert({
        where: { id: cartId },
        update: {},
        create: { id: cartId }
      });

      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId,
            productId
          }
        },
        update: {
          quantity: {
            increment: quantity
          }
        },
        create: {
          cartId,
          productId,
          quantity
        }
      });

      return { ok: true };
    },
    { ok: true }
  );
}

export async function addToCartForIdentity(input: {
  cartId?: string | null;
  userId?: string | null;
  productId: string;
  quantity: number;
}) {
  if (input.userId && hasDatabaseUrl) {
    const existingCartId = await getUserCartId(input.userId);
    const userCartId = existingCartId ?? createCartId();

    if (!existingCartId) {
      await prisma.cart.create({
        data: {
          id: userCartId,
          userId: input.userId
        }
      });
    }

    await addToCart(userCartId, input.productId, input.quantity);
    return {
      cartId: userCartId,
      items: await getCartItems(userCartId)
    };
  }

  const guestCartId = ensureCartId(input.cartId);
  await addToCart(guestCartId, input.productId, input.quantity);

  return {
    cartId: guestCartId,
    items: await getCartItems(guestCartId)
  };
}

export async function setCartQuantity(cartId: string, productId: string, quantity: number) {
  return withFallback(
    async () => {
      await prisma.cart.upsert({
        where: { id: cartId },
        update: {},
        create: { id: cartId }
      });

      if (quantity <= 0) {
        await prisma.cartItem.deleteMany({
          where: {
            cartId,
            productId
          }
        });

        return { ok: true };
      }

      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId,
            productId
          }
        },
        update: {
          quantity
        },
        create: {
          cartId,
          productId,
          quantity
        }
      });

      return { ok: true };
    },
    { ok: true }
  );
}

export async function setCartQuantityForIdentity(input: {
  cartId?: string | null;
  userId?: string | null;
  productId: string;
  quantity: number;
}) {
  if (input.userId && hasDatabaseUrl) {
    const userCartId = await getUserCartId(input.userId);
    if (!userCartId) {
      return { items: [] };
    }

    await setCartQuantity(userCartId, input.productId, input.quantity);
    return { items: await getCartItems(userCartId) };
  }

  if (!input.cartId) {
    return { items: [] };
  }

  await setCartQuantity(input.cartId, input.productId, input.quantity);
  return { items: await getCartItems(input.cartId) };
}

export async function removeFromCart(cartId: string, productId: string) {
  return withFallback(
    async () => {
      await prisma.cartItem.deleteMany({
        where: {
          cartId,
          productId
        }
      });

      return { ok: true };
    },
    { ok: true }
  );
}

export async function removeFromCartForIdentity(input: {
  cartId?: string | null;
  userId?: string | null;
  productId: string;
}) {
  if (input.userId && hasDatabaseUrl) {
    const userCartId = await getUserCartId(input.userId);
    if (!userCartId) {
      return { items: [] };
    }

    await removeFromCart(userCartId, input.productId);
    return { items: await getCartItems(userCartId) };
  }

  if (!input.cartId) {
    return { items: [] };
  }

  await removeFromCart(input.cartId, input.productId);
  return { items: await getCartItems(input.cartId) };
}

export function ensureCartId(cartId?: string | null) {
  return cartId ?? createCartId();
}

export async function mergeGuestCartToUser(cartId: string, userId: string) {
  return withFallback(
    async () => {
      const guestCart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true }
      });

      const userCart = await prisma.cart.findFirst({
        where: { userId },
        include: { items: true }
      });

      if (!guestCart) {
        const attached = await prisma.cart.upsert({
          where: { userId },
          update: {},
          create: { userId }
        });

        return attached.id;
      }

      if (!userCart) {
        await prisma.cart.update({
          where: { id: guestCart.id },
          data: { userId }
        });

        return guestCart.id;
      }

      for (const item of guestCart.items) {
        await prisma.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: userCart.id,
              productId: item.productId
            }
          },
          update: {
            quantity: {
              increment: item.quantity
            }
          },
          create: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity
          }
        });
      }

      await prisma.cart.delete({
        where: { id: guestCart.id }
      });

      return userCart.id;
    },
    cartId
  );
}

export async function getSitemapData() {
  const [categories, products] = await Promise.all([getCategories(), getProductsByCategory()]);
  return { categories, products };
}
