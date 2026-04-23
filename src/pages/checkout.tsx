import { useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { authOptions } from "@/lib/auth";
import { getCartIdFromRequest } from "@/lib/server/cart-session";
import { getCartItemsForIdentity } from "@/lib/server/catalog";
import type { CartItem } from "@/types/catalog";

type CheckoutPageProps = {
  items: CartItem[];
};

export const getServerSideProps: GetServerSideProps<CheckoutPageProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      items: await getCartItemsForIdentity({
        cartId: getCartIdFromRequest(context.req),
        userId: session?.user?.id
      })
    }
  };
};

export default function CheckoutPage({ items }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [customerName, setCustomerName] = useState("Client Demo");
  const [customerPhone, setCustomerPhone] = useState("+2250700000000");
  const [customerEmail, setCustomerEmail] = useState("client@caveplus.ci");
  const [deliveryNote, setDeliveryNote] = useState("Livraison Cocody, appeler avant passage.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          deliveryNote,
          returnUrl: `${window.location.origin}/checkout/retour`
        })
      });

      const payload = (await response.json()) as { paymentUrl?: string; error?: string };

      if (!response.ok || !payload.paymentUrl) {
        throw new Error(payload.error ?? "Le paiement n'a pas pu etre initialise.");
      }

      window.location.href = payload.paymentUrl;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Une erreur est survenue.");
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout>
      <Seo
        title="Checkout"
        description="Finalisez votre commande CavePlus avec paiement mobile money ou carte."
        pathname="/checkout"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="glass-card rounded-[24px] border border-mist p-6">
            <h1 className="font-display text-4xl text-ink">Paiement premium</h1>
            <p className="mt-3 text-sm leading-6 text-charcoal/72">
              Checkout mobile-first avec retour PayHubSecure, validation WhatsApp et recapitulatif
              de commande.
            </p>

            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm text-charcoal">
                Nom complet
                <input
                  className="h-12 rounded-xl border border-mist bg-white px-4"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm text-charcoal">
                Telephone WhatsApp
                <input
                  className="h-12 rounded-xl border border-mist bg-white px-4"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm text-charcoal">
                Email
                <input
                  className="h-12 rounded-xl border border-mist bg-white px-4"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm text-charcoal">
                Notes de livraison
                <textarea
                  className="min-h-28 rounded-xl border border-mist bg-white px-4 py-3"
                  value={deliveryNote}
                  onChange={(event) => setDeliveryNote(event.target.value)}
                />
              </label>
              {error ? <p className="text-sm text-error">{error}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="mt-3 rounded-full bg-gold px-6 py-4 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Redirection..." : "Payer via PayHubSecure"}
              </button>
            </form>
          </div>

          <OrderSummary items={items} />
        </div>
      </section>
    </MainLayout>
  );
}
