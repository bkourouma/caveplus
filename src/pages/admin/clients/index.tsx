import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AdminPageIntro } from "@/components/admin/AdminPageIntro";
import { AdminTable } from "@/components/admin/AdminTable";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { getAdminCustomers } from "@/lib/server/admin";
import { formatPrice } from "@/lib/utils";
import type { AdminCustomer } from "@/types/admin";

type AdminClientsPageProps = {
  rows: AdminCustomer[];
};

export const getServerSideProps: GetServerSideProps<AdminClientsPageProps> = async () => ({
  props: {
    rows: await getAdminCustomers()
  }
});

export default function AdminClientsPage({
  rows
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Admin clients"
        description="Base clients, segmentation et suivi WhatsApp opt-in."
        pathname="/admin/clients"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <AdminPageIntro
          eyebrow="CRM"
          title="Clients"
          description="L'annuaire client du back-office, avec historique simplifie et statut d'opt-in WhatsApp."
        />

        <AdminTable
          rows={rows}
          columns={[
            { key: "name", label: "Client" },
            { key: "email", label: "Email" },
            { key: "totalOrders", label: "Commandes" },
            {
              key: "totalSpent",
              label: "Depense",
              render: (value) => <span className="font-medium text-gold">{formatPrice(Number(value))}</span>
            },
            {
              key: "whatsappOptIn",
              label: "WhatsApp",
              render: (value) => <span>{value ? "Opt-in" : "Opt-out"}</span>
            }
          ]}
        />
      </section>
    </MainLayout>
  );
}
