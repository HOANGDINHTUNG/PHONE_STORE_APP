import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { ChevronDown, Image as ImageIcon, Pencil, Plus, RefreshCw, Search, SlidersHorizontal, Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLocalBrandLogo } from "../../api/brandService";
import {
  adminCatalogService,
  type AdminBanner,
  type AdminBrand,
  type AdminCategory,
  type AdminNews,
  type AdminProduct,
  type AdminVariant,
  type CatalogStatus,
  type PublicationStatus,
} from "../../api/adminCatalogService";

type PageKind = "products" | "variants" | "brands" | "categories" | "banners" | "news";
type FormValues = Record<string, string>;

const pageCopy: Record<PageKind, { title: string; description: string; create: string }> = {
  products: { title: "Quản lý sản phẩm", description: "Danh mục điện thoại đang được kinh doanh trên PinkPhone.", create: "Thêm sản phẩm" },
  variants: { title: "Quản lý biến thể", description: "Quản lý SKU, màu sắc, cấu hình và giá bán cho từng sản phẩm.", create: "Thêm biến thể" },
  brands: { title: "Quản lý thương hiệu", description: "Danh sách các thương hiệu điện thoại đang phân phối.", create: "Thêm thương hiệu" },
  categories: { title: "Quản lý danh mục", description: "Phân cấp và quản lý cấu trúc sản phẩm.", create: "Thêm danh mục" },
  banners: { title: "Banner quảng cáo", description: "Quản lý banner hiển thị trên toàn hệ thống.", create: "Thêm banner" },
  news: { title: "Quản lý tin tức", description: "Soạn, xuất bản và lưu trữ nội dung tin tức.", create: "Viết tin mới" },
};

