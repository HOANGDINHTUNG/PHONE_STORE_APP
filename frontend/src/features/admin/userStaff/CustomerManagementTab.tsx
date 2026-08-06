import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Input, Select, Table, message } from "antd";
import { Activity, Mail, Search, Users } from "lucide-react";
import { userStaffService } from "./userStaffService";
import type { CustomerItem } from "./userStaffTypes";

export function CustomerManagementTab() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("ALL");
  const load = async () => { try { setCustomers(await userStaffService.fetchCustomersFromBackend()); } catch { message.error("Không tải được danh sách khách hàng từ backend."); } };
  useEffect(() => { void load(); }, []);
  const rows = useMemo(() => customers.filter((customer) => { const text = query.trim().toLowerCase(); return (!text || `${customer.name} ${customer.customerCode} ${customer.email} ${customer.phone}`.toLowerCase().includes(text)) && (filter === "ALL" || customer.status === filter); }), [customers, query, filter]);
  const active = customers.filter((customer) => customer.status === "Hoạt động").length;
  const locked = customers.length - active;
  const withPhone = customers.filter((customer) => Boolean(customer.phone)).length;
  const columns = [
    { title: "Khách hàng", render: (_: unknown, item: CustomerItem) => <div><b className="block text-slate-900">{item.name}</b><span className="text-xs text-slate-500">{item.customerCode}</span></div> },
    { title: "Liên hệ", render: (_: unknown, item: CustomerItem) => <div className="text-sm"><div>{item.email || "—"}</div><div className="text-slate-500">{item.phone || "Chưa cập nhật SĐT"}</div></div> },
    { title: "Đơn hàng", render: (_: unknown, item: CustomerItem) => <div><b>{item.orderCount}</b><span className="ml-1 text-xs text-slate-500">đơn</span></div> },
    { title: "Tổng chi tiêu", render: (_: unknown, item: CustomerItem) => <b>{Number(item.totalSpend || 0).toLocaleString("vi-VN")} đ</b> },
    { title: "Marketing", dataIndex: "marketingOptIn", render: (value: boolean) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${value ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{value ? "Đã đồng ý" : "Chưa đăng ký"}</span> },
    { title: "Trạng thái", dataIndex: "status", render: (value: CustomerItem["status"]) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${value === "Hoạt động" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{value}</span> },
  ];
  return <div className="space-y-6"><section className="grid gap-4 md:grid-cols-3"><CustomerMetric icon={<Users size={20} />} label="Tổng khách hàng" value={customers.length} detail="Từ tài khoản khách hàng" /><CustomerMetric icon={<Activity size={20} />} label="Đang hoạt động" value={active} detail={customers.length ? `${Math.round(active / customers.length * 100)}% tổng khách hàng` : "Chưa có dữ liệu"} /><CustomerMetric icon={<Mail size={20} />} label="Có thông tin liên hệ" value={withPhone} detail={`${locked} tài khoản đang tạm khóa`} /></section><section className="overflow-hidden rounded-2xl border border-[#ead9e0] bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3dce4] p-4"><div><h2 className="text-lg font-bold text-slate-950">Danh sách khách hàng</h2><p className="text-xs text-slate-500">Dữ liệu lấy từ backend</p></div><div className="flex gap-2"><Input value={query} onChange={(event) => setQuery(event.target.value)} prefix={<Search size={16} />} placeholder="Tìm khách hàng..." className="w-52" allowClear /><Select value={filter} onChange={setFilter} className="w-40" options={[{ value: "ALL", label: "Tất cả trạng thái" }, { value: "Hoạt động", label: "Hoạt động" }, { value: "Tạm khóa", label: "Tạm khóa" }]} /></div></div><Table className="admin-staff-table" dataSource={rows} columns={columns} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} khách hàng` }} /></section></div>;
}

function CustomerMetric({ icon, label, value, detail }: { icon: ReactNode; label: string; value: number; detail: string }) { return <div className="flex items-center justify-between rounded-2xl border border-[#eed2db] bg-[#fffafb] p-5"><div><div className="text-sm font-semibold text-slate-500">{label}</div><div className="mt-2 text-3xl font-bold text-slate-950">{value.toLocaleString("vi-VN")}</div><div className="mt-1 text-xs text-slate-500">{detail}</div></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffe1ea] text-[#c2185b]">{icon}</span></div>; }
