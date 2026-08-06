import {
  CalendarDays,
  Check,
  Crown,
  Eye,
  Gift,
  Headphones,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Ticket,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";

export function WarrantyLookupPage() {
  return (
    <AccountShell title="Tra cứu bảo hành" description="Kiểm tra thông tin chi tiết về gói bảo hành và tình trạng điện thoại của bạn.">
      <Panel className="p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Field label="Số điện thoại mua hàng" placeholder="09xx xxx xxx" />
          <Field label="IMEI / Serial / Mã đơn" placeholder="Nhập mã định danh thiết bị" />
          <button type="button" className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-white">
            <Search size={18} /> Tra cứu
          </button>
        </div>
      </Panel>
      <div className="my-5 flex items-center justify-between">
        <h2 className="font-extrabold">Kết quả tra cứu</h2>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-success"><Check size={15} /> Đã xác thực thông tin</span>
      </div>
      <div className="grid items-stretch gap-5 xl:grid-cols-[1fr_18rem]">
        <Panel className="grid gap-5 p-5 sm:grid-cols-[9rem_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft"><PhoneStripImage index={0} /></div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Điện thoại của bạn</p>
            <h2 className="mt-1 text-xl font-black">iPhone 15 Pro Max 256GB</h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="IMEI" value="352940********" />
              <Info label="Ngày mua" value="15/02/2024" />
              <Info label="Gói bảo hành" value="PinkCare+ 24 tháng" />
              <Info label="Tình trạng" value="Còn hạn" success />
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs"><span>Thời hạn còn lại</span><strong className="text-primary">280 ngày</strong></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-soft"><div className="h-full w-3/4 bg-primary" /></div>
            </div>
          </div>
        </Panel>
        <section className="rounded-2xl bg-primary p-5 text-white">
          <Headphones size={24} />
          <h2 className="mt-4 font-extrabold">Cần hỗ trợ kỹ thuật?</h2>
          <p className="mt-2 text-sm leading-6 text-white/85">Chúng tôi luôn sẵn sàng hỗ trợ mọi vấn đề về điện thoại.</p>
          <button type="button" className="mt-6 min-h-11 w-full rounded-xl bg-white font-bold text-primary">Yêu cầu hỗ trợ ngay</button>
        </section>
      </div>
      <Panel className="mt-5 overflow-hidden">
        <h2 className="border-b border-border p-5 font-extrabold">Lịch sử sửa chữa</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-muted"><tr><th className="p-4">Mã phiếu</th><th className="p-4">Ngày tiếp nhận</th><th className="p-4">Nội dung</th><th className="p-4">Trạng thái</th><th className="p-4">Chi phí</th></tr></thead>
            <tbody>
              <tr className="border-b border-border"><td className="p-4 font-bold">PK-BH-9821</td><td className="p-4">20/03/2024</td><td className="p-4">Vệ sinh máy định kỳ</td><td className="p-4"><Status /></td><td className="p-4 font-bold text-success">Miễn phí</td></tr>
              <tr><td className="p-4 font-bold">PK-BH-7742</td><td className="p-4">05/03/2024</td><td className="p-4">Kiểm tra lỗi cảm ứng màn hình</td><td className="p-4"><Status /></td><td className="p-4 font-bold text-success">Miễn phí</td></tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </AccountShell>
  );
}

export function MembershipPage() {
  const benefits = [
    [Truck, "Miễn phí vận chuyển", "Cho mọi đơn điện thoại toàn quốc"],
    [Gift, "Quà sinh nhật", "Voucher 500.000đ vào tháng sinh nhật"],
    [ShieldCheck, "Bảo hành VIP", "Ưu tiên xử lý bảo hành"],
    [Ticket, "Voucher độc quyền", "Giảm thêm cho lần mua điện thoại kế tiếp"],
  ] as const;
  return (
    <AccountShell title="Hạng thành viên" description="Quyền lợi và tiến trình tích lũy của thành viên PinkPhone.">
      <div className="grid gap-5 md:grid-cols-[1fr_17rem]">
        <section className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white">
          <p className="text-sm font-bold text-white/80">Hạng hiện tại</p>
          <div className="mt-2 flex items-center gap-3"><Crown size={32} /><h2 className="text-4xl font-black">Vàng</h2></div>
          <p className="mt-2 text-sm">Bạn đang ở nhóm 35% khách hàng thân thiết nhất.</p>
          <div className="mt-6 flex justify-between text-xs"><span>Tiến trình lên hạng Bạch Kim</span><strong>8.500 / 30.000 điểm</strong></div>
          <div className="mt-2 h-2 rounded-full bg-white/25"><div className="h-full w-[28.3%] rounded-full bg-white" /></div>
        </section>
        <Panel className="grid place-items-center p-6 text-center">
          <Star size={28} className="text-primary" />
          <p className="mt-3 text-sm text-muted">Điểm tích lũy hiện có</p>
          <strong className="text-4xl text-primary">2.450</strong>
          <button type="button" className="mt-4 min-h-10 w-full rounded-xl bg-primary text-sm font-bold text-white">Đổi quà ngay</button>
        </Panel>
      </div>
      <h2 className="mt-7 text-xl font-black">Quyền lợi hạng Vàng</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {benefits.map(([Icon, title, note]) => (
          <Panel key={title} className="border-b-4 border-b-primary p-5">
            <Icon size={22} className="text-primary" /><h3 className="mt-4 font-extrabold">{title}</h3><p className="mt-2 text-xs leading-5 text-muted">{note}</p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-6 overflow-hidden p-5">
        <h2 className="text-lg font-extrabold">So sánh quyền lợi các hạng</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[38rem] text-sm">
            <thead><tr className="text-left text-muted"><th className="py-3">Đặc quyền</th><th>Thành viên</th><th>Bạc</th><th className="text-primary">Vàng</th><th>Bạch Kim</th><th>Kim Cương</th><th>Thẻ Đen</th></tr></thead>
            <tbody className="[&_td]:border-t [&_td]:border-border [&_td]:py-4">
              <tr><td>Chi tiêu tích lũy</td><td>0 - 5tr</td><td>5tr - 15tr</td><td className="font-bold text-primary">15tr - 30tr</td><td className="text-secondary">30tr - 100tr</td><td className="text-secondary">100tr - 500tr</td><td className="font-bold text-secondary">Trên 500tr</td></tr>
              <tr><td>Tích lũy điểm</td><td>0,5%</td><td>1%</td><td className="font-bold text-primary">2%</td><td className="text-secondary">3%</td><td className="text-secondary">4%</td><td className="text-secondary">5%</td></tr>
              <tr><td>Vệ sinh máy miễn phí</td><td>—</td><td>1 lần/năm</td><td className="font-bold text-primary">Vô hạn</td><td className="text-secondary">Vô hạn</td><td className="text-secondary">Vô hạn</td><td className="text-secondary">Vô hạn</td></tr>
              <tr><td>Ưu đãi thu cũ</td><td>+100k</td><td>+200k</td><td className="font-bold text-primary">+500k</td><td className="text-secondary">+700k</td><td className="text-secondary">+1 triệu</td><td className="text-secondary">+1.5tr</td></tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </AccountShell>
  );
}

const coupons = [
  ["Hotsale", "Giảm 500k", "Đơn điện thoại từ 15.000.000đ"],
  ["Thành viên Vàng", "Giảm 10%", "Phí bảo hành mở rộng"],
  ["Flash Deal", "Giảm 1,2 triệu", "Áp dụng cho Galaxy Z Fold"],
  ["Thành viên mới", "Giảm 200k", "Đơn điện thoại đầu tiên"],
] as const;

export function VouchersPage() {
  return (
    <AccountShell title="Mã giảm giá của tôi" description="Khám phá ưu đãi độc quyền dành riêng cho thành viên PinkPhone.">
      <div className="flex gap-2 overflow-x-auto border-b border-border pb-2">
        {["Có thể sử dụng (12)", "Sắp hết hạn (2)", "Đã sử dụng", "Đã hết hạn"].map((tab, i) => <button key={tab} type="button" className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-bold ${i === 0 ? "bg-primary text-white" : "text-muted"}`}>{tab}</button>)}
      </div>
      <div className="my-5 flex flex-col justify-between gap-3 sm:flex-row">
        <select className="min-h-11 rounded-xl border border-border bg-white px-4 text-sm"><option>Mới nhất</option><option>Sắp hết hạn</option></select>
        <div className="flex"><input className="min-h-11 min-w-0 rounded-l-xl border border-border px-4" placeholder="Nhập mã voucher..." /><button type="button" className="rounded-r-xl bg-primary px-4 text-sm font-bold text-white">Áp dụng</button></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {coupons.map(([tag, value, condition]) => (
          <Panel key={value + tag} className="relative overflow-hidden border-l-4 border-l-primary p-5">
            <Star className="absolute right-4 top-4 text-primary" size={18} />
            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-primary">{tag}</span>
            <h2 className="mt-4 text-2xl font-black text-primary">{value}</h2>
            <p className="mt-1 text-sm">{condition}</p>
            <div className="mt-4 space-y-1 text-xs text-muted"><p><CalendarDays className="mr-1 inline" size={13} /> Hạn dùng: 31/12/2024</p><p>Áp dụng trên website và cửa hàng</p></div>
            <div className="mt-5 flex gap-2"><button type="button" className="min-h-10 flex-1 rounded-xl bg-primary text-sm font-bold text-white">Dùng ngay</button><button type="button" className="grid size-10 place-items-center rounded-xl border border-border" aria-label="Xem chi tiết"><Eye size={17} /></button></div>
          </Panel>
        ))}
      </div>
    </AccountShell>
  );
}

const favorites = [
  ["iPhone 15 Pro Max", "29.990.000đ", "34.990.000đ", 0],
  ["Samsung Galaxy S24 Ultra", "26.490.000đ", "31.990.000đ", 1],
  ["Google Pixel 8 Pro", "21.990.000đ", "24.500.000đ", 2],
  ["Xiaomi 14 Ultra", "23.490.000đ", "27.990.000đ", 3],
] as const;

export function FavoritesPage() {
  return (
    <AccountShell title="Sản phẩm yêu thích" description="Danh sách các mẫu điện thoại bạn đã quan tâm và lưu lại.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {favorites.map(([name, price, oldPrice, index]) => (
          <Panel key={name} className="relative p-4">
            <button type="button" className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white shadow" aria-label={`Xóa ${name}`}><Trash2 size={16} /></button>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-soft"><PhoneStripImage index={index} /></div>
            <div className="mt-4 flex items-center justify-between gap-2 text-[11px]"><span className="rounded-full bg-primary px-2 py-1 font-bold text-white">Còn hàng</span><span className="text-muted">256GB</span></div>
            <h2 className="mt-3 font-extrabold">{name}</h2>
            <div className="mt-2 flex items-baseline gap-2"><strong className="text-lg text-primary">{price}</strong><del className="text-xs text-muted">{oldPrice}</del></div>
            <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" className="min-h-10 rounded-xl bg-primary text-sm font-bold text-white">Thêm giỏ</button><Link to="/san-pham/pinkphone-ultra-x" className="inline-flex min-h-10 items-center justify-center rounded-xl bg-neutral-soft text-sm font-bold">Chi tiết</Link></div>
          </Panel>
        ))}
      </div>
    </AccountShell>
  );
}

export function AddressesPage() {
  return (
    <AccountShell
      title="Sổ địa chỉ"
      description="Quản lý các địa chỉ nhận hàng để thanh toán nhanh chóng hơn."
      actions={<button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-bold text-white"><Plus size={18} /> Thêm địa chỉ mới</button>}
    >
      <div className="space-y-4">
        <Address name="Nguyễn Minh Anh" phone="0987 654 321" text="Số 123, Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh" primary />
        <Address name="Trần Thị Bích Ngọc" phone="0901 234 567" text="Tòa nhà Landmark 81, Vinhomes Central Park, Quận Bình Thạnh, TP. Hồ Chí Minh" />
        <Address name="Hoàng Văn Nam" phone="0912 345 678" text="Số 45, Ngõ 12, Đường Xuân Thủy, Quận Cầu Giấy, Hà Nội" />
      </div>
      <Panel className="mt-5 overflow-hidden">
        <div className="grid h-56 place-items-center bg-neutral-soft">
          <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-bold text-white"><MapPin size={18} /> Xem cửa hàng gần nhất</button>
        </div>
      </Panel>
    </AccountShell>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return <label className="grid gap-2 text-sm font-bold">{label}<input className="min-h-12 rounded-xl border border-border px-4 font-normal outline-none focus:border-primary" placeholder={placeholder} /></label>;
}
function Info({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return <div><p className="text-xs text-muted">{label}</p><p className={`mt-1 font-bold ${success ? "text-success" : ""}`}>{value}</p></div>;
}
function Status() { return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-success">Hoàn thành</span>; }
function Address({ name, phone, text, primary }: { name: string; phone: string; text: string; primary?: boolean }) {
  return (
    <Panel className={`p-5 ${primary ? "border-primary" : ""}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <div className="flex flex-wrap items-center gap-2"><h2 className="font-extrabold">{name}</h2>{primary && <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white">Mặc định</span>}</div>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted"><Smartphone size={16} className="text-primary" /> {phone}</p>
          <p className="mt-2 flex items-start gap-2 text-sm text-muted"><MapPin size={16} className="mt-0.5 shrink-0 text-primary" /> {text}</p>
        </div>
        <div className="flex shrink-0 gap-2"><button type="button" className="min-h-10 rounded-xl border border-border px-4 text-sm font-bold">Chỉnh sửa</button><button type="button" className="min-h-10 rounded-xl border border-border px-4 text-sm font-bold text-danger">Xóa</button></div>
      </div>
    </Panel>
  );
}
