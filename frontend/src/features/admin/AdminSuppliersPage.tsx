import { useEffect, useMemo, useState } from "react";
import { Button, Input, message, Select, Table } from "antd";
import { ArrowLeft, Building2, Eye, MapPin, Pencil, Plus, RefreshCw, Save, Search, Settings2 } from "lucide-react";
import { adminInventoryService, type Supplier } from "../../api/adminInventoryService";

type SupplierForm = Omit<Supplier, "id">;
type Screen = "list" | "create" | "edit" | "details";

const emptyForm = (): SupplierForm => ({
  supplierCode: `NCC-${String(Date.now()).slice(-6)}`,
  name: "",
  taxCode: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  status: "ACTIVE",
});

const inputClass = "mt-1.5 w-full rounded-lg border border-[#ead7de] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#d92e70] focus:ring-2 focus:ring-[#fbe1e8]";

function StatusBadge({ status }: { status: Supplier["status"] }) {
  return status === "ACTIVE" ? (
    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Đang giao dịch</span>
  ) : (
    <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">Ngừng giao dịch</span>
  );
}

export function AdminSuppliersPage() {
  const [items, setItems] = useState<Supplier[]>([]);
  const [screen, setScreen] = useState<Screen>("list");
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [form, setForm] = useState<SupplierForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Supplier["status"]>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      setItems(await adminInventoryService.suppliers());
    } catch {
      message.error("Không thể tải danh sách nhà cung cấp.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((supplier) => {
      const matchesQuery = !normalizedQuery || [supplier.supplierCode, supplier.name, supplier.phone, supplier.contactName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return matchesQuery && (statusFilter === "ALL" || supplier.status === statusFilter);
    });
  }, [items, query, statusFilter]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setScreen("create");
  };

  const openEdit = async (id: string) => {
    try {
      const supplier = await adminInventoryService.supplier(id);
      setSelected(supplier);
      setForm({ ...supplier });
      setScreen("edit");
    } catch {
      message.error("Không thể tải thông tin nhà cung cấp.");
    }
  };

  const openDetails = async (id: string) => {
    try {
      setSelected(await adminInventoryService.supplier(id));
      setScreen("details");
    } catch {
      message.error("Không thể tải thông tin nhà cung cấp.");
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        supplierCode: form.supplierCode.trim(),
        name: form.name.trim(),
        taxCode: form.taxCode?.trim() || undefined,
        contactName: form.contactName?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        email: form.email?.trim() || undefined,
        address: form.address?.trim() || undefined,
      };
      const saved = screen === "edit" && selected
        ? await adminInventoryService.updateSupplier(selected.id, payload)
        : await adminInventoryService.createSupplier(payload);

      if (saved.status !== form.status) {
        await adminInventoryService.supplierStatus(saved.id, form.status);
      }
      message.success(screen === "edit" ? "Đã cập nhật nhà cung cấp." : "Đã thêm nhà cung cấp.");
      setScreen("list");
      await load();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Không thể lưu nhà cung cấp. Hãy kiểm tra mã NCC và mã số thuế có bị trùng không.");
    } finally {
      setIsSaving(false);
    }
  };

  if (screen === "details" && selected) {
    const rows: Array<[string, string | undefined]> = [
      ["Mã nhà cung cấp", selected.supplierCode], ["Tên nhà cung cấp", selected.name],
      ["Mã số thuế", selected.taxCode], ["Người liên hệ", selected.contactName],
      ["Số điện thoại", selected.phone], ["Email", selected.email], ["Địa chỉ", selected.address],
    ];
    return <div className="mx-auto max-w-[1160px] space-y-6">
      <button onClick={() => setScreen("list")} className="inline-flex items-center gap-2 text-sm font-bold text-[#c2185b]"><ArrowLeft size={17}/> Quay lại danh sách</button>
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-black text-slate-950">{selected.name}</h1><p className="mt-1 text-sm text-slate-500">Thông tin chi tiết nhà cung cấp</p></div><button onClick={() => void openEdit(selected.id)} className="inline-flex items-center gap-2 rounded-lg border border-[#d92e70] px-4 py-2.5 text-sm font-bold text-[#c2185b]"><Pencil size={16}/> Chỉnh sửa</button></div>
      <section className="rounded-2xl border border-[#eed2db] bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between border-b border-[#f4e4e9] pb-4"><h2 className="text-lg font-black">Thông tin nhà cung cấp</h2><StatusBadge status={selected.status}/></div><dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{rows.map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 font-semibold text-slate-800">{value || "—"}</dd></div>)}</dl></section>
    </div>;
  }

  if (screen === "create" || screen === "edit") {
    const isEditing = screen === "edit";
    const setValue = <K extends keyof SupplierForm>(key: K, value: SupplierForm[K]) => setForm((current) => ({ ...current, [key]: value }));
    return <div className="mx-auto w-full max-w-[1120px] space-y-5 pb-10">
      <div className="border-b border-[#efd9e1] pb-5"><button onClick={() => setScreen("list")} className="inline-flex items-center gap-1 text-sm font-bold text-[#a91b50]"><ArrowLeft size={15}/> Quay lại danh sách nhà cung cấp</button><h1 className="mt-4 text-2xl font-black text-slate-950">{isEditing ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}</h1><p className="mt-1 text-sm text-slate-500">Điền thông tin đối tác cung ứng để sử dụng khi tạo đơn nhập hàng.</p></div>
      <form onSubmit={save} className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1.65fr_0.8fr]">
          <div className="space-y-5">
            <section className="rounded-xl border border-[#ead4dc] bg-white p-5"><h2 className="flex items-center gap-2 border-b border-[#f3e4e9] pb-3 font-black text-slate-900"><Building2 size={18} className="text-[#d92e70]"/> Thông tin cơ bản</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-slate-700">Mã nhà cung cấp *<input required maxLength={30} value={form.supplierCode} onChange={(e) => setValue("supplierCode", e.target.value)} className={inputClass}/></label><label className="text-sm font-bold text-slate-700">Tên nhà cung cấp *<input required maxLength={255} value={form.name} onChange={(e) => setValue("name", e.target.value)} className={inputClass}/></label><label className="text-sm font-bold text-slate-700">Mã số thuế<input maxLength={50} value={form.taxCode || ""} onChange={(e) => setValue("taxCode", e.target.value)} className={inputClass}/></label></div></section>
            <section className="rounded-xl border border-[#ead4dc] bg-white p-5"><h2 className="flex items-center gap-2 border-b border-[#f3e4e9] pb-3 font-black text-slate-900"><MapPin size={18} className="text-[#d92e70]"/> Thông tin liên hệ</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-slate-700">Người liên hệ chính<input maxLength={150} value={form.contactName || ""} onChange={(e) => setValue("contactName", e.target.value)} className={inputClass}/></label><label className="text-sm font-bold text-slate-700">Số điện thoại<input maxLength={20} value={form.phone || ""} onChange={(e) => setValue("phone", e.target.value)} className={inputClass}/></label><label className="text-sm font-bold text-slate-700">Email<input type="email" maxLength={254} value={form.email || ""} onChange={(e) => setValue("email", e.target.value)} className={inputClass}/></label><label className="text-sm font-bold text-slate-700 md:col-span-2">Địa chỉ<textarea maxLength={500} rows={3} value={form.address || ""} onChange={(e) => setValue("address", e.target.value)} className={inputClass}/></label></div></section>
          </div>
          <section className="h-fit rounded-xl border border-[#ead4dc] bg-white p-5"><h2 className="flex items-center gap-2 border-b border-[#f3e4e9] pb-3 font-black text-slate-900"><Settings2 size={18} className="text-[#d92e70]"/> Cấu hình</h2><label className="mt-5 flex cursor-pointer items-center justify-between gap-4"><span><span className="block text-sm font-bold text-slate-700">Trạng thái hợp tác</span><span className="mt-1 block text-xs text-slate-500">Cho phép tạo đơn nhập với nhà cung cấp này.</span></span><input type="checkbox" checked={form.status === "ACTIVE"} onChange={(e) => setValue("status", e.target.checked ? "ACTIVE" : "INACTIVE")} className="h-4 w-4 accent-[#c2185b]"/></label></section>
        </div>
        <div className="flex justify-end gap-3 border-t border-[#efd9e1] pt-5"><button type="button" onClick={() => setScreen("list")} className="rounded-lg border border-[#e4c6d2] bg-white px-5 py-2.5 text-sm font-bold text-slate-600">Hủy</button><button disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-[#c2185b] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save size={16}/>{isSaving ? "Đang lưu..." : "Lưu thông tin"}</button></div>
      </form>
    </div>;
  }

  return <SupplierList
    items={items}
    filteredItems={filteredItems}
    isLoading={isLoading}
    query={query}
    statusFilter={statusFilter}
    onQueryChange={setQuery}
    onStatusChange={setStatusFilter}
    onCreate={openCreate}
    onReload={() => void load()}
    onDetails={(id) => void openDetails(id)}
    onEdit={(id) => void openEdit(id)}
  />;

}

function SupplierList({
  items,
  filteredItems,
  isLoading,
  query,
  statusFilter,
  onQueryChange,
  onStatusChange,
  onCreate,
  onReload,
  onDetails,
  onEdit,
}: {
  items: Supplier[];
  filteredItems: Supplier[];
  isLoading: boolean;
  query: string;
  statusFilter: "ALL" | Supplier["status"];
  onQueryChange: (value: string) => void;
  onStatusChange: (value: "ALL" | Supplier["status"]) => void;
  onCreate: () => void;
  onReload: () => void;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const columns = [
    { title: "Mã NCC", dataIndex: "supplierCode", key: "supplierCode", render: (value: string) => <span className="font-bold text-[#c2185b]">{value}</span> },
    { title: "Tên nhà cung cấp", dataIndex: "name", key: "name", render: (value: string) => <span className="font-semibold text-slate-800">{value}</span> },
    { title: "Người liên hệ", dataIndex: "contactName", key: "contactName", render: (value?: string) => value || "—" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone", render: (value?: string) => value || "—" },
    { title: "Trạng thái", dataIndex: "status", key: "status", render: (value: Supplier["status"]) => <StatusBadge status={value} /> },
    {
      title: "Thao tác", key: "actions", align: "center" as const,
      render: (_: unknown, record: Supplier) => <div className="flex justify-center gap-1"><button onClick={() => onDetails(record.id)} title="Xem chi tiết" className="rounded-md p-2 text-slate-500 transition hover:bg-[#fff0f5] hover:text-[#c2185b]"><Eye size={17}/></button><button onClick={() => onEdit(record.id)} title="Chỉnh sửa" className="rounded-md p-2 text-slate-500 transition hover:bg-[#fff0f5] hover:text-[#c2185b]"><Pencil size={17}/></button></div>,
    },
  ];

  return <div className="mx-auto max-w-[1400px] space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h1 className="text-3xl font-black tracking-tight text-slate-950">Danh sách Nhà cung cấp</h1><p className="mt-1 text-sm text-slate-500">Quản lý các đối tác cung ứng sử dụng cho đơn nhập hàng.</p></div>
      <Button type="primary" icon={<Plus size={18}/>} size="large" onClick={onCreate} className="h-11 rounded-xl bg-[#c2185b] px-5 font-bold shadow-sm hover:!bg-[#a70f4b]">Thêm nhà cung cấp</Button>
    </section>

    <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[260px] flex-1 text-xs font-semibold text-slate-500">Tìm kiếm
          <Input value={query} onChange={(event) => onQueryChange(event.target.value)} size="large" allowClear prefix={<Search size={16} className="mr-1 text-slate-400"/>} placeholder="Tên, mã NCC, số điện thoại..." className="mt-1.5"/>
        </label>
        <label className="w-full sm:w-52 text-xs font-semibold text-slate-500">Trạng thái
          <Select value={statusFilter} onChange={onStatusChange} size="large" className="mt-1.5 w-full" options={[{ label: "Tất cả trạng thái", value: "ALL" }, { label: "Đang giao dịch", value: "ACTIVE" }, { label: "Ngừng giao dịch", value: "INACTIVE" }]}/>
        </label>
        <Button onClick={onReload} icon={<RefreshCw size={16}/>} size="large" className="font-bold">Làm mới</Button>
      </div>
    </section>

    <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
      <Table dataSource={filteredItems} columns={columns} rowKey="id" loading={isLoading} className="admin-suppliers-table" pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total, range) => <span className="text-sm font-medium text-slate-500">Hiển thị <b className="text-slate-800">{total ? `${range[0]} - ${range[1]}` : "0"}</b> trong tổng số <b className="text-slate-800">{total}</b> nhà cung cấp</span> }}/>
    </section>
  </div>;
}
