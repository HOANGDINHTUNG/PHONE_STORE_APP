export type NotificationType = "Transactional" | "Marketing" | "System";
export type NotificationStatus = "Đã đọc" | "Đã gửi" | "Chờ gửi" | "Thất bại";

export interface NotificationItem {
  id: string;
  userName: string;
  userCode: string;
  avatar?: string;
  type: NotificationType;
  title: string;
  content: string;
  bizCode: string;
  status: NotificationStatus;
  createdAt: string;
}

export type AuditLogResult = "SUCCESS" | "FAILURE";

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorEmail: string;
  actionCode: string;
  entityType: string;
  result: AuditLogResult;
  correlationId: string;
  ipAddress: string;
  userAgent: string;
  oldDataJson: string;
  newDataJson: string;
}
