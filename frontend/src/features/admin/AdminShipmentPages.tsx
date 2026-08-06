import { useEffect, useMemo, useState } from "react";
import { message, Select } from "antd";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Eye,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  adminOrderService,
  type AdminOrder,
} from "../../api/adminOrderService";
import {
  adminShipmentService,
  type ShipmentDetail,
  type ShipmentStatus,
  type ShipmentSummary,
  type Warehouse,
  type WarehouseRecommendation,
} from "../../api/adminShipmentService";

const money = (value?: number) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))} đ`;
const dateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";
const labels: Record<ShipmentStatus, string> = {
  PENDING: "Chờ tạo hàng",
  PACKING: "Đang đóng gói",
  SHIPPED: "Đã bàn giao",
  IN_TRANSIT: "Đang giao",
  DELIVERED: "Đã giao",
  RETURNED: "Hoàn về",
  CANCELLED: "Đã hủy",
  FAILED: "Thất bại",
};
function ShipmentBadge({ status }: { status: ShipmentStatus }) {
  const tone =
    status === "DELIVERED"
      ? "bg-emerald-100 text-emerald-700"
      : ["FAILED", "CANCELLED"].includes(status)
        ? "bg-rose-100 text-rose-700"
        : ["SHIPPED", "IN_TRANSIT", "PACKING"].includes(status)
          ? "bg-sky-100 text-sky-700"
          : "bg-amber-100 text-amber-700";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${tone}`}
    >
      {labels[status]}
    </span>
  );
}

