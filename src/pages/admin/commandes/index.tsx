import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AdminPageIntro } from "@/components/admin/AdminPageIntro";
import { AdminTable } from "@/components/admin/AdminTable";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { getAdminOrders } from "@/lib/server/admin";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/types/admin";

type AdminOrdersPageProps = {
  rows: AdminOrder[];
};

export const getServerSideProps: GetServerSideProps<AdminOrdersPageProps> = async () => ({
  props: {
    rows: await getAdminOrders()
  }
});

export default function AdminOrdersPage({
  rows
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Admin commandes"
        description="Pilotage du cycle de commande, du paiement a la livraison."
        pathname="/admin/commandes"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <AdminPageIntro
          eyebrow="Operations"
          title="Commandes"
          description="Vision rapide sur l'etat des commandes, des paiements PayHub et des contacts clients WhatsApp."
        />

        <AdminTable
          rows={rows}
          columns={[
            { key: "id", label: "Commande" },
            { key: "customerName", label: "Client" },
            {
              key: "total",
              label: "Total",
              render: (value) => <span className="font-medium text-gold">{formatPrice(Number(value))}</span>
            },
            { key: "status", label: "Statut" },
            { key: "paymentStatus", label: "Paiement" }
          ]}
        />
      </section>
    </MainLayout>
  );
}
