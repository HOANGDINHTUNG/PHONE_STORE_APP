export type PurchaseOrderStatus =
  | "COMPLETED"
  | "APPROVED"
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "PARTIALLY_RECEIVED"
  | "CANCELLED";

export interface PurchaseOrderItem {
  id: string | number;
  sku: string;
  name: string;
  image?: string;
  qtyOrd: number;
  qtyRec: number;
  unitCost: number;
  totalCost: number;
}

export interface ActivityLog {
  id: string;
  title: string;
  timestamp: string;
  actor: string;
  type: "approved" | "submitted" | "created" | "cancelled" | "received";
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierName: string;
  supplierId?: string;
  destWarehouse: string;
  warehouseId?: string;
  totalAmount: number;
  expectedDelivery: string;
  createdAt: string;
  creator: string;
  approver?: string;
  referenceNo?: string;
  note?: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  history: ActivityLog[];
}

export interface FilterParams {
  status?: string;
  warehouseId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CreatePOPayload {
  supplierName: string;
  destWarehouse: string;
  expectedDelivery: string;
  referenceNo?: string;
  note?: string;
  items: {
    sku: string;
    name: string;
    image?: string;
    qtyOrd: number;
    unitCost: number;
  }[];
}
