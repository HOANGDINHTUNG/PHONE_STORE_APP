import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../../storefront/components/Breadcrumbs";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";

export function CartEmptyPage() {
  return (
    <StorePageLayout title="Giỏ hàng trống - PinkPhone">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <Breadcrumbs current="Giỏ hàng trống" parent="Mua sắm" />
        <section className="grid min-h-[28rem] place-items-center text-center">
          <div>
            <span className="mx-auto grid size-40 place-items-center rounded-full bg-surface-soft text-primary">
              <ShoppingBag size={76} strokeWidth={1.6} />
            </span>
            <h1 className="mt-7 text-3xl font-extrabold tracking-[-0.04em]">
              Giỏ hàng của bạn đang trống
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
              Hãy lựa chọn chiếc điện thoại phù hợp và quay lại đây để hoàn tất đơn hàng.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-primary px-7 text-sm font-bold text-white shadow-sm hover:bg-primary-strong"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </section>

        <section className="border-t border-border py-12" aria-labelledby="best-sellers-title">
          <div className="flex items-center justify-between gap-4">
            <h2 id="best-sellers-title" className="text-2xl font-extrabold">
              Điện thoại bán chạy
            </h2>
            <Link to="/#products" className="text-sm font-bold text-primary hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["PinkPhone 15 Pro Max", "29.490.000đ", 0],
              ["PinkPhone Galaxy Z", "15.990.000đ", 1],
              ["PinkPhone 15 Pink", "22.190.000đ", 2],
              ["PinkPhone 14 Ultra", "26.990.000đ", 4],
            ].map(([name, price, index]) => (
              <article key={name} className="rounded-2xl border border-border bg-white p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-soft">
                  <PhoneStripImage index={Number(index)} />
                </div>
                <h3 className="mt-4 font-bold">{name}</h3>
                <p className="mt-2 font-extrabold text-primary">{price}</p>
                <Link
                  to="/san-pham/pinkphone-ultra-x"
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-primary text-sm font-bold text-primary hover:bg-surface-soft"
                >
                  Xem điện thoại
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StorePageLayout>
  );
}
