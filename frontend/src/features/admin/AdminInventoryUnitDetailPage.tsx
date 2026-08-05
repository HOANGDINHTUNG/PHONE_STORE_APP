import { useEffect, useState, type ReactNode } from "react";
import { message } from "antd";
import { ArrowLeft, Clock3, FileText, Package, Printer, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminInventoryService, type InventoryUnitDetail, type InventoryUnitSummary } from "../../api/adminInventoryService";

const labels: Record<string, string> = { AVAILABLE: "Có sẵn", RESERVED: "Đang giữ hàng", SOLD: "Đã bán", RETURNED: "Đã trả", DEFECTIVE: "Lỗi", IN_WARRANTY: "Bảo hành", VOID: "Đã huỷ", IMPORT: "Nhập kho", SALE: "Xuất kho (bán hàng)", RESERVE: "Giữ hàng", RELEASE: "Gỡ giữ hàng", CANCEL_ORDER: "Huỷ đơn", RETURN_IN: "Nhập trả", RETURN_OUT: "Xuất trả", ADJUST_IN: "Điều chỉnh tăng", ADJUST_OUT: "Điều chỉnh giảm" };
const label = (value?: string) => labels[value || ""] || value || "—";
const formatDate = (value?: string) => value ? new Date(value).toLocaleString("vi-VN") : "—";

