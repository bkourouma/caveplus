import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function CheckoutReturnPage() {
  return (
    <MainLayout>
      <Seo
        title="Retour paiement"
        description="Confirmation de retour PayHubSecure pour votre commande."
        pathname="/checkout/retour"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="glass-card rounded-[28px] border border-mist p-8">
          <p className="text-sm uppercase tracking-[0.32em] text-success/70">Paiement</p>
          <h1 className="mt-4 font-display text-4xl text-ink">Transaction recue</h1>
          <p className="mt-4 text-base leading-7 text-charcoal/72">
            Cette page sert de retour PayHubSecure. Dans l&apos;integration finale, le statut de commande
            sera confirme via IPN puis notifie sur WhatsApp.
          </p>
          <Link href="/compte/commandes" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream">
            Voir mes commandes
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
