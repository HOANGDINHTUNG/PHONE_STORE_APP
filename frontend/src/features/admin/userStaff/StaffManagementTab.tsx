import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  message,
} from "antd";
import {
  Briefcase,
  Download,
  Filter,
  Lock,
  Edit2,
  Plus,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { userStaffService } from "./userStaffService";
import { CreateStaffPayload, StaffEmploymentStatus, StaffMemberItem } from "./userStaffTypes";

export function StaffManagementTab() {
  const [reloadKey, setReloadKey] = useState(0);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    userStaffService.fetchStaffFromBackend().then(() => {
      setReloadKey((prev) => prev + 1);
    });
  }, []);

  const staffList = useMemo(() => {
    let list = userStaffService.getStaff();

    if (departmentFilter !== "ALL") {
      list = list.filter((s) => s.department === departmentFilter);
    }

    if (statusFilter !== "ALL") {
      list = list.filter((s) => s.status === statusFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.empCode.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.position.toLowerCase().includes(q)
      );
    }

    return list;
  }, [departmentFilter, statusFilter, searchText, reloadKey]);

  const handleFinishAddStaff = (values: any) => {
    const payload: CreateStaffPayload = {
      fullName: values.fullName,
      companyEmail: values.companyEmail,
      phone: values.phone,
      dob: values.dob,
      empCode: values.empCode || "EMP-1249",
      department: values.department,
      position: values.position,
      directManager: values.directManager,
      permissions: {
        basic: values.permBasic ?? true,
        editor: values.permEditor ?? false,
        admin: values.permAdmin ?? false,
      },
    };

    userStaffService.createStaff(payload);
    message.success(`Đã thêm nhân viên ${values.fullName} thành công!`);
    form.resetFields();
    setReloadKey((prev) => prev + 1);
  };

  const renderStatusBadge = (status: StaffEmploymentStatus) => {
    switch (status) {
      case "ĐANG LÀM VIỆC":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcf9e8] px-3 py-1 text-xs font-black text-[#168a51]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#168a51]" />
            ĐANG LÀM VIỆC
          </span>
        );
      case "NGHỈ PHÉP":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            NGHỈ PHÉP
          </span>
        );
      case "TẠM ĐÌNH CHỈ":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fee2e2] px-3 py-1 text-xs font-black text-[#dc2626]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
            TẠM ĐÌNH CHỈ
          </span>
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      title: "Mã NV",
      dataIndex: "empCode",
      key: "empCode",
      render: (code: string, record: StaffMemberItem) => (
        <div>
          <span className="font-extrabold text-slate-900">{code}</span>
          {record.isSelf && (
            <span className="ml-1 text-[11px] font-semibold text-[#c2185b]">
              (Bạn)
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Họ tên",
      key: "name",
      render: (_: any, record: StaffMemberItem) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
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
              <div className="grid h-full w-full place-items-center text-xs font-bold text-slate-500">
                {record.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="font-extrabold text-slate-900">{record.name}</div>
            <div className="text-xs text-slate-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phòng ban & Chức vụ",
      key: "department",
      render: (_: any, record: StaffMemberItem) => (
        <div>
          <div className="font-bold text-slate-900">{record.department}</div>
          <div className="text-xs text-slate-500">{record.position}</div>
        </div>
      ),
    },
    {
      title: "Quản lý trực tiếp",
      dataIndex: "directManager",
      key: "directManager",
      render: (text?: string) => (
        <span className="text-xs text-slate-600">{text || "--"}</span>
      ),
    },
    {
      title: "Ngày vào làm",
      dataIndex: "hireDate",
      key: "hireDate",
      render: (text: string) => <span className="text-xs text-slate-500">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: StaffEmploymentStatus) => renderStatusBadge(status),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: StaffMemberItem) => (
        <div className="flex items-center gap-2 text-slate-400">
          <button
            onClick={() => {
              form.setFieldsValue({
                fullName: record.name,
                companyEmail: record.email,
                empCode: record.empCode,
                department: record.department,
                position: record.position,
                directManager: record.directManager,
              });
              document.getElementById("add-staff-form")?.scrollIntoView({ behavior: "smooth" });
              message.info(`Đang chỉnh sửa thông tin nhân viên ${record.name}`);
            }}
            className="hover:text-slate-700"
            title="Chỉnh sửa nhân viên"
          >
            <Edit2 size={16} />
          </button>
          <Popconfirm
            title="Tạm đình chỉ nhân viên"
            description={`Bạn có chắc muốn tạm đình chỉ tài khoản của ${record.name}?`}
            onConfirm={() => message.success(`Đã tạm đình chỉ tài khoản ${record.name}`)}
            okText="Đình chỉ"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <button className="hover:text-red-600" title="Tạm đình chỉ">
              <Lock size={16} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards matching Image 2 */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="flex items-center justify-between rounded-2xl border border-[#eed2db] bg-[#fffafb] p-5 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
          <div>
            <div className="text-xs font-bold text-slate-500">Tổng Nhân sự</div>
            <div className="mt-2 text-3xl font-black text-slate-950">1,248</div>
            <div className="mt-1 text-xs font-bold text-emerald-600">
              📈 +12 tháng này
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ffdce7] text-[#c2185b]">
            <Users size={22} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-center justify-between rounded-2xl border border-[#eed2db] bg-[#fffafb] p-5 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
          <div>
            <div className="text-xs font-bold text-slate-500">Đang làm việc</div>
            <div className="mt-2 text-3xl font-black text-slate-950">1,180</div>
            <div className="mt-1 text-xs font-semibold text-slate-500">
              ~94.5% tổng số
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
            <UserCheck size={22} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-center justify-between rounded-2xl border border-[#eed2db] bg-[#fffafb] p-5 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
          <div>
            <div className="text-xs font-bold text-slate-500">Nghỉ phép</div>
            <div className="mt-2 text-3xl font-black text-slate-950">45</div>
            <div className="mt-1 text-xs font-semibold text-slate-500">Hôm nay</div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600">
            <Briefcase size={22} />
          </div>
        </div>

        {/* Card 4: Action Card */}
        <button
          onClick={() => {
            const formEl = document.getElementById("add-staff-form");
            formEl?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center justify-between rounded-2xl border border-[#f3cad7] bg-[#ffe4ed] p-5 text-left shadow-sm transition-transform hover:scale-[1.02]"
        >
          <div>
            <div className="text-lg font-black text-[#c2185b]">
              + Thêm Nhân viên Mới
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Tạo hồ sơ và cấp quyền nhân sự
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c2185b] text-white">
            <Plus size={24} />
          </div>
        </button>
      </section>

      {/* Staff Table Section matching Image 2 */}
      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3dce4] p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-950">Danh sách Nhân viên</h2>
            <span className="rounded-full bg-[#fff0f5] px-2.5 py-0.5 text-xs font-bold text-[#c2185b]">
              1,248 kết quả
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Tìm kiếm nhân viên..."
              prefix={<Search size={16} className="mr-1 text-slate-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-48"
              size="middle"
              allowClear
            />

            <Select
              value={departmentFilter}
              onChange={(val) => setDepartmentFilter(val)}
              size="middle"
              className="w-44"
              options={[
                { label: "Tất cả phòng ban", value: "ALL" },
                { label: "Phát triển Phần mềm", value: "Phát triển Phần mềm" },
                { label: "Marketing", value: "Marketing" },
                { label: "Kho hàng", value: "Kho hàng" },
              ]}
            />

            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              size="middle"
              className="w-40"
              options={[
                { label: "Tất cả trạng thái", value: "ALL" },
                { label: "ĐANG LÀM VIỆC", value: "ĐANG LÀM VIỆC" },
                { label: "NGHỈ PHÉP", value: "NGHỈ PHÉP" },
                { label: "TẠM ĐÌNH CHỈ", value: "TẠM ĐÌNH CHỈ" },
              ]}
            />

            <Button icon={<Download size={15} />} className="font-bold">
              Xuất CSV
            </Button>
          </div>
        </div>

        <Table
          dataSource={staffList}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> trên <b className="text-slate-800">1,248</b>
              </span>
            ),
          }}
        />
      </section>

      {/* Add Staff Form Card matching Image 2 */}
      <section
        id="add-staff-form"
        className="grid gap-6 rounded-2xl border border-[#eed2db] bg-white p-6 shadow-[0_3px_10px_rgba(79,20,45,0.02)] md:grid-cols-[280px_1fr]"
      >
        {/* Left Side Highlight */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#f5dce4] bg-[#fffafb] p-6 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#ffdce7] text-[#c2185b]">
            <Users size={32} />
          </div>
          <h3 className="mt-4 text-lg font-black text-slate-950">Thêm Nhân viên Mới</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Nhập thông tin chi tiết để cấp phát tài khoản và phân quyền truy cập hệ thống PinkPhone Admin.
          </p>
        </div>

        {/* Right Form Fields */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinishAddStaff}
          initialValues={{
            empCode: "EMP-1249",
            permBasic: true,
          }}
          className="space-y-6"
        >
          {/* Section 1: Thông tin cá nhân */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#c2185b]">
              THÔNG TIN CÁ NHÂN
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Form.Item
                name="fullName"
                label="Họ và tên *"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên." }]}
              >
                <Input size="large" placeholder="VĐ: Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                name="companyEmail"
                label="Email công ty *"
                rules={[
                  { required: true, message: "Vui lòng nhập email." },
                  { type: "email", message: "Email không hợp lệ." },
                ]}
              >
                <Input size="large" placeholder="ten.ho@pinkphone.vn" />
              </Form.Item>

              <Form.Item name="phone" label="Số điện thoại">
                <Input size="large" placeholder="09xxxxxxxx" />
              </Form.Item>

              <Form.Item name="dob" label="Ngày sinh">
                <DatePicker size="large" className="w-full" format="DD/MM/YYYY" placeholder="mm/dd/yyyy" />
              </Form.Item>
            </div>
          </div>

          {/* Section 2: Vị trí công tác */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#c2185b]">
              VỊ TRÍ CÔNG TÁC
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Form.Item name="empCode" label="Mã nhân viên (Tự động)">
                <Input size="large" readOnly className="bg-slate-50 font-bold" />
              </Form.Item>

              <Form.Item
                name="department"
                label="Phòng ban *"
                rules={[{ required: true, message: "Vui lòng chọn phòng ban." }]}
              >
                <Select
                  size="large"
                  placeholder="Chọn phòng ban..."
                  options={[
                    { label: "Phát triển Phần mềm", value: "Phát triển Phần mềm" },
                    { label: "Marketing", value: "Marketing" },
                    { label: "Kho hàng", value: "Kho hàng" },
                    { label: "Nhân sự", value: "Nhân sự" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="position"
                label="Chức vụ *"
                rules={[{ required: true, message: "Vui lòng nhập chức vụ." }]}
              >
                <Input size="large" placeholder="VD: Chuyên viên" />
              </Form.Item>

              <Form.Item name="directManager" label="Quản lý trực tiếp">
                <Input size="large" placeholder="Tìm tên hoặc mã NV..." />
              </Form.Item>
            </div>
          </div>

          {/* Section 3: Phân quyền sơ bộ */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#c2185b]">
              PHÂN QUYỀN SƠ BỘ
            </div>
            <div className="mt-3 rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 space-y-3">
              <Form.Item name="permBasic" valuePropName="checked" noStyle>
                <Checkbox className="font-bold text-slate-800">
                  Quyền truy cập cơ bản
                  <span className="block text-xs font-normal text-slate-500">
                    Cho phép đăng nhập, xem dashboard và sửa thông tin cá nhân.
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item name="permEditor" valuePropName="checked" noStyle>
                <Checkbox className="font-bold text-slate-800">
                  Quản lý nội dung (Editor)
                  <span className="block text-xs font-normal text-slate-500">
                    Quyền xem, thêm, sửa sản phẩm và nội dung khuyến mãi.
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item name="permAdmin" valuePropName="checked" noStyle>
                <Checkbox className="font-bold text-slate-800">
                  Quản trị viên (Admin)
                  <span className="block text-xs font-normal text-red-500">
                    Cảnh báo: Quyền cao nhất, có thể thay đổi cấu hình hệ thống.
                  </span>
                </Checkbox>
              </Form.Item>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button size="large" onClick={() => form.resetFields()}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-[#c2185b] font-bold hover:bg-[#a70f4b]"
            >
              Lưu Nhân viên
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
}
