import Link from "next/link";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

const links = [
  { label: "Produits", href: "/admin/produits" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Commandes", href: "/admin/commandes" },
  { label: "Stocks", href: "/admin/stocks" },
  { label: "Clients", href: "/admin/clients" },
  { label: "WhatsApp", href: "/admin/whatsapp" },
  { label: "CMS", href: "/admin/cms" },
  { label: "Statistiques", href: "/admin/statistiques" },
  { label: "Parametres", href: "/admin/parametres" }
];

export default function AdminPage() {
  return (
    <MainLayout>
      <Seo
        title="Dashboard admin"
        description="Pilotez produits, commandes, stock et CRM WhatsApp depuis le back-office CavePlus."
        pathname="/admin"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-bordeaux/65">Back-office</p>
            <h1 className="mt-3 font-display text-4xl text-ink">Dashboard CavePlus</h1>
          </div>
          <Link href="/admin/statistiques" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream">
            Voir les stats
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <AdminStatCard label="CA du jour" value="945 000 FCFA" hint="Inclut paiements PayHub valides." />
          <AdminStatCard label="Commandes" value="18" hint="6 en preparation, 12 payees." />
          <AdminStatCard label="Broadcast" value="1 248" hint="Contacts opt-in WhatsApp." />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="glass-card rounded-[20px] border border-mist p-5">
              <p className="font-display text-2xl text-ink">{link.label}</p>
              <p className="mt-2 text-sm leading-6 text-charcoal/72">
                Espace prevu dans la structure MVP pour la gestion non-technique.
              </p>
            </Link>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
