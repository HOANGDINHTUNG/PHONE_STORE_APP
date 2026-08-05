import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { Download, Edit2, Plus, Search, Shield, Trash2 } from "lucide-react";
import { rolePermissionService } from "./rolePermissionService";
import { RoleItem, RoleStatus, RoleType } from "./rolePermissionTypes";

interface RolesListTabProps {
  onEditRole?: (role: RoleItem) => void;
}

export function RolesListTab({ onEditRole }: RolesListTabProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    rolePermissionService.fetchRolesFromBackend().then(() => {
      setReloadKey((prev) => prev + 1);
    });
  }, []);

  const roles = useMemo(() => {
    let list = rolePermissionService.getRoles();

    if (typeFilter !== "ALL") {
      list = list.filter((r) => r.type === typeFilter);
    }

    if (statusFilter !== "ALL") {
      list = list.filter((r) => r.status === statusFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.roleCode.toLowerCase().includes(q) ||
          r.roleName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [typeFilter, statusFilter, searchText, reloadKey]);

  const renderTypeBadge = (type: RoleType) => {
    if (type === "SYSTEM") {
      return (
        <span className="rounded-md bg-slate-200 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-slate-700">
          SYSTEM
        </span>
      );
    }
    return (
      <span className="rounded-md bg-[#ffe4ed] px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-[#c2185b]">
        CUSTOM
      </span>
    );
  };

  const renderStatusBadge = (status: RoleStatus) => {
    if (status === "Hoạt động") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black text-[#168a51]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#168a51]" />
          Hoạt động
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffdce7] px-3 py-1 text-xs font-black text-[#d92e70]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d92e70]" />
        Không hoạt động
      </span>
    );
  };

  const columns = [
    {
      title: "Mã Vai trò",
      dataIndex: "roleCode",
      key: "roleCode",
      render: (code: string) => <span className="font-mono font-bold text-slate-700">{code}</span>,
    },
    {
      title: "Tên Vai trò",
      key: "roleName",
      render: (_: any, record: RoleItem) => (
        <div className="flex items-center gap-2 font-black text-slate-900">
          <span>{record.roleName}</span>
          {record.type === "SYSTEM" && (
            <Shield size={15} className="text-[#c2185b] fill-[#ffe4ed]" />
          )}
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-[320px]">{text}</span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: RoleType) => renderTypeBadge(type),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: RoleStatus) => renderStatusBadge(status),
    },
    {
      title: "Quyền hạn",
      dataIndex: "permissionCount",
      key: "permissionCount",
      render: (count: number) => <span className="font-extrabold text-slate-800">{count}</span>,
    },
    {
      title: "Người dùng",
      dataIndex: "userCount",
      key: "userCount",
      render: (count: number) => <span className="font-extrabold text-slate-800">{count}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: RoleItem) => (
        <div className="flex items-center gap-2 text-slate-400">
          <button
            onClick={() => onEditRole?.(record)}
            className="p-1 hover:text-[#c2185b]"
            title="Chỉnh sửa quyền"
          >
            <Edit2 size={16} />
          </button>
          {record.type === "CUSTOM" && (
            <button className="p-1 hover:text-red-600" title="Xóa vai trò">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter & Header Action Bar matching Image 1 */}
      <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm kiếm vai trò..."
            prefix={<Search size={16} className="mr-1 text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-64"
            size="large"
            allowClear
          />

          <Select
            value={typeFilter}
            onChange={(val) => setTypeFilter(val)}
            size="large"
            className="w-40"
            options={[
              { label: "Tất cả loại", value: "ALL" },
              { label: "SYSTEM", value: "SYSTEM" },
              { label: "CUSTOM", value: "CUSTOM" },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            size="large"
            className="w-44"
            options={[
              { label: "Trạng thái", value: "ALL" },
              { label: "Hoạt động", value: "Hoạt động" },
              { label: "Không hoạt động", value: "Không hoạt động" },
            ]}
          />

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing <b>1 - {roles.length}</b> of <b>12</b> roles
            </span>
            <Button icon={<Download size={16} />} size="large" className="font-bold">
              Export
            </Button>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              size="large"
              className="rounded-xl bg-[#c2185b] font-bold hover:bg-[#a70f4b]"
            >
              Tạo vai trò mới
            </Button>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table
          dataSource={roles}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
          }}
        />
      </section>
    </div>
  );
}
