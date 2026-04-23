import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AdminPageIntro } from "@/components/admin/AdminPageIntro";
import { AdminTable } from "@/components/admin/AdminTable";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { getAdminCampaigns, getAdminStats } from "@/lib/server/admin";
import type { BroadcastCampaign } from "@/types/admin";

type WhatsAppPageProps = {
  rows: BroadcastCampaign[];
  stats: {
    whatsappAudience: number;
  };
};

export const getServerSideProps: GetServerSideProps<WhatsAppPageProps> = async () => {
  const [rows, stats] = await Promise.all([getAdminCampaigns(), getAdminStats()]);

  return {
    props: {
      rows,
      stats
    }
  };
};

export default function AdminWhatsAppPage({
  rows,
  stats
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Admin WhatsApp"
        description="Campagnes, relances et operation transactionnelle WhatsApp."
        pathname="/admin/whatsapp"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <AdminPageIntro
          eyebrow="CRM"
          title="WhatsApp"
          description="Module marketing et transactionnel pour messages individuels, broadcasts et suivi d'audience."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-[20px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-charcoal/55">Audience opt-in</p>
            <p className="mt-4 font-display text-3xl text-ink">{stats.whatsappAudience}</p>
          </div>
          <div className="glass-card rounded-[20px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-charcoal/55">Templates actifs</p>
            <p className="mt-4 font-display text-3xl text-ink">12</p>
          </div>
          <div className="glass-card rounded-[20px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-charcoal/55">Session provider</p>
            <p className="mt-4 font-display text-3xl text-ink">WaSender</p>
          </div>
        </div>

        <AdminTable
          rows={rows}
          columns={[
            { key: "title", label: "Campagne" },
            { key: "audience", label: "Audience" },
            { key: "scheduledFor", label: "Planifiee pour" },
            { key: "status", label: "Statut" }
          ]}
        />
      </section>
    </MainLayout>
  );
}
