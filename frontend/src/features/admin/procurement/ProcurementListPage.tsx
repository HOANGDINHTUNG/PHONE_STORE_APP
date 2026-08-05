import React, { useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Input,
  Select,
  Table,
} from "antd";
import { Plus, RotateCcw, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreatePOModal } from "./CreatePOModal";
import { procurementService } from "./procurementService";
import { CreatePOPayload, PurchaseOrder, PurchaseOrderStatus } from "./procurementTypes";

const { RangePicker } = DatePicker;

export function ProcurementListPage() {
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("ALL");
  const [searchText, setSearchText] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const purchaseOrders = useMemo(() => {
    return procurementService.getPurchaseOrders({
      status: statusFilter,
      warehouse: warehouseFilter,
      search: searchText,
    });
  }, [statusFilter, warehouseFilter, searchText, reloadKey]);

  const handleClearFilters = () => {
    setStatusFilter("ALL");
    setWarehouseFilter("ALL");
    setSearchText("");
  };

  const handleCreateSubmit = (payload: CreatePOPayload) => {
    const newPO = procurementService.createPO(payload);
    setIsCreateOpen(false);
    setReloadKey((prev) => prev + 1);
    navigate(`/admin/procurement/${newPO.code}`);
  };

  const renderStatusBadge = (status: PurchaseOrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-block rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#168a51]">
            HOÀN TẤT
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-block rounded-full bg-[#ffdce7] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#d92e70]">
            ĐÃ DUYỆT
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-block rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#64748b]">
            BẢN NHÁP
          </span>
        );
      case "PENDING_APPROVAL":
        return (
          <span className="inline-block rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#d97706]">
            CHỜ DUYỆT
          </span>
        );
      case "PARTIALLY_RECEIVED":
        return (
          <span className="inline-block rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0284c7]">
            NHẬP MỘT PHẦN
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-block rounded-full bg-[#fee2e2] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#dc2626]">
            ĐÃ HỦY
          </span>
        );
      default:
        return (
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {status}
          </span>
        );
    }
  };

  const columns = [
    {
      title: "Mã đơn nhập",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <Link
          to={`/admin/procurement/${code}`}
          className="font-bold text-[#d92e70] hover:underline"
        >
          {code}
        </Link>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      render: (text: string) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: "Kho nhận",
      dataIndex: "destWarehouse",
      key: "destWarehouse",
      render: (text: string) => <span className="text-slate-600">{text}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val: number) => (
        <span className="font-extrabold text-slate-900">
          {val.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      title: "Ngày dự kiến",
      dataIndex: "expectedDelivery",
      key: "expectedDelivery",
      render: (text: string) => <span className="text-slate-600">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: PurchaseOrderStatus) => renderStatusBadge(status),
    },
    {
      title: "Người tạo / Duyệt",
      key: "creatorApprover",
      render: (_: any, record: PurchaseOrder) => (
        <div className="text-xs text-slate-700">
          <div className="font-medium">{record.creator}</div>
          <div className="text-slate-400">{record.approver || "--"}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Đơn nhập hàng (Purchase Orders)</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý và theo dõi tiến độ nhập hàng từ các nhà cung cấp.
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          size="large"
          onClick={() => setIsCreateOpen(true)}
          className="h-11 rounded-xl bg-[#c2185b] px-5 font-bold shadow-sm hover:bg-[#a70f4b]"
        >
          Tạo đơn nhập hàng
        </Button>
      </section>

      <section className="rounded-2xl border border-[#eed2db] bg-white p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm mã PO, nhà cung cấp..."
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
              { label: "HOÀN TẤT", value: "COMPLETED" },
              { label: "ĐÃ DUYỆT", value: "APPROVED" },
              { label: "BẢN NHÁP", value: "DRAFT" },
              { label: "CHỜ DUYỆT", value: "PENDING_APPROVAL" },
              { label: "NHẬP MỘT PHẦN", value: "PARTIALLY_RECEIVED" },
              { label: "ĐÃ HỦY", value: "CANCELLED" },
            ]}
          />

          <Select
            value={warehouseFilter}
            onChange={(val) => setWarehouseFilter(val)}
            size="large"
            className="w-52"
            options={[
              { label: "Tất cả kho hàng", value: "ALL" },
              { label: "Kho Tổng - Quận 7", value: "Kho Tổng" },
              { label: "Trung tâm Phân phối Chính", value: "Main Dist." },
              { label: "Kho Miền Bắc (North Hub)", value: "North Hub" },
              { label: "Kho Miền Nam (South Hub)", value: "South Hub" },
            ]}
          />

          <RangePicker size="large" className="w-full sm:w-auto" format="DD/MM/YYYY" placeholder={["Từ ngày", "Đến ngày"]} />

          <button
            onClick={handleClearFilters}
            className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-[#d92e70] hover:underline"
          >
            <RotateCcw size={15} /> Xóa bộ lọc
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table
          dataSource={purchaseOrders}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <b className="text-slate-800">{range[0]} - {range[1]}</b> trong tổng số <b className="text-slate-800">{total}</b> đơn nhập hàng
              </span>
            ),
          }}
          className="admin-po-table"
        />
      </section>

      <CreatePOModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