export function AdminShipmentsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ShipmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      setItems((await adminShipmentService.getShipments()).items);
    } catch {
      message.error("Không tải được danh sách vận đơn.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const providers = useMemo(
    () => [
      ...new Set(items.map((item) => item.shippingProvider).filter(Boolean)),
    ],
    [items],
  );
  const shown = items.filter(
    (item) =>
      `${item.shipmentCode} ${item.orderCode} ${item.trackingCode}`
        .toLowerCase()
        .includes(keyword.toLowerCase()) &&
      (!status || item.status === status) &&
      (!provider || item.shippingProvider === provider),
  );
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <section className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950">
            Danh sách vận đơn
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý tiến độ giao hàng, mã theo dõi và đối tác vận chuyển.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void load()}
            className="rounded-lg border border-[#e8c4d2] bg-white p-3 text-[#9d1950]"
          >
            <RefreshCw size={17} />
          </button>
          <button
            onClick={() => navigate("/admin/shipments/new")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#c2185b] px-4 py-3 text-sm font-bold text-white"
          >
            <Plus size={18} /> Tạo vận đơn
          </button>
        </div>
      </section>
      <section className="grid gap-3 rounded-xl border border-[#efd3dc] bg-[#fce4eb] p-4 md:grid-cols-4">
        <label className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 text-slate-500" size={17} />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Mã vận đơn, mã đơn hàng, mã theo dõi..."
            className="w-full rounded-lg border border-[#edcfda] bg-white py-2.5 pl-10 pr-3 text-sm outline-none"
          />
        </label>
        <select
          value={provider}
          onChange={(event) => setProvider(event.target.value)}
          className="rounded-lg border border-[#edcfda] bg-white px-3 py-2.5 text-sm font-medium outline-none"
        >
          <option value="">Tất cả đối tác</option>
          {providers.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-[#edcfda] bg-white px-3 py-2.5 text-sm font-medium outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </section>
      {loading ? (
        <div className="grid min-h-64 place-items-center rounded-xl border bg-white text-slate-500">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <section className="overflow-x-auto rounded-xl border border-[#edd0db] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#fbe1e8] text-[11px] font-extrabold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-4">Mã vận đơn</th>
                <th className="px-4 py-4">Mã đơn</th>
                <th className="px-4 py-4">Kho xuất</th>
                <th className="px-4 py-4">Đối tác</th>
                <th className="px-4 py-4">Mã theo dõi</th>
                <th className="px-4 py-4 text-center">Sản phẩm</th>
                <th className="px-4 py-4 text-right">Phí</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {shown.length ? (
                shown.map((item) => (
                  <tr key={item.id} className="border-t border-[#f5e3e9]">
                    <td className="px-4 py-4 font-black text-[#c2185b]">
                      {item.shipmentCode}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/admin/orders/${item.orderId}`}
                        className="font-bold hover:text-[#c2185b]"
                      >
                        #{item.orderCode}
                      </Link>
                    </td>
                    <td className="px-4 py-4">{item.warehouseName}</td>
                    <td className="px-4 py-4">{item.shippingProvider}</td>
                    <td className="px-4 py-4 font-mono text-xs">
                      {item.trackingCode || "—"}
                    </td>
                    <td className="px-4 py-4 text-center">{item.itemCount}</td>
                    <td className="px-4 py-4 text-right">
                      {money(item.shippingFee)}
                    </td>
                    <td className="px-4 py-4">
                      <ShipmentBadge status={item.status} />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => navigate(`/admin/shipments/${item.id}`)}
                        className="rounded-lg p-2 text-[#a91b50] hover:bg-[#fff0f5]"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Chưa có vận đơn phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="border-t border-[#f5e3e9] px-5 py-3 text-sm text-slate-600">
            Hiển thị {shown.length} trên {items.length} vận đơn
          </div>
        </section>
      )}
    </div>
  );
}

export function AdminShipmentDetailPage() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState("");
  const [provider, setProvider] = useState("");
  const [working, setWorking] = useState(false);
  const load = async () => {
    if (!shipmentId) return;
    setLoading(true);
    try {
      const data = await adminShipmentService.getShipment(shipmentId);
      setShipment(data);
      setTracking(data.trackingCode || "");
      setProvider(data.shippingProvider || "");
    } catch {
      message.error("Không tải được chi tiết vận đơn.");
      navigate("/admin/shipments");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [shipmentId]);
  if (loading || !shipment)
    return (
      <div className="grid min-h-80 place-items-center text-slate-500">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  const updateStatus = async (status: ShipmentStatus) => {
    setWorking(true);
    try {
      setShipment(await adminShipmentService.updateStatus(shipment.id, status));
      message.success("Đã cập nhật trạng thái vận đơn.");
    } catch {
      message.error("Không thể cập nhật trạng thái.");
    } finally {
      setWorking(false);
    }
  };
  const saveTracking = async () => {
    if (!provider.trim() || !tracking.trim())
      return message.warning("Vui lòng nhập đối tác và mã theo dõi.");
    setWorking(true);
    try {
      setShipment(
        await adminShipmentService.updateTracking(
          shipment.id,
          provider,
          tracking,
        ),
      );
      message.success("Đã cập nhật mã theo dõi.");
    } catch {
      message.error("Không thể cập nhật mã theo dõi.");
    } finally {
      setWorking(false);
    }
  };
  const timeline: ShipmentStatus[] = [
    "PENDING",
    "PACKING",
    "SHIPPED",
    "IN_TRANSIT",
    "DELIVERED",
  ];
  const position = timeline.indexOf(shipment.status);
  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/admin/shipments")}
            className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-[#a91b50]"
          >
            <ArrowLeft size={16} /> Quay lại vận đơn
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-slate-950">
              Vận đơn #{shipment.shipmentCode}
            </h1>
            <ShipmentBadge status={shipment.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Đơn hàng #{shipment.orderCode} · Tạo lúc{" "}
            {dateTime(shipment.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {shipment.status === "PENDING" && (
            <button
              disabled={working}
              onClick={() => void updateStatus("PACKING")}
              className="rounded-lg border border-[#e7c4d1] bg-white px-4 py-2.5 text-sm font-bold text-[#a91b50]"
            >
              Bắt đầu đóng gói
            </button>
          )}
          {["PENDING", "PACKING"].includes(shipment.status) && (
            <button
              disabled={working}
              onClick={() => void updateStatus("SHIPPED")}
              className="rounded-lg bg-[#c2185b] px-4 py-2.5 text-sm font-bold text-white"
            >
              Bàn giao vận chuyển
            </button>
          )}
          {["SHIPPED", "IN_TRANSIT"].includes(shipment.status) && (
            <button
              disabled={working}
              onClick={() => void updateStatus("DELIVERED")}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
            >
              Xác nhận đã giao
            </button>
          )}
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[1.7fr_0.8fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-[#edd0db] bg-[#fbe1e8] p-6">
            <h2 className="flex items-center gap-2 font-black text-slate-950">
              <Truck size={18} /> Tiến trình giao hàng
            </h2>
            <div className="mt-5 space-y-4">
              {timeline.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${position >= index ? "bg-[#c2185b] text-white" : "bg-white text-slate-400"}`}
                  >
                    {position >= index ? "✓" : index + 1}
                  </span>
                  <div>
                    <b className="text-sm text-slate-900">{labels[step]}</b>
                    <p className="text-xs text-slate-500">
                      {position === index
                        ? "Trạng thái hiện tại"
                        : position > index
                          ? "Đã hoàn thành"
                          : "Đang chờ"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="overflow-x-auto rounded-xl border border-[#edd0db] bg-white">
            <div className="border-b border-[#f2dce4] bg-[#fbe1e8] px-5 py-4">
              <h2 className="flex items-center gap-2 font-black text-slate-950">
                <Package size={18} /> Hàng hóa bàn giao ({shipment.items.length}
                )
              </h2>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#fffafb] text-[11px] font-extrabold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3 text-center">SL</th>
                  <th className="px-4 py-3">IMEI / Serial</th>
                  <th className="px-4 py-3 text-right">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {shipment.items.map((item) => (
                  <tr
                    key={item.shipmentItemId}
                    className="border-t border-[#f5e3e9]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            className="h-11 w-11 rounded border object-contain"
                          />
                        ) : (
                          <span className="grid h-11 w-11 place-items-center rounded bg-[#fff0f5] text-[#c2185b]">
                            <Package size={17} />
                          </span>
                        )}
                        <div>
                          <b className="block">{item.productName}</b>
                          <span className="text-xs text-slate-500">
                            {item.variantName} · {item.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">{item.quantity}</td>
                    <td className="px-4 py-4 text-xs">
                      {item.identifiers.length
                        ? item.identifiers.join(", ")
                        : "Chưa gán"}
                    </td>
                    <td className="px-4 py-4 text-right font-bold">
                      {money(item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
        <aside className="space-y-5">
          <section className="rounded-xl border border-[#edd0db] bg-[#fbe1e8] p-5">
            <h2 className="font-black text-slate-950">Thông tin giao vận</h2>
            <label className="mt-4 block text-xs font-bold text-slate-600">
              Đối tác
              <input
                value={provider}
                onChange={(event) => setProvider(event.target.value)}
                className="mt-1 w-full rounded border border-[#eacbd5] bg-white px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="mt-3 block text-xs font-bold text-slate-600">
              Mã theo dõi
              <input
                value={tracking}
                onChange={(event) => setTracking(event.target.value)}
                className="mt-1 w-full rounded border border-[#eacbd5] bg-white px-3 py-2 text-sm outline-none"
              />
            </label>
            <button
              disabled={working}
              onClick={() => void saveTracking()}
              className="mt-3 w-full rounded-lg border border-[#dcaac0] bg-white py-2 text-sm font-bold text-[#a91b50]"
            >
              Lưu thông tin
            </button>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Phí giao hàng</dt>
                <dd className="font-bold">{money(shipment.shippingFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Dự kiến giao</dt>
                <dd>{dateTime(shipment.estimatedDeliveryAt)}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-xl border border-[#edd0db] bg-[#fbe1e8] p-5">
            <h2 className="font-black text-slate-950">Điểm đi & nhận</h2>
            <div className="mt-4 rounded-lg bg-white p-3 text-sm">
              <b>{shipment.warehouseName}</b>
              <p className="mt-1 text-slate-600">
                {shipment.warehouseAddress || "Chưa có địa chỉ kho"}
              </p>
            </div>
            <div className="mt-3 rounded-lg bg-white p-3 text-sm">
              <b>{shipment.receiverName || "Người nhận"}</b>
              <p className="mt-1 text-slate-600">
                {shipment.receiverPhone}
                <br />
                {shipment.destinationAddress}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function AdminShipmentCreatePage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [orderId, setOrderId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [warehouseRecommendations, setWarehouseRecommendations] = useState<WarehouseRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [provider, setProvider] = useState("Giao Hàng Nhanh (GHN)");
  const [trackingCode, setTrackingCode] = useState("");
  const [shippingFee, setShippingFee] = useState("0");
  const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    Promise.all([
      adminOrderService.getOrders(),
      adminShipmentService.getWarehouses(),
    ])
      .then(([orderData, warehouseData]) => {
        setOrders(
          orderData.items.filter(
            (order) =>
              order.items.length > 0 &&
              !["CANCELLED", "COMPLETED", "RETURNED"].includes(order.status),
          ),
        );
        setWarehouses(warehouseData);
      })
      .catch(() => message.error("Không tải được dữ liệu tạo vận đơn."))
      .finally(() => setLoading(false));
  }, []);
  const selected = orders.find((order) => order.id === orderId);
  const selectOrder = async (value: string) => {
    setOrderId(value);
    setQuantities({});
    setWarehouseId("");
    setWarehouseRecommendations([]);
    if (!value) return;
    setLoadingRecommendations(true);
    try {
      const recommendations = await adminShipmentService.getWarehouseRecommendations(value);
      setWarehouseRecommendations(recommendations);
      const preferredWarehouse = recommendations.find((warehouse) => warehouse.canFulfill);
      setWarehouseId(preferredWarehouse?.warehouseId || "");
    } catch {
      message.warning("Không thể đề xuất kho tự động. Bạn vẫn có thể chọn kho thủ công.");
    } finally {
      setLoadingRecommendations(false);
    }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || !warehouseId)
      return message.warning("Vui lòng chọn đơn hàng và kho xuất.");
    const items = selected.items
      .map((item) => ({
        orderItemId: item.id,
        quantity: quantities[item.id] ?? item.quantity,
      }))
      .filter((item) => item.quantity > 0);
    if (!items.length)
      return message.warning("Cần chọn ít nhất một sản phẩm để giao.");
    setSaving(true);
    try {
      const shipment = await adminShipmentService.createShipment(selected.id, {
        warehouseId,
        shippingProvider: provider,
        trackingCode: trackingCode || undefined,
        shippingFee: Number(shippingFee || 0),
        estimatedDeliveryAt: estimatedDeliveryAt || undefined,
        items,
      });
      message.success("Đã tạo vận đơn.");
      navigate(`/admin/shipments/${shipment.id}`);
    } catch (error) {
      const detail = (error as { response?: { data?: { detail?: string } } })
        .response?.data?.detail;
      message.error(detail || "Không thể tạo vận đơn.");
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return (
      <div className="grid min-h-80 place-items-center text-slate-500">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  return (
    <form onSubmit={submit} className="mx-auto max-w-[1400px] space-y-6">
      <section className="flex flex-wrap justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/shipments")}
            className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-[#a91b50]"
          >
            <ArrowLeft size={16} /> Quay lại vận đơn
          </button>
          <h1 className="text-2xl font-black text-slate-950">Tạo vận đơn</h1>
          <p className="mt-1 text-sm text-slate-500">
            Chọn đơn hàng, kho xuất và hàng hóa cần bàn giao.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-[#e8c4d2] bg-white px-4 py-2.5 text-sm font-bold text-slate-600"
          >
            Hủy
          </button>
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#c2185b] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            <CheckCircle2 size={17} />{" "}
            {saving ? "Đang tạo..." : "Xác nhận tạo vận đơn"}
          </button>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[1.7fr_0.8fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-[#edd0db] bg-[#fbe1e8] p-5">
            <h2 className="font-black text-slate-950">
              1. Chọn đơn hàng và kho xuất
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">
                Đơn hàng
                <Select
                  showSearch
                  optionFilterProp="label"
                  value={orderId || undefined}
                  placeholder="Nhập mã đơn hoặc tên khách..."
                  notFoundContent="Không tìm thấy đơn hàng phù hợp"
                  onChange={selectOrder}
                  options={orders.map((order) => ({
                    value: order.id,
                    label: `#${order.orderCode} · ${order.receiverName || order.contactName || "Khách hàng"} · ${money(order.grandTotalAmount)}`,
                  }))}
                  className="mt-2 w-full"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Chọn đơn để hệ thống đề xuất kho đủ hàng và gần khu vực nhận.
                </span>
              </label>
              <label className="text-sm font-bold text-slate-700">
                Kho xuất
                <Select
                  showSearch
                  optionFilterProp="label"
                  value={warehouseId || undefined}
                  placeholder="Nhập mã hoặc tên kho..."
                  notFoundContent="Không tìm thấy kho phù hợp"
                  onChange={setWarehouseId}
                  options={(warehouseRecommendations.length
                    ? warehouseRecommendations
                    : warehouses
                        .filter((warehouse) => warehouse.status === "ACTIVE")
                        .map((warehouse) => ({
                          warehouseId: warehouse.id,
                          warehouseCode: warehouse.code,
                          warehouseName: warehouse.name,
                          canFulfill: false,
                          recommendationReason: "Chọn kho để kiểm tra khả dụng",
                        }))
                  ).map((warehouse, index) => ({
                    value: warehouse.warehouseId,
                    label: `${warehouseRecommendations.length && index === 0 ? "Đề xuất #1 · " : ""}${warehouse.warehouseName} (${warehouse.warehouseCode}) — ${warehouse.recommendationReason}`,
                    disabled: warehouseRecommendations.length > 0 && !warehouse.canFulfill,
                  }))}
                  loading={loadingRecommendations}
                  className="mt-2 w-full"
                />
                {warehouseRecommendations.length > 0 && (
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    Kho không đủ toàn bộ hàng được khóa để tránh tạo vận đơn không thể giao.
                  </span>
                )}
                {warehouseRecommendations.length > 0 && !warehouseRecommendations.some((warehouse) => warehouse.canFulfill) && (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                    Không có kho đang hoạt động đủ hàng cho đúng SKU và số lượng của đơn này. Hãy nhập thêm hàng hoặc điều chỉnh đơn trước khi tạo vận đơn.
                  </p>
                )}
              </label>
            </div>
          </section>
          <section className="overflow-x-auto rounded-xl border border-[#edd0db] bg-white">
            <div className="border-b border-[#f2dce4] bg-[#fbe1e8] px-5 py-4">
              <h2 className="flex items-center gap-2 font-black text-slate-950">
                <ClipboardList size={18} /> 2. Phân bổ hàng hóa
              </h2>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#fffafb] text-[11px] font-extrabold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-5 py-3">Sản phẩm</th>
                  <th className="px-5 py-3 text-center">Đã đặt</th>
                  <th className="px-5 py-3 text-right">Số lượng giao</th>
                </tr>
              </thead>
              <tbody>
                {selected ? (
                  selected.items.map((item) => (
                    <tr key={item.id} className="border-t border-[#f5e3e9]">
                      <td className="px-5 py-4">
                        <b>{item.productName}</b>
                        <span className="ml-2 text-xs text-slate-500">
                          {item.variantName} · {item.sku}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">{item.quantity}</td>
                      <td className="px-5 py-4 text-right">
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={quantities[item.id] ?? item.quantity}
                          onChange={(event) =>
                            setQuantities((current) => ({
                              ...current,
                              [item.id]: Math.min(
                                item.quantity,
                                Math.max(0, Number(event.target.value)),
                              ),
                            }))
                          }
                          className="w-24 rounded border border-[#edcfda] px-2 py-1.5 text-right outline-none"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      Chọn đơn hàng để phân bổ sản phẩm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
        <aside className="rounded-xl border border-[#edd0db] bg-[#fbe1e8] p-5">
          <h2 className="font-black text-slate-950">3. Thông tin giao vận</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              Đối tác vận chuyển
              <input
                required
                value={provider}
                onChange={(event) => setProvider(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#edcfda] bg-white px-3 py-2.5 outline-none"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Mã theo dõi{" "}
              <span className="font-normal text-slate-400">
                (bỏ trống để tự tạo)
              </span>
              <input
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#edcfda] bg-white px-3 py-2.5 outline-none"
                placeholder="TRK-..."
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Phí giao hàng (VND)
              <input
                min="0"
                type="number"
                value={shippingFee}
                onChange={(event) => setShippingFee(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#edcfda] bg-white px-3 py-2.5 outline-none"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Dự kiến giao
              <input
                type="datetime-local"
                value={estimatedDeliveryAt}
                onChange={(event) => setEstimatedDeliveryAt(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#edcfda] bg-white px-3 py-2.5 outline-none"
              />
            </label>
          </div>
        </aside>
      </div>
    </form>
  );
}
