import Image from "next/image";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import {
  ArrowUpRight,
  Beer,
  Candy,
  Droplets,
  Gift,
  Package,
  Sparkles,
  UtensilsCrossed,
  Wine,
  type LucideIcon
} from "lucide-react";
import { HeroSlideshow, type HeroSlide } from "@/components/home/HeroSlideshow";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getFeaturedProducts } from "@/lib/server/catalog";
import type { Category, Product } from "@/types/catalog";

type HomePageProps = {
  categories: Category[];
  featuredProducts: Product[];
};

const categoryIcons: Record<string, LucideIcon> = {
  champagnes: Sparkles,
  whiskies: Wine,
  vins: Wine,
  "spiritueux-liqueurs": Sparkles,
  "bieres-craft": Beer,
  "eaux-boissons": Droplets,
  "douceurs-sucrees": Candy,
  "aperitifs-sales": UtensilsCrossed,
  "service-accessoires": Package,
  "coffrets-packs": Gift,
  "epicerie-divers": Package
};

function getCategoryIcon(slug: string) {
  return categoryIcons[slug] ?? Package;
}

const heroSlides: HeroSlide[] = [
  {
    src: "/assets/Images-hero/champagne-toast-celebration-friends-party-golden.jpg",
    alt: "Coupe de champagne levee pour un toast de celebration",
    label: "Notre selection",
    title: "Champagnes",
    accentTitle: "de celebration",
    description:
      "Bulles fines, fruits blancs et finale lumineuse pour accompagner mariages, anniversaires et tous les toasts qui meritent une bouteille memorable.",
    primaryHref: "/categorie/champagnes",
    primaryLabel: "Voir les champagnes",
    secondaryHref: "/catalogue",
    secondaryLabel: "Toute la cave"
  },
  {
    src: "/assets/Images-hero/wine-glasses-red-white-wine-bottles-luxury-tasting.png",
    alt: "Verres de vin rouge et blanc poses devant une selection de bouteilles",
    label: "Degustation",
    title: "Vins de table",
    accentTitle: "et de cave",
    description:
      "Rouges soyeux, blancs precis et cuvees expressives choisis pour les accords, la gastronomie et le plaisir de servir juste.",
    primaryHref: "/categorie/vins",
    primaryLabel: "Voir les vins",
    secondaryHref: "/catalogue",
    secondaryLabel: "Tous les produits"
  },
  {
    src: "/assets/Images-hero/luxury-dinner-party-friends-wine-celebration-elegant-event.png",
    alt: "Diner elegant entre amis autour d'une table et de bouteilles de vin",
    label: "Art de recevoir",
    title: "Diners",
    accentTitle: "et grands cadeaux",
    description:
      "Des bouteilles choisies pour faire sensation a table, offrir avec allure et prolonger la conversation autour de profils elegants et genereux.",
    primaryHref: "/catalogue",
    primaryLabel: "Explorer la cave",
    secondaryHref: "/a-propos",
    secondaryLabel: "Notre univers"
  },
  {
    src: "/assets/Images-hero/elderly-couple-romantic-dinner-50th-anniversary-wine-celebration.png",
    alt: "Couple celebrant un anniversaire autour d'un diner au vin",
    label: "Moments rares",
    title: "Vins de coeur",
    accentTitle: "pour les grandes dates",
    description:
      "Des bouteilles harmonieuses, soyeuses et profondes pour accompagner un repas intime, un anniversaire de mariage ou une soiree que l'on veut marquer.",
    primaryHref: "/categorie/vins",
    primaryLabel: "Voir les grands vins",
    secondaryHref: "/catalogue",
    secondaryLabel: "Selection complete"
  },
  {
    src: "/assets/Images-hero/luxury-spirits-store-interior-premium-whiskey-display.jpg",
    alt: "Rayon de spiritueux premium presente dans une cave elegante",
    label: "Spiritueux premium",
    title: "Spiritueux",
    accentTitle: "de caractere",
    description:
      "Whiskies, cognacs et flacons de degustation aux notes epicees, boisees et longues en bouche pour completer une cave exigeante.",
    primaryHref: "/catalogue",
    primaryLabel: "Voir la collection",
    secondaryHref: "/categorie/whiskies",
    secondaryLabel: "Whiskies & cognacs"
  }
];

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [categories, featuredProducts] = await Promise.all([getCategories(), getFeaturedProducts()]);

  return {
    props: {
      categories,
      featuredProducts
    },
    revalidate: 300
  };
};

export default function HomePage({
  categories,
  featuredProducts
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MainLayout>
      <Seo
        title="Cave a vins, champagnes et spiritueux a Abidjan"
        description="CavePlus propose une selection de vins, champagnes et spiritueux premium pensee pour les grandes tables, les cadeaux et les celebrations a Abidjan."
        pathname="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "CavePlus",
          url: "https://caveplus.allianceconsultants.net",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Abidjan",
            addressCountry: "CI"
          },
          telephone: "+2250700000000"
        }}
      />

      <HeroSlideshow slides={heroSlides} />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,242,233,0.96))] px-5 py-8 shadow-[0_24px_80px_rgba(11,11,11,0.08)] sm:px-8 sm:py-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-bordeaux/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.32em] text-bordeaux/65">
                Nos univers
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                Parcourez la cave par categorie
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-charcoal/72">
                Une navigation plus claire pour trouver rapidement la bonne bouteille, le bon
                cadeau ou l&apos;accompagnement adapte a chaque moment.
              </p>
            </div>

            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 self-start rounded-full border border-bordeaux/15 bg-white/75 px-5 py-3 text-sm font-medium text-ink transition hover:border-bordeaux/30 hover:bg-white"
            >
              Voir tout le catalogue
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);

              return (
                <Link
                  key={category.id}
                  href={`/categorie/${category.slug}`}
                  className="group relative overflow-hidden rounded-[28px] border border-white/80 bg-white/78 p-5 shadow-[0_18px_50px_rgba(11,11,11,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-gold/45 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/22 via-gold/10 to-bordeaux/10 text-bordeaux ring-1 ring-gold/20">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-mist bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-charcoal/55">
                      Explorer
                    </span>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-display text-[1.7rem] leading-tight text-ink">
                      {category.name}
                    </h3>
                    <p className="mt-3 max-w-[30ch] text-sm leading-6 text-charcoal/72">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-mist/80 pt-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-bordeaux/55">
                      {category.slug.replace(/-/g, " ")}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                      Voir
                      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  <div className="relative mt-5 h-24 overflow-hidden rounded-[20px] border border-mist/70">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-ink/10 to-bordeaux/25" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-bordeaux/65">
            Selection signature
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink">Bouteilles a decouvrir</h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
