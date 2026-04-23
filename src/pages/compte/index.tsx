import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { AccountActions } from "@/components/account/AccountActions";
import { CartMergeOnMount } from "@/components/cart/CartMergeOnMount";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { authOptions } from "@/lib/auth";

type AccountPageProps = {
  customerName: string | null;
  customerEmail: string | null;
};

export const getServerSideProps: GetServerSideProps<AccountPageProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false
      }
    };
  }

  return {
    props: {
      customerName: session?.user?.name ?? null,
      customerEmail: session?.user?.email ?? null
    }
  };
};

export default function AccountPage({
  customerName,
  customerEmail
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      {customerEmail ? <CartMergeOnMount /> : null}
      <Seo
        title="Mon compte"
        description="Consultez votre espace client CavePlus."
        pathname="/compte"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl text-ink">Mon compte</h1>
          <AccountActions />
        </div>
        <div className="mt-4 rounded-[20px] border border-mist bg-white/70 p-5 text-sm text-charcoal/74">
          <p className="font-medium text-ink">{customerName ?? "Client CavePlus"}</p>
          <p className="mt-1">{customerEmail}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { href: "/compte/commandes", title: "Commandes", text: "Suivre vos paiements et livraisons." },
            { href: "/compte/profil", title: "Profil", text: "Coordonnees, WhatsApp et adresses." },
            { href: "/panier", title: "Panier", text: "Retrouver votre panier synchronise avec votre session." }
          ].map((card) => (
            <Link key={card.href} href={card.href} className="glass-card rounded-[20px] border border-mist p-5">
              <p className="font-display text-2xl text-ink">{card.title}</p>
              <p className="mt-3 text-sm leading-6 text-charcoal/74">{card.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
