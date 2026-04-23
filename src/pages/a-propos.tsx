import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function AboutPage() {
  return (
    <MainLayout>
      <Seo
        title="A propos"
        description="Decouvrez la vision CavePlus, cave premium et mobile-first pour la Cote d'Ivoire."
        pathname="/a-propos"
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-sm uppercase tracking-[0.32em] text-bordeaux/65">Maison</p>
        <h1 className="mt-4 font-display text-4xl text-ink">Une cave premium ancree dans le service</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-charcoal/78">
          <p>
            CavePlus combine selection haut de gamme, experience mobile-first et operations modernes
            pour servir les particuliers comme les entreprises.
          </p>
          <p>
            Le projet est pense pour une exploitation locale robuste: paiement mobile money,
            confirmations WhatsApp, gestion admin simplifiee et SEO natif des pages catalogue.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
