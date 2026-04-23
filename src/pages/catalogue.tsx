import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getProductsByCategory } from "@/lib/server/catalog";
import type { Category, Product } from "@/types/catalog";

type CataloguePageProps = {
  categories: Category[];
  products: Product[];
};

export const getStaticProps: GetStaticProps<CataloguePageProps> = async () => {
  const [categories, products] = await Promise.all([getCategories(), getProductsByCategory()]);

  return {
    props: {
      categories,
      products
    },
    revalidate: 300
  };
};

export default function CataloguePage({
  categories,
  products
}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <MainLayout>
      <Seo
        title="Catalogue premium"
        description="Achetez vins, champagnes et spiritueux premium a Abidjan sur une experience mobile-first."
        pathname="/catalogue"
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.32em] text-bordeaux/65">Catalogue</p>
          <h1 className="mt-4 font-display text-4xl text-ink">Tous les produits CavePlus</h1>
          <p className="mt-4 text-base leading-7 text-charcoal/75">
            Une vitrine premium concue pour le marche ivoirien, avec livraison locale, paiement
            mobile money et accompagnement WhatsApp.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <span
              key={category.id}
              className="rounded-full border border-mist bg-white px-4 py-2 text-sm text-charcoal"
            >
              {category.name}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
