import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AdminPageIntro } from "@/components/admin/AdminPageIntro";
import { AdminTable } from "@/components/admin/AdminTable";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { getAdminProducts } from "@/lib/server/admin";

type AdminStockRow = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  alert: string;
};

type AdminStocksPageProps = {
  rows: AdminStockRow[];
};

export const getServerSideProps: GetServerSideProps<AdminStocksPageProps> = async () => {
  const products = await getAdminProducts();

  return {
    props: {
      rows: products.map((product: { id: string; name: string; stock: number }) => ({
        id: product.id,
        name: product.name,
        sku: product.id.slice(0, 12).toUpperCase(),
        stock: product.stock,
        alert: product.stock <= 5 ? "Stock faible" : "OK"
      }))
    }
  };
};

export default function AdminStocksPage({
  rows
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Admin stocks"
        description="Suivi du niveau de stock et des alertes produits."
        pathname="/admin/stocks"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <AdminPageIntro
          eyebrow="Operations"
          title="Stocks"
          description="Une vue simple pour anticiper les ruptures et enclencher les ajustements de stock."
        />

        <AdminTable
          rows={rows}
          columns={[
            { key: "name", label: "Produit" },
            { key: "sku", label: "SKU" },
            { key: "stock", label: "Quantite" },
            {
              key: "alert",
              label: "Alerte",
              render: (value) => (
                <span className={value === "Stock faible" ? "text-warning" : "text-success"}>{String(value)}</span>
              )
            }
          ]}
        />
      </section>
    </MainLayout>
  );
}
