import Image from "next/image";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { getProductBySlug, getProductSlugs } from "@/lib/server/catalog";
import { buildCanonical, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type ProductPageProps = {
  product: Product;
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getProductSlugs()).map((slug) => ({ params: { slug } })),
  fallback: "blocking"
});

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const slug = String(params?.slug ?? "");
  const product = await getProductBySlug(slug);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product },
    revalidate: 300
  };
};

export default function ProductPage({ product }: InferGetStaticPropsType<typeof getStaticProps>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: [product.imageUrl],
      description: product.description,
      sku: product.id,
      brand: { "@type": "Brand", name: product.producer ?? "CavePlus" },
      offers: {
        "@type": "Offer",
        url: buildCanonical(`/produit/${product.slug}`),
        priceCurrency: "XOF",
        price: product.price,
        availability:
          product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: buildCanonical("/") },
        {
          "@type": "ListItem",
          position: 2,
          name: product.categoryName,
          item: buildCanonical(`/categorie/${product.categorySlug}`)
        },
        { "@type": "ListItem", position: 3, name: product.name }
      ]
    }
  ];

  return (
    <MainLayout>
      <Seo
        title={`${product.name} - ${product.producer ?? "CavePlus"}`}
        description={product.description}
        pathname={`/produit/${product.slug}`}
        imageUrl={product.imageUrl}
        type="product"
        jsonLd={jsonLd}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-mist bg-white">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-bordeaux/65">{product.categoryName}</p>
            <h1 className="mt-3 font-display text-4xl text-ink">{product.name}</h1>
            <p className="mt-3 text-base leading-7 text-charcoal/75">{product.description}</p>
          </div>

          <div className="glass-card rounded-[24px] border border-mist p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold text-gold">{formatPrice(product.price)}</p>
                {product.compareAtPrice ? (
                  <p className="mt-1 text-sm text-charcoal/45 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </p>
                ) : null}
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1 text-sm text-success">
                {product.stock > 0 ? "En stock" : "Indisponible"}
              </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-charcoal/75 sm:grid-cols-2">
              <p>Producteur: {product.producer ?? "Selection CavePlus"}</p>
              <p>Origine: {product.origin ?? "Non renseignee"}</p>
              <p>Volume: {product.volumeMl ? `${product.volumeMl} ml` : "Non renseigne"}</p>
              <p>Alcool: {product.alcoholPct ? `${product.alcoholPct}%` : "Non renseigne"}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
              <Link
                href="/checkout"
                className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink"
              >
                Acheter maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
