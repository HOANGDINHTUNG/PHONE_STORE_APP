import {
  CreatePOPayload,
  FilterParams,
  PurchaseOrder,
} from "./procurementTypes";
import { apiClient } from "../../../api/client";

const INITIAL_MOCK_POS: PurchaseOrder[] = [
  {
    id: "po-1045",
    code: "PO-2023-1045",
    supplierName: "Apple Distributor Asia Pacific",
    destWarehouse: "Kho Tổng - Quận 7",
    totalAmount: 2139500000,
    expectedDelivery: "28/10/2023",
    createdAt: "24/10/2023",
    creator: "Quản trị viên (Admin User)",
    approver: "Trưởng phòng Kho (Manager User)",
    referenceNo: "INV-APPLE-9923",
    note: "Đơn hàng ưu tiên phục vụ mùa mua sắm Q4. Yêu cầu toàn bộ thiết bị phải có mã VN/A chính hãng.",
    status: "APPROVED",
    items: [
      {
        id: "item-1",
        sku: "IP15-PM-256-NT",
        name: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
        qtyOrd: 50,
        qtyRec: 0,
        unitCost: 28500000,
        totalCost: 1425000000,
      },
      {
        id: "item-2",
        sku: "AP-PRO-2-USBC",
        name: "AirPods Pro 2 (USB-C)",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c.png",
        qtyOrd: 100,
        qtyRec: 0,
        unitCost: 5200000,
        totalCost: 520000000,
      },
    ],
    history: [
      {
        id: "h-1",
        title: "Đã duyệt đơn nhập",
        timestamp: "Hôm nay, 10:45 AM",
        actor: "Trưởng phòng Kho (Manager User)",
        type: "approved",
      },
      {
        id: "h-2",
        title: "Đã gửi yêu cầu phê duyệt",
        timestamp: "Hôm nay, 09:12 AM",
        actor: "Quản trị viên (Admin User)",
        type: "submitted",
      },
      {
        id: "h-3",
        title: "Đã tạo đơn nhập hàng",
        timestamp: "Hôm nay, 08:30 AM",
        actor: "Quản trị viên (Admin User)",
        type: "created",
      },
    ],
  },
  {
    id: "po-0891",
    code: "PO-2023-0891",
    supplierName: "TechVision Electronics",
    destWarehouse: "Trung tâm Phân phối Chính",
    totalAmount: 1084800000,
    expectedDelivery: "24/10/2023",
    createdAt: "20/10/2023",
    creator: "Nguyễn Văn A",
    approver: "Trần Thị B",
    referenceNo: "TV-88219",
    note: "Nhập bổ sung kho chính chuẩn bị chương trình khuyến mãi tháng 11.",
    status: "COMPLETED",
    items: [
      {
        id: "item-891-1",
        sku: "S24U-256-GREY",
        name: "Samsung Galaxy S24 Ultra 256GB Xám Titan",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
        qtyOrd: 40,
        qtyRec: 40,
        unitCost: 24500000,
        totalCost: 980000000,
      },
    ],
    history: [
      {
        id: "h-891-1",
        title: "Đã kiểm đếm & Nhập kho hoàn tất",
        timestamp: "24/10/2023, 15:20",
        actor: "Bộ phận Kiểm hàng Kho",
        type: "received",
      },
      {
        id: "h-891-2",
        title: "Đã phê duyệt đơn nhập",
        timestamp: "21/10/2023, 11:00",
        actor: "Trần Thị B",
        type: "approved",
      },
    ],
  },
  {
    id: "po-0892",
    code: "PO-2023-0892",
    supplierName: "Global Acc. Ltd",
    destWarehouse: "Kho Miền Bắc (North Hub)",
    totalAmount: 308412000,
    expectedDelivery: "26/10/2023",
    createdAt: "22/10/2023",
    creator: "Lê Văn C",
    approver: "Trần Thị B",
    referenceNo: "GA-PO-4412",
    status: "APPROVED",
    items: [
      {
        id: "item-892-1",
        sku: "ANKER-MAG-10K",
        name: "Sạc dự phòng Anker MagGo 10000mAh",
        qtyOrd: 200,
        qtyRec: 0,
        unitCost: 1400000,
        totalCost: 280000000,
      },
    ],
    history: [
      {
        id: "h-892-1",
        title: "Đã phê duyệt đơn nhập",
        timestamp: "23/10/2023, 09:30",
        actor: "Trần Thị B",
        type: "approved",
      },
      {
        id: "h-892-2",
        title: "Đã tạo đơn nhập hàng",
        timestamp: "22/10/2023, 14:15",
        actor: "Lê Văn C",
        type: "created",
      },
    ],
  },
  {
    id: "po-0893",
    code: "PO-2023-0893",
    supplierName: "SmartDisplays Inc",
    destWarehouse: "Kho Miền Nam (South Hub)",
    totalAmount: 2136000000,
    expectedDelivery: "02/11/2023",
    createdAt: "25/10/2023",
    creator: "Hoàng Minh D",
    approver: "--",
    referenceNo: "SD-2023-90",
    note: "Đơn nháp chờ chốt ngân sách mua hàng quý IV.",
    status: "DRAFT",
    items: [
      {
        id: "item-893-1",
        sku: "X14U-512-WHITE",
        name: "Xiaomi 14 Ultra 512GB Trắng",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra-1.png",
        qtyOrd: 80,
        qtyRec: 0,
        unitCost: 26700000,
        totalCost: 2136000000,
      },
    ],
    history: [
      {
        id: "h-893-1",
        title: "Đã tạo bản nháp",
        timestamp: "25/10/2023, 16:00",
        actor: "Hoàng Minh D",
        type: "created",
      },
    ],
  },
  {
    id: "po-0894",
    code: "PO-2023-0894",
    supplierName: "BatteryWorld Corp",
    destWarehouse: "Kho Tổng - Quận 7",
    totalAmount: 828000000,
    expectedDelivery: "28/10/2023",
    createdAt: "24/10/2023",
    creator: "Nguyễn Văn A",
    approver: "--",
    referenceNo: "BW-9901",
    status: "PENDING_APPROVAL",
    items: [
      {
        id: "item-894-1",
        sku: "BAT-IP15-ORIGINAL",
        name: "Pin linh kiện chính hãng iPhone 15",
        qtyOrd: 500,
        qtyRec: 0,
        unitCost: 1500000,
        totalCost: 750000000,
      },
    ],
    history: [
      {
        id: "h-894-1",
        title: "Đã gửi yêu cầu phê duyệt",
        timestamp: "24/10/2023, 11:30",
        actor: "Nguyễn Văn A",
        type: "submitted",
      },
      {
        id: "h-894-2",
        title: "Đã tạo đơn nhập hàng",
        timestamp: "24/10/2023, 10:00",
        actor: "Nguyễn Văn A",
        type: "created",
      },
    ],
  },
];

