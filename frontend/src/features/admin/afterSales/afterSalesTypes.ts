export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewItem {
  id: string;
  productName: string;
  variantName?: string;
  sku: string;
  image?: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  status: ReviewStatus;
  rejectionReason?: string;
  moderatedBy?: string;
  moderatedAt?: string;
}

export type WarrantyClaimStatusType =
  | "INSPECTING"
  | "WAITING_PARTS"
  | "COMPLETED"
  | "SUBMITTED"
  | "REJECTED"
  | "RECEIVED"
  | "REPAIRING";

export interface WarrantyClaimItem {
  id: string;
  claimCode: string;
  customerName: string;
  customerPhone: string;
  serialImei: string;
  productName: string;
  status: WarrantyClaimStatusType;
  createdAt: string;
  issueDescription?: string;
  resolution?: string;
}

export type ReturnRequestStatusType =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "IN_TRANSIT"
  | "COMPLETED";

export interface ReturnRequestItem {
  id: string;
  returnCode: string;
  orderCode: string;
  requestDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  serialImei?: string;
  conditionNote: string;
  originalPrice: number;
  reasonTitle: string;
  reasonDetail: string;
  evidenceImages?: string[];
  status: ReturnRequestStatusType;
  technicianNote?: string;
}
