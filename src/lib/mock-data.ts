import type { CartItem, Category, Product } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "cat-champagnes",
    slug: "champagnes",
    name: "Champagnes",
    description: "Bulles fines, notes d'agrumes et finale cremeuse pour les toasts et receptions.",
    imageUrl:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-whiskies",
    slug: "whiskies",
    name: "Whiskies",
    description: "Boise elegant, epices douces et belle longueur pour la degustation et les cadeaux.",
    imageUrl:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-vins",
    slug: "vins",
    name: "Vins",
    description: "Rouges veloutes, blancs tendus et roses delicats pour la table, la cave et le partage.",
    imageUrl:
      "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-spiritueux-liqueurs",
    slug: "spiritueux-liqueurs",
    name: "Spiritueux & Liqueurs",
    description: "Whisky, cognac, champagne, vodka et autres flacons choisis pour offrir ou deguster.",
    imageUrl:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-bieres-craft",
    slug: "bieres-craft",
    name: "Bieres & Craft",
    description: "Locales, importees et artisanales pour l'apero, les soirees et les tables conviviales.",
    imageUrl:
      "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-eaux-boissons",
    slug: "eaux-boissons",
    name: "Eaux & Boissons",
    description: "Plate, petillante et boissons fraiches pour accompagner vos commandes et receptions.",
    imageUrl:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-douceurs-sucrees",
    slug: "douceurs-sucrees",
    name: "Douceurs Sucrees",
    description: "Bonbons, chocolats et confiseries pour les cadeaux, buffets et petites envies gourmandes.",
    imageUrl:
      "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-aperitifs-sales",
    slug: "aperitifs-sales",
    name: "Aperitifs Sales",
    description: "Chips, cacahuetes et snacks croquants pour completer un plateau ou un moment partage.",
    imageUrl:
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-service-accessoires",
    slug: "service-accessoires",
    name: "Service & Accessoires",
    description: "Tire-bouchons, carafes, verres et essentiels pour servir chaque bouteille avec style.",
    imageUrl:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-coffrets-packs",
    slug: "coffrets-packs",
    name: "Coffrets & Packs",
    description: "Idees cadeaux, assortiments et packs promo penses pour faire plaisir ou stocker malin.",
    imageUrl:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cat-epicerie-divers",
    slug: "epicerie-divers",
    name: "Epicerie & Divers",
    description: "Une selection complementaire pour retrouver facilement les produits hors cave classique.",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
  }
];

export const products: Product[] = [
  {
    id: "prod-moet",
    slug: "champagne-moet-chandon-brut-imperial",
    name: "Moet & Chandon Brut Imperial",
    shortDesc: "Bulles fines, fruits blancs et touche briochee.",
    description:
      "Une cuvee lumineuse aux notes de pomme, d'agrumes et de fruits blancs, parfaite pour les celebrations raffinees et les grands toasts.",
    price: 49900,
    compareAtPrice: 54500,
    stock: 12,
    volumeMl: 750,
    alcoholPct: 12,
    origin: "France",
    producer: "Moet & Chandon",
    imageUrl:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "champagnes",
    categoryName: "Champagnes",
    isFeatured: true
  },
  {
    id: "prod-hennessy",
    slug: "cognac-hennessy-vs",
    name: "Hennessy VS",
    shortDesc: "Texture ronde, epices douces et finale vanillee.",
    description:
      "Une bouteille signature pour les amateurs de spiritueux premium, avec une bouche souple et chaleureuse ideale pour les cadeaux et la degustation.",
    price: 45900,
    stock: 18,
    volumeMl: 700,
    alcoholPct: 40,
    origin: "France",
    producer: "Hennessy",
    imageUrl:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "whiskies",
    categoryName: "Whiskies",
    isFeatured: true
  },
  {
    id: "prod-margaux",
    slug: "chateau-margaux-premier-cru",
    name: "Chateau Margaux Premier Cru",
    shortDesc: "Cassis noir, violette, tanins soyeux et grande longueur.",
    description:
      "Grand Bordeaux profond et veloute, a la finale persistante et au potentiel de garde remarquable pour les amateurs de grands rouges.",
    price: 189000,
    stock: 4,
    volumeMl: 750,
    alcoholPct: 13.5,
    origin: "France",
    producer: "Chateau Margaux",
    vintage: 2018,
    imageUrl:
      "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "vins",
    categoryName: "Vins",
    isFeatured: true
  },
  {
    id: "prod-ruinart",
    slug: "champagne-ruinart-blanc-de-blancs",
    name: "Ruinart Blanc de Blancs",
    shortDesc: "Chardonnay pur, citron confit et craie delicate.",
    description: "Une cuvee precise et aerienne, ideale pour receptions privees, aperitifs elegants et accords marins.",
    price: 68900,
    stock: 6,
    volumeMl: 750,
    alcoholPct: 12.5,
    origin: "France",
    producer: "Ruinart",
    imageUrl:
      "https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "champagnes",
    categoryName: "Champagnes"
  }
];

export const mockCart: CartItem[] = [
  {
    product: products[0],
    quantity: 1
  },
  {
    product: products[1],
    quantity: 2
  }
];
