import { apiClient } from "../../../api/client";
import { AuditLogItem, NotificationItem } from "./notificationAuditTypes";

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userName: "Nguyen Van A",
    userCode: "USR-0921",
    avatar: "",
    type: "Transactional",
    title: "Xác nhận thanh toán thành công",
    content: "Đơn hàng #88912 của bạn đã được thanh toán thành công qua VNPAY.",
    bizCode: "ORD-88912",
    status: "Đã đọc",
    createdAt: "24/10/2023 14:32:01",
  },
  {
    id: "notif-2",
    userName: "Tran Thi B",
    userCode: "USR-1142",
    avatar: "",
    type: "Marketing",
    title: "Ưu đãi ngày thứ 6",
    content: "Giảm 50% cho tất cả các cuộc gọi nội mạng và phụ kiện chính hãng.",
    bizCode: "CPN-BLACKFRIDAY",
    status: "Đã gửi",
    createdAt: "24/10/2023 14:30:00",
  },
  {
    id: "notif-3",
    userName: "Lê Văn C",
    userCode: "USR-1005",
    avatar: "",
    type: "System",
    title: "Bảo trì hệ thống định kỳ",
    content: "Hệ thống sẽ tạm dừng hoạt động từ 00:00 - 02:00 ngày 28/10/2023.",
    bizCode: "SYS-MAINT",
    status: "Đã đọc",
    createdAt: "24/10/2023 10:15:00",
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "audit-1",
    timestamp: "2023-10-27 14:32:01",
    actorEmail: "admin@pinkphone.vn",
    actionCode: "UPDATE_CONFIG",
    entityType: "SYSTEM_SETTINGS",
    result: "SUCCESS",
    correlationId: "req_8f9a2b1c",
    ipAddress: "192.168.1.42 (Mac/Chrome)",
    userAgent: "Macintosh; Intel Mac OS X 10_15_7; Chrome 118.0.0.0",
    oldDataJson: `{\n  "setting_name": "API_RATE_LIMIT",\n  "value": 100,\n  "status": "active",\n  "api_key": "********" // masked\n}`,
    newDataJson: `{\n  "setting_name": "API_RATE_LIMIT",\n  "value": 500,\n  "status": "active",\n  "api_key": "********" // masked\n}`,
  },
  {
    id: "audit-2",
    timestamp: "2023-10-27 14:28:45",
    actorEmail: "system_cron",
    actionCode: "DATA_SYNC",
    entityType: "EXTERNAL_API",
    result: "FAILURE",
    correlationId: "req_3a2d1f9b",
    ipAddress: "127.0.0.1 (Spring Task)",
    userAgent: "Spring-Cloud-Task/3.0.0",
    oldDataJson: `{\n  "last_sync": "2023-10-26 12:00:00",\n  "records": 120\n}`,
    newDataJson: `{\n  "last_sync": "2023-10-27 14:28:45",\n  "records": 0,\n  "error": "Connection timeout to ERP API"\n}`,
  },
  {
    id: "audit-3",
    timestamp: "2023-10-26 09:15:20",
    actorEmail: "admin@pinkphone.vn",
    actionCode: "ASSIGN_ROLE",
    entityType: "USER_ROLE",
    result: "SUCCESS",
    correlationId: "req_7c8d9e0f",
    ipAddress: "192.168.1.42 (Mac/Chrome)",
    userAgent: "Macintosh; Intel Mac OS X 10_15_7; Chrome 118.0.0.0",
    oldDataJson: `{\n  "user_email": "a.nguyen@pinkphone.vn",\n  "role": "STAFF"\n}`,
    newDataJson: `{\n  "user_email": "a.nguyen@pinkphone.vn",\n  "role": "STORE_MANAGER"\n}`,
  },
];

const NOTIFS_KEY = "pinkphone_admin_notifications_v1";
const AUDITS_KEY = "pinkphone_admin_audit_logs_v1";

export const notificationAuditService = {
  // Notifications
  getNotifications(): NotificationItem[] {
    try {
      const raw = localStorage.getItem(NOTIFS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  },

  async fetchNotificationsFromBackend(): Promise<NotificationItem[]> {
    try {
      const res = await apiClient.get<any[]>("/notifications");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: NotificationItem[] = res.data.map((n, idx) => ({
          id: n.id || `notif-${idx}`,
          userName: n.userName || "Nguyen Van A",
          userCode: n.userCode || `USR-092${idx}`,
          avatar: "",
          type: n.notificationType === "Marketing" ? "Marketing" : n.notificationType === "System" ? "System" : "Transactional",
          title: n.title || "Thông báo hệ thống",
          content: n.content || "Nội dung chi tiết thông báo...",
          bizCode: n.entityId || `ORD-8891${idx}`,
          status: n.readAt ? "Đã đọc" : "Đã gửi",
          createdAt: n.createdAt ? new Date(n.createdAt).toLocaleString("vi-VN") : "24/10/2023 14:32:01",
        }));
        localStorage.setItem(NOTIFS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn("Backend API /notifications failed, using local database fallback", e);
    }
    return this.getNotifications();
  },

  // Audit Logs
  getAuditLogs(): AuditLogItem[] {
    try {
      const raw = localStorage.getItem(AUDITS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(AUDITS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  },
};
