import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AdminPageIntro } from "@/components/admin/AdminPageIntro";
import { AdminTable } from "@/components/admin/AdminTable";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { getAdminCmsBlocks } from "@/lib/server/admin";
import type { CmsBlock } from "@/types/admin";

type AdminCmsPageProps = {
  rows: CmsBlock[];
};

export const getServerSideProps: GetServerSideProps<AdminCmsPageProps> = async () => ({
  props: {
    rows: await getAdminCmsBlocks()
  }
});

export default function AdminCmsPage({
  rows
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Admin CMS"
        description="Edition des pages, blocs marketing et contenus SEO."
        pathname="/admin/cms"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <AdminPageIntro
          eyebrow="Contenu"
          title="CMS"
          description="Espace dedie aux pages editoriales, au hero d'accueil et aux contenus SEO categories/produits."
        />

        <AdminTable
          rows={rows}
          columns={[
            { key: "title", label: "Bloc" },
            { key: "type", label: "Type" },
            { key: "updatedAt", label: "Mis a jour" },
            { key: "status", label: "Statut" }
          ]}
        />
      </section>
    </MainLayout>
  );
}
