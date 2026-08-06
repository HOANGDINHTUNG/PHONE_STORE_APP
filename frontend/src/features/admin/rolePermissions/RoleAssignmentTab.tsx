import React, { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Form, Input, Popconfirm, Select, Table, Tag, message } from "antd";
import { History, Info, RefreshCw, UserCheck } from "lucide-react";
import { apiClient } from "../../../api/client";
import { rolePermissionService } from "./rolePermissionService";
import { AssignRolePayload, RoleAssignmentRecord, RoleItem } from "./rolePermissionTypes";

interface UserOption { id: string; name: string; email: string; }

export function RoleAssignmentTab() {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<RoleAssignmentRecord[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedUserId = Form.useWatch("userId", form);

  const load = async () => {
    setLoading(true);
    try {
      const [usersResponse, roleList, assignments] = await Promise.all([
        apiClient.get<any[]>("/admin/users"),
        rolePermissionService.fetchRolesFromBackend(),
        rolePermissionService.fetchAssignmentsFromBackend(),
      ]);
      setUsers((Array.isArray(usersResponse.data) ? usersResponse.data : []).map((user: any) => ({
        id: String(user.id), name: user.fullName || user.username || user.email, email: user.email || "",
      })));
      setRoles(roleList.filter((role) => role.status === "Hoạt động"));
      setRecords(assignments);
    } catch {
      message.error("Không tải được dữ liệu phân quyền. Hãy kiểm tra backend và quyền admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const activeRoles = useMemo(() => records.filter((record) => record.userId === selectedUserId && record.status === "ACTIVE"), [records, selectedUserId]);
  const selectedUser = users.find((user) => user.id === selectedUserId);

  const handleFinish = async (values: any) => {
    const user = users.find((item) => item.id === values.userId);
    if (!user) return;
    const payload: AssignRolePayload = {
      userId: user.id,
      userEmail: user.email,
      roleCode: values.roleCode,
      expiryDate: values.expiryDate?.toISOString(),
      reason: values.reason,
    };
    try {
      await rolePermissionService.assignRole(payload);
      message.success("Đã gán vai trò. Quyền áp dụng ngay cho tài khoản này.");
      form.resetFields();
      await load();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Không thể gán vai trò. Tài khoản có thể đã được cấp role này.");
    }
  };

  const columns = [
    {
      title: "Tài khoản nhận quyền", key: "user", width: 250,
      render: (_: unknown, record: RoleAssignmentRecord) => <div><p className="font-bold text-slate-900">{record.userEmail}</p><p className="text-xs text-slate-400">ID: {record.userId || "—"}</p></div>,
    },
    {
      title: "Vai trò", key: "role", width: 240,
      render: (_: unknown, record: RoleAssignmentRecord) => <div><p className="font-bold text-slate-800">{record.roleName || record.roleCode}</p><span className="rounded bg-[#fff0f5] px-2 py-0.5 font-mono text-[11px] font-bold text-[#c2185b]">{record.roleCode}</span></div>,
    },
    { title: "Trạng thái", key: "status", width: 135, render: (_: unknown, record: RoleAssignmentRecord) => <Tag color={record.status === "ACTIVE" ? "green" : "red"}>{record.status === "ACTIVE" ? "Đang hiệu lực" : "Đã thu hồi"}</Tag> },
    { title: "Thời hạn", dataIndex: "expiryText", key: "expiry", width: 175, render: (text: string) => <span className="text-sm text-slate-600">{text}</span> },
    { title: "Người cấp / thời gian", key: "audit", width: 200, render: (_: unknown, record: RoleAssignmentRecord) => <div className="text-xs text-slate-600"><p>Bởi: <b>{record.assignedBy}</b></p><p className="mt-1 text-slate-400">{record.assignedAt}</p></div> },
    { title: "Lý do", dataIndex: "reason", key: "reason", render: (text: string) => <span className="line-clamp-2 text-sm text-slate-600">{text}</span> },
    {
      title: "Thao tác", key: "actions", width: 130,
      render: (_: unknown, record: RoleAssignmentRecord) => record.status !== "ACTIVE" ? <span className="text-xs text-slate-400">Đã thu hồi</span> : (
        <Popconfirm
          title="Thu hồi vai trò?"
          description={`Tài khoản sẽ mất quyền của vai trò ${record.roleName || record.roleCode} sau lần làm mới token tiếp theo.`}
          okText="Thu hồi"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          onConfirm={async () => {
            try {
              await rolePermissionService.revokeRole(record, "Thu hồi từ màn hình phân quyền");
              await load();
              message.success("Đã thu hồi vai trò. Tài khoản cần đăng nhập lại để token cũ hết hiệu lực.");
            } catch (error: any) {
              message.error(error?.response?.data?.message || "Không thể thu hồi vai trò.");
            }
          }}
        >
          <Button danger size="small">Thu hồi</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 text-sm text-slate-600">
        <b className="text-slate-900">Luồng cấp quyền:</b> chọn tài khoản → chọn vai trò → hệ thống áp dụng tập quyền của vai trò đó. Hồ sơ nhân sự chỉ là thông tin tổ chức; quyền đăng nhập luôn được cấp cho tài khoản.
      </section>
      <section className="grid gap-6 xl:grid-cols-[410px_1fr]">
        <div className="rounded-2xl border border-[#eed2db] bg-white p-6 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
          <div className="mb-5 flex items-center gap-2 border-b border-[#f3dce4] pb-3"><UserCheck size={20} className="text-[#c2185b]" /><h2 className="text-base font-black text-slate-950">Cấp vai trò cho tài khoản</h2></div>
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item name="userId" label="Tài khoản nhận quyền *" rules={[{ required: true, message: "Hãy chọn tài khoản." }]}>
              <Select showSearch optionFilterProp="label" loading={loading} placeholder="Tìm tên hoặc email..." options={users.map((user) => ({ value: user.id, label: `${user.name} — ${user.email}` }))} />
            </Form.Item>
            {selectedUser && <div className="mb-4 rounded-xl bg-slate-50 p-3 text-xs"><p className="font-bold text-slate-800">Vai trò đang có</p><div className="mt-2 flex flex-wrap gap-1">{activeRoles.length ? activeRoles.map((record) => <Tag key={record.id} color="magenta">{record.roleName || record.roleCode}</Tag>) : <span className="text-slate-400">Chưa có vai trò nào.</span>}</div></div>}
            <Form.Item name="roleCode" label="Vai trò cấp phát *" rules={[{ required: true, message: "Hãy chọn vai trò." }]}>
              <Select showSearch optionFilterProp="label" loading={loading} placeholder="Chọn vai trò đang hoạt động" options={roles.map((role) => ({ value: role.roleCode, label: `${role.roleName} (${role.roleCode})` }))} />
            </Form.Item>
            <div className="mb-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"><Info size={16} className="shrink-0" />Mỗi lần cấp quyền đều được lưu người cấp, thời điểm và lý do để đối soát.</div>
            <Form.Item name="expiryDate" label="Ngày hết hạn (không bắt buộc)"><DatePicker className="w-full" format="DD/MM/YYYY" /></Form.Item>
            <Form.Item name="reason" label="Lý do cấp quyền *" rules={[{ required: true, message: "Hãy nhập lý do cấp quyền." }]}><Input.TextArea rows={3} maxLength={255} showCount placeholder="Ví dụ: Bổ nhiệm quản lý kho tháng 8/2026" /></Form.Item>
            <Button type="primary" htmlType="submit" block className="bg-[#c2185b] font-bold hover:!bg-[#a70f4b]">Xác nhận cấp vai trò</Button>
          </Form>
        </div>
        <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
          <div className="flex items-center justify-between border-b border-[#f3dce4] p-4"><div className="flex items-center gap-2"><History size={18} className="text-[#c2185b]" /><h3 className="font-black text-slate-950">Lịch sử cấp và thu hồi vai trò</h3></div><Button icon={<RefreshCw size={15} />} onClick={() => void load()}>Tải lại</Button></div>
          <Table dataSource={records} columns={columns} rowKey="id" loading={loading} scroll={{ x: 1100 }} pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `Tổng ${total} bản ghi` }} />
        </section>
      </section>
    </div>
  );
}
