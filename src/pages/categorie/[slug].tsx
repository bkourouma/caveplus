import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategoryBySlug, getCategorySlugs, getProductsByCategory } from "@/lib/server/catalog";
import type { Category, Product } from "@/types/catalog";

type CategoryPageProps = {
  category: Category;
  products: Product[];
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getCategorySlugs()).map((slug) => ({ params: { slug } })),
  fallback: "blocking"
});

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const slug = String(params?.slug ?? "");
  const [category, products] = await Promise.all([getCategoryBySlug(slug), getProductsByCategory(slug)]);

  if (!category) {
    return { notFound: true };
  }

  return {
    props: { category, products },
    revalidate: 300
  };
};

export default function CategoryPage({
  category,
  products
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MainLayout>
      <Seo
        title={`${category.name} - Selection premium`}
        description={category.description}
        pathname={`/categorie/${category.slug}`}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm uppercase tracking-[0.3em] text-bordeaux/65">Categorie</p>
        <h1 className="mt-3 font-display text-4xl text-ink">{category.name}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-charcoal/75">{category.description}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
