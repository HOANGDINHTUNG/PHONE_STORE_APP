import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import { BriefcaseBusiness, Plus, Search, UserCheck, Users } from "lucide-react";
import { apiClient } from "../../../api/client";
import { userStaffService } from "./userStaffService";
import type { StaffEmploymentStatus, StaffMemberItem } from "./userStaffTypes";

type Position = { id: string; name: string; department?: { name: string }; status: string };

const statusText: Record<StaffEmploymentStatus, string> = {
  "ĐANG LÀM VIỆC": "Đang làm việc", "NGHỈ PHÉP": "Nghỉ phép", "TẠM ĐÌNH CHỈ": "Tạm đình chỉ",
};

export function StaffManagementTab() {
  const [form] = Form.useForm();
  const [staff, setStaff] = useState<StaffMemberItem[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"ALL" | StaffEmploymentStatus>("ALL");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [staffRows, positionResponse] = await Promise.all([
        userStaffService.fetchStaffFromBackend(),
        apiClient.get<any>("/admin/positions", { params: { status: "ACTIVE", size: 100 } }).then((response) => response.data),
      ]);
      setStaff(staffRows);
      setPositions(positionResponse.items || positionResponse.content || []);
    } catch { message.error("Không tải được dữ liệu nhân sự từ backend."); }
  };
  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => staff.filter((item) => {
    const query = keyword.trim().toLowerCase();
    return (!query || `${item.name} ${item.empCode} ${item.email} ${item.position}`.toLowerCase().includes(query))
      && (status === "ALL" || item.status === status);
  }), [staff, keyword, status]);
  const active = staff.filter((item) => item.status === "ĐANG LÀM VIỆC").length;
  const leave = staff.filter((item) => item.status === "NGHỈ PHÉP").length;

  const submit = async (values: { fullName: string; email: string; phone: string; employeeCode: string; positionId: string }) => {
    setSaving(true);
    try {
      await apiClient.post("/admin/staff", { ...values, hireDate: new Date().toISOString().slice(0, 10) });
      message.success("Đã tạo nhân viên và hồ sơ nhân sự.");
      form.resetFields(); setOpen(false); await load();
    } catch (error: any) {
      message.error(error?.response?.data?.detail || error?.response?.data?.message || "Không thể tạo nhân viên. Kiểm tra email, mã nhân viên và chức danh.");
    } finally { setSaving(false); }
  };

  const columns = [
    { title: "Mã NV", dataIndex: "empCode", render: (value: string) => <b className="text-[#b21652]">{value}</b> },
    { title: "Nhân viên", render: (_: unknown, item: StaffMemberItem) => <div><b className="block text-slate-900">{item.name}</b><span className="text-xs text-slate-500">{item.email}</span></div> },
    { title: "Phòng ban / Chức danh", render: (_: unknown, item: StaffMemberItem) => <div><b className="block text-slate-800">{item.department}</b><span className="text-xs text-slate-500">{item.position}</span></div> },
    { title: "Quản lý", dataIndex: "directManager", render: (value?: string) => <span className="text-sm text-slate-600">{value || "—"}</span> },
    { title: "Ngày vào làm", dataIndex: "hireDate", render: (value: string) => <span className="text-sm text-slate-600">{value || "—"}</span> },
    { title: "Trạng thái", dataIndex: "status", render: (value: StaffEmploymentStatus) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${value === "ĐANG LÀM VIỆC" ? "bg-emerald-100 text-emerald-700" : value === "NGHỈ PHÉP" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{statusText[value]}</span> },
  ];

  return <div className="space-y-6"><section className="grid gap-4 md:grid-cols-4"><Metric label="Tổng nhân sự" value={staff.length} icon={<Users size={22} />} tone="pink" /><Metric label="Đang làm việc" value={active} icon={<UserCheck size={22} />} tone="green" detail={staff.length ? `${Math.round(active / staff.length * 100)}% tổng số` : "Chưa có dữ liệu"} /><Metric label="Nghỉ phép" value={leave} icon={<BriefcaseBusiness size={22} />} tone="amber" detail="Theo trạng thái hồ sơ" /><button onClick={() => { form.resetFields(); setOpen(true); }} className="flex items-center justify-between rounded-2xl border border-[#f2cad8] bg-[#fff0f5] p-5 text-left transition hover:shadow-md"><div><b className="block text-lg text-[#bd1455]">Thêm nhân viên mới</b><span className="mt-1 block text-xs text-slate-600">Tạo tài khoản và hồ sơ nhân sự</span></div><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#c2185b] text-white"><Plus size={24} /></span></button></section><section className="overflow-hidden rounded-2xl border border-[#ead9e0] bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3dce4] p-4"><div><h2 className="text-lg font-bold text-slate-950">Danh sách nhân viên</h2><p className="text-xs text-slate-500">{staff.length} hồ sơ lấy từ backend</p></div><div className="flex gap-2"><Input value={keyword} onChange={(event) => setKeyword(event.target.value)} prefix={<Search size={16} />} placeholder="Tìm nhân viên..." className="w-52" allowClear /><Select value={status} onChange={setStatus} className="w-44" options={[{ value: "ALL", label: "Tất cả trạng thái" }, ...Object.entries(statusText).map(([value, label]) => ({ value, label }))]} /></div></div><Table className="admin-staff-table" dataSource={rows} columns={columns} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} nhân sự` }} /></section><Modal rootClassName="admin-staff-modal" title="Thêm nhân viên mới" open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose width={720}><p className="mb-5 text-sm text-slate-500">Tài khoản chỉ được tạo khi email, mã nhân viên và chức danh hợp lệ trên hệ thống.</p><Form form={form} layout="vertical" onFinish={submit} initialValues={{ employeeCode: `EMP-${Date.now().toString().slice(-6)}` }}><div className="grid gap-x-4 md:grid-cols-2"><Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Nhập họ tên." }]}><Input size="large" /></Form.Item><Form.Item name="email" label="Email công ty" rules={[{ required: true, type: "email", message: "Nhập email hợp lệ." }]}><Input size="large" /></Form.Item><Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Nhập số điện thoại." }]}><Input size="large" /></Form.Item><Form.Item name="employeeCode" label="Mã nhân viên" rules={[{ required: true, message: "Nhập mã nhân viên." }]}><Input size="large" /></Form.Item></div><Form.Item name="positionId" label="Chức danh / Phòng ban" rules={[{ required: true, message: "Chọn chức danh." }]}><Select size="large" loading={!positions.length} placeholder="Chọn chức danh đang hoạt động" options={positions.map((position) => ({ value: position.id, label: `${position.department?.name || "Chưa phân phòng ban"} · ${position.name}` }))} /></Form.Item><div className="mt-6 flex justify-end gap-2"><Button onClick={() => setOpen(false)}>Hủy</Button><Button type="primary" htmlType="submit" loading={saving} className="bg-[#c2185b]">Tạo nhân viên</Button></div></Form></Modal></div>;
}

function Metric({ label, value, icon, tone, detail }: { label: string; value: number; icon: ReactNode; tone: "pink" | "green" | "amber"; detail?: string }) { const colors = { pink: "bg-[#ffdce7] text-[#c2185b]", green: "bg-emerald-100 text-emerald-600", amber: "bg-amber-100 text-amber-600" }; return <div className="flex items-center justify-between rounded-2xl border border-[#eed2db] bg-[#fffafb] p-5"><div><div className="text-sm font-semibold text-slate-500">{label}</div><div className="mt-2 text-3xl font-bold text-slate-950">{value.toLocaleString("vi-VN")}</div><div className="mt-1 text-xs text-slate-500">{detail || "Dữ liệu hiện tại"}</div></div><span className={`grid h-12 w-12 place-items-center rounded-2xl ${colors[tone]}`}>{icon}</span></div>; }
