import { apiClient } from "../../../api/client";
import { AuditLogItem, NotificationItem } from "./notificationAuditTypes";

const NOTIFS_KEY = "pinkphone_admin_notifications_v1";
const AUDITS_KEY = "pinkphone_admin_audit_logs_v1";

const readLocal = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const notificationAuditService = {
  getNotifications(): NotificationItem[] {
    return readLocal<NotificationItem>(NOTIFS_KEY);
  },

  async fetchNotificationsFromBackend(): Promise<NotificationItem[]> {
    try {
      const response = await apiClient.get<any[]>("/admin/notifications");
      if (!Array.isArray(response.data)) throw new Error("Invalid notifications response");
      const notifications: NotificationItem[] = response.data.map((notification, index) => ({
        id: notification.id || `notification-${index}`,
        userName: notification.userName || notification.username || "Người dùng",
        userCode: notification.userCode || notification.userId || "—",
        avatar: "",
        type: notification.notificationType === "Marketing" ? "Marketing" : notification.notificationType === "System" ? "System" : "Transactional",
        title: notification.title || "Thông báo hệ thống",
        content: notification.content || "",
        bizCode: notification.entityId || notification.entityType || "—",
        status: (notification.readAt ? "Đã đọc" : "Đã gửi") as NotificationItem["status"],
        createdAt: notification.createdAt ? new Date(notification.createdAt).toLocaleString("vi-VN") : "—",
      }));
      localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifications));
      return notifications;
    } catch (error) {
      console.warn("Backend API /admin/notifications failed", error);
      return this.getNotifications();
    }
  },

  getAuditLogs(): AuditLogItem[] {
    return readLocal<AuditLogItem>(AUDITS_KEY);
  },

  async fetchAuditLogsFromBackend(): Promise<AuditLogItem[]> {
    const response = await apiClient.get<any[]>("/admin/audit-logs");
    if (!Array.isArray(response.data)) throw new Error("Invalid audit-log response");
    const logs: AuditLogItem[] = response.data.map((log, index) => ({
      id: log.id || `audit-${index}`,
      // Keep ISO data for date filtering; format only when rendering.
      timestamp: log.timestamp || "",
      actorEmail: log.actorEmail || "system",
      actionCode: log.actionCode || "SYSTEM_EVENT",
      entityType: log.entityType || "SYSTEM",
      result: log.result === "FAILURE" ? "FAILURE" : "SUCCESS",
      correlationId: log.correlationId || "—",
      ipAddress: log.ipAddress || "—",
      userAgent: log.userAgent || "—",
      oldDataJson: log.oldDataJson || "",
      newDataJson: log.newDataJson || "",
    }));
    localStorage.setItem(AUDITS_KEY, JSON.stringify(logs));
    return logs;
  },
};
