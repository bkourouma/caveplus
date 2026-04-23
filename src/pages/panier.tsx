import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { CartItemsManager } from "@/components/cart/CartItemsManager";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { authOptions } from "@/lib/auth";
import { getCartIdFromRequest } from "@/lib/server/cart-session";
import { getCartItemsForIdentity } from "@/lib/server/catalog";
import type { CartItem } from "@/types/catalog";

type CartPageProps = {
  items: CartItem[];
};

export const getServerSideProps: GetServerSideProps<CartPageProps> = async (context) => {
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

export default function CartPage({ items }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Panier"
        description="Consultez votre panier CavePlus et preparez votre paiement premium."
        pathname="/panier"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <CartItemsManager initialItems={items} />
      </section>
    </MainLayout>
  );
}
