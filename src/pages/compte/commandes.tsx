import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { authOptions } from "@/lib/auth";
import { getAccountOrdersByEmail } from "@/lib/server/account";
import { formatPrice } from "@/lib/utils";

type AccountOrder = {
  id: string;
  status: string;
  total: number;
  channel: string;
};

type OrdersPageProps = {
  orders: AccountOrder[];
};

export const getServerSideProps: GetServerSideProps<OrdersPageProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false
      }
    };
  }

  const items = await getAccountOrdersByEmail(session.user.email);

  return {
    props: {
      orders: items.slice(0, 8).map((item) => ({
        id: item.id,
        status: item.status,
        total: item.total,
        channel: item.channel
      }))
    }
  };
};

export default function OrdersPage({ orders }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Mes commandes"
        description="Retrouvez l'historique de vos commandes CavePlus."
        pathname="/compte/commandes"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Mes commandes</h1>
        {orders.length === 0 ? (
          <div className="mt-8 glass-card rounded-[20px] border border-mist p-6 text-sm leading-6 text-charcoal/74">
            Aucune commande pour le moment. Votre historique apparaitra ici apres votre premier achat.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="glass-card rounded-[20px] border border-mist p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl text-ink">{order.id}</p>
                    <p className="mt-1 text-sm text-charcoal/70">{order.channel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-charcoal/65">{order.status}</p>
                    <p className="mt-1 font-semibold text-gold">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