const statusClass = (status?: string) => {
  if (status === "ACTIVE" || status === "PUBLISHED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "DRAFT" || status === "SCHEDULED") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (status === "ARCHIVED") return "bg-slate-100 text-slate-600 ring-slate-200";
  return "bg-rose-50 text-rose-700 ring-rose-200";
};

const statusLabel = (status?: string) => ({ ACTIVE: "Đang hoạt động", INACTIVE: "Đã ẩn", DRAFT: "Bản nháp", PUBLISHED: "Đã xuất bản", ARCHIVED: "Đã lưu trữ", SCHEDULED: "Đã lên lịch" }[status || ""] || status || "—");

function StatusPill({ status }: { status?: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ${statusClass(status)}`}>{statusLabel(status)}</span>;
}

function Input({ label, value, onChange, type = "text", required = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="block text-sm font-semibold text-slate-700">
    {label}{required && <span className="ml-1 text-[#d92e70]">*</span>}
    <input required={required} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#edd4de] bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#d92e70] focus:ring-2 focus:ring-[#fce0eb]" />
  </label>;
}

function Select({ label, value, onChange, children, required = false }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode; required?: boolean }) {
  return <label className="block text-sm font-semibold text-slate-700">
    {label}{required && <span className="ml-1 text-[#d92e70]">*</span>}
    <span className="relative mt-1.5 block"><select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-lg border border-[#edd4de] bg-white px-3 py-2.5 pr-9 text-sm font-medium text-slate-800 outline-none transition focus:border-[#d92e70] focus:ring-2 focus:ring-[#fce0eb]">{children}</select><ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-500" size={16} /></span>
  </label>;
}

function Textarea({ label, value, onChange, required = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) {
  return <label className="block text-sm font-semibold text-slate-700">
    {label}{required && <span className="ml-1 text-[#d92e70]">*</span>}
    <textarea required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1.5 min-h-24 w-full rounded-lg border border-[#edd4de] bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#d92e70] focus:ring-2 focus:ring-[#fce0eb]" />
  </label>;
}

function EditorDialog({ title, onClose, onSubmit, busy, children }: { title: string; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; busy: boolean; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-4">
    <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#fffafb] shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f1dce4] bg-[#fffafb] px-6 py-4"><h2 className="text-lg font-black text-slate-950">{title}</h2><button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-[#fff0f5]">Đóng</button></div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">{children}</div>
      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#f1dce4] bg-white px-6 py-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#ebc9d5] px-4 py-2.5 text-sm font-bold text-slate-600">Hủy</button><button disabled={busy} className="rounded-lg bg-[#c2185b] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{busy ? "Đang lưu..." : "Lưu thay đổi"}</button></div>
    </form>
  </div>;
}

function TableShell({ children, empty, loading }: { children: React.ReactNode; empty: boolean; loading: boolean }) {
  if (loading) return <div className="grid min-h-72 place-items-center rounded-xl border border-[#eed2db] bg-white text-sm font-semibold text-slate-500"><RefreshCw className="mr-2 animate-spin" size={18} /> Đang tải dữ liệu...</div>;
  if (empty) return <div className="grid min-h-72 place-items-center rounded-xl border border-dashed border-[#eacbd6] bg-white text-center"><div><Tags className="mx-auto mb-3 text-[#d92e70]" size={30} /><p className="font-bold text-slate-700">Chưa có dữ liệu phù hợp</p><p className="mt-1 text-sm text-slate-500">Hãy thay đổi bộ lọc hoặc tạo bản ghi mới.</p></div></div>;
  return <div className="overflow-x-auto rounded-xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.03)]">{children}</div>;
}

export function AdminCatalogPage({ kind }: { kind: PageKind }) {
  const copy = pageCopy[kind];
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [variants, setVariants] = useState<AdminVariant[]>([]);
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [news, setNews] = useState<AdminNews[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(() => new URLSearchParams(window.location.search).get("product") || "");
  const [productQuery, setProductQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>({});
  const navigate = useNavigate();

  const updateForm = (key: string) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const loadReferenceData = useCallback(async () => {
    const [brandData, categoryData] = await Promise.all([adminCatalogService.getBrands(), adminCatalogService.getCategories()]);
    setBrands(brandData);
    setCategories(categoryData);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (status) params.status = status;
      if (kind === "products") setProducts(await adminCatalogService.getProducts(params));
      if (kind === "brands") setBrands(await adminCatalogService.getBrands(params));
      if (kind === "categories") setCategories(await adminCatalogService.getCategories(params));
      if (kind === "banners") setBanners(await adminCatalogService.getBanners(params));
      if (kind === "news") setNews(await adminCatalogService.getNews(params));
      if (kind === "variants") {
        const productData = await adminCatalogService.getProducts();
        setProducts(productData);
        if (!selectedProductId && productData[0]) {
          setSelectedProductId(productData[0].id);
          setProductQuery(productData[0].name);
        }
      }
    } catch {
      message.error("Không tải được dữ liệu quản trị. Hãy kiểm tra kết nối backend và quyền admin.");
    } finally { setLoading(false); }
  }, [kind, keyword, selectedProductId, status]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (kind === "products") void loadReferenceData().catch(() => undefined); }, [kind, loadReferenceData]);
  useEffect(() => {
    if (kind !== "variants") return;
    const selected = products.find((item) => item.id === selectedProductId);
    if (selected) setProductQuery(selected.name);
  }, [kind, products, selectedProductId]);
  useEffect(() => {
    if (kind !== "variants" || !selectedProductId) {
      if (kind === "variants") setVariants([]);
      return;
    }
    setLoading(true);
    void adminCatalogService.getVariants(selectedProductId).then(setVariants).catch(() => message.error("Không tải được các biến thể của sản phẩm này.")).finally(() => setLoading(false));
  }, [kind, selectedProductId]);

  const records = useMemo(() => ({ products, variants, brands, categories, banners, news }[kind]), [kind, products, variants, brands, categories, banners, news]);
  const filteredVariantProducts = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((item) => `${item.name} ${item.slug}`.toLowerCase().includes(query));
  }, [products, productQuery]);
  const createDefaults = () => {
    if (kind === "products") return { categoryId: categories[0]?.id || "", brandId: brands[0]?.id || "", name: "", description: "" };
    if (kind === "variants") return { sku: "", name: "", color: "", ramGb: "", storageGb: "", trackingType: "NONE", warrantyMonths: "12", listPrice: "", salePrice: "", imageUrl: "" };
    if (kind === "brands") return { name: "", logoUrl: "", description: "" };
    if (kind === "categories") return { name: "", parentId: "", description: "", status: "ACTIVE", sortOrder: "0" };
    if (kind === "banners") return { title: "", label: "", subtitle: "", imageUrl: "", linkUrl: "", position: "HERO", bgColor: "", textColor: "", sortOrder: "0", status: "ACTIVE" };
    return { title: "", tag: "Tin tức", description: "", content: "", imageUrl: "", publishedAt: "", status: "DRAFT" };
  };

  const openCreate = () => { setEditingId(null); setForm(createDefaults()); setDialogOpen(true); };
  const openEdit = (record: AdminProduct | AdminVariant | AdminBrand | AdminCategory | AdminBanner | AdminNews) => {
    setEditingId(record.id);
    if (kind === "products") { const item = record as AdminProduct; setForm({ categoryId: item.categoryId, brandId: item.brandId, name: item.name, description: item.description || "" }); }
    if (kind === "variants") { const item = record as AdminVariant; setForm({ sku: item.sku, name: item.name, color: item.color || "", ramGb: String(item.ramGb || ""), storageGb: String(item.storageGb || ""), trackingType: item.trackingType || "NONE", warrantyMonths: String(item.warrantyMonths || ""), listPrice: String(item.listPrice), salePrice: String(item.salePrice || ""), imageUrl: "" }); }
    if (kind === "brands") { const item = record as AdminBrand; setForm({ name: item.name, logoUrl: item.logoUrl || "", description: item.description || "" }); }
    if (kind === "categories") { const item = record as AdminCategory; setForm({ name: item.name, parentId: item.parentId || "", description: item.description || "", status: item.status, sortOrder: String(item.sortOrder) }); }
    if (kind === "banners") { const item = record as AdminBanner; setForm({ title: item.title, label: item.label || "", subtitle: item.subtitle || "", imageUrl: item.image, linkUrl: item.linkUrl || "", position: item.position || "HERO", bgColor: item.bgColor || "", textColor: item.textColor || "", sortOrder: String(item.sortOrder), status: item.status }); }
    if (kind === "news") { const item = record as AdminNews; setForm({ title: item.title, tag: item.tag, description: item.description, content: item.content || "", imageUrl: item.image, publishedAt: "", status: item.status }); }
    setDialogOpen(true);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (kind === "products") {
        const payload = { categoryId: form.categoryId, brandId: form.brandId, name: form.name, description: form.description || undefined };
        if (editingId) await adminCatalogService.updateProduct(editingId, payload);
        else await adminCatalogService.createProduct(payload);
      }
      if (kind === "variants") {
        const numeric = (key: string) => form[key] ? Number(form[key]) : undefined;
        if (editingId) {
          await adminCatalogService.updateVariant(editingId, Number((variants.find((v) => v.id === editingId)?.version || 0)), { name: form.name, color: form.color || undefined, ramGb: numeric("ramGb"), storageGb: numeric("storageGb"), warrantyMonths: numeric("warrantyMonths") });
          await adminCatalogService.changeVariantPrice(editingId, Number(form.listPrice), numeric("salePrice"));
          if (form.imageUrl) await adminCatalogService.addVariantImage(editingId, form.imageUrl);
        }
        else {
          const created = await adminCatalogService.createVariant(selectedProductId, { sku: form.sku, name: form.name, color: form.color || undefined, ramGb: numeric("ramGb"), storageGb: numeric("storageGb"), trackingType: (form.trackingType || "NONE") as AdminVariant["trackingType"], warrantyMonths: numeric("warrantyMonths"), listPrice: Number(form.listPrice), salePrice: numeric("salePrice") });
          if (form.imageUrl) await adminCatalogService.addVariantImage(created.id, form.imageUrl);
        }
      }
      if (kind === "brands") { const payload = { name: form.name, logoUrl: form.logoUrl || undefined, description: form.description || undefined }; if (editingId) await adminCatalogService.updateBrand(editingId, payload); else await adminCatalogService.createBrand(payload); }
      if (kind === "categories") { const payload = { name: form.name, parentId: form.parentId || undefined, description: form.description || undefined, status: (form.status || "ACTIVE") as CatalogStatus, sortOrder: Number(form.sortOrder || 0) }; if (editingId) await adminCatalogService.updateCategory(editingId, payload); else await adminCatalogService.createCategory(payload); }
      if (kind === "banners") { const payload = { ...form, sortOrder: Number(form.sortOrder || 0), status: (form.status || "ACTIVE") as AdminBanner["status"] }; if (editingId) await adminCatalogService.updateBanner(editingId, payload); else await adminCatalogService.createBanner(payload); }
      if (kind === "news") { const payload = { title: form.title, tag: form.tag, description: form.description, content: form.content || undefined, imageUrl: form.imageUrl, publishedAt: form.publishedAt || undefined, status: (form.status || "DRAFT") as AdminNews["status"] }; if (editingId) await adminCatalogService.updateNews(editingId, payload); else await adminCatalogService.createNews(payload); }
      message.success(editingId ? "Đã cập nhật dữ liệu." : "Đã tạo bản ghi mới.");
      setDialogOpen(false);
      await load();
      if (kind === "variants" && selectedProductId) setVariants(await adminCatalogService.getVariants(selectedProductId));
    } catch {
      message.error("Không thể lưu. Vui lòng kiểm tra các trường bắt buộc và thử lại.");
    } finally { setSaving(false); }
  };

  const changeStatus = async (id: string, current: string, nextStatus?: string) => {
    try {
      if (kind === "products") {
        const target = nextStatus || (current === "DRAFT" ? "ACTIVE" : current === "ACTIVE" ? "INACTIVE" : "DRAFT");
        await adminCatalogService.setProductStatus(id, target as PublicationStatus);
      }
      if (kind === "variants") await adminCatalogService.setVariantStatus(id, current === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      if (kind === "brands") await adminCatalogService.setBrandStatus(id, current === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      if (kind === "categories") await adminCatalogService.setCategoryStatus(id, current === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      if (kind === "banners") await adminCatalogService.setBannerStatus(id, current === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      if (kind === "news") await adminCatalogService.setNewsStatus(id, current === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED");
      message.success("Đã cập nhật trạng thái.");
      await load();
      if (kind === "variants" && selectedProductId) setVariants(await adminCatalogService.getVariants(selectedProductId));
    } catch { message.error("Không thể đổi trạng thái bản ghi này."); }
  };

  const renderForm = () => {
    if (kind === "products") return <><Input label="Tên sản phẩm" value={form.name || ""} onChange={updateForm("name")} required placeholder="VD: iPhone 16 Pro" /><Select label="Thương hiệu" value={form.brandId || ""} onChange={updateForm("brandId")} required>{brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select><Select label="Danh mục" value={form.categoryId || ""} onChange={updateForm("categoryId")} required>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select><div className="sm:col-span-2"><Textarea label="Mô tả" value={form.description || ""} onChange={updateForm("description")} placeholder="Mô tả ngắn về sản phẩm..." /></div></>;
    if (kind === "variants") return <><Input label="SKU" value={form.sku || ""} onChange={updateForm("sku")} required placeholder="IP16P-256-NAT" /><Input label="Tên biến thể" value={form.name || ""} onChange={updateForm("name")} required placeholder="iPhone 16 Pro 256GB" /><Input label="Màu sắc" value={form.color || ""} onChange={updateForm("color")} placeholder="Titan sa mạc" /><Select label="Kiểu theo dõi" value={form.trackingType || "NONE"} onChange={updateForm("trackingType")}><option value="NONE">Không theo dõi</option><option value="SERIALIZED">Theo serial</option><option value="BATCH">Theo lô</option></Select><Input label="RAM (GB)" type="number" value={form.ramGb || ""} onChange={updateForm("ramGb")} /><Input label="Bộ nhớ (GB)" type="number" value={form.storageGb || ""} onChange={updateForm("storageGb")} /><Input label="Bảo hành (tháng)" type="number" value={form.warrantyMonths || ""} onChange={updateForm("warrantyMonths")} /><Input label="Giá niêm yết" type="number" value={form.listPrice || ""} onChange={updateForm("listPrice")} required /><Input label="Giá bán" type="number" value={form.salePrice || ""} onChange={updateForm("salePrice")} /><div className="sm:col-span-2"><Input label={editingId ? "Thêm ảnh mới (URL, tùy chọn)" : "Ảnh đại diện (URL, tùy chọn)"} value={form.imageUrl || ""} onChange={updateForm("imageUrl")} placeholder="https://..." /></div></>;
    if (kind === "brands") return <><Input label="Tên thương hiệu" value={form.name || ""} onChange={updateForm("name")} required placeholder="Apple" /><Input label="URL logo" value={form.logoUrl || ""} onChange={updateForm("logoUrl")} placeholder="https://..." /><div className="sm:col-span-2"><Textarea label="Mô tả" value={form.description || ""} onChange={updateForm("description")} /></div></>;
    if (kind === "categories") return <><Input label="Tên danh mục" value={form.name || ""} onChange={updateForm("name")} required /><Select label="Danh mục cha" value={form.parentId || ""} onChange={updateForm("parentId")}><option value="">Không có (danh mục gốc)</option>{categories.filter((item) => item.id !== editingId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select><Select label="Trạng thái" value={form.status || "ACTIVE"} onChange={updateForm("status")}><option value="ACTIVE">Đang hoạt động</option><option value="INACTIVE">Đã ẩn</option></Select><Input label="Thứ tự hiển thị" type="number" value={form.sortOrder || "0"} onChange={updateForm("sortOrder")} required /><div className="sm:col-span-2"><Textarea label="Mô tả" value={form.description || ""} onChange={updateForm("description")} /></div></>;
    if (kind === "banners") return <><Input label="Tiêu đề banner" value={form.title || ""} onChange={updateForm("title")} required /><Input label="Nhãn nhỏ" value={form.label || ""} onChange={updateForm("label")} placeholder="Khuyến mãi" /><div className="sm:col-span-2"><Input label="URL hình ảnh" value={form.imageUrl || ""} onChange={updateForm("imageUrl")} required placeholder="https://..." /></div><div className="sm:col-span-2"><Input label="Đường dẫn khi bấm" value={form.linkUrl || ""} onChange={updateForm("linkUrl")} placeholder="/product/iphone-16-pro" /></div><div className="sm:col-span-2"><Textarea label="Nội dung phụ" value={form.subtitle || ""} onChange={updateForm("subtitle")} /></div><Select label="Vị trí" value={form.position || "HERO"} onChange={updateForm("position")}><option value="HERO">Trang chủ - Hero</option><option value="MIDDLE">Giữa trang</option><option value="SIDEBAR">Sidebar</option></Select><Input label="Thứ tự ưu tiên" type="number" value={form.sortOrder || "0"} onChange={updateForm("sortOrder")} required /><Input label="Màu nền" value={form.bgColor || ""} onChange={updateForm("bgColor")} placeholder="#f8d4df" /><Select label="Trạng thái" value={form.status || "ACTIVE"} onChange={updateForm("status")}><option value="ACTIVE">Đang chạy</option><option value="INACTIVE">Đã ẩn</option><option value="SCHEDULED">Đã lên lịch</option></Select></>;
    return <><Input label="Tiêu đề" value={form.title || ""} onChange={updateForm("title")} required /><Input label="Chuyên mục" value={form.tag || ""} onChange={updateForm("tag")} required /><div className="sm:col-span-2"><Input label="URL ảnh đại diện" value={form.imageUrl || ""} onChange={updateForm("imageUrl")} required placeholder="https://..." /></div><div className="sm:col-span-2"><Textarea label="Mô tả ngắn" value={form.description || ""} onChange={updateForm("description")} required /></div><div className="sm:col-span-2"><Textarea label="Nội dung bài viết" value={form.content || ""} onChange={updateForm("content")} /></div><Input label="Thời gian xuất bản" type="datetime-local" value={form.publishedAt || ""} onChange={updateForm("publishedAt")} /><Select label="Trạng thái" value={form.status || "DRAFT"} onChange={updateForm("status")}><option value="DRAFT">Bản nháp</option><option value="PUBLISHED">Đã xuất bản</option><option value="ARCHIVED">Lưu trữ</option></Select></>;
  };

  const renderTable = () => {
    if (kind === "products") return <table className="min-w-full text-left text-sm"><thead><tr className="bg-[#fbe1e8] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><th className="px-5 py-4">Sản phẩm</th><th className="px-5 py-4">Danh mục</th><th className="px-5 py-4">Thương hiệu</th><th className="px-5 py-4 text-center">Biến thể</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead><tbody>{products.map((item) => <tr key={item.id} className="border-t border-[#f6e4ea]"><td className="px-5 py-4"><b className="block text-slate-900">{item.name}</b><span className="text-xs text-slate-500">/{item.slug}</span></td><td className="px-5 py-4">{item.categoryName}</td><td className="px-5 py-4">{item.brandName}</td><td className="px-5 py-4 text-center font-bold">{item.variantCount}</td><td className="px-5 py-4"><StatusPill status={item.publicationStatus} /></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => navigate(`/admin/variants?product=${item.id}`)} className="rounded-lg border border-[#ebc9d5] px-2.5 py-1.5 text-xs font-bold text-[#c2185b]" title="Quản lý biến thể">Biến thể</button><button onClick={() => openEdit(item)} className="rounded-lg border border-[#ebc9d5] p-1.5 text-[#c2185b]"><Pencil size={15} /></button><button onClick={() => void changeStatus(item.id, item.publicationStatus)} className="rounded-lg bg-[#fff0f5] px-2.5 py-1.5 text-xs font-bold text-[#b20f50]">{item.publicationStatus === "ACTIVE" ? "Ẩn" : "Bật"}</button></div></td></tr>)}</tbody></table>;
    if (kind === "variants") return <table className="min-w-full text-left text-sm"><thead><tr className="bg-[#fbe1e8] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><th className="px-5 py-4">SKU / biến thể</th><th className="px-5 py-4">Cấu hình</th><th className="min-w-[160px] whitespace-nowrap px-5 py-4">Giá bán (VNĐ)</th><th className="px-5 py-4">Ảnh</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead><tbody>{variants.map((item) => { const image = item.images.find((entry) => entry.isPrimary)?.imageUrl || item.images[0]?.imageUrl; const price = Number(item.salePrice ?? item.listPrice ?? 0); return <tr key={item.id} className="border-t border-[#f6e4ea]"><td className="px-5 py-4"><b className="block text-slate-900">{item.name}</b><span className="text-xs text-slate-500">{item.sku}</span></td><td className="px-5 py-4">{[item.color, item.ramGb && `${item.ramGb}GB RAM`, item.storageGb && `${item.storageGb}GB`].filter(Boolean).join(" · ") || "—"}</td><td className="min-w-[160px] whitespace-nowrap px-5 py-4 font-bold text-[#c2185b]">{Number.isFinite(price) ? new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(price) : "—"} ₫</td><td className="px-5 py-4">{image ? <img src={image} alt={item.name} className="h-12 w-16 rounded-lg border border-[#f1dce4] bg-white object-contain p-1" /> : <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500"><ImageIcon size={15} /> Chưa có ảnh</span>}</td><td className="px-5 py-4"><StatusPill status={item.status} /></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-[#ebc9d5] p-1.5 text-[#c2185b]"><Pencil size={15} /></button><button onClick={() => void changeStatus(item.id, item.status)} className="rounded-lg bg-[#fff0f5] px-2.5 py-1.5 text-xs font-bold text-[#b20f50]">{item.status === "ACTIVE" ? "Ẩn" : "Bật"}</button></div></td></tr>; })}</tbody></table>;
    if (kind === "brands") return <table className="min-w-full text-left text-sm"><thead><tr className="bg-[#fbe1e8] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><th className="px-5 py-4">Thương hiệu</th><th className="px-5 py-4">Mô tả</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead><tbody>{brands.map((item) => <tr key={item.id} className="border-t border-[#f6e4ea]"><td className="px-5 py-4"><div className="flex items-center gap-3"><img className="h-9 w-12 rounded border border-[#f1dce4] object-contain p-1" src={getLocalBrandLogo(item.slug, item.name, item.logoUrl)} alt={`Logo ${item.name}`} /><div><b className="block text-slate-900">{item.name}</b><span className="text-xs text-slate-500">/{item.slug}</span></div></div></td><td className="max-w-xs px-5 py-4 text-slate-600">{item.description || "—"}</td><td className="px-5 py-4"><StatusPill status={item.status} /></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-[#ebc9d5] p-1.5 text-[#c2185b]"><Pencil size={15} /></button><button onClick={() => void changeStatus(item.id, item.status)} className="rounded-lg bg-[#fff0f5] px-2.5 py-1.5 text-xs font-bold text-[#b20f50]">{item.status === "ACTIVE" ? "Ẩn" : "Bật"}</button></div></td></tr>)}</tbody></table>;
    if (kind === "categories") return <table className="min-w-full text-left text-sm"><thead><tr className="bg-[#fbe1e8] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><th className="px-5 py-4">Tên danh mục</th><th className="px-5 py-4">Slug</th><th className="px-5 py-4">Thứ tự</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead><tbody>{categories.map((item) => <tr key={item.id} className="border-t border-[#f6e4ea]"><td className="px-5 py-4"><b className="text-slate-900">{item.parentId ? "↳ " : ""}{item.name}</b><span className="ml-2 text-xs text-slate-500">{item.description || ""}</span></td><td className="px-5 py-4 text-slate-600">{item.slug}</td><td className="px-5 py-4">{item.sortOrder}</td><td className="px-5 py-4"><StatusPill status={item.status} /></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-[#ebc9d5] p-1.5 text-[#c2185b]"><Pencil size={15} /></button><button onClick={() => void changeStatus(item.id, item.status)} className="rounded-lg bg-[#fff0f5] px-2.5 py-1.5 text-xs font-bold text-[#b20f50]">{item.status === "ACTIVE" ? "Ẩn" : "Bật"}</button></div></td></tr>)}</tbody></table>;
    if (kind === "banners") return <table className="min-w-full text-left text-sm"><thead><tr className="bg-[#fbe1e8] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><th className="px-5 py-4">Preview & tiêu đề</th><th className="px-5 py-4">Vị trí</th><th className="px-5 py-4">Thứ tự</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead><tbody>{banners.map((item) => <tr key={item.id} className="border-t border-[#f6e4ea]"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={item.image} alt="" className="h-11 w-20 rounded border border-[#f1dce4] object-cover" /><div><b className="block text-slate-900">{item.title}</b><span className="text-xs text-slate-500">{item.linkUrl || "Không có liên kết"}</span></div></div></td><td className="px-5 py-4">{item.position || "HERO"}</td><td className="px-5 py-4">{item.sortOrder}</td><td className="px-5 py-4"><StatusPill status={item.status} /></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-[#ebc9d5] p-1.5 text-[#c2185b]"><Pencil size={15} /></button><button onClick={() => void changeStatus(item.id, item.status)} className="rounded-lg bg-[#fff0f5] px-2.5 py-1.5 text-xs font-bold text-[#b20f50]">{item.status === "ACTIVE" ? "Ẩn" : "Bật"}</button></div></td></tr>)}</tbody></table>;
    return <table className="min-w-full text-left text-sm"><thead><tr className="bg-[#fbe1e8] text-[11px] font-extrabold uppercase tracking-wide text-slate-600"><th className="px-5 py-4">Bài viết</th><th className="px-5 py-4">Chuyên mục</th><th className="px-5 py-4">Ngày đăng</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead><tbody>{news.map((item) => <tr key={item.id} className="border-t border-[#f6e4ea]"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={item.image} alt="" className="h-11 w-16 rounded border border-[#f1dce4] object-cover" /><div><b className="block text-slate-900">{item.title}</b><span className="line-clamp-1 text-xs text-slate-500">{item.description}</span></div></div></td><td className="px-5 py-4">{item.tag}</td><td className="px-5 py-4">{item.date}</td><td className="px-5 py-4"><StatusPill status={item.status} /></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-[#ebc9d5] p-1.5 text-[#c2185b]"><Pencil size={15} /></button><button onClick={() => void changeStatus(item.id, item.status)} className="rounded-lg bg-[#fff0f5] px-2.5 py-1.5 text-xs font-bold text-[#b20f50]">{item.status === "PUBLISHED" ? "Lưu trữ" : "Xuất bản"}</button></div></td></tr>)}</tbody></table>;
  };

  return <div className="mx-auto max-w-[1400px] space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h1 className="text-2xl font-black tracking-tight text-slate-950">{copy.title}</h1><p className="mt-1 text-sm text-slate-500">{copy.description}</p></div><button onClick={openCreate} disabled={kind === "variants" && !selectedProductId} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c2185b] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#a70f4b] disabled:cursor-not-allowed disabled:opacity-60"><Plus size={18} /> {copy.create}</button></section>
    {kind === "variants" && <section className="rounded-xl border border-[#efd3dc] bg-[#fce4eb] p-4"><div className="grid gap-3 md:grid-cols-2"><label className="block text-sm font-semibold text-slate-700">Tìm sản phẩm<span className="relative mt-1.5 flex items-center"><Search className="absolute left-3 text-slate-500" size={17}/><input list="variant-products" value={productQuery} onChange={(event) => { const value = event.target.value; setProductQuery(value); const exact = products.find((item) => item.name === value || item.slug === value); if (exact) setSelectedProductId(exact.id); }} placeholder="Nhập tên sản phẩm hoặc slug..." className="w-full rounded-lg border border-[#edd4de] bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#d92e70]" /></span></label><Select label="Hoặc chọn sản phẩm" value={selectedProductId} onChange={setSelectedProductId}><option value="">Chọn sản phẩm</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.variantCount} biến thể)</option>)}</Select></div><datalist id="variant-products">{filteredVariantProducts.map((item) => <option key={item.id} value={item.name}>{item.variantCount} biến thể · /{item.slug}</option>)}</datalist><p className="mt-2 text-xs text-slate-500">Đang chọn: {selectedProductId ? products.find((item) => item.id === selectedProductId)?.name || "Sản phẩm đã chọn" : "Chưa chọn sản phẩm"}</p></section>}
    {kind !== "variants" && <section className="flex flex-col gap-3 rounded-xl border border-[#efd3dc] bg-[#fce4eb] p-4 md:flex-row md:items-end"><label className="block flex-1 text-sm font-semibold text-slate-700">Tìm kiếm<span className="relative mt-1.5 flex items-center"><Search className="absolute left-3 text-slate-500" size={17} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load(); }} placeholder="Nhập tên, slug hoặc từ khóa..." className="w-full rounded-lg border border-[#edd4de] bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#d92e70]" /></span></label><div className="w-full md:w-48"><Select label="Trạng thái" value={status} onChange={setStatus}><option value="">Tất cả trạng thái</option>{kind === "products" && <><option value="ACTIVE">Đang hoạt động</option><option value="DRAFT">Bản nháp</option><option value="INACTIVE">Đã ẩn</option></>}{["brands", "categories"].includes(kind) && <><option value="ACTIVE">Đang hoạt động</option><option value="INACTIVE">Đã ẩn</option></>}{kind === "banners" && <><option value="ACTIVE">Đang chạy</option><option value="INACTIVE">Đã ẩn</option><option value="SCHEDULED">Đã lên lịch</option></>}{kind === "news" && <><option value="DRAFT">Bản nháp</option><option value="PUBLISHED">Đã xuất bản</option><option value="ARCHIVED">Lưu trữ</option></>}</Select></div><button onClick={() => void load()} className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg border border-[#e8c4d1] bg-white px-4 text-sm font-bold text-[#9f1c4e]"><SlidersHorizontal size={17} /> Lọc</button></section>}
    <TableShell loading={loading} empty={records.length === 0}>{renderTable()}</TableShell>
    {dialogOpen && <EditorDialog title={`${editingId ? "Chỉnh sửa" : "Tạo mới"} · ${copy.title}`} onClose={() => setDialogOpen(false)} onSubmit={handleSave} busy={saving}>{renderForm()}</EditorDialog>}
  </div>;
}
