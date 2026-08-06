import { apiClient } from "./client";

export interface NotificationResponse {
  id: string;
  notificationType: string;
  title: string;
  content: string;
  entityType: string;
  entityId: string;
  actionUrl: string;
  createdAt: string;
  readAt: string | null;
}

export const getNotificationsApi = async (): Promise<
  NotificationResponse[]
> => {
  const response =
    await apiClient.get<NotificationResponse[]>("/me/notifications");
  return response.data;
};

export const markAllNotificationsReadApi = async (): Promise<void> => {
  await apiClient.post("/me/notifications/read-all");
};

export const markNotificationReadApi = async (id: string): Promise<void> => {
  await apiClient.patch(`/me/notifications/${id}/read`);
};
