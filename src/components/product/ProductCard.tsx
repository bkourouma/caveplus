import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="glass-card gold-ring overflow-hidden rounded-[20px]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-bordeaux px-3 py-1 text-xs font-medium text-cream">
          {product.categoryName}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-display text-xl text-ink">{product.name}</h3>
          <p className="mt-1 text-sm leading-6 text-charcoal/75">{product.shortDesc}</p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-gold">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-xs text-charcoal/50 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <Link
            href={`/produit/${product.slug}`}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition hover:bg-bordeaux"
          >
            Voir
          </Link>
        </div>
      </div>
    </article>
  );
}
