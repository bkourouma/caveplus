import { PrismaClient } from "@prisma/client";
import { categories, products } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  const categoryBySlug = new Map<string, string>();

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl
      }
    });

    categoryBySlug.set(category.slug, createdCategory.id);
  }

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug);

    if (!categoryId) {
      continue;
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDesc: product.shortDesc,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        categoryId,
        producer: product.producer,
        origin: product.origin,
        volumeMl: product.volumeMl,
        alcoholPct: product.alcoholPct,
        vintage: product.vintage,
        isFeatured: product.isFeatured ?? false
      },
      create: {
        slug: product.slug,
        name: product.name,
        shortDesc: product.shortDesc,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        sku: `CP-${product.slug.slice(0, 12).toUpperCase()}`,
        categoryId,
        producer: product.producer,
        origin: product.origin,
        volumeMl: product.volumeMl,
        alcoholPct: product.alcoholPct,
        vintage: product.vintage,
        isFeatured: product.isFeatured ?? false,
        images: {
          create: [
            {
              url: product.imageUrl,
              alt: product.name
            }
          ]
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
