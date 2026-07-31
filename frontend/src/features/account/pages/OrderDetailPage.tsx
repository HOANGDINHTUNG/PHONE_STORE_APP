import { Check, CreditCard, MapPin, PackageCheck, Truck } from "lucide-react";
import { AccountShell, Panel } from "../components/AccountShell";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";

export function OrderDetailPage() {
  return (
    <AccountShell
      title="Chi tiết đơn hàng"
      description="Mã đơn #PP123-001 · Ngày đặt 15/10/2024 lúc 14:30"
      actions={<span className="rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-white">Đang giao</span>}
    >
      <Panel className="p-5 sm:p-6">
        <div className="grid grid-cols-4 gap-2">
          {[
            [PackageCheck, "Đặt hàng"],
            [Check, "Xác nhận"],
            [Truck, "Đang giao"],
            [MapPin, "Đã giao"],
          ].map(([Icon, label], index) => {
            const StepIcon = Icon as typeof Truck;
            return (
              <div key={String(label)} className="relative text-center">
                <div className={`mx-auto grid size-10 place-items-center rounded-full ${index < 3 ? "bg-primary text-white" : "bg-neutral-soft text-muted"}`}>
                  <StepIcon size={19} />
                </div>
                <p className={`mt-2 text-xs font-bold ${index === 2 ? "text-primary" : "text-muted"}`}>{String(label)}</p>
                {index < 3 && <span className={`absolute left-[calc(50%+1.25rem)] top-5 h-px w-[calc(100%-2.5rem)] ${index < 2 ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <InfoPanel icon={MapPin} title="Thông tin nhận hàng">
          <strong>Nguyễn Minh Anh</strong>
          <p>090 123 4567</p>
          <p>123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</p>
        </InfoPanel>
        <InfoPanel icon={CreditCard} title="Thanh toán & Giao hàng">
          <p className="flex justify-between gap-4"><span>Phương thức</span><strong>Thẻ tín dụng (VISA)</strong></p>
          <p className="flex justify-between gap-4"><span>Trạng thái</span><strong className="text-success">Đã thanh toán</strong></p>
          <p className="flex justify-between gap-4"><span>Đơn vị vận chuyển</span><strong>PinkExpress Premium</strong></p>
        </InfoPanel>
      </div>

      <Panel className="mt-5 overflow-hidden">
        <h2 className="border-b border-border p-5 text-lg font-extrabold">Điện thoại trong đơn</h2>
        <OrderPhone index={0} name="iPhone 16 Pro Max 256GB - Pink Titanium" price="29.990.000đ" />
        <OrderPhone index={1} name="Samsung Galaxy S24 Ultra 512GB" price="18.500.000đ" />
      </Panel>

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_15rem]">
        <Panel className="p-5">
          <dl className="space-y-3 text-sm">
            <Row label="Tạm tính (2 điện thoại)" value="48.490.000đ" />
            <Row label="Giảm giá khuyến mãi" value="-2.500.000đ" highlight />
            <Row label="Phí vận chuyển" value="Miễn phí" highlight />
            <Row label="Tổng thanh toán" value="45.990.000đ" total />
          </dl>
        </Panel>
        <div className="grid content-start gap-2">
          <button type="button" className="min-h-12 rounded-xl bg-primary font-bold text-white">Mua lại đơn này</button>
          <button type="button" className="min-h-12 rounded-xl border border-primary font-bold text-primary">Hủy đơn hàng</button>
          <p className="text-center text-xs text-muted">Chỉ có thể hủy khi đơn chưa bàn giao vận chuyển.</p>
        </div>
      </div>
    </AccountShell>
  );
}

function InfoPanel({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <Panel className="p-5">
      <h2 className="flex items-center gap-2 font-extrabold"><Icon size={19} className="text-primary" /> {title}</h2>
      <div className="mt-4 space-y-2 text-sm leading-6 text-muted">{children}</div>
    </Panel>
  );
}

function OrderPhone({ index, name, price }: { index: number; name: string; price: string }) {
  return (
    <article className="grid gap-4 border-b border-border p-5 last:border-0 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft"><PhoneStripImage index={index} /></div>
      <div><h3 className="font-extrabold">{name}</h3><p className="mt-1 text-xs text-muted">Màu sắc: Hồng · Bảo hành 24 tháng</p></div>
      <div className="sm:text-right"><strong className="text-lg text-primary">{price}</strong><p className="text-xs text-muted">Số lượng: 01</p></div>
    </article>
  );
}

function Row({ label, value, highlight, total }: { label: string; value: string; highlight?: boolean; total?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${total ? "mt-4 border-t border-border pt-4 text-xl" : ""}`}>
      <dt className={total ? "font-extrabold" : "text-muted"}>{label}</dt>
      <dd className={`${total ? "font-black text-primary" : "font-semibold"} ${highlight ? "text-success" : ""}`}>{value}</dd>
    </div>
  );
}

