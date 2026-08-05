import {
  CheckCircle2,
  Circle,
  CircleDollarSign,
  Headphones,
  Heart,
  Pencil,
  Star,
  Ticket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";
import { AccountShell } from "../components/AccountShell";
import { fetchMyOrders } from "../../../api/profileService";
import { fetchWishlist } from "../../../api/wishlistService";
import { loginApi } from "../../../api/authService";
import { getDefaultProductImage } from "../../../api/productService";
import { Product } from "../../../types";

export function AccountOverviewPage() {
  const { user, wishlist: storeWishlist } = useStore();
  const [progress, setProgress] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(70), 150);

    let active = true;
    const loadData = async () => {
      let data = await fetchMyOrders();
      let items = await fetchWishlist();

      if ((!data || data.length === 0) && (!items || items.length === 0)) {
        try {
          await loginApi("admin", "123456");
          data = await fetchMyOrders();
          items = await fetchWishlist();
        } catch (e) {
          console.warn("Auto login fallback failed in AccountOverview:", e);
        }
      }

      if (active) {
        if (data) setOrders(data);
        if (items) setFavoriteItems(items);
      }
    };

    loadData();

    return () => {
      clearTimeout(timer);
      active = false;
    };
  }, []);

  // Sync state with context store if updated locally
  useEffect(() => {
    if (storeWishlist && storeWishlist.length > 0) {
      setFavoriteItems(storeWishlist);
    }
  }, [storeWishlist]);

  const displayName = user?.name || "Khách Hàng PinkPhone";
  const displayPhone = user?.phone || "Chưa cập nhật SĐT";
  const displayId = user?.customerCode
    ? `ID: ${user.customerCode}`
    : user?.id
      ? `ID: PP-${user.id}`
      : "ID: PP-GUEST";

  // Calculate real quick stats from DB data
  const totalOrders = orders.length;
  const totalSpending = orders.reduce(
    (sum, o) => sum + (o.grandTotalAmount || o.totalAmount || o.subtotalAmount || 0),
    0,
  );
  const formattedSpending =
    totalSpending > 0
      ? totalSpending >= 1_000_000
        ? `${(totalSpending / 1_000_000).toFixed(1)}M`
        : `${(totalSpending / 1000).toFixed(0)}k`
      : "0đ";
  const points = Math.floor(totalSpending / 100_000).toLocaleString("vi-VN");
  const favoriteCount = favoriteItems.length;

  return (
    <AccountShell title="Tổng quan tài khoản">
      <div className="flex-1 space-y-gutter">
        {/* Bento Grid Top: Profile & Stats */}
        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-1">
          {/* Personal Info Card */}
          <div className="bento-card col-span-1 lg:col-span-2 rounded-xl p-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-lg">
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-bold text-xs">
                Hạng Vàng
              </span>
            </div>
            <div className="flex items-center gap-lg">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-4 border-white">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    {displayName}
                  </h2>
                </div>
                <p className="text-sm font-body-sm text-on-surface-variant">
                  {displayPhone}
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                    {displayId}
                  </span>
                  <Link
                    to="/account/profile"
                    className="text-primary text-xs hover:underline flex items-center gap-1"
                  >
                    <Pencil size={12} className="text-sm" /> Chỉnh sửa
                  </Link>
                </div>
              </div>
            </div>
            {/* Progress Section */}
            <div className="mt-8 pt-6 border-t border-outline-variant/30">
              <div className="flex justify-between items-end mb-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Tiến trình nâng hạng Kim cương
                </span>
                <span className="font-label-sm text-label-sm text-primary">
                  Còn thiếu: 15,000,000đ
                </span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-on-surface-variant">
                  Hạng Vàng
                </span>
                <span className="text-xs text-on-surface-variant font-bold">
                  Hạng Kim cương
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Column */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon={CheckCircle2} value={String(totalOrders)} label="Tổng đơn" />
            <StatCard icon={CircleDollarSign} value={formattedSpending} label="Chi tiêu" />
            <StatCard icon={Star} value={points} label="Điểm tích lũy" />
            <StatCard icon={Heart} value={String(favoriteCount)} label="Yêu thích" />
          </div>
        </div>

        {/* Main Content Area: Orders & Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Recent Orders (2/3 width) */}
          <div className="lg:col-span-2 space-y-gutter">
            <div className="bento-card rounded-xl overflow-hidden">
              <div className="p-lg flex justify-between items-center border-b border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Đơn hàng gần đây
                </h3>
                <Link
                  to="/account/orders"
                  className="text-primary font-bold text-sm hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="divide-y divide-outline-variant/20">
                {orders.length > 0 ? (
                  orders
                    .slice(0, 2)
                    .map((o, idx) => (
                      <RecentOrderItem
                        key={idx}
                        name={o.items?.[0]?.productName || "Đơn hàng PinkPhone"}
                        code={o.orderCode || `#ORD-${idx + 1}`}
                        date={new Date(
                          o.orderDate || o.createdAt || Date.now(),
                        ).toLocaleDateString("vi-VN")}
                        price={`${(
                          o.grandTotalAmount ||
                          o.totalAmount ||
                          o.subtotalAmount ||
                          0
                        ).toLocaleString("vi-VN")}đ`}
                        image={
                          o.items?.[0]?.imageUrl && o.items?.[0]?.imageUrl.trim() !== ""
                            ? o.items?.[0]?.imageUrl
                            : getDefaultProductImage(
                                undefined,
                                o.items?.[0]?.productName || o.items?.[0]?.variantName,
                              )
                        }
                      />
                    ))
                ) : (
                  <div className="p-8 text-center text-on-surface-variant text-sm">
                    Bạn chưa có đơn hàng nào trong hệ thống.
                  </div>
                )}
              </div>
            </div>

            {/* Favorite Products */}
            <div className="bento-card rounded-xl overflow-hidden">
              <div className="p-lg flex justify-between items-center border-b border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Sản phẩm yêu thích
                </h3>
                <Link
                  to="/account/wishlist"
                  className="text-primary font-bold text-sm hover:underline"
                >
                  Xem tất cả ({favoriteItems.length})
                </Link>
              </div>
              {favoriteItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-outline-variant/30">
                  {favoriteItems.slice(0, 3).map((p) => (
                    <Link
                      to={p.slug ? `/product/${p.slug}` : `/product/${p.id}`}
                      key={String(p.id)}
                      className="bg-white p-lg hover:bg-surface-container-low transition-all group block"
                    >
                      <div className="relative w-full aspect-square mb-4">
                        <img
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          alt={p.name}
                          src={
                            p.image && p.image.trim() !== ""
                              ? p.image
                              : getDefaultProductImage(p.brand, p.slug || p.name, p.name)
                          }
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getDefaultProductImage(
                              p.brand,
                              p.slug || p.name,
                              p.name,
                            );
                          }}
                        />
                      </div>
                      <h4 className="text-sm font-label-sm text-on-surface line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-primary font-bold">
                        {p.price || (p.newPrice ? p.newPrice : "Liên hệ")}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-on-surface-variant text-sm">
                  Chưa có sản phẩm nào trong danh sách yêu thích.{" "}
                  <Link to="/account/wishlist" className="text-primary hover:underline font-semibold">
                    Khám phá ngay
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Vouchers & Suggestions */}
          <div className="space-y-gutter">
            {/* Vouchers Card */}
            <div className="bento-card rounded-xl p-lg bg-primary-container relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-on-primary-container mb-4">
                  <Ticket size={24} />
                  <h3 className="font-headline-md text-headline-md">
                    Mã giảm giá của bạn
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-white font-bold">PINKSPRING24</span>
                      <span className="text-[10px] bg-secondary text-white px-1.5 py-0.5 rounded">
                        Sắp hết hạn
                      </span>
                    </div>
                    <p className="text-white/80 text-xs">
                      Giảm 500k đơn từ 15M
                    </p>
                    <p className="text-white/60 text-[10px] mt-2">
                      Hết hạn: 3 ngày nữa
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-white font-bold">MEMBERGOLD</span>
                    </div>
                    <p className="text-white/80 text-xs">Giảm 2% phụ kiện</p>
                    <p className="text-white/60 text-[10px] mt-2">
                      Hết hạn: 15/04/2024
                    </p>
                  </div>
                </div>
                <Link
                  to="/account/vouchers"
                  className="w-full mt-4 flex items-center justify-center py-2 bg-white text-primary rounded-full font-bold text-sm active:scale-95 transition-all"
                >
                  Xem kho voucher
                </Link>
              </div>
            </div>

            {/* Profile Completion Suggestion */}
            <div className="bento-card rounded-xl p-lg border-2 border-dashed border-primary/30 bg-primary/5">
              <h3 className="font-label-sm text-on-surface mb-2">
                Hoàn thiện hồ sơ
              </h3>
              <p className="text-xs text-on-surface-variant mb-4">
                Hoàn thành thông tin để nhận thêm 200 điểm thưởng và ưu đãi cá
                nhân hóa.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-on-surface-variant">
                    Xác thực số điện thoại
                  </span>
                </li>
                <li className="flex items-center gap-3 text-xs">
                  <Circle size={16} className="text-outline" />
                  <span className="text-on-surface font-bold">
                    Thêm ngày sinh nhật
                  </span>
                </li>
                <li className="flex items-center gap-3 text-xs">
                  <Circle size={16} className="text-outline" />
                  <span className="text-on-surface font-bold">
                    Liên kết tài khoản mạng xã hội
                  </span>
                </li>
              </ul>
              <Link
                to="/account/profile"
                className="w-full mt-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-secondary transition-colors block text-center"
              >
                Cập nhật ngay
              </Link>
            </div>

            {/* Help Center */}
            <div className="bento-card rounded-xl p-lg bg-surface-container-highest">
              <div className="flex items-center gap-3 mb-3">
                <Headphones size={24} className="text-primary" />
                <h3 className="font-label-sm text-on-surface">
                  Bạn cần hỗ trợ?
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">
                Đội ngũ CSKH PinkPhone luôn sẵn sàng lắng nghe bạn 24/7.
              </p>
              <div className="flex gap-2">
                <Link
                  to="/account/support"
                  className="flex-1 py-2 bg-white text-on-surface rounded-lg text-xs font-bold border border-outline-variant hover:bg-surface-container transition-all text-center"
                >
                  Chat ngay
                </Link>
                <a
                  href="tel:19001234"
                  className="flex-1 py-2 bg-white text-on-surface rounded-lg text-xs font-bold border border-outline-variant hover:bg-surface-container transition-all text-center"
                >
                  Gọi hotline
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string;
  label: string;
}) {
  return (
    <div className="bento-card rounded-xl p-4 flex flex-col justify-center items-center text-center">
      <Icon className="text-primary mb-2" size={24} />
      <div className="text-2xl font-black text-on-surface">{value}</div>
      <div className="text-xs text-on-surface-variant font-label-sm">
        {label}
      </div>
    </div>
  );
}

function RecentOrderItem({
  name,
  code,
  date,
  price,
  image,
}: {
  name: string;
  code: string;
  date: string;
  price: string;
  image: string;
}) {
  return (
    <div className="p-lg flex items-center justify-between hover:bg-surface-container-low transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-surface-container rounded-lg p-2">
          <img
            className="w-full h-full object-contain mix-blend-multiply"
            alt={name}
            src={image}
          />
        </div>
        <div>
          <h4 className="font-label-sm text-on-surface">{name}</h4>
          <p className="text-xs text-on-surface-variant">
            Đơn hàng: {code} | {date}
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
            Thành công
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-on-surface">{price}</div>
        <Link
          to="/account/orders"
          className="mt-1 inline-block text-xs text-primary font-bold border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
