import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function AdminSettingsPage() {
  return (
    <MainLayout>
      <Seo
        title="Parametres admin"
        description="Configuration des integrations et reglages operationnels."
        pathname="/admin/parametres"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Parametres</h1>
        <div className="mt-8 grid gap-4">
          {[
            "Authentification Google / credentials",
            "Paiement PayHubSecure",
            "Session WaSender",
            "Emails transactionnels",
            "SEO et domaine canonique"
          ].map((item) => (
            <div key={item} className="glass-card rounded-[20px] border border-mist p-5 text-sm text-charcoal/75">
              {item}
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
