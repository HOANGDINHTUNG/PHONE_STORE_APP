import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Input, Select, Table, message } from "antd";
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { userStaffService } from "./userStaffService";
import { ProfileType, UserAccountItem, UserAccountStatus } from "./userStaffTypes";

export function AllUsersTab() {
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [profileTypeFilter, setProfileTypeFilter] = useState<string>("ALL");

  useEffect(() => {
    userStaffService.fetchUsersFromBackend().then(() => {
      setReloadKey((prev) => prev + 1);
    });
  }, []);

  const users = useMemo(() => {
    let list = userStaffService.getUsers();

    if (statusFilter !== "ALL") {
      list = list.filter((u) => u.status === statusFilter);
    }

    if (profileTypeFilter !== "ALL") {
      list = list.filter((u) => u.profileType === profileTypeFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.userIdCode.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
    }

    return list;
  }, [statusFilter, profileTypeFilter, searchText, reloadKey]);

  const renderStatusBadge = (status: UserAccountStatus) => {
    switch (status) {
      case "HOẠT ĐỘNG":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black text-[#168a51]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#168a51]" />
            HOẠT ĐỘNG
          </span>
        );
      case "CHỜ XÁC MINH":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffdce7] px-3 py-1 text-xs font-black text-[#d92e70]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d92e70]" />
            CHỜ XÁC MINH
          </span>
        );
      case "BỊ KHÓA":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            BỊ KHÓA
          </span>
        );
      default:
        return null;
    }
  };

  const renderProfileBadge = (type: ProfileType) => {
    if (type === "Staff") {
      return (
        <span className="rounded-md bg-[#ffe4ed] px-2.5 py-1 text-xs font-bold text-[#c2185b]">
          Staff
        </span>
      );
    }
    return (
      <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
        Customer
      </span>
    );
  };

  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (_: any, record: UserAccountItem) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
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
              <div className="grid h-full w-full place-items-center font-bold text-slate-500">
                {record.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="font-extrabold text-slate-900">{record.name}</div>
            <div className="text-xs font-medium text-slate-400">
              ID: {record.userIdCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_: any, record: UserAccountItem) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Mail size={13} className="text-slate-400" />
            <span>{record.email}</span>
            {record.isEmailVerified ? (
              <CheckCircle2 size={13} className="text-emerald-500" />
            ) : (
              <AlertCircle size={13} className="text-amber-500" />
            )}
          </div>
          {record.phone && (
            <div className="flex items-center gap-1.5 text-slate-700">
              <Phone size={13} className="text-slate-400" />
              <span>{record.phone}</span>
              {record.isPhoneVerified ? (
                <CheckCircle2 size={13} className="text-emerald-500" />
              ) : (
                <AlertCircle size={13} className="text-amber-500" />
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Loại hồ sơ",
      dataIndex: "profileType",
      key: "profileType",
      render: (type: ProfileType) => renderProfileBadge(type),
    },
    {
      title: "Vai trò đang có",
      key: "roles",
      width: 210,
      render: (_: any, record: UserAccountItem) => (
        <div className="flex flex-wrap gap-1">
          {record.roleNames?.length ? record.roleNames.map((role) => (
            <span key={role} className="max-w-[180px] truncate rounded-md bg-[#fff0f5] px-2 py-1 text-xs font-bold text-[#c2185b]" title={role}>{role}</span>
          )) : <span className="text-xs text-slate-400">Chưa được cấp vai trò</span>}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: UserAccountStatus) => renderStatusBadge(status),
    },
    {
      title: "Đăng nhập cuối",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (text: string) => <span className="text-xs text-slate-500">{text}</span>,
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
      render: (_: any, record: UserAccountItem) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "details",
                label: "Xem chi tiết hồ sơ",
                onClick: () => message.info(`Đang xem chi tiết tài khoản ${record.name}`),
              },
              {
                key: "roles",
                label: "Quản lý vai trò & quyền",
                onClick: () => navigate("/admin/roles"),
              },
              {
                key: "status",
                label: record.status === "BỊ KHÓA" ? "Mở khóa tài khoản" : "Khóa tài khoản",
                danger: record.status !== "BỊ KHÓA",
                onClick: async () => {
                  try {
                    const nextStatus = record.status === "BỊ KHÓA" ? "ACTIVE" : "LOCKED";
                    await userStaffService.changeUserAccountStatus(String(record.id), nextStatus);
                    await userStaffService.fetchUsersFromBackend();
                    setReloadKey((value) => value + 1);
                    message.success(nextStatus === "ACTIVE" ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.");
                  } catch {
                    message.error("Không thể cập nhật trạng thái tài khoản.");
                  }
                },
              },
            ],
          }}
          trigger={["click"]}
        >
          <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <MoreHorizontal size={18} />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action & Filter Bar matching Image 1 */}
      <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            TRẠNG THÁI:
          </div>
          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            size="large"
            className="w-40"
            options={[
              { label: "Tất cả", value: "ALL" },
              { label: "HOẠT ĐỘNG", value: "HOẠT ĐỘNG" },
              { label: "CHỜ XÁC MINH", value: "CHỜ XÁC MINH" },
              { label: "BỊ KHÓA", value: "BỊ KHÓA" },
            ]}
          />

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            LOẠI HỒ SƠ:
          </div>
          <Select
            value={profileTypeFilter}
            onChange={(val) => setProfileTypeFilter(val)}
            size="large"
            className="w-36"
            options={[
              { label: "Tất cả", value: "ALL" },
              { label: "Customer", value: "Customer" },
              { label: "Staff", value: "Staff" },
            ]}
          />

          <Input
            placeholder="Tìm theo tên, email, SĐT..."
            prefix={<Search size={16} className="mr-1 text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-80"
            size="large"
            allowClear
          />

          <div className="ml-auto flex items-center gap-3">
            <Button
              size="large"
              icon={<Filter size={16} />}
              className="rounded-xl border-[#efd3dc] font-bold text-slate-700 hover:border-[#c2185b] hover:text-[#c2185b]"
            >
              Lọc
            </Button>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              size="large"
              className="rounded-xl bg-[#c2185b] font-bold hover:bg-[#a70f4b]"
            >
              Thêm người dùng
            </Button>
          </div>
        </div>
      </section>

      {/* Users Table */}
      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <b className="text-slate-800">{range[0]} đến {range[1]}</b> trong <b className="text-slate-800">12,450</b> người dùng
              </span>
            ),
          }}
        />
      </section>
    </div>
  );
}
