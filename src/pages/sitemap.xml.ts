import type { GetServerSideProps } from "next";
import { getSitemapData } from "@/lib/server/catalog";
import { getSiteUrl } from "@/lib/utils";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = getSiteUrl();
  const staticPages = ["/", "/catalogue", "/a-propos", "/localisation"];
  const { categories, products } = await getSitemapData();
  const urls = [
    ...staticPages,
    ...categories.map((category) => `/categorie/${category.slug}`),
    ...products.filter((product) => product.stock >= 0).map((product) => `/produit/${product.slug}`)
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url><loc>${baseUrl}${url}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`
  )
  .join("")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
