import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
} from "antd";
import { Plus, Trash2 } from "lucide-react";
import { CreatePOPayload } from "./procurementTypes";
import dayjs from "dayjs";
import { adminInventoryService, ProcurementProductVariant, Supplier, Warehouse } from "../../../api/adminInventoryService";

interface CreatePOModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePOPayload) => void;
}

type PurchaseItem = { sku: string; name: string; qtyOrd: number; unitCost: number; image?: string };
const emptyItem = (): PurchaseItem => ({ sku: "", name: "", qtyOrd: 1, unitCost: 0 });

const SAMPLE_PRODUCTS = [
  {
    sku: "IP15-PM-256-NT",
    name: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
    unitCost: 28500000,
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
  },
  {
    sku: "S24U-256-GREY",
    name: "Samsung Galaxy S24 Ultra 256GB Xám Titan",
    unitCost: 24500000,
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
  },
  {
    sku: "X14U-512-WHITE",
    name: "Xiaomi 14 Ultra 512GB Trắng",
    unitCost: 26700000,
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra-1.png",
  },
  {
    sku: "AP-PRO-2-USBC",
    name: "AirPods Pro 2 (USB-C)",
    unitCost: 5200000,
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c.png",
  },
];

export function CreatePOModal({ open, onClose, onSubmit }: CreatePOModalProps) {
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [productVariants, setProductVariants] = useState<ProcurementProductVariant[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [items, setItems] = useState<PurchaseItem[]>([emptyItem()]);

  useEffect(() => {
    if (!open) return;

    setIsLoadingSuppliers(true);
    adminInventoryService.suppliers()
      .then((supplierData) => {
        setSuppliers(supplierData.filter((supplier) => supplier.status === "ACTIVE"));
      })
      .catch(() => message.error("Không thể tải danh sách nhà cung cấp."))
      .finally(() => setIsLoadingSuppliers(false));

    setIsLoadingWarehouses(true);
    adminInventoryService.warehouses()
      .then((warehouseData) => {
        setWarehouses(warehouseData.filter((warehouse) => warehouse.status === "ACTIVE"));
      })
      .catch(() => message.error("Không thể tải danh sách kho hàng."))
      .finally(() => setIsLoadingWarehouses(false));
    setIsLoadingProducts(true);
    adminInventoryService.productVariants()
      .then((productData) => {
        setProductVariants(productData);
        setItems((current) => current.map((item) => {
          const selectedProduct = productData.find((product) => product.sku === item.sku);
          if (selectedProduct || !productData[0]) return item;
          return {
            sku: productData[0].sku,
            name: productData[0].name,
            qtyOrd: item.qtyOrd,
            unitCost: Number(productData[0].suggestedUnitCost || 0),
          };
        }));
      })
      .catch(() => message.error("Không thể tải danh sách SKU từ hệ thống."))
      .finally(() => setIsLoadingProducts(false));
  }, [open]);

  const handleAddItem = () => {
    const product = productVariants[0];
    setItems([
      ...items,
      product
        ? { sku: product.sku, name: product.name, qtyOrd: 1, unitCost: Number(product.suggestedUnitCost || 0) }
        : emptyItem(),
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      message.warning("Đơn hàng phải có ít nhất 1 sản phẩm.");
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProductSelect = (sku: string, index: number) => {
    const prod = productVariants.find((p) => p.sku === sku);
    if (!prod) return;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      sku: prod.sku,
      name: prod.name,
      unitCost: Number(prod.suggestedUnitCost || 0),
    };
    setItems(newItems);
  };

  const handleQtyChange = (val: number | null, index: number) => {
    const newItems = [...items];
    newItems[index].qtyOrd = val || 1;
    setItems(newItems);
  };

  const handleUnitCostChange = (val: number | null, index: number) => {
    const newItems = [...items];
    newItems[index].unitCost = val || 0;
    setItems(newItems);
  };

  const calculateSubtotal = () =>
    items.reduce((acc, it) => acc + it.qtyOrd * it.unitCost, 0);

  const handleFinish = (values: any) => {
    if (items.length === 0 || items.some((item) => !item.sku)) {
      message.error("Vui lòng thêm sản phẩm vào đơn nhập hàng.");
      return;
    }

    const payload: CreatePOPayload = {
      supplierName: values.supplierName,
      destWarehouse: values.destWarehouse,
      expectedDelivery: values.expectedDelivery
        ? dayjs(values.expectedDelivery).format("DD/MM/YYYY")
        : dayjs().add(5, "day").format("DD/MM/YYYY"),
      referenceNo: values.referenceNo,
      note: values.note,
      items,
    };

    onSubmit(payload);
    form.resetFields();
    const firstProduct = productVariants[0];
    setItems([
      firstProduct
        ? { sku: firstProduct.sku, name: firstProduct.name, qtyOrd: 1, unitCost: Number(firstProduct.suggestedUnitCost || 0) }
        : emptyItem(),
    ]);
  };

  return (
    <Modal
      title={
        <div className="text-xl font-extrabold text-slate-900">
          Tạo đơn nhập hàng mới (Create PO)
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          expectedDelivery: dayjs().add(5, "day"),
        }}
        className="mt-4 space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Form.Item
            name="supplierName"
            label="Nhà cung cấp"
            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp." }]}
          >
            <Select
              placeholder="Chọn nhà cung cấp"
              loading={isLoadingSuppliers}
              options={suppliers.map((supplier) => ({
                label: `${supplier.supplierCode} — ${supplier.name}`,
                value: supplier.name,
              }))}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="destWarehouse"
            label="Kho nhận hàng"
            rules={[{ required: true, message: "Vui lòng chọn kho nhận." }]}
          >
            <Select
              placeholder="Chọn kho nhận"
              loading={isLoadingWarehouses}
              options={warehouses.map((warehouse) => ({
                label: `${warehouse.code} — ${warehouse.name}`,
                value: warehouse.name,
              }))}
              size="large"
            />
          </Form.Item>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Form.Item name="expectedDelivery" label="Ngày dự kiến nhận">
            <DatePicker size="large" className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày" />
          </Form.Item>

          <Form.Item name="referenceNo" label="Mã tham chiếu / Số hóa đơn">
            <Input size="large" placeholder="Ví dụ: INV-APPLE-9923" />
          </Form.Item>
        </div>

        <Form.Item name="note" label="Ghi chú đơn nhập hàng">
          <Input.TextArea
            rows={2}
            placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt..."
          />
        </Form.Item>

        <div className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
            <h3 className="text-base font-bold text-slate-900">Danh sách sản phẩm nhập</h3>
            <Button
              type="dashed"
              icon={<Plus size={16} />}
              onClick={handleAddItem}
              className="border-[#d92e70] text-[#d92e70] hover:bg-[#fff0f5]"
            >
              Thêm sản phẩm
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-xl border border-[#f3dce4] bg-white p-4 md:grid-cols-[minmax(0,1fr)_136px_172px_40px] md:items-end"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-500">Mã SKU / Sản phẩm</label>
                  <Select
                    value={item.sku}
                    onChange={(val) => handleProductSelect(val, index)}
                    className="mt-1 w-full"
                    loading={isLoadingProducts}
                    showSearch
                    optionFilterProp="label"
                    options={productVariants.map((p) => ({
                      label: `${p.sku} - ${p.name}`,
                      value: p.sku,
                    }))}
                  />
                </div>
                <div>
                  <label className="whitespace-nowrap text-xs font-semibold text-slate-500">Số lượng đặt</label>
                  <InputNumber
                    min={1}
                    value={item.qtyOrd}
                    onChange={(val) => handleQtyChange(val, index)}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="whitespace-nowrap text-xs font-semibold text-slate-500">Đơn giá nhập (đ)</label>
                  <InputNumber
                    min={0}
                    step={100000}
                    value={item.unitCost}
                    onChange={(val) => handleUnitCostChange(val, index)}
                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    className="mt-1 w-full"
                  />
                </div>
                <div className="flex items-end justify-end md:pb-1">
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={18} />}
                    onClick={() => handleRemoveItem(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-end border-t border-[#f0cad7] pt-3 text-right">
            <div className="text-xs text-slate-500">Tạm tính: {calculateSubtotal().toLocaleString("vi-VN")} đ</div>
            <div className="text-xs text-slate-500">Thuế (VAT 10%): {Math.round(calculateSubtotal() * 0.1).toLocaleString("vi-VN")} đ</div>
            <div className="mt-1 text-base font-black text-[#c2185b]">
              Tổng tiền: {Math.round(calculateSubtotal() * 1.1).toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button size="large" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-[#c2185b] hover:bg-[#a70f4b]"
          >
            Tạo đơn nhập hàng
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
