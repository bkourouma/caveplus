import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AdminPageIntro } from "@/components/admin/AdminPageIntro";
import { AdminTable } from "@/components/admin/AdminTable";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { getAdminProducts } from "@/lib/server/admin";
import { formatPrice } from "@/lib/utils";

type AdminProductRow = {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  stock: number;
  producer: string;
};

type AdminProductsPageProps = {
  rows: AdminProductRow[];
};

export const getServerSideProps: GetServerSideProps<AdminProductsPageProps> = async () => ({
  props: {
    rows: await getAdminProducts()
  }
});

export default function AdminProductsPage({
  rows
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Admin produits"
        description="Gestion catalogue, prix, stock et visibilite produits."
        pathname="/admin/produits"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <AdminPageIntro
          eyebrow="Catalogue"
          title="Produits"
          description="Base produit prete pour le CRUD admin: prix, stock, SKU, mises en avant et enrichissement SEO."
        />

        <AdminTable
          rows={rows}
          columns={[
            { key: "name", label: "Produit" },
            { key: "categoryName", label: "Categorie" },
            {
              key: "price",
              label: "Prix",
              render: (value) => <span className="font-medium text-gold">{formatPrice(Number(value))}</span>
            },
            { key: "stock", label: "Stock" },
            { key: "producer", label: "Maison" }
          ]}
        />
      </section>
    </MainLayout>
  );
}
