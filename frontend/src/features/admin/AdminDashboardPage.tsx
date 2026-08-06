import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Eye,
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  ShoppingCart,
  Warehouse,
} from "lucide-react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/client";
import { adminCatalogService } from "../../api/adminCatalogService";
import { useStore } from "../../context/StoreContext";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED" | "PARTIALLY_RETURNED" | "RETURNED";
type TimeRange = "today" | "month" | "all";

interface AdminOrder {
  id: string;
  orderCode: string;
  receiverName?: string;
  contactName?: string;
  grandTotalAmount: number | string;
  status: OrderStatus;
  createdAt: string;
}

interface PagedResponse<T> {
  items: T[];
  page: { totalElements: number };
}

const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận", CONFIRMED: "Đã xác nhận", PROCESSING: "Đang xử lý", SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất", CANCELLED: "Đã hủy", PARTIALLY_RETURNED: "Hoàn trả một phần", RETURNED: "Đã hoàn trả",
};

const statusTone = (status: OrderStatus) => status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : status === "CANCELLED" || status === "RETURNED" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700";
const money = (amount: number) => `${new Intl.NumberFormat("vi-VN").format(amount)} đ`;

function startsAt(range: TimeRange) {
  const now = new Date();
  if (range === "all") return new Date(0);
  if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useStore();
  const canViewAudit = user?.role === "ADMIN" || user?.permissions?.includes("AUDIT_VIEW");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [range, setRange] = useState<TimeRange>("today");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const isAdmin = user?.role === "ADMIN";
      const canViewOrders = isAdmin || user?.permissions?.some((permission) => ["ORDER_VIEW", "ORDER_MANAGE"].includes(permission));
      const canViewProducts = isAdmin || user?.permissions?.some((permission) => ["PRODUCT_VIEW", "PRODUCT_CREATE", "PRODUCT_UPDATE"].includes(permission));
      const [orderResponse, products] = await Promise.all([
        canViewOrders
          ? apiClient.get<PagedResponse<AdminOrder>>("/admin/orders", { params: { page: 1, size: 100 } }).then((response) => response.data)
          : Promise.resolve({ items: [], page: { totalElements: 0 } } as PagedResponse<AdminOrder>),
        canViewProducts ? adminCatalogService.getProducts() : Promise.resolve([]),
      ]);
      setOrders(orderResponse.items || []);
      setTotalOrders(orderResponse.page?.totalElements || 0);
      setProductCount(products.length);
    } catch {
      message.error("Không tải được dữ liệu tổng quan. Hãy kiểm tra backend và quyền admin.");
    } finally { setLoading(false); }
  };

  useEffect(() => { void loadDashboard(); }, []);

  const scopedOrders = useMemo(() => {
    const begin = startsAt(range);
    return orders.filter((order) => new Date(order.createdAt) >= begin);
  }, [orders, range]);

  const metrics = useMemo(() => {
    const count = (statuses: OrderStatus[]) => scopedOrders.filter((order) => statuses.includes(order.status)).length;
    const completed = scopedOrders.filter((order) => order.status === "COMPLETED");
    return {
      pending: count(["PENDING"]),
      processing: count(["CONFIRMED", "PROCESSING"]),
      shipping: count(["SHIPPING"]),
      cancelled: count(["CANCELLED", "RETURNED", "PARTIALLY_RETURNED"]),
      revenue: completed.reduce((total, order) => total + Number(order.grandTotalAmount || 0), 0),
      chart: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "COMPLETED", "CANCELLED"].map((status) => count([status as OrderStatus])),
    };
  }, [scopedOrders]);

  const chartMax = Math.max(1, ...metrics.chart);
  const recentOrders = orders.slice(0, 5);

  return <div className="mx-auto max-w-[1400px] space-y-7">
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div><h1 className="text-2xl font-black tracking-tight text-slate-950">Tổng quan hệ thống</h1><p className="mt-1 text-sm text-slate-500">Số liệu vận hành lấy trực tiếp từ hệ thống đơn hàng.</p></div>
      <div className="flex flex-wrap gap-2">
        <label className="relative inline-flex items-center gap-2 rounded-xl border border-[#efd3dc] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"><CalendarDays size={17} /><select value={range} onChange={(event) => setRange(event.target.value as TimeRange)} className="appearance-none bg-transparent pr-5 outline-none"><option value="today">Hôm nay</option><option value="month">Tháng này</option><option value="all">Tất cả thời gian</option></select><ChevronDown className="pointer-events-none absolute right-3" size={16} /></label>
        <button onClick={() => navigate("/admin/inventory")} className="inline-flex items-center gap-2 rounded-xl border border-[#efd3dc] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"><Warehouse size={17} /> Tất cả kho hàng <ChevronDown size={16} className="ml-2" /></button>
        <button onClick={() => void loadDashboard()} className="inline-flex items-center gap-2 rounded-xl border border-[#efd3dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#c2185b]"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Làm mới</button>
      </div>
    </section>

    {loading ? <div className="grid min-h-80 place-items-center rounded-xl border border-[#eed2db] bg-white text-sm font-semibold text-slate-500"><LoaderCircle className="mr-2 animate-spin" size={19} /> Đang tải số liệu...</div> : <>
      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.5fr_0.85fr]">
        <button onClick={() => navigate("/admin/orders")} className="rounded-xl border border-[#eed2db] bg-white p-5 text-left shadow-[0_3px_10px_rgba(79,20,45,0.03)] transition hover:border-[#dc7ca2]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff0f5] text-[#d92e70]"><ShoppingCart size={19} /></span>
          <h2 className="mt-6 text-sm font-medium text-slate-600">Đơn hàng trong kỳ</h2>
          <div className="mt-4 space-y-2"><div className="flex items-center justify-between rounded-xl bg-[#fffafb] px-3 py-2.5 text-sm"><span>Đơn mới</span><b className="text-[#d92e70]">{metrics.pending}</b></div><div className="flex items-center justify-between rounded-xl bg-[#fffafb] px-3 py-2.5 text-sm"><span>Đang xử lý</span><b>{metrics.processing}</b></div></div>
          <p className="mt-4 text-xs text-slate-500">Toàn hệ thống: {totalOrders} đơn · {productCount} sản phẩm</p>
        </button>

        <article className="rounded-xl border border-[#eed2db] bg-white p-5 shadow-[0_3px_10px_rgba(79,20,45,0.03)]">
          <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ddfbe9] text-[#168a51]"><PackageCheck size={19} /></span><div><p className="text-sm text-slate-600">Doanh thu đơn hoàn tất</p><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{money(metrics.revenue)}</h2></div></div><span className="rounded-full bg-[#ecfff4] px-2.5 py-1 text-xs font-bold text-[#168a51]">Dữ liệu thật</span></div>
          <div className="mt-7 flex h-24 items-end gap-2">{metrics.chart.map((value, index) => <span key={index} title={`${value} đơn`} className={`flex-1 rounded-t-lg ${index === 4 ? "bg-[#d92e70]" : "bg-[#f6c8d8]"}`} style={{ height: `${Math.max(8, (value / chartMax) * 100)}%` }} />)}</div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400"><span>Chờ</span><span>Xác nhận</span><span>Xử lý</span><span>Giao</span><span>Xong</span><span>Hủy</span></div>
        </article>

        <button onClick={() => navigate("/admin/shipping")} className="rounded-xl border border-[#eed2db] bg-white p-5 text-left shadow-[0_3px_10px_rgba(79,20,45,0.03)] transition hover:border-[#dc7ca2]"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffe6e3] text-[#df3027]"><AlertTriangle size={20} /></span><span className="rounded-full bg-[#fff0f0] px-2 py-1 text-[10px] font-black text-[#c91b26]">CẦN THEO DÕI</span></div><h2 className="mt-6 text-sm font-medium text-slate-600">Vận chuyển & hoàn trả</h2><div className="mt-4 space-y-2"><div className="flex items-center justify-between rounded-xl bg-[#fffafa] px-3 py-2.5 text-sm"><span className="text-[#d92e70]">Đang giao</span><b className="text-[#c91b26]">{metrics.shipping}</b></div><div className="flex items-center justify-between rounded-xl bg-[#fffafa] px-3 py-2.5 text-sm"><span className="text-[#d92e70]">Hủy / hoàn trả</span><b className="text-[#c91b26]">{metrics.cancelled}</b></div></div></button>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.9fr]">
        <article className="overflow-hidden rounded-xl border border-[#eed2db] bg-white"><div className="flex items-center justify-between border-b border-[#f3dce4] px-5 py-4"><h2 className="text-lg font-black text-slate-950">Hoạt động vận hành</h2>{canViewAudit && <button onClick={() => navigate("/admin/audit-logs")} className="text-sm font-bold text-[#d92e70]">Tất cả</button>}</div><div className="space-y-5 p-5 text-sm">{recentOrders.length ? recentOrders.slice(0, 3).map((order) => <button key={order.id} onClick={() => navigate("/admin/orders")} className="relative block w-full border-l-2 border-[#f0cad7] pl-5 text-left"><span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#d92e70] ring-4 ring-white" /><div className="flex justify-between gap-3"><b>{statusLabel[order.status]}</b><span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span></div><p className="mt-1 leading-5 text-slate-600">Đơn hàng <b>{order.orderCode}</b> của {order.receiverName || order.contactName || "khách hàng"}.</p></button>) : <p className="text-slate-500">Chưa có hoạt động đơn hàng.</p>}</div></article>
        <article className="overflow-hidden rounded-xl border border-[#eed2db] bg-white"><div className="flex items-center justify-between border-b border-[#f3dce4] px-5 py-4"><h2 className="text-lg font-black text-slate-950">Đơn hàng mới nhất</h2><button onClick={() => navigate("/admin/orders")} className="rounded-xl bg-[#d92e70] px-3 py-2 text-sm font-bold text-white">Xem chi tiết</button></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-[#fffafb] text-[11px] uppercase tracking-wide text-slate-600"><tr><th className="px-5 py-3">Mã đơn</th><th className="px-5 py-3">Khách hàng</th><th className="px-5 py-3">Tổng tiền</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Thao tác</th></tr></thead><tbody>{recentOrders.length ? recentOrders.map((order) => <tr key={order.id} className="border-t border-[#f6e4ea]"><td className="px-5 py-4 font-bold text-[#d92e70]">{order.orderCode}</td><td className="px-5 py-4">{order.receiverName || order.contactName || "Khách vãng lai"}</td><td className="px-5 py-4 font-medium">{money(Number(order.grandTotalAmount || 0))}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone(order.status)}`}>{statusLabel[order.status]}</span></td><td className="px-5 py-4"><button onClick={() => navigate("/admin/orders")} aria-label="Xem đơn hàng"><Eye size={19} className="text-[#9c4e68]" /></button></td></tr>) : <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Chưa có đơn hàng.</td></tr>}</tbody></table></div></article>
      </section>
    </>}
  </div>;
}
