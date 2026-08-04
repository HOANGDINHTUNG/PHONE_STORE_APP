import {
  CheckCircle2,
  Circle,
  CircleDollarSign,
  Headphones,
  Heart,
  PackageCheck,
  Pencil,
  Star,
  Ticket,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";
import { AccountShell } from "../components/AccountShell";
import { fetchMyOrders } from "../../../api/profileService";

const favoriteProducts = [
  {
    name: "iPhone 14 Pro",
    price: "21.990.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB420XbhBlAxmbIfJby2Gb1XM6669nP8NhkvKeV0BXZAnoZPbxoVEXO1TULDiHlLpIBQ1m7fbcs1jpcUgcyT-coLCxLbSJ45xnZE4GXzL_8JQobyk6PkQGBzg6d7emzJgAd2XRi8Od1-w7p5eRkDfBsPWZlnvgIIc-EwMOk4LMdAnV-xOoDcwf-ENU27_WZkvT1XNRsxOXthfrTunECIzMUtX4E5F8XzkrLiiOhQ_uBNRkWkQO0zgmG",
  },
  {
    name: "Google Pixel 8",
    price: "18.200.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9lBauPgukMezkK2Ul0sLryulXGxggietH7c-l0yX7PZO7SQZNvayGPo8oInHOc_1fEZ1mEEsz18jvtndyRkb9qaZT9KcZDQA6kDT1xyTG-cqLVxi2FFMv6U6tG-zuw3xyOOKZwr8o-yn1Q1s9FBP3yWeX3bmeb8xKl-KkE1NPzwUhyST2yQrnMjy9GXsZFHixuxcj_w0AnqbNUW3ebxTgD8v-TesOf6c7yBsTqHYuS_wACjcJQpW4",
  },
  {
    name: "Xiaomi 13 Ultra",
    price: "24.500.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlGvFxRkJf_VE1JEl4LWyK_U_OF4j2ulo3C4jYVLpyNU_7Q-CgSQLHG2gnAqvZK-9WFsSlk7Udw8eOLkf00GDtCyUnveZeGtzI67OzumZoNjWhI16NYGgjLLU__IBPy7YxfRaOMlRETL516jRR8wxxMOS6JToHucLyoeZEofihc05vwpWale8UJ8Ce6mfj8B6_kMY1RIKCtW3y8NJX7oWihyC3mWFdkHCoDAdsAi6OM-rBNiimeNKu",
  },
];

export function AccountOverviewPage() {
  const { user } = useStore();
  const [progress, setProgress] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(70), 150);

    let active = true;
    fetchMyOrders().then((data) => {
      if (active && data) setOrders(data);
    });

    return () => {
      clearTimeout(timer);
      active = false;
    };
  }, []);

  const displayName = user?.name || "Khách Hàng PinkPhone";
  const displayPhone = user?.phone || "09xxxxxx";

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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2bZvDn7uo1TgAlkFmJk00vw6AuxmZ40QUMAn_UPm0a1H-Hq_ZYxzNFaG_MjqM7J40FyU8e7DV2UB8Dik856Q4NXcU7iGHZaVCVsIAn3blHCLnBH2woxe_KByenZffilHHn2nBk3bRg90EBDpt6iylqpJjChx9BkvtQiLH-gWByqwfKzlW3GujzVzlrUxOSS7vnCAe_sHIiXGCWO6CjJ37CV55zAS_bDRGVbANNJ66M9ipptYRcmdJ"
                />
              </div>
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface">
                  {displayName}
                </h1>
                <p className="font-body-md text-on-surface-variant">
                  {displayPhone}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-label-sm px-2 py-1 bg-surface-container rounded-md">
                    ID: PP-992834
                  </span>
                  <button className="text-primary text-xs hover:underline flex items-center gap-1">
                    <Pencil size={12} className="text-sm" /> Chỉnh sửa
                  </button>
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
            <StatCard icon={CheckCircle2} value="12" label="Tổng đơn" />
            <StatCard icon={CircleDollarSign} value="85M" label="Chi tiêu" />
            <StatCard icon={Star} value="1,200" label="Điểm tích lũy" />
            <StatCard icon={Heart} value="8" label="Yêu thích" />
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
                          o.orderDate || Date.now(),
                        ).toLocaleDateString("vi-VN")}
                        price={`${(o.totalAmount || 0).toLocaleString(
                          "vi-VN",
                        )}đ`}
                        image="/images/prod_s24.png"
                      />
                    ))
                ) : (
                  <>
                    <RecentOrderItem
                      name="iPhone 15 Pro Max 256GB - Pink"
                      code="#ORD-7721"
                      date="12/03/2024"
                      price="32,990,000đ"
                      image="https://lh3.googleusercontent.com/aida-public/AB6AXuC9ZbmsxE7l8ZZIY4RL03JQa4BgHioS2eyfQ_pwtO4mv22j1BLO7v9PWwW_sUarD_vRrKMixXqDRSBdWineOe3sHmf8F7m_clW6MXzDWgy3RyOf7zx7jsdfZyviocZB5V3GREtTShRPeueMjfMfDOgLKHsZOcNFTccSyxLBbD14PiNfkXKUbeOF6DembL4ncAanzBgQE4xilG6dwKksQ3hgmX5A0pywnwqxEMLMgpEdBugzVhRcJ2zp"
                    />
                    <RecentOrderItem
                      name="Samsung Galaxy Z Flip5"
                      code="#ORD-6612"
                      date="05/02/2024"
                      price="19,450,000đ"
                      image="https://lh3.googleusercontent.com/aida-public/AB6AXuAJKvS_xvc-aibIJ6czIqWK2bBJdrfQe6WZf2t_WPJnQMdxPo77E4yAKOxQJglAb-KcSiHDlYyAMombBZKDIBsgnBbHEGOq50XkngqIOJDR-BwxitH6TnNDc50lAPK3GJ-ofQUrmGA7Cg3_BHA7sVglbK8jo2QMhvEcMtnGGAV4qmcsVka0WIMI2Iyio5qxFrMb3iqffimpjoaFrQ1wh5kg44mVulQ6iVPuXb9AipniNlMklcc-rSha"
                    />
                  </>
                )}
              </div>
            </div>
            {/* Favorite Products */}
            <div className="bento-card rounded-xl overflow-hidden">
              <div className="p-lg border-b border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Sản phẩm yêu thích
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-outline-variant/30">
                {favoriteProducts.map((p) => (
                  <Link
                    to="/"
                    key={p.name}
                    className="bg-white p-lg hover:bg-surface-container-low transition-all group block"
                  >
                    <div className="relative w-full aspect-square mb-4">
                      <img
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform mix-blend-multiply"
                        alt={p.name}
                        src={p.image}
                      />
                    </div>
                    <h4 className="text-sm font-label-sm text-on-surface line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-primary font-bold">{p.price}</p>
                  </Link>
                ))}
              </div>
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
              <button className="w-full mt-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-secondary transition-colors">
                Cập nhật ngay
              </button>
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
                <button className="flex-1 py-2 bg-white text-on-surface rounded-lg text-xs font-bold border border-outline-variant hover:bg-surface-container transition-all">
                  Chat ngay
                </button>
                <button className="flex-1 py-2 bg-white text-on-surface rounded-lg text-xs font-bold border border-outline-variant hover:bg-surface-container transition-all">
                  Gọi hotline
                </button>
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
        <button className="mt-1 text-xs text-primary font-bold border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all">
          Mua lại
        </button>
      </div>
    </div>
  );
}
