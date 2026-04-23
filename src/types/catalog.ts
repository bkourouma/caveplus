export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  volumeMl?: number;
  alcoholPct?: number;
  origin?: string;
  vintage?: number;
  producer?: string;
  imageUrl: string;
  categorySlug: string;
  categoryName: string;
  isFeatured?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
