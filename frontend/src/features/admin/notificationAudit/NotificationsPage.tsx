import React, { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Input, Select, Table } from "antd";
import {
  CheckCheck,
  Check,
  ChevronRight,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { notificationAuditService } from "./notificationAuditService";
import { NotificationItem, NotificationStatus, NotificationType } from "./notificationAuditTypes";

export function NotificationsPage() {
  const [reloadKey, setReloadKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    notificationAuditService.fetchNotificationsFromBackend().then(() => {
      setReloadKey((prev) => prev + 1);
    });
  }, []);

  const notifications = useMemo(() => {
    let list = notificationAuditService.getNotifications();

    if (statusFilter !== "ALL") {
      list = list.filter((n) => n.status === statusFilter);
    }

    if (typeFilter !== "ALL") {
      list = list.filter((n) => n.type === typeFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.userName.toLowerCase().includes(q) ||
          n.userCode.toLowerCase().includes(q) ||
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.bizCode.toLowerCase().includes(q)
      );
    }

    return list;
  }, [statusFilter, typeFilter, searchText, reloadKey]);

  const renderTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "Transactional":
        return (
          <span className="rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black text-[#168a51]">
            Transactional
          </span>
        );
      case "Marketing":
        return (
          <span className="rounded-full bg-[#ffdce7] px-3 py-1 text-xs font-black text-[#d92e70]">
            Marketing
          </span>
        );
      case "System":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
            System
          </span>
        );
      default:
        return null;
    }
  };

  const renderStatusBadge = (status: NotificationStatus) => {
    if (status === "Đã đọc") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600">
          <CheckCheck size={16} /> Đã đọc
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
        <Check size={14} /> Đã gửi
      </span>
    );
  };

  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (_: any, record: NotificationItem) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#ffe4ed] font-extrabold text-[#c2185b]">
            {record.userName.charAt(0)}
          </div>
          <div>
            <div className="font-extrabold text-slate-900">{record.userName}</div>
            <div className="text-xs text-slate-400">{record.userCode}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Loại TB",
      dataIndex: "type",
      key: "type",
      render: (type: NotificationType) => renderTypeBadge(type),
    },
    {
      title: "Tiêu đề / Nội dung",
      key: "titleContent",
      render: (_: any, record: NotificationItem) => (
        <div className="max-w-[380px]">
          <div className="font-extrabold text-slate-900">{record.title}</div>
          <div className="text-xs text-slate-500 line-clamp-1">{record.content}</div>
        </div>
      ),
    },
    {
      title: "Thực thể (Biz Code)",
      dataIndex: "bizCode",
      key: "bizCode",
      render: (code: string) => (
        <span className="font-mono text-xs font-bold text-slate-700">{code}</span>
      ),
    },
    {
      title: "Trạng thái đọc",
      dataIndex: "status",
      key: "status",
      render: (status: NotificationStatus) => renderStatusBadge(status),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => <span className="text-xs text-slate-500">{text}</span>,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header Section matching Image 1 */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Giám sát Thông báo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi và quản lý luồng gửi thông báo đa kênh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button icon={<Filter size={16} />} size="large" className="font-bold">
            Lọc
          </Button>
          <Button icon={<Download size={16} />} size="large" className="font-bold">
            Xuất CSV
          </Button>
        </div>
      </section>

      {/* Filter Bar Section matching Image 1 */}
      <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm kiếm thông báo, user."
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
              { label: "Tất cả trạng thái", value: "ALL" },
              { label: "Đã đọc", value: "Đã đọc" },
              { label: "Đã gửi", value: "Đã gửi" },
            ]}
          />

          <Select
            value={typeFilter}
            onChange={(val) => setTypeFilter(val)}
            size="large"
            className="w-52"
            options={[
              { label: "Tất cả loại thông báo", value: "ALL" },
              { label: "Transactional", value: "Transactional" },
              { label: "Marketing", value: "Marketing" },
              { label: "System", value: "System" },
            ]}
          />

          <DatePicker size="large" className="w-44" placeholder="mm/dd/yyyy" format="DD/MM/YYYY" />
        </div>
      </section>

      {/* Notifications Table Section matching Image 1 */}
      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table
          dataSource={notifications}
          columns={columns}
          rowKey="id"
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4 bg-slate-50 text-xs space-y-1">
                <div className="font-bold text-slate-900">Chi tiết nội dung gửi:</div>
                <p className="text-slate-700">{record.content}</p>
              </div>
            ),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> của <b className="text-slate-800">2,491</b>
              </span>
            ),
          }}
        />
      </section>
    </div>
  );
}
