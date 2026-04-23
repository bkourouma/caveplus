import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function AdminStatsPage() {
  return (
    <MainLayout>
      <Seo
        title="Statistiques admin"
        description="KPIs de pilotage CavePlus pour ventes, catalogue et CRM."
        pathname="/admin/statistiques"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Statistiques</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <AdminStatCard label="Taux conversion" value="3.8%" hint="Objectif mobile-first en progression." />
          <AdminStatCard label="Panier moyen" value="78 500 FCFA" hint="Haut potentiel corporate et cadeaux." />
          <AdminStatCard label="Top categorie" value="Champagnes" hint="Trafic organique et demandes WhatsApp." />
        </div>
      </section>
    </MainLayout>
  );
}
