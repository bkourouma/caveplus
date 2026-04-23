import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function NotFoundPage() {
  return (
    <MainLayout>
      <Seo
        title="Page introuvable"
        description="La page demandee n'existe pas ou a ete deplacee."
        pathname="/404"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="glass-card rounded-[28px] border border-mist p-8">
          <p className="text-sm uppercase tracking-[0.32em] text-bordeaux/65">Erreur 404</p>
          <h1 className="mt-4 font-display text-4xl text-ink">Cette bouteille n&apos;est plus sur l&apos;etagere</h1>
          <p className="mt-4 text-base leading-7 text-charcoal/72">
            Retournez vers le catalogue premium ou explorez nos categories phares.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalogue" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream">
              Retour au catalogue
            </Link>
            <Link href="/categorie/champagnes" className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink">
              Voir les champagnes
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
