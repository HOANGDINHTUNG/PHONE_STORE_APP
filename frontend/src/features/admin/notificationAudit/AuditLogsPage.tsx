import React, { useMemo, useState } from "react";
import { Button, DatePicker, Drawer, Input, Select, Table } from "antd";
import {
  AlertCircle,
  Download,
  Eye,
  Info,
  Search,
  X,
} from "lucide-react";
import { notificationAuditService } from "./notificationAuditService";
import { AuditLogItem, AuditLogResult } from "./notificationAuditTypes";

export function AuditLogsPage() {
  const [searchText, setSearchText] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [resultFilter, setResultFilter] = useState("ALL");

  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const auditLogs = useMemo(() => {
    let list = notificationAuditService.getAuditLogs();

    if (actionFilter !== "ALL") {
      list = list.filter((a) => a.actionCode === actionFilter);
    }

    if (entityFilter !== "ALL") {
      list = list.filter((a) => a.entityType === entityFilter);
    }

    if (resultFilter !== "ALL") {
      list = list.filter((a) => a.result === resultFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.actorEmail.toLowerCase().includes(q) ||
          a.correlationId.toLowerCase().includes(q) ||
          a.actionCode.toLowerCase().includes(q)
      );
    }

    return list;
  }, [actionFilter, entityFilter, resultFilter, searchText]);

  const openDetailDrawer = (log: AuditLogItem) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const renderResultBadge = (result: AuditLogResult) => {
    if (result === "SUCCESS") {
      return (
        <span className="rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black text-[#168a51]">
          SUCCESS
        </span>
      );
    }
    return (
      <span className="rounded-full bg-[#ffdce7] px-3 py-1 text-xs font-black text-[#d92e70]">
        FAILURE
      </span>
    );
  };

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text: string) => <span className="text-xs text-slate-500">{text}</span>,
    },
    {
      title: "Người thực hiện",
      dataIndex: "actorEmail",
      key: "actorEmail",
      render: (email: string) => <span className="font-bold text-slate-900">{email}</span>,
    },
    {
      title: "Hành động",
      dataIndex: "actionCode",
      key: "actionCode",
      render: (code: string) => (
        <span className="rounded bg-rose-50 px-2 py-0.5 font-mono text-xs font-bold text-[#c2185b]">
          {code}
        </span>
      ),
    },
    {
      title: "Thực thể",
      dataIndex: "entityType",
      key: "entityType",
      render: (text: string) => <span className="font-semibold text-slate-700">{text}</span>,
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (result: AuditLogResult) => renderResultBadge(result),
    },
    {
      title: "Correlation ID",
      dataIndex: "correlationId",
      key: "correlationId",
      render: (text: string) => (
        <span className="font-mono text-xs text-slate-500">{text}</span>
      ),
    },
    {
      title: "Chi tiết",
      key: "actions",
      render: (_: any, record: AuditLogItem) => (
        <button
          onClick={() => openDetailDrawer(record)}
          className="grid h-8 w-8 place-items-center rounded-lg text-[#c2185b] hover:bg-[#fff0f5]"
          title="Xem chi tiết hành động"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header Section matching Image 2 */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Nhật ký Kiểm toán
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lưu vết toàn bộ hoạt động hệ thống. Chỉ đọc.
          </p>
        </div>

        <Button icon={<Download size={16} />} size="large" className="font-bold">
          Xuất CSV
        </Button>
      </section>

      {/* Filter Bar Section matching Image 2 */}
      <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Email / ID..."
            prefix={<Search size={16} className="mr-1 text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-56"
            size="large"
            allowClear
          />

          <Select
            value={actionFilter}
            onChange={(val) => setActionFilter(val)}
            size="large"
            className="w-48"
            options={[
              { label: "Tất cả hành động", value: "ALL" },
              { label: "UPDATE_CONFIG", value: "UPDATE_CONFIG" },
              { label: "DATA_SYNC", value: "DATA_SYNC" },
              { label: "ASSIGN_ROLE", value: "ASSIGN_ROLE" },
            ]}
          />

          <Select
            value={entityFilter}
            onChange={(val) => setEntityFilter(val)}
            size="large"
            className="w-48"
            options={[
              { label: "Tất cả thực thể", value: "ALL" },
              { label: "SYSTEM_SETTINGS", value: "SYSTEM_SETTINGS" },
              { label: "EXTERNAL_API", value: "EXTERNAL_API" },
              { label: "USER_ROLE", value: "USER_ROLE" },
            ]}
          />

          <Select
            value={resultFilter}
            onChange={(val) => setResultFilter(val)}
            size="large"
            className="w-40"
            options={[
              { label: "Tất cả kết quả", value: "ALL" },
              { label: "SUCCESS", value: "SUCCESS" },
              { label: "FAILURE", value: "FAILURE" },
            ]}
          />

          <DatePicker size="large" className="w-44" placeholder="Hôm nay" format="DD/MM/YYYY" />
        </div>
      </section>

      {/* Audit Logs Table Section matching Image 2 */}
      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table
          dataSource={auditLogs}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> trên tổng số <b className="text-slate-800">1,245</b> bản ghi
              </span>
            ),
          }}
        />
      </section>

      {/* Right Drawer Panel matching Image 2 */}
      <Drawer
        title={null}
        placement="right"
        width={600}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        closable={false}
      >
        {selectedLog ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#f3dce4] pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">Chi tiết hành động</h2>
                <div className="font-mono text-xs font-semibold text-slate-400">
                  Correlation ID: {selectedLog.correlationId}
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* 4 Metadata Card Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Người thực hiện</div>
                <div className="mt-1 font-bold text-slate-900">{selectedLog.actorEmail}</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase">IP / Thiết bị</div>
                <div className="mt-1 text-xs font-semibold text-slate-700">{selectedLog.ipAddress}</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Mã hành động</div>
                <div className="mt-1 font-mono text-xs font-black text-[#c2185b]">
                  {selectedLog.actionCode}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Thực thể / Nghiệp vụ</div>
                <div className="mt-1 text-xs font-bold text-slate-800">{selectedLog.entityType}</div>
              </div>
            </div>

            {/* JSON Diff Section matching Image 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                📑 Thay đổi dữ liệu (Diff)
              </div>

              <div className="grid gap-3 sm:grid-cols-2 font-mono text-xs">
                {/* Old Data */}
                <div className="overflow-hidden rounded-xl bg-slate-900 p-4 text-slate-200">
                  <div className="border-b border-slate-700 pb-2 text-[11px] font-sans font-bold text-slate-400">
                    Dữ liệu cũ (Old)
                  </div>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">
                    {selectedLog.oldDataJson}
                  </pre>
                </div>

                {/* New Data */}
                <div className="overflow-hidden rounded-xl bg-slate-900 p-4 text-emerald-400">
                  <div className="border-b border-slate-700 pb-2 text-[11px] font-sans font-bold text-slate-400">
                    Dữ liệu mới (New)
                  </div>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">
                    {selectedLog.newDataJson}
                  </pre>
                </div>
              </div>
            </div>

            {/* Tamper Proof Callout Box matching Image 2 */}
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
              <Info size={18} className="mt-0.5 text-[#c2185b] shrink-0" />
              <div className="text-xs text-rose-800">
                <div className="font-extrabold">Bản ghi chống giả mạo (Tamper-proof)</div>
                <p className="mt-1 leading-relaxed text-rose-700">
                  Dữ liệu nhật ký kiểm toán là chỉ đọc (Read-only) và được ký điện tử để đảm bảo tính toàn vẹn. Không hỗ trợ thao tác Xóa/Sửa.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
