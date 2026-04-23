import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AdminPageIntro } from "@/components/admin/AdminPageIntro";
import { AdminTable } from "@/components/admin/AdminTable";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { getAdminCategories } from "@/lib/server/admin";

type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

type AdminCategoriesPageProps = {
  rows: AdminCategoryRow[];
};

export const getServerSideProps: GetServerSideProps<AdminCategoriesPageProps> = async () => ({
  props: {
    rows: await getAdminCategories()
  }
});

export default function AdminCategoriesPage({
  rows
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Seo
        title="Admin categories"
        description="Organisation du catalogue et contenus SEO des categories."
        pathname="/admin/categories"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <AdminPageIntro
          eyebrow="Catalogue"
          title="Categories"
          description="Structure de navigation, descriptions editoriales et futur SEO editable par categorie."
        />

        <AdminTable
          rows={rows}
          columns={[
            { key: "name", label: "Categorie" },
            { key: "slug", label: "Slug" },
            { key: "description", label: "Description" }
          ]}
        />
      </section>
    </MainLayout>
  );
}
