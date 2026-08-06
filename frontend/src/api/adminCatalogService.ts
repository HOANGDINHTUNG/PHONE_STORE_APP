import { apiClient } from "./client";

export type CatalogStatus = "ACTIVE" | "INACTIVE";
export type PublicationStatus = "DRAFT" | CatalogStatus;

export interface AdminProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  name: string;
  slug: string;
  description?: string;
  publicationStatus: PublicationStatus;
  variantCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  status: CatalogStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCategory {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  description?: string;
  status: CatalogStatus;
  sortOrder: number;
  subCategories?: AdminCategory[];
}

export interface AdminVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  color?: string;
  ramGb?: number;
  storageGb?: number;
  trackingType?: "SERIALIZED" | "BATCH" | "NONE";
  warrantyMonths?: number;
  listPrice: number;
  salePrice?: number;
  status: CatalogStatus;
  version: number;
  images: { id: string; imageUrl: string; isPrimary: boolean }[];
}

export interface AdminBanner {
  id: string;
  title: string;
  label?: string;
  subtitle?: string;
  image: string;
  linkUrl?: string;
  position?: string;
  bgColor?: string;
  textColor?: string;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE" | "SCHEDULED";
}

export interface AdminNews {
  id: string;
  tag: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  image: string;
  viewsCount: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export const adminCatalogService = {
  getProducts: (params?: Record<string, string>) => apiClient.get<AdminProduct[]>("/admin/products", { params }).then((r) => r.data),
  createProduct: (data: Pick<AdminProduct, "categoryId" | "brandId" | "name" | "description">) => apiClient.post<AdminProduct>("/admin/products", data).then((r) => r.data),
  updateProduct: (id: string, data: Partial<Pick<AdminProduct, "categoryId" | "brandId" | "name" | "description">>) => apiClient.patch<AdminProduct>(`/admin/products/${id}`, data).then((r) => r.data),
  setProductStatus: (id: string, status: PublicationStatus) => apiClient.patch<AdminProduct>(`/admin/products/${id}/status`, undefined, { params: { status } }).then((r) => r.data),

  getBrands: (params?: Record<string, string>) => apiClient.get<AdminBrand[]>("/admin/brands", { params }).then((r) => r.data),
  createBrand: (data: Pick<AdminBrand, "name" | "logoUrl" | "description">) => apiClient.post<AdminBrand>("/admin/brands", data).then((r) => r.data),
  updateBrand: (id: string, data: Pick<AdminBrand, "name" | "logoUrl" | "description">) => apiClient.patch<AdminBrand>(`/admin/brands/${id}`, data).then((r) => r.data),
  setBrandStatus: (id: string, status: CatalogStatus) => apiClient.patch<AdminBrand>(`/admin/brands/${id}/status`, undefined, { params: { status } }).then((r) => r.data),

  getCategories: (params?: Record<string, string>) => apiClient.get<AdminCategory[]>("/admin/categories", { params }).then((r) => r.data),
  createCategory: (data: Omit<AdminCategory, "id" | "slug" | "subCategories">) => apiClient.post<AdminCategory>("/admin/categories", data).then((r) => r.data),
  updateCategory: (id: string, data: Omit<AdminCategory, "id" | "slug" | "subCategories">) => apiClient.patch<AdminCategory>(`/admin/categories/${id}`, data).then((r) => r.data),
  setCategoryStatus: (id: string, status: CatalogStatus) => apiClient.patch<AdminCategory>(`/admin/categories/${id}/status`, undefined, { params: { status } }).then((r) => r.data),

  getVariants: (productId: string) => apiClient.get<AdminVariant[]>(`/admin/products/${productId}/variants`).then((r) => r.data),
  createVariant: (productId: string, data: Omit<AdminVariant, "id" | "productId" | "status" | "version" | "images">) => apiClient.post<AdminVariant>(`/admin/products/${productId}/variants`, data).then((r) => r.data),
  updateVariant: (id: string, version: number, data: Partial<Pick<AdminVariant, "name" | "color" | "ramGb" | "storageGb" | "warrantyMonths">>) => apiClient.patch<AdminVariant>(`/admin/variants/${id}`, data, { headers: { "If-Match": version } }).then((r) => r.data),
  changeVariantPrice: (id: string, newListPrice: number, newSalePrice?: number) => apiClient.post<AdminVariant>(`/admin/variants/${id}/price-changes`, { newListPrice, newSalePrice, reason: "Cập nhật từ quản trị biến thể" }).then((r) => r.data),
  setVariantStatus: (id: string, status: CatalogStatus) => apiClient.patch<AdminVariant>(`/admin/variants/${id}/status`, undefined, { params: { status } }).then((r) => r.data),
  addVariantImage: (id: string, imageUrl: string) => apiClient.post(`/admin/variants/${id}/images`, { imageUrl, altText: "", isPrimary: true, sortOrder: 0 }).then((r) => r.data),

  getBanners: (params?: Record<string, string>) => apiClient.get<AdminBanner[]>("/admin/banners", { params }).then((r) => r.data),
  createBanner: (data: Omit<AdminBanner, "id" | "image"> & { imageUrl: string }) => apiClient.post<AdminBanner>("/admin/banners", data).then((r) => r.data),
  updateBanner: (id: string, data: Omit<AdminBanner, "id" | "image"> & { imageUrl: string }) => apiClient.patch<AdminBanner>(`/admin/banners/${id}`, data).then((r) => r.data),
  setBannerStatus: (id: string, status: AdminBanner["status"]) => apiClient.patch<AdminBanner>(`/admin/banners/${id}/status`, undefined, { params: { status } }).then((r) => r.data),

  getNews: (params?: Record<string, string>) => apiClient.get<AdminNews[]>("/admin/news", { params }).then((r) => r.data),
  createNews: (data: Omit<AdminNews, "id" | "date" | "image" | "viewsCount"> & { imageUrl: string; publishedAt?: string }) => apiClient.post<AdminNews>("/admin/news", data).then((r) => r.data),
  updateNews: (id: string, data: Omit<AdminNews, "id" | "date" | "image" | "viewsCount"> & { imageUrl: string; publishedAt?: string }) => apiClient.patch<AdminNews>(`/admin/news/${id}`, data).then((r) => r.data),
  setNewsStatus: (id: string, status: AdminNews["status"]) => apiClient.patch<AdminNews>(`/admin/news/${id}/status`, undefined, { params: { status } }).then((r) => r.data),
};
