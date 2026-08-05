import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  PackageCheck,
  RefreshCcw,
  ShoppingBag,
  Star,
  Truck,
  BellOff,
  Search,
  Plus,
  Inbox,
  CornerDownLeft,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";

const reviewPhones = [
  ["iPhone 16 Pro Max", "Đơn #PP123-001", 0, false],
  ["Samsung Galaxy S24 Ultra", "Đơn #PP122-890", 1, true],
] as const;

export function ReturnsPage() {
  return (
    <AccountShell
      title="Đổi trả & hoàn tiền"
      description="Quản lý các yêu cầu đổi trả và hoàn tiền của bạn."
    >
      <div className="-mt-2 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b-2 border-primary/20 pb-4">
          <div>
            <h1
              className="text-display-lg-mobile md:text-display-lg font-black text-primary tracking-tight"
              style={{ fontSize: "32px", lineHeight: "40px" }}
            >
              Đổi trả & hoàn tiền
            </h1>
            <p className="text-body-md text-on-surface-variant font-medium mt-1">
              Quản lý các yêu cầu đổi trả và hoàn tiền của bạn.
            </p>
          </div>
          <Link
            to="/account/returns/new"
            className="bg-primary text-white px-6 py-3 rounded-full font-bold text-label-sm hover:bg-secondary active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus size={20} />
            Tạo yêu cầu mới
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <span className="text-[32px] leading-[40px] font-black text-primary">
              3
            </span>
            <span className="text-label-sm font-bold text-on-surface-variant mt-2 text-center">
              Đang xử lý
            </span>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <span className="text-[32px] leading-[40px] font-black text-on-surface">
              1
            </span>
            <span className="text-label-sm font-bold text-on-surface-variant mt-2 text-center">
              Đang vận chuyển
            </span>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <span className="text-[32px] leading-[40px] font-black text-on-surface">
              5
            </span>
            <span className="text-label-sm font-bold text-on-surface-variant mt-2 text-center">
              Hoàn thành
            </span>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center hover:shadow-md transition-shadow opacity-60">
            <span className="text-[32px] leading-[40px] font-black text-on-surface">
              0
            </span>
            <span className="text-label-sm font-bold text-on-surface-variant mt-2 text-center">
              Đã hủy
            </span>
          </div>
        </div>

        {/* List View */}
        <div className="flex flex-col gap-5">
          {/* Item 1: PENDING */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <CornerDownLeft size={24} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-on-surface">
                    #RT-12345
                  </h4>
                  <p className="text-[13px] font-medium text-on-surface-variant mt-0.5">
                    Đơn hàng: <span className="font-mono">#ORD-98765</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[12px] font-bold bg-[#fff0f1] text-primary border border-primary/20 tracking-wider">
                  PENDING
                </span>
                <span className="text-[12px] font-medium text-on-surface-variant text-right w-full">
                  24/10/2024
                </span>
              </div>
            </div>

            <div className="h-px bg-outline-variant/30 my-4 w-full"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 bg-surface-container-low rounded-xl flex-shrink-0 p-1.5 border border-outline-variant/20">
                  <img
                    alt="Product"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsBKvDTQ1O4iRarAMqmCOO27UlBLSBrgLTOEvnVyEVf77F-6fFu4CKoYkWVKpcSVdbWqtND6pRkbVn2hD3Z-cpqHT-N38gX_8LDk_rTNI2S0ZRnU_xZFsfwNMeGYbD_2YO9_WHPqxMefEfdYEYTIz6ZqCuhP7mYxsWk2XIUnxzTaQakh_TBBQrpKfD_h0iCprhb8N0I-8ykS3tFUpTu35WfGQpJIMw9jzYiPM0vjXw_Qv5KhSXqm73"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-[15px] text-on-surface font-bold line-clamp-1">
                    PinkPhone Pro Max 256GB - Rose Pink
                  </p>
                  <p className="text-[13px] font-medium text-on-surface-variant mt-1">
                    Yêu cầu:{" "}
                    <span className="text-secondary font-bold">Hoàn tiền</span>
                  </p>
                </div>
              </div>

              <Link
                to="/account/returns/RT-12345"
                className="w-full sm:w-auto text-primary border-2 border-primary/20 bg-primary/5 hover:bg-primary hover:text-white hover:border-primary font-bold text-[14px] px-6 py-2.5 rounded-xl transition-all whitespace-nowrap text-center"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>

          {/* Item 2: IN_TRANSIT */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <RefreshCcw size={24} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-on-surface">
                    #RT-12344
                  </h4>
                  <p className="text-[13px] font-medium text-on-surface-variant mt-0.5">
                    Đơn hàng: <span className="font-mono">#ORD-98760</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[12px] font-bold bg-[#fffdf0] text-[#8a7200] border border-[#ffe066] tracking-wider">
                  IN_TRANSIT
                </span>
                <span className="text-[12px] font-medium text-on-surface-variant text-right w-full">
                  20/10/2024
                </span>
              </div>
            </div>

            <div className="h-px bg-outline-variant/30 my-4 w-full"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 bg-surface-container-low rounded-xl flex-shrink-0 p-1.5 border border-outline-variant/20">
                  <img
                    alt="Product"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh-MXDsnjZf6tDIbn2nIV-E8k2c1wc89J9xmXi66e3zfrSMIo85lmMeMFDopbE00jRJFhds9SuDBIVsRItmqbqwX3cKVF41UIPRDS1ucxhTRgC_dFJBx6Gg8qOyD0zmuTgvE7_R6_GJIOYxe4acewqGX2LPHNWQa18pFOyIjrBHVK9b4sI2B_YVcB9kDqlgM8FLe0Pusgr04o5KDNbZzJsBLT7X919oAF7PtjJwQrUTsgoKZWy6ik6"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-[15px] text-on-surface font-bold line-clamp-1">
                    PinkPods ANC - Cotton Candy
                  </p>
                  <p className="text-[13px] font-medium text-on-surface-variant mt-1">
                    Yêu cầu:{" "}
                    <span className="text-primary font-bold">Đổi sản phẩm</span>
                  </p>
                </div>
              </div>

              <Link
                to="/account/returns/RT-12344"
                className="w-full sm:w-auto bg-surface-container hover:bg-surface-variant/80 text-on-surface font-bold text-[14px] px-6 py-2.5 rounded-xl transition-all whitespace-nowrap text-center outline-none"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    Icon: ShoppingBag,
    title: "Xác nhận đơn hàng #PP-123456",
    time: "Vừa xong",
    text: "Đơn hàng của bạn đã được xác nhận và đang trong quá trình chuẩn bị. Chúng tôi sẽ thông báo khi đơn hàng được giao cho đơn vị vận chuyển.",
    isRead: false,
    category: "Đơn hàng",
  },
  {
    id: "2",
    Icon: CreditCard,
    title: "Thanh toán thành công #PP-123412",
    time: "2 giờ trước",
    text: "Bạn đã thanh toán thành công số tiền 24,990,000đ cho đơn hàng #PP-123412.",
    isRead: true,
    category: "Đơn hàng",
  },
  {
    id: "3",
    Icon: Truck,
    title: "Đơn hàng #PP-123390 đang được giao",
    time: "Hôm qua",
    text: "Đơn hàng của bạn đã được giao cho bưu tá. Vui lòng chú ý điện thoại để nhận hàng.",
    isRead: true,
    category: "Đơn hàng",
  },
];

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  // [DEV-MODE]: Added state machine to handle the 4 lifecycle paths organically
  const [fetchStatus, setFetchStatus] = useState<
    "loading" | "error" | "empty" | "success"
  >("success");

  const filteredNotifications = MOCK_NOTIFICATIONS.filter((n) => {
    if (activeTab === "Chưa đọc") return !n.isRead;
    if (activeTab === "Đơn hàng") return n.category === "Đơn hàng";
    return true;
  });

  return (
    <AccountShell
      title="Thông báo"
      description="Cập nhật đơn hàng, ưu đãi và hoạt động tài khoản PinkPhone."
      actions={
        <div className="flex items-center gap-4">
          {/* Debug Panel to toggle states easily during UI verification */}
          <div className="hidden lg:flex bg-surface-container-high rounded-full p-1 gap-1 text-[10px] font-bold">
            {["loading", "empty", "error", "success"].map((s) => (
              <button
                key={s}
                onClick={() => setFetchStatus(s as any)}
                className={`px-3 py-1 rounded-full uppercase ${fetchStatus === s ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container-highest"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors underline decoration-primary decoration-2 underline-offset-4"
          >
            Đánh dấu tất cả là đã đọc
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex gap-8 overflow-x-auto border-b border-outline-variant mb-6">
        {["Tất cả", "Chưa đọc", "Đơn hàng", "Ưu đãi"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-label-sm text-label-sm pb-2 px-1 whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "font-bold text-primary border-b-2 border-primary"
                : "font-medium text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {fetchStatus === "loading" && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container-low rounded-xl p-4 flex gap-4 items-start animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-surface-variant shrink-0"></div>
              <div className="flex-grow">
                <div
                  className={`h-4 bg-surface-variant rounded mb-2 ${i === 1 ? "w-1/3" : i === 2 ? "w-1/4" : "w-1/2"}`}
                ></div>
                <div className="h-3 bg-surface-variant rounded w-full mb-1"></div>
                <div
                  className={`h-3 bg-surface-variant rounded ${i === 1 ? "w-2/3" : i === 2 ? "w-1/2" : "w-3/4"}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fetchStatus === "empty" && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-t border-outline-variant mt-8 fade-in">
          <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center mb-6 text-outline">
            <BellOff size={48} />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            Hộp thư thông báo đang trống
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Các cập nhật về đơn hàng và ưu đãi sẽ xuất hiện tại đây.
          </p>
          <button className="mt-6 font-label-sm text-label-sm bg-primary text-on-primary px-6 py-3 rounded-full hover:bg-secondary transition-colors">
            Tiếp tục mua sắm
          </button>
        </div>
      )}

      {fetchStatus === "error" && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-t border-outline-variant mt-8 fade-in">
          <div className="w-20 h-20 bg-error-container text-on-error-container rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            Đã xảy ra lỗi khi tải dữ liệu
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Vui lòng kiểm tra kết nối mạng và thử lại.
          </p>
          <button
            onClick={() => {
              setFetchStatus("loading");
              setTimeout(() => setFetchStatus("success"), 1000);
            }}
            className="font-label-sm text-label-sm border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-on-primary transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      )}

      {fetchStatus === "success" && (
        <div className="fade-in">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 text-center text-on-surface-variant font-medium">
              Không tìm thấy thông báo nào trong mục này
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-xl p-4 flex gap-4 items-start shadow-sm border border-border/50 hover:shadow-md transition-shadow relative cursor-pointer ${
                    !notif.isRead
                      ? "bg-primary-fixed-dim/10"
                      : "bg-surface-container-lowest"
                  }`}
                >
                  {!notif.isRead && (
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full"></div>
                  )}

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      !notif.isRead
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    <notif.Icon size={20} />
                  </div>

                  <div className="flex-grow pr-6">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-label-sm text-label-sm text-on-surface">
                        {notif.title}
                      </h4>
                      <span className="font-body-md text-body-md text-on-surface-variant text-sm shrink-0 ml-2">
                        {notif.time}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                      {notif.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button className="font-label-sm text-label-sm text-primary border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
              Xem thêm
            </button>
          </div>
        </div>
      )}
    </AccountShell>
  );
}

function Summary({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof RefreshCcw;
  value: string;
  label: string;
}) {
  return (
    <Panel className="p-5 text-center">
      <Icon className="mx-auto text-primary" size={21} />
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Panel>
  );
}
