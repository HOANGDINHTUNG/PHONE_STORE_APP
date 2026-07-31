import { Check, Clock3, Headphones, MapPin } from "lucide-react";
import { AccountShell, Panel } from "../components/AccountShell";

const timeline = [
  ["Dự kiến giao hàng", "14:00 - 18:00, 24/10", "Shipper đang trên đường giao đến bạn."],
  ["Đã đến kho phân loại HCM - Tân Bình", "08:45, 23/10", "Đơn hàng đang chờ phân tuyến."],
  ["Đang vận chuyển liên tỉnh", "22:30, 22/10", "Rời kho tổng Hà Nội, đang hướng về TP. Hồ Chí Minh."],
  ["PinkPhone đã đóng gói", "15:20, 22/10", "Kiểm tra kỹ thuật và đóng gói chống sốc hoàn tất."],
] as const;

export function OrderTrackingPage() {
  return (
    <AccountShell title="Theo dõi đơn hàng" description="Cập nhật hành trình của đơn #PP-99238 theo thời gian thực.">
      <Panel className="mb-5 flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h2 className="text-lg font-extrabold">Đơn hàng #PP-99238</h2>
          <p className="mt-1 text-sm text-muted">Sẵn sàng giao tới bạn vào ngày mai</p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="text-muted">Đơn vị vận chuyển</p>
          <strong className="text-primary">Giao Hàng Nhanh · #GHN123456789</strong>
        </div>
      </Panel>
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_19rem]">
        <Panel className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">Hành trình đơn hàng</h2>
            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-primary">Đang vận chuyển</span>
          </div>
          <div className="mt-7 space-y-0">
            {timeline.map(([title, time, note], index) => (
              <div key={title} className="grid grid-cols-[2rem_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <div className={`grid size-7 place-items-center rounded-full ${index === 0 ? "bg-primary text-white" : "bg-neutral-soft text-muted"}`}>
                    {index === 0 ? <Clock3 size={15} /> : <Check size={15} />}
                  </div>
                  {index < timeline.length - 1 && <div className="h-20 w-px bg-border" />}
                </div>
                <div>
                  <div className="flex flex-wrap justify-between gap-2"><strong>{title}</strong><span className="text-xs font-bold text-primary">{time}</span></div>
                  <p className="mt-1 text-sm text-muted">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <aside className="space-y-4">
          <Panel className="p-5">
            <h2 className="flex items-center gap-2 font-extrabold"><MapPin size={18} className="text-primary" /> Người nhận</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-muted">Họ và tên</dt><dd className="font-bold">Nguyễn Minh Anh</dd></div>
              <div><dt className="text-muted">Số điện thoại</dt><dd className="font-bold">090 *** 1234</dd></div>
              <div><dt className="text-muted">Địa chỉ</dt><dd className="font-bold">123 Cách Mạng Tháng 8, Quận 3, TP.HCM</dd></div>
            </dl>
          </Panel>
          <Panel className="overflow-hidden">
            <div className="grid h-40 place-items-center bg-neutral-soft">
              <div className="text-center text-muted"><MapPin className="mx-auto text-primary" /><p className="mt-2 text-sm font-bold">Bản đồ hành trình</p></div>
            </div>
          </Panel>
          <section className="rounded-2xl bg-primary p-5 text-white">
            <Headphones size={23} />
            <h2 className="mt-3 font-extrabold">Cần giúp đỡ với đơn hàng?</h2>
            <p className="mt-2 text-sm leading-6 text-white/85">Đội ngũ PinkPhone sẵn sàng giải đáp 24/7.</p>
            <a href="tel:18006601" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white font-bold text-primary">Liên hệ hỗ trợ</a>
          </section>
        </aside>
      </div>
    </AccountShell>
  );
}
