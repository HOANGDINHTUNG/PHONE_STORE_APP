import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import {
  ArrowLeft,
  BanknoteArrowDown,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Eye,
  Filter,
  LoaderCircle,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  adminPaymentService,
  type AdminPayment,
  type AdminRefund,
  type PaymentAttemptStatus,
  type PaymentStatus,
  type RefundStatus,
  type RefundSummary,
} from "../../api/adminPaymentService";

const money = (amount?: number) => `${new Intl.NumberFormat("vi-VN").format(Number(amount || 0))} đ`;
const dateTime = (value?: string) => value ? new Date(value).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "—";

const paymentStatusLabel: Record<PaymentStatus, string> = {
  UNPAID: "Chưa thanh toán", PARTIALLY_PAID: "Thanh toán một phần", PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền", CANCELLED: "Đã hủy", EXPIRED: "Hết hạn",
};
const refundStatusLabel: Record<RefundStatus, string> = {
  PENDING: "Chờ duyệt", PROCESSING: "Đang xử lý", SUCCESS: "Hoàn tất", FAILED: "Thất bại", CANCELLED: "Đã hủy",
};

function StatusBadge({ status }: { status: PaymentStatus | PaymentAttemptStatus | RefundStatus }) {
  const success = ["PAID", "SUCCESS"].includes(status);
  const danger = ["FAILED", "UNPAID", "CANCELLED", "EXPIRED"].includes(status);
  const processing = ["PENDING", "PROCESSING", "PARTIALLY_PAID"].includes(status);
  const text = paymentStatusLabel[status as PaymentStatus] || refundStatusLabel[status as RefundStatus] || status;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold ${success ? "bg-emerald-100 text-emerald-700" : danger ? "bg-rose-100 text-rose-700" : processing ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{text}</span>;
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return <tr><td colSpan={colSpan} className="px-5 py-12 text-center text-sm text-slate-500">{text}</td></tr>;
}

export function AdminPaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try { setPayments((await adminPaymentService.getPayments()).items); }
    catch { message.error("Không tải được danh sách thanh toán."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const methods = useMemo(() => [...new Set(payments.map((payment) => payment.latestMethod).filter(Boolean))], [payments]);
  const filtered = useMemo(() => payments.filter((payment) => {
    const searchable = `${payment.orderCode} ${payment.id}`.toLowerCase();
    return (!keyword.trim() || searchable.includes(keyword.trim().toLowerCase()))
      && (!status || payment.status === status)
      && (!method || payment.latestMethod === method);
  }), [payments, keyword, status, method]);
  const rows = filtered.slice((page - 1) * 10, page * 10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const applyFilter = () => setPage(1);

  return <div className="mx-auto max-w-[1400px] space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div><h1 className="text-2xl font-black text-slate-950">Danh sách thanh toán</h1><p className="mt-1 text-sm text-slate-500">Theo dõi giao dịch, trạng thái thanh toán và số tiền hoàn.</p></div>
      <div className="flex gap-2"><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-[#e8c4d2] bg-white px-4 py-2.5 text-sm font-bold text-[#9d1950]"><RefreshCw size={16} /> Làm mới</button><button onClick={() => navigate("/admin/refunds")} className="inline-flex items-center gap-2 rounded-lg bg-[#c2185b] px-4 py-2.5 text-sm font-bold text-white"><BanknoteArrowDown size={17} /> Hàng đợi hoàn tiền</button></div>
    </section>
    <section className="grid gap-3 rounded-xl border border-[#efd3dc] bg-[#fce4eb] p-4 md:grid-cols-4">
      <label className="text-sm font-bold text-slate-700 md:col-span-2">Tìm đơn hàng<span className="relative mt-2 block"><Search className="absolute left-3 top-2.5 text-slate-500" size={17} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && applyFilter()} placeholder="Mã đơn hàng hoặc mã thanh toán" className="w-full rounded-lg border border-[#edcfda] bg-white py-2.5 pl-10 pr-3 outline-none focus:border-[#d92e70]" /></span></label>
      <label className="text-sm font-bold text-slate-700">Trạng thái<select value={status} onChange={(event) => { setStatus(event.target.value); applyFilter(); }} className="mt-2 w-full rounded-lg border border-[#edcfda] bg-white px-3 py-2.5 font-medium outline-none"><option value="">Tất cả</option>{Object.entries(paymentStatusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-bold text-slate-700">Phương thức<select value={method} onChange={(event) => { setMethod(event.target.value); applyFilter(); }} className="mt-2 w-full rounded-lg border border-[#edcfda] bg-white px-3 py-2.5 font-medium outline-none"><option value="">Tất cả</option>{methods.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    </section>
    {loading ? <div className="grid min-h-64 place-items-center rounded-xl border border-[#eed2db] bg-white text-slate-500"><LoaderCircle className="animate-spin" /></div> : <section className="overflow-x-auto rounded-xl border border-[#edd0db] bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-[#fbe1e8] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><tr><th className="px-5 py-4">Mã đơn hàng</th><th className="px-5 py-4 text-right">Phải thanh toán</th><th className="px-5 py-4 text-right">Đã thanh toán</th><th className="px-5 py-4 text-right">Đã hoàn</th><th className="px-5 py-4">Phương thức</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4">Thời gian</th><th className="px-5 py-4" /></tr></thead><tbody>{rows.length ? rows.map((payment) => <tr key={payment.id} className="border-t border-[#f5e3e9]"><td className="px-5 py-4"><button onClick={() => navigate(`/admin/payments/${payment.id}`)} className="font-black text-[#c2185b] hover:underline">#{payment.orderCode}</button><span className="mt-1 block text-xs text-slate-400">PAY-{payment.id}</span></td><td className="px-5 py-4 text-right font-semibold">{money(payment.expectedAmount)}</td><td className="px-5 py-4 text-right font-bold text-emerald-700">{money(payment.paidAmount)}</td><td className="px-5 py-4 text-right font-semibold text-[#c2185b]">{payment.refundedAmount ? money(payment.refundedAmount) : "—"}</td><td className="px-5 py-4">{payment.latestMethod || "—"}</td><td className="px-5 py-4"><StatusBadge status={payment.status} /></td><td className="px-5 py-4 text-xs text-slate-600">{dateTime(payment.paidAt || payment.createdAt)}</td><td className="px-5 py-4"><button onClick={() => navigate(`/admin/payments/${payment.id}`)} title="Xem chi tiết" className="rounded-lg p-2 text-[#a91b50] hover:bg-[#fff0f5]"><Eye size={17} /></button></td></tr>) : <EmptyRow colSpan={8} text="Không có giao dịch phù hợp." />}</tbody></table><div className="flex items-center justify-between border-t border-[#f5e3e9] px-5 py-3 text-sm text-slate-600"><span>Hiển thị {rows.length} trên {filtered.length} giao dịch</span><div className="flex items-center gap-2"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded border border-[#ecced8] px-2 py-1 disabled:opacity-40">‹</button><b>{page} / {totalPages}</b><button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded border border-[#ecced8] px-2 py-1 disabled:opacity-40">›</button></div></div></section>}
  </div>;
}

export function AdminPaymentDetailPage() {
  const { paymentId } = useParams(); const navigate = useNavigate();
  const [payment, setPayment] = useState<AdminPayment | null>(null); const [loading, setLoading] = useState(true);
  const load = async () => { if (!paymentId) return; setLoading(true); try { setPayment(await adminPaymentService.getPayment(paymentId)); } catch { message.error("Không tải được chi tiết thanh toán."); navigate("/admin/payments"); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, [paymentId]);
  if (loading || !payment) return <div className="grid min-h-80 place-items-center text-slate-500"><LoaderCircle className="animate-spin" /></div>;
  return <div className="mx-auto max-w-[1400px] space-y-6"><section className="flex flex-wrap items-start justify-between gap-4"><div><button onClick={() => navigate("/admin/payments")} className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-[#a91b50]"><ArrowLeft size={16} /> Quay lại thanh toán</button><h1 className="text-2xl font-black text-slate-950">Chi tiết thanh toán</h1><p className="mt-1 text-sm text-slate-500">Tham chiếu: <b className="text-[#c2185b]">PAY-{payment.id}</b></p></div><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-[#e8c4d2] bg-white px-4 py-2.5 text-sm font-bold text-[#9d1950]"><RefreshCw size={16} /> Đồng bộ trạng thái</button></section><div className="grid gap-5 xl:grid-cols-[0.8fr_1.6fr]"><section className="rounded-xl border border-[#edd0db] bg-[#fbe1e8] p-6"><h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-700"><CreditCard size={17} /> Tóm tắt đơn hàng</h2><p className="mt-5 text-sm text-slate-500">Mã đơn hàng</p><Link to="/admin/orders" className="mt-1 block text-2xl font-black text-[#c2185b]">#{payment.orderCode}</Link><div className="my-6 border-t border-[#edcbd7]" /><p className="text-sm text-slate-500">Tổng tiền cần thanh toán</p><p className="mt-2 text-3xl font-black text-[#c2185b]">{money(payment.expectedAmount)}</p><div className="my-6 border-t border-[#edcbd7]" /><div className="flex items-center justify-between"><span className="text-sm text-slate-600">Trạng thái hiện tại</span><StatusBadge status={payment.status} /></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-white p-3"><span className="text-xs text-slate-500">Đã thu</span><b className="mt-1 block text-emerald-700">{money(payment.paidAmount)}</b></div><div className="rounded-lg bg-white p-3"><span className="text-xs text-slate-500">Đã hoàn</span><b className="mt-1 block text-[#c2185b]">{money(payment.refundedAmount)}</b></div></div></section><section className="overflow-x-auto rounded-xl border border-[#edd0db] bg-white"><div className="border-b border-[#f2dce4] bg-[#fbe1e8] px-5 py-4"><h2 className="flex items-center gap-2 font-black text-slate-950"><Clock3 size={18} /> Lịch sử lần thanh toán</h2></div><table className="min-w-full text-left text-sm"><thead className="bg-[#fffafb] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">Lần</th><th className="px-4 py-3">Phương thức</th><th className="px-4 py-3">Nhà cung cấp</th><th className="px-4 py-3 text-right">Số tiền</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Mã giao dịch</th><th className="px-4 py-3">Thông báo</th></tr></thead><tbody>{payment.attempts.length ? payment.attempts.map((attempt) => <tr key={attempt.id} className="border-t border-[#f5e3e9]"><td className="px-4 py-4 font-bold">#{attempt.attemptNumber}</td><td className="px-4 py-4 font-bold text-[#a91b50]">{attempt.method}</td><td className="px-4 py-4">{attempt.providerCode}</td><td className="px-4 py-4 text-right font-bold">{money(attempt.amount)}</td><td className="px-4 py-4"><StatusBadge status={attempt.status} /></td><td className="px-4 py-4 text-xs">{attempt.providerTransactionId || "—"}</td><td className="max-w-48 px-4 py-4 text-xs text-slate-600">{attempt.providerMessage || "—"}</td></tr>) : <EmptyRow colSpan={7} text="Chưa có lần thanh toán nào." />}</tbody></table></section></div><section className="rounded-xl border border-[#493337] bg-[#382629] p-5 text-white"><h2 className="flex items-center gap-2 font-black"><CircleDollarSign size={18} /> Thông tin kỹ thuật</h2><div className="mt-4 grid gap-3 text-sm md:grid-cols-3"><div className="rounded bg-black/20 p-3"><span className="block text-xs text-slate-300">Mã thanh toán</span><b className="mt-1 block">PAY-{payment.id}</b></div><div className="rounded bg-black/20 p-3"><span className="block text-xs text-slate-300">Tạo lúc</span><b className="mt-1 block">{dateTime(payment.createdAt)}</b></div><div className="rounded bg-black/20 p-3"><span className="block text-xs text-slate-300">Tiền tệ</span><b className="mt-1 block">{payment.currency}</b></div></div></section></div>;
}

function RefundSummaryCard({ title, value, amount, tone, icon }: { title: string; value: number; amount?: number; tone: string; icon: React.ReactNode }) {
  return <article className="rounded-xl border border-[#edd0db] bg-[#fbe1e8] p-5"><div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-600">{title}</span><span className={tone}>{icon}</span></div><p className={`mt-3 text-3xl font-black ${tone}`}>{value}</p>{amount !== undefined && <p className="mt-2 text-sm text-slate-600">{money(amount)} tổng cộng</p>}</article>;
}

export function AdminRefundQueuePage() {
  const [refunds, setRefunds] = useState<AdminRefund[]>([]); const [summary, setSummary] = useState<RefundSummary | null>(null); const [loading, setLoading] = useState(true); const [status, setStatus] = useState(""); const [workingId, setWorkingId] = useState<number | null>(null);
  const load = async () => { setLoading(true); try { const [refundData, summaryData] = await Promise.all([adminPaymentService.getRefunds(), adminPaymentService.getRefundSummary()]); setRefunds(refundData.items); setSummary(summaryData); } catch { message.error("Không tải được hàng đợi hoàn tiền."); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const shown = status ? refunds.filter((refund) => refund.status === status) : refunds;
  const updateRefund = async (refund: AdminRefund) => { setWorkingId(refund.id); try { if (refund.status === "PENDING") await adminPaymentService.approveRefund(refund.id); else if (refund.status === "PROCESSING") await adminPaymentService.confirmManualRefund(refund.id); else return; message.success("Đã cập nhật yêu cầu hoàn tiền."); await load(); } catch (error) { const detail = (error as { response?: { data?: { detail?: string } } }).response?.data?.detail; message.error(detail || "Không thể cập nhật yêu cầu hoàn tiền."); } finally { setWorkingId(null); } };
  return <div className="mx-auto max-w-[1400px] space-y-6"><section className="flex flex-wrap justify-between gap-4"><div><h1 className="text-2xl font-black text-slate-950">Hàng đợi hoàn tiền</h1><p className="mt-1 text-sm text-slate-500">Quản lý, duyệt và xác nhận các yêu cầu hoàn tiền của khách hàng.</p></div><div className="flex gap-2"><Link to="/admin/payments" className="inline-flex items-center gap-2 rounded-lg border border-[#e8c4d2] bg-white px-4 py-2.5 text-sm font-bold text-[#9d1950]"><CreditCard size={17} /> Danh sách thanh toán</Link><button onClick={() => void load()} className="rounded-lg border border-[#e8c4d2] bg-white px-3 py-2 text-[#9d1950]"><RefreshCw size={17} /></button></div></section><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><RefundSummaryCard title="Chờ duyệt" value={summary?.pendingCount || 0} amount={summary?.pendingAmount} tone="text-[#c2185b]" icon={<Clock3 size={20} />} /><RefundSummaryCard title="Đang xử lý" value={summary?.processingCount || 0} amount={summary?.processingAmount} tone="text-amber-600" icon={<RefreshCw size={20} />} /><RefundSummaryCard title="Hoàn tất hôm nay" value={summary?.completedTodayCount || 0} amount={summary?.completedTodayAmount} tone="text-emerald-600" icon={<CheckCircle2 size={20} />} /><RefundSummaryCard title="Thất bại" value={summary?.failedCount || 0} tone="text-rose-600" icon={<XCircle size={20} />} /></section>{loading ? <div className="grid min-h-64 place-items-center rounded-xl border border-[#eed2db] bg-white text-slate-500"><LoaderCircle className="animate-spin" /></div> : <section className="overflow-x-auto rounded-xl border border-[#edd0db] bg-white"><div className="flex items-center justify-between border-b border-[#f2dce4] bg-[#fbe1e8] px-5 py-4"><h2 className="font-black text-slate-950">Yêu cầu hoàn tiền</h2><label className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><Filter size={16} /><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded border border-[#eacbd5] bg-white px-3 py-2 outline-none"><option value="">Tất cả ({refunds.length})</option>{Object.entries(refundStatusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><table className="min-w-full text-left text-sm"><thead className="bg-[#fffafb] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><tr><th className="px-5 py-3">Mã hoàn</th><th className="px-5 py-3">Mã đơn</th><th className="px-5 py-3">Yêu cầu trả</th><th className="px-5 py-3 text-right">Số tiền</th><th className="px-5 py-3">Phương thức</th><th className="px-5 py-3">Người yêu cầu</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3 text-right">Thao tác</th></tr></thead><tbody>{shown.length ? shown.map((refund) => <tr key={refund.id} className="border-t border-[#f5e3e9]"><td className="px-5 py-4 font-black text-[#c2185b]">{refund.refundCode}</td><td className="px-5 py-4"><Link to={`/admin/payments/${refund.paymentId}`} className="font-bold text-slate-700 hover:text-[#c2185b]">#{refund.orderCode}</Link></td><td className="px-5 py-4">{refund.returnCode || "—"}</td><td className="px-5 py-4 text-right font-bold">{money(refund.amount)}</td><td className="px-5 py-4">{refund.method}</td><td className="px-5 py-4">{refund.requesterName}</td><td className="px-5 py-4"><StatusBadge status={refund.status} /></td><td className="px-5 py-4 text-right">{refund.status === "PENDING" || refund.status === "PROCESSING" ? <button disabled={workingId === refund.id} onClick={() => void updateRefund(refund)} className="rounded-lg bg-[#c2185b] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{workingId === refund.id ? "Đang xử lý" : refund.status === "PENDING" ? "Duyệt" : "Xác nhận hoàn"}</button> : <span className="text-xs text-slate-400">—</span>}</td></tr>) : <EmptyRow colSpan={8} text="Không có yêu cầu hoàn tiền phù hợp." />}</tbody></table></section>}</div>;
}
