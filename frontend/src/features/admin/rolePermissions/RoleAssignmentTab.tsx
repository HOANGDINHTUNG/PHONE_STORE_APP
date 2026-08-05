import React, { useMemo, useState } from "react";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  message,
} from "antd";
import {
  CheckCircle2,
  Filter,
  History,
  Info,
  RefreshCw,
  UserCheck,
  XCircle,
} from "lucide-react";
import { rolePermissionService } from "./rolePermissionService";
import { AssignRolePayload, RoleAssignmentRecord } from "./rolePermissionTypes";

export function RoleAssignmentTab() {
  const [reloadKey, setReloadKey] = useState(0);
  const [form] = Form.useForm();

  const historyRecords = useMemo(() => {
    return rolePermissionService.getAssignments();
  }, [reloadKey]);

  const handleFinish = (values: any) => {
    const payload: AssignRolePayload = {
      userEmail: values.userEmail,
      roleCode: values.roleCode,
      expiryDate: values.expiryDate
        ? values.expiryDate.format("DD/MM/YYYY")
        : "Vĩnh viễn",
      reason: values.reason,
    };

    rolePermissionService.assignRole(payload);
    message.success(`Đã gán vai trò ${values.roleCode} cho ${values.userEmail} thành công!`);
    form.resetFields();
    setReloadKey((prev) => prev + 1);
  };

  const renderStatusBadge = (status: "ACTIVE" | "REVOKED") => {
    if (status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#dcf9e8] px-2.5 py-0.5 text-[11px] font-black text-[#168a51]">
          ● ACTIVE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#ffdce7] px-2.5 py-0.5 text-[11px] font-black text-[#d92e70]">
        ✕ REVOKED
      </span>
    );
  };

  const columns = [
    {
      title: "NGƯỜI DÙNG / VAI TRÒ",
      key: "userRole",
      render: (_: any, record: RoleAssignmentRecord) => (
        <div>
          <div className="font-extrabold text-slate-900">{record.userEmail}</div>
          <span className="rounded bg-rose-50 px-2 py-0.5 font-mono text-[11px] font-bold text-[#c2185b]">
            {record.roleCode}
          </span>
        </div>
      ),
    },
    {
      title: "TRẠNG THÁI",
      key: "status",
      render: (_: any, record: RoleAssignmentRecord) => (
        <div className="space-y-1">
          <div>{renderStatusBadge(record.status)}</div>
          <div className="text-[11px] text-slate-400">Hết hạn: {record.expiryText}</div>
        </div>
      ),
    },
    {
      title: "CHI TIẾT GÁN",
      key: "assignedDetails",
      render: (_: any, record: RoleAssignmentRecord) => (
        <div className="text-xs space-y-0.5 text-slate-600">
          <div>
            Bởi: <b>{record.assignedBy}</b>
          </div>
          <div className="text-slate-400">Ngày: {record.assignedAt}</div>
        </div>
      ),
    },
    {
      title: "LÝ DO",
      dataIndex: "reason",
      key: "reason",
      render: (text: string) => (
        <span className="text-xs text-slate-700 max-w-[240px] line-clamp-2">{text}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[440px_1fr]">
        {/* Left Form: THỰC HIỆN GÁN VAI TRÒ matching Image 3 */}
        <div className="rounded-2xl border border-[#eed2db] bg-white p-6 shadow-[0_3px_10px_rgba(79,20,45,0.02)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f3dce4] pb-3">
            <UserCheck size={20} className="text-[#c2185b]" />
            <h2 className="text-base font-black text-slate-950">THỰC HIỆN GÁN VAI TRÒ</h2>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              userEmail: "Nguyen Van A (a.nguyen@pinkphone.vn)",
              roleCode: "CS Representative (Hỗ trợ KH)",
            }}
            className="space-y-4"
          >
            <Form.Item
              name="userEmail"
              label="Người dùng nhận quyền *"
              rules={[{ required: true, message: "Vui lòng chọn người dùng." }]}
            >
              <Input size="large" placeholder="Tìm kiếm theo email..." />
            </Form.Item>

            <Form.Item
              name="roleCode"
              label="Vai trò cấp phát *"
              rules={[{ required: true, message: "Vui lòng chọn vai trò." }]}
            >
              <Select
                size="large"
                options={[
                  { label: "CS Representative (Hỗ trợ KH)", value: "CS_REP" },
                  { label: "Quản lý Cửa hàng (Store Manager)", value: "STORE_MANAGER" },
                  { label: "Quản lý Kho (Warehouse Lead)", value: "WH_MGR" },
                  { label: "Kiểm toán Tài chính (Finance Auditor)", value: "FINANCE_AUDITOR" },
                ]}
              />
            </Form.Item>

            {/* Security Callout Box */}
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 flex items-start gap-2.5 text-xs text-rose-700">
              <Info size={16} className="mt-0.5 shrink-0 text-[#c2185b]" />
              <div>
                <b>Lưu ý Bảo mật:</b> Vai trò <b>SUPER_ADMIN</b> không thể được gán qua giao diện này. Yêu cầu quy trình duyệt kỹ thuật cấp cao.
              </div>
            </div>

            <Form.Item name="expiryDate" label="Ngày hết hạn (Tuỳ chọn)">
              <DatePicker size="large" className="w-full" format="DD/MM/YYYY" placeholder="mm/dd/yyyy" />
              <div className="mt-1 text-[11px] text-slate-400">
                Để trống nếu cấp quyền vĩnh viễn.
              </div>
            </Form.Item>

            <Form.Item
              name="reason"
              label="Lý do gán quyền *"
              rules={[{ required: true, message: "Vui lòng nhập lý do." }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập mã ticket JIRA hoặc lý do cụ thể..."
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="rounded-xl bg-[#c2185b] font-bold hover:bg-[#a70f4b]"
            >
              👤+ Xác nhận Gán Quyền
            </Button>
          </Form>
        </div>

        {/* Right Table: LỊCH SỬ GÁN QUYỀN GẦN ĐÂY matching Image 3 */}
        <div className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#f3dce4] p-4">
              <div className="flex items-center gap-2">
                <History size={18} className="text-[#c2185b]" />
                <h3 className="text-base font-black text-slate-950">
                  LỊCH SỬ GÁN QUYỀN GẦN ĐÂY
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button className="grid h-9 w-9 place-items-center rounded-xl border border-[#efd3dc] text-slate-600 hover:bg-[#fff0f5] hover:text-[#c2185b]">
                  <Filter size={15} />
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-xl border border-[#efd3dc] text-slate-600 hover:bg-[#fff0f5] hover:text-[#c2185b]">
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            <Table
              dataSource={historyRecords}
              columns={columns}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total, range) => (
                  <span className="text-xs font-medium text-slate-500">
                    Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> của <b className="text-slate-800">128</b> bản ghi
                  </span>
                ),
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
