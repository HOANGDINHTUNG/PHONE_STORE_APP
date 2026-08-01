import {
  Bell,
  Check,
  ChevronRight,
  Clock3,
  PackageCheck,
  RefreshCcw,
  Star,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";

const reviewPhones = [
  ["iPhone 16 Pro Max", "Đơn #PP123-001", 0, false],
  ["Samsung Galaxy S24 Ultra", "Đơn #PP122-890", 1, true],
] as const;

export function MyReviewsPage() {
  return (
    <AccountShell
      title="Đánh giá của tôi"
      description="Quản lý đánh giá và chia sẻ trải nghiệm sử dụng điện thoại đã mua tại PinkPhone."
    >
      <div className="flex gap-2 overflow-x-auto border-b border-border pb-2">
        <button
          type="button"
          className="min-h-10 shrink-0 rounded-xl bg-primary px-4 text-sm font-bold text-white"
        >
          Chờ đánh giá (1)
        </button>
        <button
          type="button"
          className="min-h-10 shrink-0 rounded-xl px-4 text-sm font-bold text-muted"
        >
          Đã đánh giá (1)
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {reviewPhones.map(([name, order, index, reviewed]) => (
          <Panel
            key={name}
            className="grid gap-4 p-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft">
              <PhoneStripImage index={index} />
            </div>
            <div>
              <p className="text-xs text-muted">{order}</p>
              <h2 className="mt-1 text-lg font-extrabold">{name}</h2>
              {reviewed ? (
                <>
                  <div className="mt-2 flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Máy đẹp, hiệu năng tốt và giao hàng rất nhanh.
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  Bạn nhận được 100 điểm khi hoàn thành đánh giá.
                </p>
              )}
            </div>
            <button
              type="button"
              className={`min-h-11 rounded-xl px-5 text-sm font-bold ${reviewed ? "border border-primary text-primary" : "bg-primary text-white"}`}
            >
              {reviewed ? "Chỉnh sửa" : "Viết đánh giá"}
            </button>
          </Panel>
        ))}
      </div>
    </AccountShell>
  );
}

export function ReturnsPage() {
  return (
    <AccountShell
      title="Đổi trả & hoàn tiền"
      description="Theo dõi yêu cầu đổi trả điện thoại và tiến trình hoàn tiền của bạn."
      actions={
        <button
          type="button"
          className="min-h-11 rounded-xl bg-primary px-5 font-bold text-white"
        >
          Tạo yêu cầu mới
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Summary icon={RefreshCcw} value="01" label="Đang xử lý" />
        <Summary icon={Check} value="03" label="Đã hoàn tất" />
        <Summary icon={Clock3} value="7 ngày" label="Thời hạn đổi trả" />
      </div>
      <Panel className="mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-soft p-4">
          <div>
            <strong className="text-primary">#RT-240915</strong>
            <span className="ml-3 text-xs text-muted">Tạo ngày 15/09/2024</span>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-warning">
            Đang kiểm tra
          </span>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft">
            <PhoneStripImage index={2} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">Google Pixel 8 Pro</h2>
            <p className="mt-1 text-sm text-muted">
              Lý do: Lỗi hiển thị màn hình khi sử dụng.
            </p>
            <p className="mt-2 text-sm">
              <strong>Số tiền dự kiến hoàn:</strong>{" "}
              <span className="text-primary">21.990.000đ</span>
            </p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary px-4 text-sm font-bold text-primary"
          >
            Xem tiến trình <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 border-t border-border p-5">
          {["Đã gửi yêu cầu", "Đã tiếp nhận", "Đang kiểm tra", "Hoàn tiền"].map(
            (step, index) => (
              <div key={step} className="text-center">
                <div
                  className={`mx-auto grid size-8 place-items-center rounded-full ${index < 3 ? "bg-primary text-white" : "bg-neutral-soft text-muted"}`}
                >
                  {index < 2 ? (
                    <Check size={15} />
                  ) : index === 2 ? (
                    <Clock3 size={15} />
                  ) : (
                    <RefreshCcw size={15} />
                  )}
                </div>
                <p className="mt-2 text-[11px] font-bold text-muted">{step}</p>
              </div>
            ),
          )}
        </div>
      </Panel>
      <div className="mt-5 rounded-2xl border border-border bg-surface-soft p-5 text-sm leading-6 text-muted">
        Điện thoại được hỗ trợ đổi trả trong 7 ngày nếu đáp ứng điều kiện ngoại
        quan và chính sách của PinkPhone.
      </div>
    </AccountShell>
  );
}

const notifications = [
  [
    Truck,
    "Đơn hàng đang trên đường giao",
    "Đơn #PP123-001 dự kiến giao trong hôm nay.",
    "5 phút trước",
  ],
  [
    PackageCheck,
    "Đơn hàng đã được xác nhận",
    "PinkPhone đã xác nhận đơn mua iPhone 16 Pro Max.",
    "2 giờ trước",
  ],
  [
    Star,
    "Bạn vừa nhận thêm 100 điểm",
    "Cảm ơn bạn đã đánh giá sản phẩm.",
    "Hôm qua",
  ],
  [
    Bell,
    "Voucher thành viên sắp hết hạn",
    "Mã PINKMEMBER sẽ hết hạn sau 3 ngày.",
    "2 ngày trước",
  ],
] as const;

export function NotificationsPage() {
  return (
    <AccountShell
      title="Thông báo"
      description="Cập nhật đơn hàng, ưu đãi và hoạt động tài khoản PinkPhone."
      actions={
        <button type="button" className="min-h-10 font-bold text-primary">
          Đánh dấu tất cả đã đọc
        </button>
      }
    >
      <div className="flex gap-2 overflow-x-auto border-b border-border pb-2">
        {["Tất cả", "Đơn hàng", "Ưu đãi", "Tài khoản"].map((tab, index) => (
          <button
            type="button"
            key={tab}
            className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-bold ${index === 0 ? "bg-primary text-white" : "text-muted"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <Panel className="mt-5 overflow-hidden">
        {notifications.map(([Icon, title, text, time], index) => (
          <article
            key={title}
            className={`flex gap-4 border-b border-border p-5 last:border-0 ${index < 2 ? "bg-surface-soft" : ""}`}
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-pink-100 text-primary">
              <Icon size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-extrabold">{title}</h2>
                <time className="text-xs text-muted">{time}</time>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
              {index === 0 && (
                <Link
                  to="/account/tracking"
                  className="mt-2 inline-flex items-center text-sm font-bold text-primary"
                >
                  Theo dõi đơn hàng <ChevronRight size={15} />
                </Link>
              )}
            </div>
            {index < 2 && (
              <span
                className="mt-2 size-2 shrink-0 rounded-full bg-primary"
                aria-label="Chưa đọc"
              />
            )}
          </article>
        ))}
      </Panel>
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
