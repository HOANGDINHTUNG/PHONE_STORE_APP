import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Breadcrumbs } from "../../storefront/components/Breadcrumbs";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";

type CartStatus = "error" | "loading";

export function CartStatusPage() {
  const [status, setStatus] = useState<CartStatus>("error");

  return (
    <StorePageLayout title="Giỏ hàng (Lỗi & Loading) - PinkPhone">
      <div className="mx-auto min-h-[42rem] max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <Breadcrumbs current="Trạng thái giỏ hàng" parent="Mua sắm" />
        <div className="mt-6 flex flex-wrap gap-2">
          {(["error", "loading"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                status === option ? "bg-primary text-white" : "border border-border bg-white"
              }`}
            >
              {option === "error" ? "Trạng thái lỗi" : "Trạng thái đang tải"}
            </button>
          ))}
        </div>

        {status === "error" ? <CartError onRetry={() => setStatus("loading")} /> : <CartLoading />}
      </div>
    </StorePageLayout>
  );
}

function CartError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div>
        <h1 className="text-3xl font-extrabold">Giỏ hàng của bạn</h1>
        <div className="mt-6 rounded-2xl border border-danger/30 bg-danger/5 p-5">
          <p className="flex items-center gap-3 font-bold text-danger">
            <AlertCircle size={20} /> Không thể tải đầy đủ thông tin giỏ hàng
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Kết nối đang không ổn định. Sản phẩm của bạn vẫn được giữ an toàn, hãy thử tải lại.
          </p>
          <Button className="mt-4" onClick={onRetry}>
            <RefreshCw size={17} /> Thử lại
          </Button>
        </div>
        <div className="mt-5 grid gap-4">
          <ErrorRow />
          <ErrorRow />
        </div>
      </div>
      <div className="h-fit rounded-2xl border border-border bg-white p-5">
        <h2 className="text-xl font-extrabold">Tổng đơn hàng</h2>
        <p className="mt-5 text-sm text-muted">Không thể tính tổng tiền lúc này.</p>
        <Button className="mt-5 w-full" disabled>Tiến hành thanh toán</Button>
      </div>
    </section>
  );
}

function CartLoading() {
  return (
    <section className="mt-8 animate-pulse grid gap-6 lg:grid-cols-[1fr_22rem]" aria-label="Đang tải giỏ hàng">
      <div>
        <Skeleton className="h-10 w-72" />
        <div className="mt-6 grid gap-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </section>
  );
}

function ErrorRow() {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-white p-5 opacity-60">
      <div className="size-28 rounded-xl bg-neutral-soft" />
      <div className="flex-1">
        <div className="h-5 w-2/5 rounded bg-neutral-soft" />
        <div className="mt-3 h-4 w-1/3 rounded bg-neutral-soft" />
        <div className="mt-8 h-10 w-32 rounded bg-neutral-soft" />
      </div>
    </div>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-xl bg-neutral-soft ${className}`} />;
}
