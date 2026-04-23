import type { PropsWithChildren } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="page-shell font-body">
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
