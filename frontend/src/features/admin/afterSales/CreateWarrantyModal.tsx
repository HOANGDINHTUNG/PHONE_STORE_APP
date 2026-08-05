import React from "react";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { WarrantyClaimItem, WarrantyClaimStatusType } from "./afterSalesTypes";

interface CreateWarrantyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (claim: Omit<WarrantyClaimItem, "id" | "claimCode" | "createdAt">) => void;
}

export function CreateWarrantyModal({ open, onClose, onSubmit }: CreateWarrantyModalProps) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      serialImei: values.serialImei,
      productName: values.productName,
      status: values.status || "SUBMITTED",
      issueDescription: values.issueDescription,
    });
    message.success("Đã tạo yêu cầu bảo hành mới thành công.");
    form.resetFields();
  };

  return (
    <Modal
      title={<div className="text-xl font-extrabold text-slate-900">Tạo Yêu cầu Bảo hành Mới</div>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: "SUBMITTED" }}
        className="mt-4 space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: "Vui lòng nhập tên khách hàng." }]}
          >
            <Input size="large" placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="customerPhone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại." }]}
          >
            <Input size="large" placeholder="Ví dụ: 0901234567" />
          </Form.Item>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Form.Item
            name="serialImei"
            label="Mã Serial / IMEI"
            rules={[{ required: true, message: "Vui lòng nhập Serial/IMEI." }]}
          >
            <Input size="large" placeholder="Ví dụ: IMEI-849302849" />
          </Form.Item>

          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm." }]}
          >
            <Input size="large" placeholder="Ví dụ: iPhone 14 Pro Max 256GB" />
          </Form.Item>
        </div>

        <Form.Item name="status" label="Trạng thái ban đầu">
          <Select
            size="large"
            options={[
              { label: "SUBMITTED (Đã tiếp nhận)", value: "SUBMITTED" },
              { label: "INSPECTING (Đang kiểm tra)", value: "INSPECTING" },
              { label: "WAITING_PARTS (Chờ linh kiện)", value: "WAITING_PARTS" },
              { label: "REPAIRING (Đang sửa chữa)", value: "REPAIRING" },
              { label: "COMPLETED (Hoàn tất)", value: "COMPLETED" },
            ]}
          />
        </Form.Item>

        <Form.Item name="issueDescription" label="Mô tả sự cố / Yêu cầu bảo hành">
          <Input.TextArea rows={3} placeholder="Mô tả lỗi sản phẩm hoặc yêu cầu của khách..." />
        </Form.Item>

        <div className="flex justify-end gap-3 pt-2">
          <Button size="large" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-[#c2185b] font-bold hover:bg-[#a70f4b]"
          >
            Tạo Yêu cầu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