const STORAGE_KEY = "pinkphone_admin_procurement_pos_v4";

function getStoredPOs(): PurchaseOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_POS));
  return INITIAL_MOCK_POS;
}

function saveStoredPOs(pos: PurchaseOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
}

function mapBackendPO(po: any, fallback?: Partial<PurchaseOrder>): PurchaseOrder {
  return {
    id: String(po.id),
    code: po.purchaseOrderCode,
    supplierName: po.supplierName || fallback?.supplierName || "—",
    supplierId: po.supplierId,
    destWarehouse: po.warehouseName || fallback?.destWarehouse || "—",
    warehouseId: po.warehouseId,
    totalAmount: Number(po.totalAmount || 0),
    expectedDelivery: po.expectedAt ? new Date(po.expectedAt).toLocaleDateString("vi-VN") : "—",
    createdAt: po.createdAt ? new Date(po.createdAt).toLocaleDateString("vi-VN") : new Date().toLocaleDateString("vi-VN"),
    creator: "Hệ thống",
    approver: po.approvedBy ? String(po.approvedBy) : "—",
    note: po.note,
    status: po.status,
    items: (po.items || []).map((item: any) => ({
      id: item.id,
      sku: item.sku || "—",
      name: item.productVariantName || "—",
      image: item.imageUrl || undefined,
      qtyOrd: item.orderedQuantity || 0,
      qtyRec: item.receivedQuantity || 0,
      unitCost: Number(item.unitCost || 0),
      totalCost: Number(item.lineTotal || 0),
    })),
    history: fallback?.history || [],
  };
}

function upsertStoredPO(po: PurchaseOrder) {
  const list = getStoredPOs();
  const index = list.findIndex((item) => item.id === po.id || item.code === po.code);
  if (index >= 0) list[index] = po;
  else list.unshift(po);
  saveStoredPOs(list);
}

