import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, DatePicker, Drawer, Input, Select, Table } from "antd";
import { Download, Eye, Info, RefreshCw, Search, X } from "lucide-react";
import { notificationAuditService } from "./notificationAuditService";
import { AuditLogItem, AuditLogResult } from "./notificationAuditTypes";

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value || "—" : date.toLocaleString("vi-VN");
};
const csvValue = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [resultFilter, setResultFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState<any>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setLogs(await notificationAuditService.fetchAuditLogsFromBackend());
    } catch {
      setLogs([]);
      setLoadError("Không tải được nhật ký kiểm toán. Hãy kiểm tra kết nối backend và quyền quản trị.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void loadLogs(); }, [loadLogs]);

  const actionOptions = useMemo(() => [...new Set(logs.map((log) => log.actionCode).filter(Boolean))].sort().map((value) => ({ label: value, value })), [logs]);
  const entityOptions = useMemo(() => [...new Set(logs.map((log) => log.entityType).filter(Boolean))].sort().map((value) => ({ label: value, value })), [logs]);
  const auditLogs = useMemo(() => logs.filter((log) => {
    if (actionFilter !== "ALL" && log.actionCode !== actionFilter) return false;
    if (entityFilter !== "ALL" && log.entityType !== entityFilter) return false;
    if (resultFilter !== "ALL" && log.result !== resultFilter) return false;
    if (dateFilter) {
      const date = new Date(log.timestamp);
      if (Number.isNaN(date.getTime()) || !dateFilter.isSame(date, "day")) return false;
    }
    const query = searchText.trim().toLowerCase();
    return !query || [log.actorEmail, log.correlationId, log.actionCode, log.entityType, log.ipAddress].some((value) => value?.toLowerCase().includes(query));
  }), [logs, actionFilter, entityFilter, resultFilter, dateFilter, searchText]);

  const exportCsv = () => {
    const rows = [["Thời gian", "Người thực hiện", "Hành động", "Thực thể", "Kết quả", "Correlation ID", "IP"], ...auditLogs.map((log) => [log.timestamp, log.actorEmail, log.actionCode, log.entityType, log.result, log.correlationId, log.ipAddress])];
    const blob = new Blob([`\ufeff${rows.map((row) => row.map(csvValue).join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nhat-ky-kiem-toan-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const resultBadge = (result: AuditLogResult) => <span className={`rounded-full px-3 py-1 text-xs font-black ${result === "SUCCESS" ? "bg-[#dcf9e8] text-[#168a51]" : "bg-[#ffdce7] text-[#d92e70]"}`}>{result}</span>;
  const columns = [
    { title: "Thời gian", dataIndex: "timestamp", key: "timestamp", render: (value: string) => <span className="text-xs text-slate-500">{formatTimestamp(value)}</span> },
    { title: "Người thực hiện", dataIndex: "actorEmail", key: "actorEmail", render: (value: string) => <span className="font-bold text-slate-900">{value || "system"}</span> },
    { title: "Hành động", dataIndex: "actionCode", key: "actionCode", render: (value: string) => <span className="rounded bg-rose-50 px-2 py-0.5 font-mono text-xs font-bold text-[#c2185b]">{value}</span> },
    { title: "Thực thể", dataIndex: "entityType", key: "entityType", render: (value: string) => <span className="font-semibold text-slate-700">{value}</span> },
    { title: "Kết quả", dataIndex: "result", key: "result", render: (value: AuditLogResult) => resultBadge(value) },
    { title: "Correlation ID", dataIndex: "correlationId", key: "correlationId", render: (value: string) => <span className="font-mono text-xs text-slate-500">{value || "—"}</span> },
    { title: "Chi tiết", key: "actions", render: (_: unknown, record: AuditLogItem) => <button onClick={() => { setSelectedLog(record); setIsDrawerOpen(true); }} className="grid h-8 w-8 place-items-center rounded-lg text-[#c2185b] hover:bg-[#fff0f5]" title="Xem chi tiết"><Eye size={18} /></button> },
  ];

  return <div className="mx-auto max-w-[1400px] space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-3xl font-black tracking-tight text-slate-950">Nhật ký Kiểm toán</h1><p className="mt-1 text-sm text-slate-500">Lưu vết các thay đổi nghiệp vụ bởi quản trị viên. Chỉ đọc.</p></div><div className="flex gap-2"><Button icon={<RefreshCw size={16} />} size="large" onClick={() => void loadLogs()} loading={loading}>Làm mới</Button><Button icon={<Download size={16} />} size="large" className="font-bold" onClick={exportCsv} disabled={!auditLogs.length}>Xuất CSV</Button></div></section>
    {loadError && <Alert type="error" showIcon message={loadError} action={<Button size="small" onClick={() => void loadLogs()}>Thử lại</Button>} />}
    <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]"><div className="flex flex-wrap items-center gap-3"><Input placeholder="Người dùng, hành động, IP, correlation ID..." prefix={<Search size={16} className="mr-1 text-slate-400" />} value={searchText} onChange={(event) => setSearchText(event.target.value)} className="w-full sm:w-72" size="large" allowClear /><Select value={actionFilter} onChange={setActionFilter} size="large" className="w-52" options={[{ label: "Tất cả hành động", value: "ALL" }, ...actionOptions]} /><Select value={entityFilter} onChange={setEntityFilter} size="large" className="w-48" options={[{ label: "Tất cả thực thể", value: "ALL" }, ...entityOptions]} /><Select value={resultFilter} onChange={setResultFilter} size="large" className="w-40" options={[{ label: "Tất cả kết quả", value: "ALL" }, { label: "SUCCESS", value: "SUCCESS" }, { label: "FAILURE", value: "FAILURE" }]} /><DatePicker value={dateFilter} onChange={setDateFilter} size="large" className="w-44" placeholder="Chọn ngày" format="DD/MM/YYYY" allowClear /></div></section>
    <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]"><Table loading={loading} dataSource={auditLogs} columns={columns} rowKey="id" locale={{ emptyText: loadError ? "Không thể tải dữ liệu." : "Chưa có nhật ký kiểm toán." }} pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total, range) => <span className="text-sm font-medium text-slate-500">Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> trên tổng số <b className="text-slate-800">{total}</b> bản ghi</span> }} /></section>
    <Drawer rootClassName="audit-log-drawer" title={null} placement="right" width={600} onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen} closable={false}>{selectedLog && <div className="space-y-6"><div className="flex items-start justify-between border-b border-[#f3dce4] pb-4"><div><h2 className="text-xl font-black text-slate-950">Chi tiết hành động</h2><div className="font-mono text-xs font-semibold text-slate-400">Correlation ID: {selectedLog.correlationId || "—"}</div></div><button onClick={() => setIsDrawerOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><div className="grid gap-3 sm:grid-cols-2">{[["Người thực hiện", selectedLog.actorEmail || "system"], ["Thời gian", formatTimestamp(selectedLog.timestamp)], ["IP / Thiết bị", selectedLog.ipAddress || "—"], ["Mã hành động", selectedLog.actionCode], ["Thực thể", selectedLog.entityType], ["Kết quả", selectedLog.result]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[11px] font-bold uppercase text-slate-400">{label}</div><div className="mt-1 break-all text-xs font-bold text-slate-800">{value}</div></div>)}</div><div className="space-y-3"><div className="text-xs font-bold text-slate-800">Thay đổi dữ liệu</div><div className="grid gap-3 sm:grid-cols-2 font-mono text-xs"><div className="overflow-hidden rounded-xl bg-slate-900 p-4 text-slate-200"><div className="border-b border-slate-700 pb-2 text-[11px] font-sans font-bold text-slate-400">Dữ liệu cũ</div><pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">{selectedLog.oldDataJson || "Không có dữ liệu cũ."}</pre></div><div className="overflow-hidden rounded-xl bg-slate-900 p-4 text-emerald-400"><div className="border-b border-slate-700 pb-2 text-[11px] font-sans font-bold text-slate-400">Dữ liệu mới / ngữ cảnh</div><pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">{selectedLog.newDataJson || "Không có dữ liệu thay đổi."}</pre></div></div></div><div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4"><Info size={18} className="mt-0.5 shrink-0 text-[#c2185b]" /><div className="text-xs text-rose-800"><div className="font-extrabold">Bản ghi chỉ đọc</div><p className="mt-1 leading-relaxed text-rose-700">Nhật ký không hỗ trợ sửa hoặc xoá từ giao diện quản trị.</p></div></div></div>}</Drawer>
  </div>;
}
