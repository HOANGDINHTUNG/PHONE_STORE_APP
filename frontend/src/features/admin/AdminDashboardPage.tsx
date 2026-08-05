import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  EllipsisVertical,
  Eye,
  PackageCheck,
  ShoppingCart,
  Warehouse,
} from "lucide-react";

const chartBars = [34, 46, 30, 62, 82, 100];

const orders = [
  { code: "#DH-29384", customer: "Trần Thị B", total: "24.500.000 đ", status: "Hoàn tất", tone: "success" },
  { code: "#DH-29385", customer: "Lê Văn C", total: "18.200.000 đ", status: "Chờ xử lý", tone: "pending" },
];

export function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">Tổng quan hệ thống</h1>
          <p className="mt-1 text-sm text-slate-500">Dữ liệu hoạt động kinh doanh thời gian thực</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-[#efd3dc] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
            <CalendarDays size={17} /> Hôm nay <ChevronDown size={16} className="ml-3" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-[#efd3dc] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
            <Warehouse size={17} /> Tất cả kho hàng <ChevronDown size={16} className="ml-3" />
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.5fr_0.85fr]">
        <article className="rounded-xl border border-[#eed2db] bg-white p-5 shadow-[0_3px_10px_rgba(79,20,45,0.03)]">
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff0f5] text-[#d92e70]"><ShoppingCart size={19} /></span>
            <EllipsisVertical size={19} className="text-slate-400" />
          </div>
          <h2 className="mt-6 text-sm font-medium text-slate-600">Đơn hàng hiện tại</h2>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-[#fffafb] px-3 py-2.5 text-sm"><span>Đơn mới</span><b className="text-[#d92e70]">142</b></div>
            <div className="flex items-center justify-between rounded-xl bg-[#fffafb] px-3 py-2.5 text-sm"><span>Chờ xử lý</span><b className="text-slate-800">38</b></div>
          </div>
        </article>

        <article className="rounded-xl border border-[#eed2db] bg-white p-5 shadow-[0_3px_10px_rgba(79,20,45,0.03)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ddfbe9] text-[#168a51]"><PackageCheck size={19} /></span>
              <div><p className="text-sm text-slate-600">Doanh thu đã thanh toán</p><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">4.520.000.000 đ</h2></div>
            </div>
            <span className="rounded-full bg-[#ecfff4] px-2.5 py-1 text-xs font-bold text-[#168a51]">↗ 12.5%</span>
          </div>
          <div className="mt-7 flex h-24 items-end gap-2">
            {chartBars.map((height, index) => <span key={height} className={`flex-1 rounded-t-lg ${index === chartBars.length - 1 ? "bg-[#d92e70]" : index === chartBars.length - 2 ? "bg-[#efb5ca]" : "bg-[#fde5ed]"}`} style={{ height: `${height}%` }} />)}
          </div>
        </article>

        <article className="rounded-xl border border-[#eed2db] bg-white p-5 shadow-[0_3px_10px_rgba(79,20,45,0.03)]">
          <div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffe6e3] text-[#df3027]"><AlertTriangle size={20} /></span><span className="rounded-full bg-[#ca1e24] px-2 py-1 text-[10px] font-black text-white">KHẨN CẤP</span></div>
          <h2 className="mt-6 text-sm font-medium text-slate-600">Vấn đề vận chuyển</h2>
          <div className="mt-4 space-y-2"><div className="flex items-center justify-between rounded-xl bg-[#fffafa] px-3 py-2.5 text-sm"><span className="text-[#d92e70]">Giao hàng trễ</span><b className="text-[#c91b26]">12</b></div><div className="flex items-center justify-between rounded-xl bg-[#fffafa] px-3 py-2.5 text-sm"><span className="text-[#d92e70]">Giao thất bại</span><b className="text-[#c91b26]">4</b></div></div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.9fr]">
        <article className="overflow-hidden rounded-xl border border-[#eed2db] bg-white">
          <div className="flex items-center justify-between border-b border-[#f3dce4] px-5 py-4"><h2 className="text-lg font-black text-slate-950">Hoạt động vận hành</h2><button className="text-sm font-bold text-[#d92e70]">Tất cả</button></div>
          <div className="space-y-6 p-5 text-sm">
            <div className="relative border-l-2 border-[#f0cad7] pl-5"><span className="absolute -left-[7px] top-0 grid h-3 w-3 place-items-center rounded-full bg-[#d92e70] ring-4 ring-white" /><div className="flex justify-between gap-3"><b>Đã xuất kho Miền Nam</b><span className="text-xs text-slate-400">10:45 AM</span></div><p className="mt-1 leading-5 text-slate-600">Đơn hàng <b>#DH-29384</b> đã bàn giao đơn vị vận chuyển.</p><div className="mt-3 h-3 w-36 rounded-full bg-slate-100" /><div className="mt-2 h-3 w-full rounded-full bg-slate-100" /></div>
            <div className="relative border-l-2 border-[#f0cad7] pl-5"><span className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-[#f4c9d7] ring-4 ring-white" /><div className="flex justify-between gap-3"><b>Thanh toán hoàn tất</b><span className="text-xs text-slate-400">09:12 AM</span></div><p className="mt-1 leading-5 text-slate-600">Xác nhận thanh toán cho khách hàng <b>Nguyễn Văn A.</b></p></div>
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-[#eed2db] bg-white">
          <div className="flex items-center justify-between border-b border-[#f3dce4] px-5 py-4"><h2 className="text-lg font-black text-slate-950">Đơn hàng mới nhất</h2><div className="flex items-center gap-2"><button className="rounded-xl border border-[#efd3dc] p-2 text-slate-600"><SlidersIcon /></button><button className="rounded-xl bg-[#d92e70] px-3 py-2 text-sm font-bold text-white">Xem chi tiết</button></div></div>
          <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-[#fffafb] text-[11px] uppercase tracking-wide text-slate-600"><tr><th className="px-5 py-3">Mã đơn</th><th className="px-5 py-3">Khách hàng</th><th className="px-5 py-3">Tổng tiền</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Thao tác</th></tr></thead><tbody>{orders.map((order) => <tr key={order.code} className="border-t border-[#f6e4ea]"><td className="px-5 py-4 font-bold text-[#d92e70]">{order.code}</td><td className="px-5 py-4">{order.customer}</td><td className="px-5 py-4 font-medium">{order.total}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${order.tone === "success" ? "bg-[#dcf9e8] text-[#168a51]" : "bg-[#ffdce7] text-[#d92e70]"}`}>{order.status}</span></td><td className="px-5 py-4"><Eye size={19} className="text-[#9c4e68]" /></td></tr>)}</tbody></table></div>
        </article>
      </section>
    </div>
  );
}

function SlidersIcon() {
  return <span className="text-base leading-none">☷</span>;
}