export const procurementService = {
  async fetchPurchaseOrdersFromBackend(): Promise<PurchaseOrder[]> {
    const response = await apiClient.get<any>("/purchase-orders", { params: { page: 1, size: 100 } });
    const content = response.data?.items || response.data?.content || [];
    const mapped: PurchaseOrder[] = content.map((po: any) => mapBackendPO(po));
    saveStoredPOs(mapped);
    return mapped;
  },
  getPurchaseOrders(filters?: FilterParams): PurchaseOrder[] {
    let list = getStoredPOs();

    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((po) => po.status === filters.status);
    }

    if (filters?.warehouseId && filters.warehouseId !== "ALL") {
      list = list.filter((po) => po.warehouseId === filters.warehouseId);
    }

    if (filters?.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (po) =>
          po.code.toLowerCase().includes(q) ||
          po.supplierName.toLowerCase().includes(q) ||
          po.destWarehouse.toLowerCase().includes(q) ||
          (po.referenceNo && po.referenceNo.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getPOByCode(code: string): PurchaseOrder | undefined {
    const list = getStoredPOs();
    return list.find(
      (po) => po.code.toLowerCase() === code.toLowerCase() || po.id === code
    );
  },

  async createPO(payload: CreatePOPayload): Promise<PurchaseOrder> {
    const response = await apiClient.post<any>("/admin/procurement", {
      supplierName: payload.supplierName, destWarehouse: payload.destWarehouse,
      expectedDelivery: payload.expectedDelivery, note: payload.note,
      items: payload.items.map((item) => ({ sku: item.sku, qtyOrd: item.qtyOrd, unitCost: item.unitCost })),
    });
    const created = mapBackendPO(response.data, { supplierName: payload.supplierName, destWarehouse: payload.destWarehouse });
    await this.fetchPurchaseOrdersFromBackend();
    return created;
  },
  async submitPO(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post<any>(`/admin/procurement/${id}/submit`);
    const mapped = mapBackendPO(response.data, this.getPOByCode(id));
    upsertStoredPO(mapped);
    return mapped;
  },
  async approvePO(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post<any>(`/admin/procurement/${id}/approve`);
    const mapped = mapBackendPO(response.data, this.getPOByCode(id));
    upsertStoredPO(mapped);
    return mapped;
  },
  async receivePurchaseOrder(id: string, receivedMap: Record<string | number, number>): Promise<PurchaseOrder> {
    const items = Object.entries(receivedMap)
      .map(([purchaseOrderItemId, quantity]) => ({ purchaseOrderItemId: Number(purchaseOrderItemId), quantity }))
      .filter((item) => item.quantity > 0);
    const response = await apiClient.post<any>(`/admin/procurement/${id}/receive`, { items });
    const mapped = mapBackendPO(response.data, this.getPOByCode(id));
    upsertStoredPO(mapped);
    return mapped;
  },
  receiveItems(code: string, receivedMap: Record<string | number, number>): PurchaseOrder | undefined {
    const list = getStoredPOs();
    const poIndex = list.findIndex(
      (p) => p.code.toLowerCase() === code.toLowerCase() || p.id === code
    );
    if (poIndex === -1) return undefined;

    const po = list[poIndex];
    let allReceived = true;
    let totalReceived = 0;

    po.items = po.items.map((item) => {
      const addedQty = receivedMap[item.id] || 0;
      const newRec = Math.min(item.qtyOrd, item.qtyRec + addedQty);
      if (newRec < item.qtyOrd) {
        allReceived = false;
      }
      totalReceived += newRec;
      return {
        ...item,
        qtyRec: newRec,
      };
    });

    if (allReceived) {
      po.status = "COMPLETED";
    } else if (totalReceived > 0) {
      po.status = "PARTIALLY_RECEIVED";
    }

    po.history.unshift({
      id: `h-rec-${Date.now()}`,
      title: allReceived ? "Đã kiểm đếm & Nhập kho hoàn tất" : "Đã nhập kho một phần",
      timestamp: "Vừa xong",
      actor: "Quản trị viên (Admin User)",
      type: "received",
    });

    list[poIndex] = po;
    saveStoredPOs(list);
    return po;
  },

  cancelPO(code: string, reason?: string): PurchaseOrder | undefined {
    const list = getStoredPOs();
    const poIndex = list.findIndex(
      (p) => p.code.toLowerCase() === code.toLowerCase() || p.id === code
    );
    if (poIndex === -1) return undefined;

    const po = list[poIndex];
    po.status = "CANCELLED";
    po.history.unshift({
      id: `h-can-${Date.now()}`,
      title: "Đã hủy đơn nhập hàng",
      timestamp: "Vừa xong",
      actor: "Quản trị viên (Admin User)",
      type: "cancelled",
    });

    list[poIndex] = po;
    saveStoredPOs(list);
    return po;
  },
};
