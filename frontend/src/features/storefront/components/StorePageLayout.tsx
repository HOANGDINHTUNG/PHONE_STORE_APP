import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { SiteFooter } from "../../home/components/SiteFooter";
import { SiteHeader } from "../../home/components/SiteHeader";

type StorePageLayoutProps = {
  children: ReactNode;
  title?: string;
};

export function StorePageLayout({ children, title = "PinkPhone" }: StorePageLayoutProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <SiteHeader search={search} onSearch={setSearch} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
