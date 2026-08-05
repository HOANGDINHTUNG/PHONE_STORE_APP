import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, Table, message } from "antd";
import { ChevronRight, Filter, Plus, Search } from "lucide-react";
import { afterSalesService } from "./afterSalesService";
import { WarrantyClaimItem, WarrantyClaimStatusType } from "./afterSalesTypes";

export function WarrantyClaimsTab() {
  const [reloadKey, setReloadKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => { afterSalesService.fetchWarrantyClaimsFromBackend().then(() => setReloadKey((value) => value + 1)); }, []);

  const claims = useMemo(() => {
    let list = afterSalesService.getWarrantyClaims();

    if (statusFilter !== "ALL") {
      list = list.filter((c) => c.status === statusFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.claimCode.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          c.customerPhone.toLowerCase().includes(q) ||
          c.serialImei.toLowerCase().includes(q) ||
          c.productName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [statusFilter, searchText, reloadKey]);

  const renderStatusBadge = (status: WarrantyClaimStatusType) => {
    switch (status) {
      case "INSPECTING":
        return (
          <span className="inline-block rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-black uppercase text-[#0284c7]">
            INSPECTING
          </span>
        );
      case "WAITING_PARTS":
        return (
          <span className="inline-block rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-black uppercase text-[#d97706]">
            WAITING_PARTS
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-block rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black uppercase text-[#168a51]">
            COMPLETED
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="inline-block rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-black uppercase text-[#7e22ce]">
            SUBMITTED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-block rounded-full bg-[#fee2e2] px-3 py-1 text-xs font-black uppercase text-[#dc2626]">
            REJECTED
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
      title: "Claim ID",
      dataIndex: "claimCode",
      key: "claimCode",
      render: (text: string) => <span className="font-extrabold text-slate-900">{text}</span>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_: any, record: WarrantyClaimItem) => (
        <div>
          <div className="font-bold text-slate-900">{record.customerName}</div>
          <div className="text-xs text-slate-400">{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: "Serial/IMEI",
      dataIndex: "serialImei",
      key: "serialImei",
      render: (text: string) => <span className="font-mono text-xs font-semibold text-slate-600">{text}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text: string) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: WarrantyClaimStatusType) => renderStatusBadge(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => <span className="text-xs text-slate-500">{text}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: () => (
        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-[#fff0f5] hover:text-[#c2185b]">
          <ChevronRight size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar & Header Action matching Image 2 */}
      <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="ID Bảo hành, Serial/IMEI, SĐT..."
            prefix={<Search size={16} className="mr-1 text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-72"
            size="large"
            allowClear
          />

          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            size="large"
            className="w-48"
            options={[
              { label: "Tất cả Trạng thái", value: "ALL" },
              { label: "INSPECTING", value: "INSPECTING" },
              { label: "WAITING_PARTS", value: "WAITING_PARTS" },
              { label: "COMPLETED", value: "COMPLETED" },
              { label: "SUBMITTED", value: "SUBMITTED" },
              { label: "REJECTED", value: "REJECTED" },
            ]}
          />

          <Button
            size="large"
            icon={<Filter size={16} />}
            className="rounded-xl border-[#efd3dc] font-bold text-slate-700 hover:border-[#c2185b] hover:text-[#c2185b]"
          >
            Bộ lọc
          </Button>

          <Button
            type="primary"
            icon={<Plus size={18} />}
            size="large"
            onClick={() => message.info("Yêu cầu bảo hành được tạo từ hồ sơ bảo hành của khách hàng.")}
            className="ml-auto rounded-xl bg-[#c2185b] px-5 font-bold shadow-sm hover:bg-[#a70f4b]"
          >
            Tạo Yêu cầu
          </Button>
        </div>
      </section>

      {/* Warranty Claims Table Section */}
      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table
          dataSource={claims}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> của <b className="text-slate-800">{total}</b> yêu cầu
              </span>
            ),
          }}
        />
      </section>

    </div>
  );
}
