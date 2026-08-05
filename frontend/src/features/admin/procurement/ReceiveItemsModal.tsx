import React, { useEffect, useState } from "react";
import { Button, InputNumber, Modal, Table, message } from "antd";
import { PackageCheck } from "lucide-react";
import { PurchaseOrder } from "./procurementTypes";

interface ReceiveItemsModalProps {
  open: boolean;
  po?: PurchaseOrder;
  onClose: () => void;
  onSubmit: (receivedMap: Record<string | number, number>) => void;
}

export function ReceiveItemsModal({
  open,
  po,
  onClose,
  onSubmit,
}: ReceiveItemsModalProps) {
  const [receivedMap, setReceivedMap] = useState<Record<string | number, number>>({});

  useEffect(() => {
    if (po) {
      const initial: Record<string | number, number> = {};
      po.items.forEach((item) => {
        const remaining = Math.max(0, item.qtyOrd - item.qtyRec);
        initial[item.id] = remaining;
      });
      setReceivedMap(initial);
    }
  }, [po]);

  if (!po) return null;

  const handleQtyChange = (itemId: string | number, qty: number | null) => {
    setReceivedMap((prev) => ({
      ...prev,
      [itemId]: qty || 0,
    }));
  };

  const handleFinish = () => {
    const totalAdded = Object.values(receivedMap).reduce((a, b) => a + b, 0);
    if (totalAdded <= 0) {
      message.warning("Vui lòng nhập số lượng nhận lớn hơn 0.");
      return;
    }
    onSubmit(receivedMap);
    message.success("Đã ghi nhận số lượng thực nhận vào kho thành công.");
    onClose();
  };

  const columns = [
    {
      title: "Mã SKU / Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          {record.image && (
            <img
              src={record.image}
              alt={record.name}
              className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          )}
          <div>
            <div className="font-bold text-slate-900">{record.sku}</div>
            <div className="text-xs text-slate-500">{record.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Đã đặt",
      dataIndex: "qtyOrd",
      key: "qtyOrd",
      render: (val: number) => <b className="text-slate-800">{val}</b>,
    },
    {
      title: "Đã nhận trước",
      dataIndex: "qtyRec",
      key: "qtyRec",
      render: (val: number) => <span className="font-medium text-emerald-600">{val}</span>,
    },
    {
      title: "Cần nhận",
      key: "pending",
      render: (_: any, record: any) => {
        const p = Math.max(0, record.qtyOrd - record.qtyRec);
        return <span className="font-bold text-amber-600">{p}</span>;
      },
    },
    {
      title: "Nhận đợt này",
      key: "receiveNow",
      render: (_: any, record: any) => {
        const maxReceivable = Math.max(0, record.qtyOrd - record.qtyRec);
        return (
          <InputNumber
            min={0}
            max={maxReceivable}
            value={receivedMap[record.id]}
            onChange={(val) => handleQtyChange(record.id, val)}
            className="w-28"
          />
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
          <PackageCheck className="text-[#c2185b]" size={24} />
          Xác nhận nhận hàng kho ({po.code})
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <p className="mt-1 text-sm text-slate-500">
        Nhập số lượng thực tế kiểm đếm được tại <b>{po.destWarehouse}</b>.
      </p>

      <div className="mt-4">
        <Table
          dataSource={po.items}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
          bordered
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button size="large" onClick={onClose}>
          Hủy
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleFinish}
          className="bg-[#c2185b] hover:bg-[#a70f4b]"
        >
          Xác nhận nhập kho
        </Button>
      </div>
    </Modal>
  );
}
