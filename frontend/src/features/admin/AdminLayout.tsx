import {
  Archive,
  Bell,
  Boxes,
  CircleHelp,
  ClipboardList,
  FileDown,
  HandCoins,
  History,
  LayoutDashboard,
  PackageSearch,
  ReceiptText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  UsersRound,
} from "lucide-react";
import { message, Popconfirm } from "antd";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const navigation = [
  { label: "Tổng quan", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Sản phẩm & Nội dung", to: "/admin/products", icon: PackageSearch },
  { label: "Khuyến mãi", to: "/admin/promotions", icon: Archive },
  { label: "Đơn hàng", to: "/admin/orders", icon: ShoppingCart },
  { label: "Thanh toán & Hoàn tiền", to: "/admin/payments", icon: HandCoins },
  { label: "Giao hàng", to: "/admin/shipping", icon: Truck },
  { label: "Kho hàng", to: "/admin/inventory", icon: Boxes },
  { label: "Nhập hàng", to: "/admin/procurement", icon: ClipboardList },
  { label: "Hậu mãi", to: "/admin/after-sales", icon: ReceiptText },
  { label: "Người dùng & Nhân sự", to: "/admin/users", icon: UsersRound },
  { label: "Vai trò & Quyền", to: "/admin/roles", icon: ShieldCheck },
  { label: "Thông báo", to: "/admin/notifications", icon: Bell },
  { label: "Nhật ký kiểm toán", to: "/admin/audit-logs", icon: History },
];

const secondaryNavigation = [
  { label: "Settings", to: "/admin/settings", icon: Settings },
  { label: "Support", to: "/admin/support", icon: CircleHelp },
];

function NavigationLink({ item }: { item: (typeof navigation)[number] }) {
  const Icon = item.icon;
  return (
    <NavLink
      end={item.end}
      to={item.to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
          isActive ? "bg-[#d92e70] text-white shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-[#c2185b]"
        }`
      }
    >
      <Icon size={19} strokeWidth={2} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export function AdminLayout() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    message.success("Đã đăng xuất quản trị.");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#fffafb] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-[#f0d6df] bg-[#fbe3e9] lg:flex">
        <div className="border-b border-[#f2d1dc] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#d92e70] shadow-sm">
              <ShoppingCart size={20} />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-[#c2185b]">PinkPhone</div>
              <div className="text-[11px] font-bold tracking-wide text-slate-600">Retail Management</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigation.map((item) => <NavigationLink key={item.to} item={item} />)}
        </nav>

        <div className="border-t border-[#f2d1dc] p-3">
          <button
            onClick={() => message.info("Báo cáo sẽ sớm có thể xuất từ trang tổng quan.")}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#c2185b] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#a70f4b]"
          >
            <FileDown size={17} /> Export Report
          </button>
          <div className="mt-3 space-y-1">
            {secondaryNavigation.map((item) => <NavigationLink key={item.to} item={item} />)}
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#f2dce3] bg-white/95 px-5 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-extrabold text-[#d92e70]">PinkPhone Admin</span>
            <span className="text-slate-300">›</span>
            <span className="hidden font-medium text-slate-600 sm:inline">Quản trị hệ thống</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="hidden w-56 items-center gap-2 rounded-xl border border-[#efd3dc] bg-[#fffafb] px-3 py-2 text-sm text-slate-400 md:flex">
              <SlidersHorizontal size={16} />
              <input className="w-full bg-transparent outline-none" placeholder="Tìm kiếm hệ thống..." />
            </label>
            <button className="relative rounded-lg p-2 text-slate-600 hover:bg-[#fff0f5]" aria-label="Thông báo">
              <Bell size={19} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d92e70]" />
            </button>
            <div className="hidden h-7 border-l border-[#f0d6df] sm:block" />
            <Popconfirm
              title="Xác nhận đăng xuất"
              description="Bạn có chắc muốn kết thúc phiên quản trị?"
              okText="Đăng xuất"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              placement="bottomRight"
              onConfirm={handleLogout}
            >
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-[#fff0f5]">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f6cad8] text-sm font-black text-[#a70f4b]">
                  {(user?.name || "A").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:block">
                  <span className="block text-sm font-bold text-slate-900">{user?.name || "Admin User"}</span>
                  <span className="block text-[10px] font-extrabold uppercase text-[#c2185b]">Quản trị viên</span>
                </span>
              </button>
            </Popconfirm>
          </div>
        </header>

        <main className="p-5 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
