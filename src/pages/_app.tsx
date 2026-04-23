import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Inter, Outfit } from "next/font/google";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${outfit.variable} ${inter.variable}`}>
      <SessionProvider session={"session" in pageProps ? pageProps.session : undefined}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
}
