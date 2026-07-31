import { Breadcrumbs } from "../../storefront/components/Breadcrumbs";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";

export function ProductDetailLoadingPage() {
  return (
    <StorePageLayout title="Chi tiết sản phẩm (Đang tải...) - PinkPhone">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Breadcrumbs current="Đang tải sản phẩm..." />
        <div className="mt-6 animate-pulse">
          <section className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
            <div>
              <div className="aspect-[5/4] rounded-card bg-neutral-soft" />
              <div className="mt-3 grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="aspect-square rounded-xl bg-neutral-soft" />
                ))}
              </div>
            </div>
            <div className="grid content-start gap-4">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-11 w-4/5" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full" />
            </div>
          </section>

          <section className="py-14">
            <Skeleton className="mx-auto h-8 w-56" />
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-40 rounded-2xl" />
              ))}
            </div>
          </section>

          <section className="grid gap-8 pb-14 lg:grid-cols-[1fr_22rem]">
            <div className="grid gap-5">
              <Skeleton className="h-9 w-2/3" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="aspect-[16/9] rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </section>
        </div>
      </div>
    </StorePageLayout>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-xl bg-neutral-soft ${className}`} aria-hidden="true" />;
}
