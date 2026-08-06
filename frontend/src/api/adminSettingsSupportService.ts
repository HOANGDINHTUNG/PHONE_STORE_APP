import { apiClient } from "./client";

export type AdminSettings = Record<string, string>;

export type SupportArticle = {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary?: string;
  content?: string;
  views: number;
};

export const adminSettingsSupportService = {
  getSettings: () => apiClient.get<AdminSettings>("/admin/settings").then((response) => response.data),
  updateSettings: (values: AdminSettings) => apiClient.patch<AdminSettings>("/admin/settings", values).then((response) => response.data),
  getArticles: () => apiClient.get<SupportArticle[]>("/admin/support/articles").then((response) => response.data),
  getArticle: (slug: string) => apiClient.get<SupportArticle>(`/admin/support/articles/${slug}`).then((response) => response.data),
  createTicket: (payload: { subject: string; description: string; priority: string; requester?: string }) =>
    apiClient.post("/admin/support/tickets", payload).then((response) => response.data),
};
