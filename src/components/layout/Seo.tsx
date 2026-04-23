import Head from "next/head";
import { buildCanonical } from "@/lib/utils";

type SeoProps = {
  title: string;
  description: string;
  pathname: string;
  imageUrl?: string;
  robots?: string;
  type?: "website" | "product" | "article";
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function Seo({
  title,
  description,
  pathname,
  imageUrl = "https://caveplus.ci/og-cover.jpg",
  robots = "index,follow",
  type = "website",
  jsonLd
}: SeoProps) {
  const canonical = buildCanonical(pathname);
  const fullTitle = `${title} - CavePlus`;
  const jsonLdList = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robots} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="CavePlus" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {jsonLdList.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
}
