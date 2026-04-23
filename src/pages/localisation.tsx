import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function LocationPage() {
  return (
    <MainLayout>
      <Seo
        title="Localisation"
        description="Retrouvez CavePlus a Abidjan et consultez nos zones de livraison."
        pathname="/localisation"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "CavePlus",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Abidjan",
            addressCountry: "CI"
          },
          telephone: "+2250700000000"
        }}
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Localisation & livraison</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="glass-card rounded-[24px] border border-mist p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-bordeaux/65">Showroom</p>
            <p className="mt-3 font-display text-2xl text-ink">Cocody, Abidjan</p>
            <p className="mt-3 text-sm leading-7 text-charcoal/74">
              Adresse precise a confirmer selon le local commercial final. La page est deja prete pour
              accueillir les donnees LocalBusiness et les horaires.
            </p>
          </div>
          <div className="glass-card rounded-[24px] border border-mist p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-bordeaux/65">Zones</p>
            <p className="mt-3 font-display text-2xl text-ink">Cocody, Plateau, Marcory, Zone 4</p>
            <p className="mt-3 text-sm leading-7 text-charcoal/74">
              Livraison premium, support WhatsApp et suivi de commande pour les achats particuliers et corporate.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