export function AdminInventoryUnitDetailPage() {
  const { warehouseId, variantId } = useParams();
  const navigate = useNavigate();
  const [units, setUnits] = useState<InventoryUnitSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [detail, setDetail] = useState<InventoryUnitDetail>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!warehouseId || !variantId) return;
    setLoading(true);
    adminInventoryService.inventoryUnits(warehouseId, variantId)
      .then((data) => { setUnits(data); setSelectedId(data[0]?.id); })
      .catch(() => message.error("Không tải được danh sách đơn vị tồn kho."))
      .finally(() => setLoading(false));
  }, [warehouseId, variantId]);
  useEffect(() => { if (selectedId) adminInventoryService.inventoryUnitDetail(selectedId).then(setDetail).catch(() => message.error("Không tải được chi tiết IMEI.")); }, [selectedId]);

  if (loading) return <div className="p-10 text-center text-slate-500">Đang tải chi tiết tồn kho…</div>;
  if (!units.length) return <Empty onBack={() => navigate("/admin/inventory/balances")} />;
  if (!detail) return <div className="p-10 text-center text-slate-500">Đang tải thông tin đơn vị…</div>;
  const mainIdentifier = detail.identifiers.find((item) => item.type === "IMEI_1")?.value || detail.identifiers[0]?.value || `Đơn vị #${detail.id}`;

  return <div className="mx-auto max-w-[1280px] space-y-6 pb-10">
    <button onClick={() => navigate("/admin/inventory/balances")} className="inline-flex items-center gap-1 text-sm font-bold text-[#a91b50]"><ArrowLeft size={17}/> Quay lại tồn kho</button>
    <section className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-slate-500">Kho hàng · Tồn kho · Chi tiết đơn vị</p><h1 className="mt-2 text-3xl font-black text-slate-950">{detail.productName}</h1><p className="mt-2 text-sm text-slate-600">IMEI/Serial: <b className="text-slate-900">{mainIdentifier}</b> <span className="ml-3 rounded-full bg-[#eaf8ef] px-3 py-1 text-xs font-bold text-emerald-700">{label(detail.unitStatus)}</span></p></div><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-[#e5c7d3] bg-white px-4 py-2.5 text-sm font-bold text-[#a91b50]"><Printer size={16}/> In tem</button></section>
    <section className="rounded-xl border border-[#eed2db] bg-[#fff8fa] p-4"><label className="text-sm font-bold text-slate-700">Đơn vị tồn kho / IMEI cần xem</label><select value={selectedId} onChange={(event) => setSelectedId(Number(event.target.value))} className="mt-2 h-11 w-full rounded-lg border border-[#e4c9d4] bg-white px-3 text-sm font-semibold outline-none sm:max-w-xl">{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.identifiers[0] || `Đơn vị #${unit.id}`} · {label(unit.unitStatus)}</option>)}</select></section>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"><div className="space-y-5"><section className="rounded-xl border border-[#edd0db] bg-[#fce1e8] p-6"><h2 className="flex items-center gap-2 font-black text-slate-900"><Package size={18} className="text-[#c2185b]"/> Thông tin chung</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="SKU hệ thống" value={detail.sku}/><Info label="Biến thể" value={detail.variantName}/><Info label="Kho lưu trữ hiện tại" value={detail.warehouseName}/><Info label="Trạng thái vật lý" value={label(detail.unitStatus)}/></div><div className="mt-5 flex gap-4 rounded-lg border border-[#ebcbd6] bg-white/50 p-4">{detail.imageUrl ? <img src={detail.imageUrl} className="h-20 w-20 rounded-lg bg-white object-contain"/> : <div className="grid h-20 w-20 place-items-center rounded-lg bg-white text-[#c2185b]"><Package size={28}/></div>}<div className="grid content-center gap-1 text-sm">{detail.identifiers.length ? detail.identifiers.map((item) => <p key={item.type}><b>{item.type.replace("_", " ")}:</b> {item.value}</p>) : <p>Chưa ghi nhận IMEI/serial cho đơn vị này.</p>}<p className="text-slate-600">Nhập kho: {formatDate(detail.receivedAt)}</p></div></div></section><div className="grid gap-4 sm:grid-cols-3"><Card icon={<FileText size={18}/>} title="Nguồn gốc nhập" value={detail.origin?.purchaseOrderCode || "Chưa có PO"} subtitle={detail.origin ? `Nhập lúc ${formatDate(detail.origin.receivedAt)}` : ""}/><Card icon={<ShieldCheck size={18}/>} title="Đặt trước / giữ hàng" value={detail.reservation ? label(detail.reservation.status) : "Không có"} subtitle={detail.reservation?.orderId || ""}/><Card icon={<Package size={18}/>} title="Đơn xuất / bán" value={detail.sale?.orderCode || "Chưa bán"} subtitle={detail.sale?.soldAt ? formatDate(detail.sale.soldAt) : ""}/></div></div><section className="rounded-xl border border-[#edd0db] bg-[#fce1e8] p-6"><h2 className="flex items-center gap-2 font-black text-slate-900"><Clock3 size={18} className="text-[#c2185b]"/> Lịch sử trạng thái</h2><div className="mt-5 space-y-5">{detail.history.length ? detail.history.map((item, index) => <div key={item.id} className="relative border-l-2 border-[#ebbbc9] pb-5 pl-5 last:pb-0"><span className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ${index === 0 ? "bg-[#c2185b]" : "bg-white ring-2 ring-[#ebbbc9]"}`}/><b className="block text-sm text-slate-900">{label(item.transactionType)}</b><p className="mt-1 text-sm text-slate-600">{item.reason || `${item.referenceType}${item.referenceId ? ` · ${item.referenceId}` : ""}`}</p><p className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)} · {item.createdBy || "Hệ thống"}</p></div>) : <p className="text-sm text-slate-500">Chưa có lịch sử giao dịch cho đơn vị này.</p>}</div></section></div>
  </div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div className="border-b border-[#f0cdd8] pb-3"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>; }
function Card({ icon, title, value, subtitle }: { icon: ReactNode; title: string; value: string; subtitle: string }) { return <section className="rounded-xl border border-[#edd0db] bg-[#fce1e8] p-4"><div className="text-[#c2185b]">{icon}</div><p className="mt-3 text-xs font-bold uppercase text-slate-500">{title}</p><p className="mt-1 break-all font-black text-[#b01450]">{value}</p>{subtitle && <p className="mt-1 break-all text-xs text-slate-500">{subtitle}</p>}</section>; }
function Empty({ onBack }: { onBack: () => void }) { return <div className="mx-auto max-w-[1200px]"><button onClick={onBack} className="inline-flex items-center gap-1 font-bold text-[#c2185b]"><ArrowLeft size={17}/> Quay lại tồn kho</button><div className="mt-6 rounded-xl border border-[#eed2db] bg-white p-12 text-center text-slate-500">Sản phẩm này chưa có đơn vị hàng tồn kho để theo dõi bằng IMEI/serial.</div></div>; }
