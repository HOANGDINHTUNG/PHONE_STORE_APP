import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  FileText,
  PackageCheck,
  Printer,
} from "lucide-react";
import { Button, Popconfirm, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { procurementService } from "./procurementService";
import { ReceiveItemsModal } from "./ReceiveItemsModal";

export function ProcurementDetailPage() {
  const { poCode } = useParams<{ poCode: string }>();
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const po = useMemo(() => {
    if (!poCode) return undefined;
    return procurementService.getPOByCode(poCode);
  }, [poCode, reloadKey]);

  if (!po) {
    return (
      <div className="mx-auto max-w-[1200px] p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Không tìm thấy đơn nhập hàng {poCode}
        </h2>
        <Link
          to="/admin/procurement"
          className="mt-4 inline-flex items-center gap-2 font-bold text-[#c2185b]"
        >
          <ArrowLeft size={18} /> Quay lại danh sách đơn nhập hàng
        </Link>
      </div>
    );
  }

  const rawSubtotal = po.items.reduce((acc, it) => acc + it.qtyOrd * it.unitCost, 0);
  const vatTax = Math.round(rawSubtotal * 0.1);
  const grandTotal = rawSubtotal + vatTax;

  const totalQtyOrd = po.items.reduce((acc, it) => acc + it.qtyOrd, 0);
  const totalQtyRec = po.items.reduce((acc, it) => acc + it.qtyRec, 0);
  const totalQtyPending = Math.max(0, totalQtyOrd - totalQtyRec);

  const handleCancel = () => {
    procurementService.cancelPO(po.code, "Hủy đơn theo yêu cầu người dùng");
    message.info("Đã hủy đơn nhập hàng.");
    setReloadKey((prev) => prev + 1);
  };

  const handleReceiveSubmit = async (receivedMap: Record<string | number, number>) => {
    await procurementService.receivePurchaseOrder(po.id, receivedMap);
    message.success("Đã nhập kho và cập nhật tồn kho thành công.");
    setReloadKey((prev) => prev + 1);
  };

  const handleSubmitForApproval = async () => {
    await procurementService.submitPO(po.id);
    message.success("Đã gửi phiếu nhập để phê duyệt.");
    setReloadKey((prev) => prev + 1);
  };

  const handleApprove = async () => {
    await procurementService.approvePO(po.id);
    message.success("Đã phê duyệt phiếu nhập. Bạn có thể nhận hàng vào kho.");
    setReloadKey((prev) => prev + 1);
  };

  const handlePrintPO = () => {
    window.print();
  };

  const renderStatusBadge = () => {
    switch (po.status) {
      case "APPROVED":
        return (
          <span className="rounded-full bg-[#ffdce7] px-3.5 py-1 text-xs font-black uppercase tracking-wide text-[#d92e70]">
            ĐÃ DUYỆT (APPROVED)
          </span>
        );
      case "COMPLETED":
        return (
          <span className="rounded-full bg-[#dcf9e8] px-3.5 py-1 text-xs font-black uppercase tracking-wide text-[#168a51]">
            HOÀN TẤT (COMPLETED)
          </span>
        );
      case "DRAFT":
        return (
          <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-black uppercase tracking-wide text-slate-600">
            BẢN NHÁP (DRAFT)
          </span>
        );
      case "PENDING_APPROVAL":
        return (
          <span className="rounded-full bg-[#fef3c7] px-3.5 py-1 text-xs font-black uppercase tracking-wide text-[#d97706]">
            CHỜ DUYỆT (PENDING APPROVAL)
          </span>
        );
      case "PARTIALLY_RECEIVED":
        return (
          <span className="rounded-full bg-[#e0f2fe] px-3.5 py-1 text-xs font-black uppercase tracking-wide text-[#0284c7]">
            NHẬP MỘT PHẦN
          </span>
        );
      case "CANCELLED":
        return (
          <span className="rounded-full bg-red-100 px-3.5 py-1 text-xs font-black uppercase tracking-wide text-red-600">
            ĐÃ HỦY (CANCELLED)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Top Header Navigation */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/admin/procurement")}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#efd3dc] bg-white text-slate-700 hover:bg-[#fff0f5] hover:text-[#c2185b]"
              aria-label="Quay lại danh sách đơn nhập"
            >
              <ArrowLeft size={19} />
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              {po.code}
            </h1>
            {renderStatusBadge()}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Khởi tạo ngày <b>{po.createdAt}</b> bởi <b className="text-slate-800">{po.creator}</b>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {po.status === "DRAFT" && (
            <Button size="large" onClick={() => void handleSubmitForApproval()} className="rounded-xl border-[#dca9bf] font-bold text-[#a70f4b]">
              Gửi duyệt
            </Button>
          )}
          {po.status === "PENDING_APPROVAL" && (
            <Button type="primary" size="large" onClick={() => void handleApprove()} className="rounded-xl bg-[#c2185b] font-bold hover:bg-[#a70f4b]">
              Phê duyệt phiếu nhập
            </Button>
          )}
          {po.status !== "CANCELLED" && po.status !== "COMPLETED" && (
            <Popconfirm
              title="Hủy đơn nhập hàng"
              description="Bạn có chắc chắn muốn hủy đơn này không?"
              okText="Hủy đơn"
              cancelText="Không"
              okButtonProps={{ danger: true }}
              onConfirm={handleCancel}
            >
              <Button size="large" className="rounded-xl font-bold">
                Hủy đơn nhập
              </Button>
            </Popconfirm>
          )}

          {(po.status === "APPROVED" || po.status === "PARTIALLY_RECEIVED") && (
            <Button
              type="primary"
              icon={<PackageCheck size={18} />}
              size="large"
              onClick={() => setIsReceiveOpen(true)}
              className="rounded-xl bg-[#c2185b] font-bold shadow-sm hover:bg-[#a70f4b]"
            >
              Nhận hàng vào kho
            </Button>
          )}
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* General Information Card */}
          <article className="rounded-2xl border border-[#eed2db] bg-white p-6 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
            <h2 className="text-xl font-black text-slate-950">Thông tin chung (General Information)</h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nhà cung cấp (Supplier)</span>
                <div className="mt-1.5 flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <Building2 size={18} className="text-[#c2185b]" />
                  {po.supplierName}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Kho nhập hàng (Warehouse)</span>
                <div className="mt-1.5 flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <span className="text-base">🏢</span>
                  {po.destWarehouse}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ngày dự kiến nhận (Expected Date)</span>
                <div className="mt-1.5 flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <Calendar size={17} className="text-slate-500" />
                  {po.expectedDelivery}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mã tham chiếu / Hóa đơn (Reference No.)</span>
                <div className="mt-1.5 flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <FileText size={17} className="text-slate-500" />
                  {po.referenceNo || "--"}
                </div>
              </div>
            </div>

            {po.note && (
              <div className="mt-6 rounded-xl border border-[#f5dce4] bg-[#fff5f8] p-4 text-sm leading-6 text-slate-700">
                <span className="font-bold text-[#c2185b]">Ghi chú (Note): </span>
                {po.note}
              </div>
            )}
          </article>

          {/* Line Items Card */}
          <article className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
            <div className="flex items-center justify-between border-b border-[#f3dce4] px-6 py-5">
              <h2 className="text-xl font-black text-slate-950">Danh mục sản phẩm (Line Items)</h2>
              <span className="rounded-full bg-[#fff0f5] px-3.5 py-1 text-xs font-extrabold text-[#c2185b]">
                {po.items.length} {po.items.length === 1 ? "Sản phẩm" : "Sản phẩm"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fffafb] text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Hình ảnh</th>
                    <th className="px-6 py-3.5">Mã SKU / Tên sản phẩm</th>
                    <th className="px-6 py-3.5 text-center">SL đặt (Qty Ord)</th>
                    <th className="px-6 py-3.5 text-center">SL nhận (Qty Rec)</th>
                    <th className="px-6 py-3.5 text-right">Đơn giá nhập</th>
                    <th className="px-6 py-3.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f6e4ea]">
                  {po.items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fffcfd]">
                      <td className="px-6 py-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-white">
                          {item.image && <img
                            src={item.image}
                            alt={item.name}
                            className="relative z-10 h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />}
                          <div className="absolute inset-0 z-0 grid place-items-center bg-[#fff0f5] text-xs font-bold text-[#c2185b]">
                            📱
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-900">{item.sku}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-extrabold text-slate-900">
                        {item.qtyOrd}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block rounded-lg bg-[#dcf9e8] px-3 py-1 text-xs font-extrabold text-[#168a51]">
                          {item.qtyRec}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">
                        {item.unitCost.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-950">
                        {item.totalCost.toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Summary Section (Fixed Grid Layout - No Overflow) */}
            <div className="flex justify-end border-t border-[#f3dce4] bg-[#fffafb] p-6">
              <div className="grid grid-cols-[auto_180px] items-center gap-x-8 gap-y-3 text-right text-sm sm:grid-cols-[auto_200px]">
                <span className="font-semibold text-slate-600">Tạm tính (Subtotal):</span>
                <span className="font-black text-slate-900">
                  {rawSubtotal.toLocaleString("vi-VN")} đ
                </span>

                <span className="font-semibold text-slate-600">Thuế (VAT 10%):</span>
                <span className="font-black text-slate-900">
                  {vatTax.toLocaleString("vi-VN")} đ
                </span>

                <div className="col-span-2 my-1 border-t border-[#f0cad7]" />

                <span className="text-base font-black text-slate-900">Tổng tiền thanh toán:</span>
                <span className="text-xl font-black text-[#c2185b]">
                  {grandTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Summary Card */}
          <article className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-6 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
            <h2 className="text-xl font-black text-slate-950">Tổng quan số lượng (Summary)</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-[#f3dce4] pb-3">
                <span className="text-slate-600">Tổng số lượng đặt</span>
                <b className="text-base text-slate-900">{totalQtyOrd} sản phẩm</b>
              </div>

              <div className="flex items-center justify-between border-b border-[#f3dce4] pb-3">
                <span className="text-slate-600">Đã nhập kho</span>
                <b className="text-base text-[#168a51]">{totalQtyRec} sản phẩm</b>
              </div>

              <div className="flex items-center justify-between pb-1">
                <span className="text-slate-600">Còn lại chờ nhập</span>
                <b className="text-base text-[#d92e70]">{totalQtyPending} sản phẩm</b>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {(po.status === "APPROVED" || po.status === "PARTIALLY_RECEIVED") && (
                <Button
                  type="primary"
                  block
                  icon={<PackageCheck size={18} />}
                  size="large"
                  onClick={() => setIsReceiveOpen(true)}
                  className="h-11 rounded-xl bg-[#c2185b] font-bold shadow-sm hover:bg-[#a70f4b]"
                >
                  Nhận hàng vào kho
                </Button>
              )}

              <Button
                block
                icon={<Printer size={18} />}
                size="large"
                onClick={handlePrintPO}
                className="h-11 rounded-xl border-[#efd3dc] font-bold text-slate-700 hover:border-[#c2185b] hover:text-[#c2185b]"
              >
                In phiếu nhập hàng (Print PO)
              </Button>
            </div>
          </article>

          {/* Activity History Timeline Card */}
          <article className="rounded-2xl border border-[#eed2db] bg-white p-6 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
            <div className="flex items-center gap-2 text-lg font-black text-slate-950">
              <Clock size={20} className="text-[#c2185b]" /> Lịch sử hoạt động (Activity History)
            </div>

            <div className="mt-6 space-y-6">
              {po.history.map((h, idx) => (
                <div key={h.id || idx} className="relative border-l-2 border-[#f2d0dc] pl-5">
                  <span
                    className={`absolute -left-[7px] top-0 h-3 w-3 rounded-full ring-4 ring-white ${
                      h.type === "approved" || h.type === "received"
                        ? "bg-[#168a51]"
                        : h.type === "cancelled"
                        ? "bg-red-500"
                        : "bg-[#c2185b]"
                    }`}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <b className="text-sm text-slate-900">{h.title}</b>
                    <span className="text-[11px] font-medium text-slate-400">
                      {h.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Thực hiện bởi: <b className="text-slate-800">{h.actor}</b>
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <ReceiveItemsModal
        open={isReceiveOpen}
        po={po}
        onClose={() => setIsReceiveOpen(false)}
        onSubmit={handleReceiveSubmit}
      />
    </div>
  );
}
