import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { ProfileForm } from "@/components/account/ProfileForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { authOptions } from "@/lib/auth";
import { getAccountProfileByEmail } from "@/lib/server/account";

type ProfilePageProps = {
  profile: {
    name: string;
    email: string;
    phone: string;
    whatsappOptIn: boolean;
  };
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false
      }
    };
  }

  const profile = await getAccountProfileByEmail(session.user.email);

  return {
    props: {
      profile: profile ?? {
        name: session.user.name ?? "Client CavePlus",
        email: session.user.email,
        phone: "",
        whatsappOptIn: true
      }
    }
  };
};

export default function ProfilePage({ profile }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Mon profil"
        description="Gerez votre profil client et vos preferences WhatsApp."
        pathname="/compte/profil"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Profil client</h1>
        <ProfileForm initialProfile={profile} />
      </section>
    </MainLayout>
  );
}
