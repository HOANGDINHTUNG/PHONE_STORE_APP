import { apiClient } from "./client";

export type ShipmentStatus = "PENDING" | "PACKING" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "RETURNED" | "CANCELLED" | "FAILED";

export interface ShipmentSummary {
  id: number; shipmentCode: string; orderId: string; orderCode: string; warehouseId: string; warehouseName: string;
  shippingProvider: string; trackingCode: string; itemCount: number; shippingFee: number; status: ShipmentStatus;
  estimatedDeliveryAt?: string; createdAt: string;
}
export interface ShipmentItem {
  shipmentItemId: number; orderItemId: string; productName: string; variantName: string; sku: string; imageUrl?: string;
  quantity: number; unitPrice: number; identifiers: string[];
}
export interface ShipmentDetail extends Omit<ShipmentSummary, "warehouseId" | "warehouseName" | "itemCount"> {
  warehouseName: string; warehouseAddress?: string; shippedAt?: string; deliveredAt?: string;
  receiverName?: string; receiverPhone?: string; destinationAddress?: string; items: ShipmentItem[];
}
export interface Warehouse { id: string; code: string; name: string; phone?: string; address?: string; status: string; }
interface Paged<T> { items: T[]; page: { totalElements: number; totalPages: number; number: number; size: number }; }

export const adminShipmentService = {
  getShipments: (page = 1, size = 100) => apiClient.get<Paged<ShipmentSummary>>("/admin/shipments", { params: { page, size } }).then((response) => response.data),
  getShipment: (id: number | string) => apiClient.get<ShipmentDetail>(`/admin/shipments/${id}`).then((response) => response.data),
  getWarehouses: () => apiClient.get<Warehouse[]>("/admin/shipments/warehouses").then((response) => response.data),
  createShipment: (orderId: string, payload: { warehouseId: string; shippingProvider: string; trackingCode?: string; shippingFee?: number; estimatedDeliveryAt?: string; items: { orderItemId: string; quantity: number }[] }) => apiClient.post<ShipmentDetail>(`/admin/shipments/orders/${orderId}`, payload).then((response) => response.data),
  updateStatus: (id: number, status: ShipmentStatus) => apiClient.patch<ShipmentDetail>(`/admin/shipments/${id}/status`, { status }).then((response) => response.data),
  updateTracking: (id: number, shippingProvider: string, trackingCode: string) => apiClient.patch<ShipmentDetail>(`/admin/shipments/${id}/tracking`, { shippingProvider, trackingCode }).then((response) => response.data),
};
