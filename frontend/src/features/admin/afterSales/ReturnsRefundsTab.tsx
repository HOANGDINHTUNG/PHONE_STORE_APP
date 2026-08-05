import React, { useMemo, useState } from "react";
import { Button, Input, Select, Table, message } from "antd";
import {
  CheckCircle2,
  ExternalLink,
  Plus,
  Play,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import { afterSalesService } from "./afterSalesService";
import { ReturnRequestItem, ReturnRequestStatusType } from "./afterSalesTypes";

export function ReturnsRefundsTab() {
  const [reloadKey, setReloadKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedId, setSelectedId] = useState<string>("ret-1");
  const [techNote, setTechNote] = useState("");

  const returnRequests = useMemo(() => {
    let list = afterSalesService.getReturnRequests();

    if (statusFilter !== "ALL") {
      list = list.filter((r) => r.status === statusFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.returnCode.toLowerCase().includes(q) ||
          r.orderCode.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.customerPhone.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [statusFilter, searchText, reloadKey]);

  const selectedItem = useMemo(() => {
    return returnRequests.find((r) => r.id === selectedId) || returnRequests[0];
  }, [returnRequests, selectedId]);

  const handleApproveReturn = () => {
    if (!selectedItem) return;
    afterSalesService.updateReturnRequestStatus(selectedItem.id, "APPROVED", techNote);
    message.success(`Đã phê duyệt yêu cầu đổi trả ${selectedItem.returnCode}`);
    setReloadKey((prev) => prev + 1);
  };

  const handleSaveDraft = () => {
    if (!selectedItem) return;
    afterSalesService.updateReturnRequestStatus(selectedItem.id, selectedItem.status, techNote);
    message.info("Đã lưu ghi chú kiểm định nháp.");
    setReloadKey((prev) => prev + 1);
  };

  const renderStatusBadge = (status: ReturnRequestStatusType) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black text-[#168a51]">
            ĐÃ DUYỆT
          </span>
        );
      case "PENDING":
        return (
          <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-black text-[#d97706]">
            ĐANG XỬ LÝ
          </span>
        );
      case "REJECTED":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600">
            TỪ CHỐI
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {status}
          </span>
        );
    }
  };

  const columns = [
    {
      title: "Mã YC",
      dataIndex: "returnCode",
      key: "returnCode",
      render: (code: string, record: ReturnRequestItem) => (
        <button
          onClick={() => setSelectedId(record.id)}
          className={`font-black hover:underline ${
            selectedId === record.id ? "text-[#c2185b]" : "text-slate-800"
          }`}
        >
          {code}
        </button>
      ),
    },
    {
      title: "Mã ĐH",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text: string) => <span className="font-semibold text-slate-700">{text}</span>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_: any, record: ReturnRequestItem) => (
        <div>
          <div className="font-bold text-slate-900">{record.customerName}</div>
          <div className="text-xs text-slate-400">{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text: string) => <span className="font-semibold text-slate-800">{text}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar matching Image 3 */}
      <section className="rounded-2xl border border-[#eed2db] bg-white p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm ID Yêu cầu, Mã ĐH..."
            prefix={<Search size={16} className="mr-1 text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-64"
            size="large"
            allowClear
          />

          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            size="large"
            className="w-48"
            options={[
              { label: "Tất cả trạng thái", value: "ALL" },
              { label: "ĐANG XỬ LÝ (PENDING)", value: "PENDING" },
              { label: "ĐÃ DUYỆT (APPROVED)", value: "APPROVED" },
              { label: "TỪ CHỐI (REJECTED)", value: "REJECTED" },
            ]}
          />

          <Button
            type="primary"
            icon={<Plus size={18} />}
            size="large"
            className="bg-[#c2185b] font-bold hover:bg-[#a70f4b]"
          >
            Tạo Yêu cầu mới
          </Button>
        </div>
      </section>

      {/* Main Grid: Table Left, Detail Panel Right matching Image 3 */}
      <section className="grid gap-6 xl:grid-cols-[1fr_480px]">
        {/* Left Table */}
        <div className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
          <Table
            dataSource={returnRequests}
            columns={columns}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => {
                setSelectedId(record.id);
                setTechNote(record.technicianNote || "");
              },
              className: `cursor-pointer transition-colors ${
                selectedId === record.id ? "bg-[#fff0f5]" : ""
              }`,
            })}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              showTotal: (total, range) => (
                <span className="text-sm font-medium text-slate-500">
                  Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> của <b className="text-slate-800">{total}</b>
                </span>
              ),
            }}
          />
        </div>

        {/* Right Detail Panel matching Image 3 */}
        {selectedItem ? (
          <article className="space-y-6 rounded-2xl border border-[#eed2db] bg-white p-6 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#f3dce4] pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">Chi tiết Yêu cầu</h2>
                <div className="mt-1 font-mono text-sm font-extrabold text-[#c2185b]">
                  {selectedItem.returnCode}
                </div>
              </div>
              <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            {/* Order & Date metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-400">Đơn hàng gốc</span>
                <div className="mt-0.5 inline-flex items-center gap-1 font-bold text-[#c2185b] hover:underline">
                  {selectedItem.orderCode} <ExternalLink size={13} />
                </div>
              </div>
              <div>
                <span className="text-slate-400">Ngày yêu cầu</span>
                <div className="mt-0.5 font-semibold text-slate-700">
                  {selectedItem.requestDate}
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 font-black text-slate-600">
                {selectedItem.customerName.charAt(0)}
              </div>
              <div>
                <div className="font-extrabold text-slate-900">{selectedItem.customerName}</div>
                <div className="text-xs text-slate-500">
                  {selectedItem.customerPhone} • {selectedItem.customerEmail}
                </div>
              </div>
            </div>

            {/* Returned Item Card */}
            <div className="rounded-xl border border-[#f3dce4] bg-[#fffafb] p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#c2185b]">
                📱 Sản phẩm hoàn trả
              </div>
              <div className="flex items-center justify-between font-extrabold text-slate-900">
                <span>{selectedItem.productName}</span>
                <span>x{selectedItem.quantity}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>IMEI 1: {selectedItem.serialImei || "356789123456789"}</span>
                <span>
                  Tình trạng: <b className="text-[#c2185b]">{selectedItem.conditionNote}</b>
                </span>
              </div>
              <div className="text-xs text-slate-600">
                Giá mua: <b className="text-slate-900">{selectedItem.originalPrice.toLocaleString("vi-VN")} đ</b>
              </div>
            </div>

            {/* Reason & Evidence Box */}
            <div className="space-y-3 rounded-xl border border-[#f5dce4] bg-[#fff5f8] p-4 text-xs">
              <div className="font-bold text-[#c2185b]">Lý do & Bằng chứng</div>
              <div className="font-extrabold text-red-600">{selectedItem.reasonTitle}</div>
              <p className="leading-relaxed text-slate-700">{selectedItem.reasonDetail}</p>
              {selectedItem.evidenceImages && selectedItem.evidenceImages.length > 0 && (
                <div className="flex items-center gap-3 pt-1">
                  {selectedItem.evidenceImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-black"
                    >
                      <img src={img} alt="Evidence" className="h-full w-full object-cover opacity-80" />
                      <div className="absolute inset-0 grid place-items-center bg-black/30 text-white">
                        <Play size={18} />
                      </div>
                      <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[9px] text-white">
                        0:15
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inspection Result Card */}
            <div className="space-y-4 rounded-xl border border-[#eed2db] bg-[#fffafb] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Kết quả kiểm định</span>
                {renderStatusBadge(selectedItem.status)}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Ghi chú KTV (Nội bộ)</label>
                <Input.TextArea
                  rows={2}
                  placeholder="Nhập tình trạng thực tế sau khi kiểm tra máy..."
                  value={techNote}
                  onChange={(e) => setTechNote(e.target.value)}
                  className="mt-1.5 rounded-xl border-[#efd3dc]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button size="large" onClick={handleSaveDraft} className="rounded-xl font-bold">
                  Lưu nháp
                </Button>
                <Button
                  type="primary"
                  icon={<CheckCircle2 size={18} />}
                  size="large"
                  onClick={handleApproveReturn}
                  className="rounded-xl bg-[#c2185b] font-bold shadow-sm hover:bg-[#a70f4b]"
                >
                  Duyệt Yêu cầu
                </Button>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </div>
  );
}
