import React, { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Input, Select, Table } from "antd";
import {
  Activity,
  CheckCircle2,
  Download,
  Mail,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
  XCircle,
} from "lucide-react";
import { userStaffService } from "./userStaffService";
import { CustomerItem } from "./userStaffTypes";

export function CustomerManagementTab() {
  const [reloadKey, setReloadKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [marketingFilter, setMarketingFilter] = useState("ALL");

  useEffect(() => { userStaffService.fetchCustomersFromBackend().then(() => setReloadKey((value) => value + 1)); }, []);

  const customers = useMemo(() => {
    let list = userStaffService.getCustomers();

    if (statusFilter !== "ALL") {
      list = list.filter((c) => c.status === statusFilter);
    }

    if (marketingFilter === "YES") {
      list = list.filter((c) => c.marketingOptIn);
    } else if (marketingFilter === "NO") {
      list = list.filter((c) => !c.marketingOptIn);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.customerCode.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    return list;
  }, [statusFilter, marketingFilter, searchText, reloadKey]);

  const renderStatusBadge = (status: "Hoạt động" | "Tạm khóa") => {
    if (status === "Hoạt động") {
      return (
        <span className="rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black text-[#168a51]">
          Hoạt động
        </span>
      );
    }
    return (
      <span className="rounded-full bg-[#ffdce7] px-3 py-1 text-xs font-black text-[#d92e70]">
        Tạm khóa
      </span>
    );
  };

  const columns = [
    {
      title: "Khách Hàng",
      key: "customer",
      render: (_: any, record: CustomerItem) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {record.avatar ? (
              <img
                src={record.avatar}
                alt={record.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs font-bold text-slate-500">
                {record.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="font-extrabold text-slate-900">{record.name}</div>
            <div className="text-xs text-slate-400">{record.customerCode}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên Hệ",
      key: "contact",
      render: (_: any, record: CustomerItem) => (
        <div className="text-xs space-y-0.5">
          <div className="text-slate-700">{record.email}</div>
          <div className="font-semibold text-slate-900">{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Thông Tin",
      key: "info",
      render: (_: any, record: CustomerItem) => (
        <div className="text-xs space-y-0.5">
          <div className="text-slate-700">{record.dob}</div>
          <div className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] inline-block font-medium text-slate-600">
            {record.province}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng Chi Tiêu",
      key: "spend",
      render: (_: any, record: CustomerItem) => (
        <div>
          <div className="font-extrabold text-slate-900">
            {record.totalSpend.toLocaleString("vi-VN")} đ
          </div>
          <div className="text-xs text-slate-500">{record.orderCount} đơn hàng</div>
        </div>
      ),
    },
    {
      title: "Marketing",
      dataIndex: "marketingOptIn",
      key: "marketingOptIn",
      render: (val: boolean) =>
        val ? (
          <CheckCircle2 size={18} className="text-emerald-500" />
        ) : (
          <XCircle size={18} className="text-slate-300" />
        ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: "Hoạt động" | "Tạm khóa") => renderStatusBadge(status),
    },
    {
      title: "Tác Vụ",
      key: "actions",
      render: () => (
        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <MoreVertical size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards matching Image 3 */}
      <section className="grid gap-4 sm:grid-cols-3">
        {/* Metric Card 1 */}
        <div className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-5 shadow-[0_3px_10px_rgba(79,20,45,0.02)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Users size={16} className="text-[#c2185b]" /> Tổng Khách Hàng
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-950">12,450</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-600">
              📈 +5.2%
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-[#f3dce4] pt-2 text-xs text-slate-500">
            <span>Tháng này: <b>+320</b></span>
            <button className="font-bold text-[#c2185b] hover:underline">Chi tiết &gt;</button>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-5 shadow-[0_3px_10px_rgba(79,20,45,0.02)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Activity size={16} className="text-[#c2185b]" /> Đang Hoạt Động (30 ngày)
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-950">8,920</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-600">
              📈 +1.8%
            </span>
          </div>
          <div className="border-t border-[#f3dce4] pt-2 text-xs text-slate-500">
            Tỷ lệ hoạt động: <b>71%</b>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-5 shadow-[0_3px_10px_rgba(79,20,45,0.02)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Mail size={16} className="text-[#c2185b]" /> Nhận Tin Marketing
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-950">65%</span>
            <span className="text-xs text-slate-500">/ tổng KH</span>
          </div>
          <div className="flex items-center gap-4 border-t border-[#f3dce4] pt-2 text-xs text-slate-500">
            <span>🔴 Email: <b>42%</b></span>
            <span>🔴 SMS: <b>23%</b></span>
          </div>
        </div>
      </section>

      {/* Header Actions & Filter Bar matching Image 3 */}
      <section className="rounded-2xl border border-[#eed2db] bg-white p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm ID, Tên, SĐT..."
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
            className="w-44"
            options={[
              { label: "Tất cả trạng thái", value: "ALL" },
              { label: "Hoạt động", value: "Hoạt động" },
              { label: "Tạm khóa", value: "Tạm khóa" },
            ]}
          />

          <Select
            value={marketingFilter}
            onChange={(val) => setMarketingFilter(val)}
            size="large"
            className="w-48"
            options={[
              { label: "Nhận Marketing", value: "ALL" },
              { label: "Đã đăng ký (Đồng ý)", value: "YES" },
              { label: "Chưa đăng ký", value: "NO" },
            ]}
          />

          <button className="grid h-10 w-10 place-items-center rounded-xl border border-[#efd3dc] text-slate-600 hover:bg-[#fff0f5] hover:text-[#c2185b]">
            <RefreshCw size={17} />
          </button>

          <button className="grid h-10 w-10 place-items-center rounded-xl border border-[#efd3dc] text-slate-600 hover:bg-[#fff0f5] hover:text-[#c2185b]">
            <SlidersHorizontal size={17} />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <Button icon={<Download size={16} />} size="large" className="font-bold">
              Xuất danh sách
            </Button>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              size="large"
              className="rounded-xl bg-[#c2185b] font-bold hover:bg-[#a70f4b]"
            >
              Thêm khách hàng
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Table Section */}
      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table
          dataSource={customers}
          columns={columns}
          rowKey="id"
          rowSelection={{ type: "checkbox" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) => (
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> trong tổng số <b className="text-slate-800">12,450</b> khách hàng
              </span>
            ),
          }}
        />
      </section>
    </div>
  );
}
