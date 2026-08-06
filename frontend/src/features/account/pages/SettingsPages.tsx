import { useState, useEffect } from "react";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  FileImage,
  KeyRound,
  Link2,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircleQuestion,
  Phone,
  Send,
  ShieldCheck,
  Smartphone,
  Upload,
  // New icons for Support UI
  Wrench,
  ShoppingBag,
  MessageSquare,
  Ticket,
  ChevronRight,
  Loader2,
  FileText,
  LucideIcon,
  Laptop,
  Tablet,
  MonitorSmartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";

export function AccountInformationPage() {
  const [saved, setSaved] = useState(false);
  return (
    <AccountShell
      title="Thông tin tài khoản"
      description="Quản lý thông tin cá nhân và địa chỉ mặc định của bạn."
    >
      {saved && (
        <div
          role="status"
          className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-success"
        >
          <CheckCircle2 size={18} /> Cập nhật thông tin thành công.
        </div>
      )}
      <Panel className="p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="relative grid size-20 place-items-center rounded-full bg-surface-soft text-2xl font-black text-primary">
            MA
            <button
              type="button"
              className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-primary text-white"
              aria-label="Thay ảnh đại diện"
            >
              <Camera size={15} />
            </button>
          </div>
          <div>
            <h2 className="font-extrabold">Ảnh đại diện</h2>
            <p className="mt-1 text-xs text-muted">
              Định dạng JPG, PNG. Tối đa 5MB.
            </p>
          </div>
        </div>
        <form
          className="mt-7 grid gap-5 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <TextField label="Họ và tên" defaultValue="Nguyễn Minh Anh" />
          <TextField label="Ngày sinh" defaultValue="20/10/1995" type="date" />
          <TextField label="Số điện thoại" defaultValue="0901234567" />
          <TextField
            label="Email"
            defaultValue="minhanh@pinkphone.vn"
            type="email"
          />
          <label className="grid gap-2 text-sm font-bold sm:col-span-2">
            Địa chỉ mặc định
            <textarea
              className="min-h-28 rounded-xl border border-border p-4 font-normal outline-none focus:border-primary"
              defaultValue="123 Đường Sáng Tạo, Phường Công Nghệ, Quận 1, TP. Hồ Chí Minh"
            />
          </label>
          <div className="flex justify-end gap-3 border-t border-border pt-5 sm:col-span-2">
            <button type="reset" className="min-h-11 px-5 font-bold text-muted">
              Hủy
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-primary px-6 font-bold text-white"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </Panel>
    </AccountShell>
  );
}

export function ChangePasswordPage() {
  const [successMsg, setSuccessMsg] = useState("");
  const [pass, setPass] = useState("");
  const [v1, setV1] = useState(false);
  const [v2, setV2] = useState(false);
  const [v3, setV3] = useState(false);

  // Sessions State
  const [logoutTarget, setLogoutTarget] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: "session-1",
      type: "laptop",
      device: "Chrome trên MacOS",
      current: true,
      date: "10:30, 15/10/2024",
      lastActive: "Vừa xong",
      expiry: "Hết hạn sau 30 ngày",
      status: "Phiên hiện tại",
      statusColor: "bg-primary text-white",
    },
    {
      id: "session-2",
      type: "smartphone",
      device: "Safari trên iPhone 13",
      current: false,
      date: "08:15, 12/10/2024",
      lastActive: "Hôm qua",
      expiry: "Hết hạn sau 14 ngày",
      status: "Đang hoạt động",
      statusColor: "bg-green-100 text-green-800 border border-green-200",
    },
    {
      id: "session-3",
      type: "tablet",
      device: "Chrome trên iPad",
      current: false,
      expired: true,
      date: "09:00, 01/09/2024",
      lastActive: "15/09/2024",
      status: "Đã hết hạn",
      statusColor: "bg-surface-container-highest text-on-surface-variant",
    },
  ]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const getStrength = (val: string) => {
    let s = 0;
    if (val.length > 0) s = 1;
    if (val.length >= 8) s = 2;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) s = 3;
    if (/[^A-Za-z0-9]/.test(val) && val.length >= 10) s = 4;
    return s;
  };

  const strength = getStrength(pass);
  const strengthLabels = ["", "Rất yếu", "Yếu", "Trung bình", "Mạnh"];
  const strengthColors = [
    "",
    "text-error",
    "text-error",
    "text-secondary",
    "text-green-600",
  ];
  const strengthWidths = ["0%", "25%", "50%", "75%", "100%"];
  const strengthBgColors = [
    "transparent",
    "#ba1a1a",
    "#f97316",
    "#eab308",
    "#22c55e",
  ];

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const form = e.target as HTMLFormElement;
    if (
      !form.currentPassword.value ||
      !form.newPassword.value ||
      !form.confirmPassword.value
    ) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (form.newPassword.value !== form.confirmPassword.value) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }
    showNotification(
      "Đổi mật khẩu thành công! Bạn có thể tiếp tục trải nghiệm.",
    );
    setPass("");
    form.reset();
  };

  const executeLogout = () => {
    setLogoutTarget(null); // Hide modal
    setIsLoggingOut(true);

    setTimeout(() => {
      setIsLoggingOut(false);
      if (logoutTarget === "all") {
        const remaining = sessions.filter((s) => s.current || s.expired);
        setSessions(remaining);
        showNotification("Đã đăng xuất khỏi tất cả thiết bị khác thành công.");
      } else if (logoutTarget) {
        setSessions((prev) => prev.filter((s) => s.id !== logoutTarget));
        showNotification("Đã đăng xuất phiên bản thành công.");
      }
    }, 800);
  };

  return (
    <AccountShell
      title="Bảo mật & phiên đăng nhập"
      description="Quản lý mật khẩu và các thiết bị đang đăng nhập vào tài khoản của bạn."
    >
      <style>{`
        .success-banner {
            transform: translateY(-100%);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .success-banner.show { transform: translateY(0); }
      `}</style>

      {/* Logout Confirmation Modal */}
      {logoutTarget && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-[24px] text-on-surface mb-2">
              Xác nhận đăng xuất
            </h3>
            <p className="font-medium text-[16px] text-on-surface-variant mb-6 leading-relaxed">
              {logoutTarget === "all"
                ? "Bạn có chắc chắn muốn đăng xuất khỏi TẤT CẢ các thiết bị khác?"
                : "Bạn có chắc chắn muốn đăng xuất khỏi thiết bị này?"}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-6 py-2.5 rounded-full font-bold text-[14px] text-on-surface-variant hover:bg-surface-container transition-colors"
                onClick={() => setLogoutTarget(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-full font-bold text-[14px] bg-error text-white hover:opacity-90 transition-opacity shadow-sm"
                onClick={executeLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      <div
        className={`success-banner fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-primary-container text-on-primary-container px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${successMsg ? "show" : ""}`}
      >
        <CheckCircle2 size={24} />
        <p className="font-semibold text-[14px]">{successMsg}</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(214,51,108,0.08)] p-6 md:p-8">
        <h2 className="font-black text-[24px] text-on-surface border-b border-surface-container-highest pb-3 mb-6">
          Đổi mật khẩu
        </h2>
        <form
          className="w-full max-w-[576px] grid gap-6"
          onSubmit={handleSubmit}
        >
          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-label-sm text-label-sm text-error">
              {errorMsg}
            </div>
          )}
          {/* Current Password */}
          <div className="grid gap-2">
            <label className="block font-label-sm text-label-sm text-on-surface">
              Mật khẩu hiện tại
            </label>
            <div className="relative group">
              <input
                required
                name="currentPassword"
                className="w-full bg-surface-container px-4 py-3 rounded-xl border border-transparent focus:border-2 focus:border-primary focus:ring-0 focus:outline-none transition-all placeholder:text-outline"
                placeholder="••••••••"
                type={v1 ? "text" : "password"}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                onClick={() => setV1(!v1)}
                type="button"
              >
                {v1 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="grid gap-2">
            <label className="block font-label-sm text-label-sm text-on-surface">
              Mật khẩu mới
            </label>
            <div className="relative group">
              <input
                required
                name="newPassword"
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-surface-container px-4 py-3 rounded-xl border border-transparent focus:border-2 focus:border-primary focus:ring-0 focus:outline-none transition-all placeholder:text-outline"
                placeholder="••••••••"
                type={v2 ? "text" : "password"}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                onClick={() => setV2(!v2)}
                type="button"
              >
                {v2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* Strength Meter */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Độ mạnh mật khẩu
                </span>
                <span
                  className={`font-label-sm text-label-sm ${strengthColors[strength]}`}
                >
                  {strengthLabels[strength]}
                </span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-1 overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: strengthWidths[strength],
                    backgroundColor: strengthBgColors[strength],
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="grid gap-2">
            <label className="block font-label-sm text-label-sm text-on-surface">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative group">
              <input
                required
                name="confirmPassword"
                className="w-full bg-surface-container px-4 py-3 rounded-xl border border-transparent focus:border-2 focus:border-primary focus:ring-0 focus:outline-none transition-all placeholder:text-outline"
                placeholder="••••••••"
                type={v3 ? "text" : "password"}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                onClick={() => setV3(!v3)}
                type="button"
              >
                {v3 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex">
            <button
              className="w-full md:w-auto px-12 py-3 bg-primary text-white rounded-full font-bold text-[18px] hover:bg-secondary active:scale-95 transition-all shadow-md"
              type="submit"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>

      {/* Sessions Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(214,51,108,0.08)] p-6 md:p-8 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-surface-container-highest pb-4">
          <div>
            <h2 className="font-black text-[24px] text-on-surface mb-1">
              Thiết bị đang đăng nhập
            </h2>
            <p className="font-medium text-[16px] text-on-surface-variant">
              Quản lý các thiết bị đang có quyền truy cập vào tài khoản.
            </p>
          </div>
          <button
            type="button"
            className="px-6 py-2.5 border border-error text-error rounded-full font-bold text-[14px] hover:bg-error/10 hover:text-red-700 transition-colors active:scale-95 whitespace-nowrap"
            onClick={() => setLogoutTarget("all")}
          >
            Đăng xuất tất cả thiết bị khác
          </button>
        </div>

        {isLoggingOut ? (
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/30">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-1/3 bg-surface-container-highest rounded"></div>
                <div className="h-4 w-1/4 bg-surface-container-highest rounded"></div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/30">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-1/3 bg-surface-container-highest rounded"></div>
                <div className="h-4 w-1/4 bg-surface-container-highest rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl transition-all ${s.current ? "border-2 border-primary-container bg-surface-container-lowest" : s.expired ? "border border-outline-variant/50 bg-surface-container-low opacity-70" : "border border-outline-variant/50 bg-surface-container-low"}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${s.current ? "bg-primary-container text-primary" : "bg-surface-container-highest text-on-surface-variant"}`}
                >
                  {s.type === "laptop" && <Laptop size={24} />}
                  {s.type === "smartphone" && <Smartphone size={24} />}
                  {s.type === "tablet" && <Tablet size={24} />}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h3 className="font-bold text-[15px] text-on-surface">
                      {s.device}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${s.statusColor}`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="text-[13px] text-on-surface-variant space-y-0.5 font-medium">
                    <p>Đăng nhập lúc: {s.date}</p>
                    <p>Sử dụng lần cuối: {s.lastActive}</p>
                    {s.expiry && (
                      <p
                        className={
                          s.current ? "text-secondary font-semibold" : ""
                        }
                      >
                        {s.expiry}
                      </p>
                    )}
                  </div>
                </div>
                {!s.current && !s.expired && (
                  <button
                    type="button"
                    className="mt-3 sm:mt-0 px-4 py-2 border border-outline-variant/80 text-on-surface-variant rounded-full font-bold text-[13px] hover:bg-error/10 hover:border-error/30 hover:text-error transition-all"
                    onClick={() => setLogoutTarget(s.id)}
                  >
                    Đăng xuất
                  </button>
                )}
              </div>
            ))}

            {sessions.filter((s) => !s.current && !s.expired).length === 0 && (
              <div className="text-center py-10 fade-in animate-in duration-500">
                <MonitorSmartphone
                  className="mx-auto text-outline-variant mb-4"
                  size={56}
                  strokeWidth={1.5}
                />
                <p className="font-semibold text-[16px] text-on-surface-variant">
                  Không có thiết bị nào khác đang đăng nhập.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bento Card Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/50 flex gap-4">
          <ShieldCheck
            className="text-primary shrink-0"
            size={36}
            strokeWidth={1.5}
          />
          <div>
            <h3 className="font-bold text-[15px] text-primary mb-1">
              Bảo mật hai lớp
            </h3>
            <p className="font-medium text-[15px] text-on-surface-variant leading-relaxed">
              Bật xác minh 2FA qua số điện thoại để nâng cao an toàn.
            </p>
          </div>
        </div>
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/50 flex gap-4">
          <KeyRound
            className="text-primary shrink-0"
            size={36}
            strokeWidth={1.5}
          />
          <div>
            <h3 className="font-bold text-[15px] text-primary mb-1">
              Mật khẩu an toàn
            </h3>
            <p className="font-medium text-[15px] text-on-surface-variant leading-relaxed">
              Nên bao gồm chữ cái viết hoa, số và ký tự đặc biệt.
            </p>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

export function SupportPage() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setTimeout(() => {
      setSubmitStatus("success");
      setTimeout(() => {
        setSubmitStatus("idle");
        if (e.target) (e.target as HTMLFormElement).reset();
      }, 3000);
    }, 1500);
  };

  return (
    <AccountShell title="Góp ý & Hỗ trợ">
      {/* Welcome Banner */}
      <section className="relative rounded-2xl overflow-hidden h-40 flex items-center px-6 md:px-8 mb-6 bg-primary-container shadow-md">
        <div className="relative z-10 w-full">
          <h1 className="text-[28px] md:text-[32px] font-black text-on-primary-container mb-2 leading-tight">
            PinkPhone luôn lắng nghe
          </h1>
          <p className="font-medium text-[16px] text-on-primary-container/90 max-w-md">
            Chúng tôi luôn ghi nhận chân thành ý kiến của bạn để cải thiện dịch
            vụ mỗi ngày.
          </p>
        </div>
      </section>

      {/* Support Form */}
      <section className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 md:p-8 shadow-sm mb-10 hover:shadow-md transition-shadow">
        <h2 className="text-[24px] font-black text-primary mb-6 flex items-center gap-2">
          <FileText size={28} />
          Gửi yêu cầu mới
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          {/* Chủ đề */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[14px] text-on-surface-variant">
              Chọn chủ đề hỗ trợ <span className="text-error">*</span>
            </label>
            <select className="rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface py-3 px-4 outline-none transition-all font-medium appearance-none">
              <option>Tư vấn mua điện thoại</option>
              <option>Bảo hành</option>
              <option>Đơn hàng</option>
              <option>Góp ý phát triển</option>
              <option>Khác</option>
            </select>
          </div>

          {/* Mã đơn hàng */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[14px] text-on-surface-variant">
              Mã đơn hàng (không bắt buộc)
            </label>
            <input
              className="rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface py-3 px-4 outline-none transition-all font-medium placeholder:text-outline-variant/70"
              placeholder="Ví dụ: PP-123456"
              type="text"
            />
          </div>

          {/* Nội dung */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-bold text-[14px] text-on-surface-variant">
              Nội dung chi tiết <span className="text-error">*</span>
            </label>
            <textarea
              required
              className="rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface py-3 px-4 outline-none transition-all resize-none min-h-[120px] font-medium placeholder:text-outline-variant/70 text-[15px]"
              placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
              rows={4}
            ></textarea>
          </div>

          {/* Tải hình ảnh */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-bold text-[14px] text-on-surface-variant">
              Hình ảnh đính kèm (nếu có)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant rounded-xl cursor-pointer bg-surface hover:bg-surface-container-low transition-all group">
              <div className="flex flex-col items-center justify-center">
                <Upload
                  size={32}
                  className="text-outline-variant group-hover:text-primary transition-colors mb-2"
                />
                <p className="font-semibold text-[14px] text-on-surface-variant">
                  Click để tải lên hình ảnh
                </p>
              </div>
              <input className="hidden" type="file" />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-[14px] text-on-surface-variant">
              Số điện thoại liên hệ <span className="text-error">*</span>
            </label>
            <input
              required
              className="rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface py-3 px-4 outline-none transition-all font-medium placeholder:text-outline-variant/70"
              placeholder="0xxx xxx xxx"
              type="tel"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-[14px] text-on-surface-variant">
              Email nhận phản hồi <span className="text-error">*</span>
            </label>
            <input
              required
              className="rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface py-3 px-4 outline-none transition-all font-medium placeholder:text-outline-variant/70"
              placeholder="example@pinkphone.vn"
              type="email"
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              className={`px-10 py-3.5 rounded-full font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition-all min-w-[200px] ${submitStatus === "loading" ? "bg-primary-fixed-dim text-white opacity-80 cursor-not-allowed" : submitStatus === "success" ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-secondary active:scale-95"}`}
              type="submit"
              disabled={submitStatus !== "idle"}
            >
              {submitStatus === "idle" && (
                <>
                  <Send size={20} /> Gửi yêu cầu
                </>
              )}
              {submitStatus === "loading" && (
                <>
                  <Loader2 size={20} className="animate-spin" /> Đang gửi...
                </>
              )}
              {submitStatus === "success" && (
                <>
                  <CheckCircle2 size={20} /> Đã gửi thành công!
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* History List */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-black text-on-surface">
            Yêu cầu đã gửi gần đây
          </h2>
          <button className="text-primary font-bold text-[14px] hover:underline hover:text-secondary">
            Xem tất cả
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <Request
            icon={Wrench}
            title="Lỗi màn hình iPhone 15 Pro Max"
            status="Hoàn thành"
            date="12/10/2023"
            refCode="PP-982134"
            iconColor="text-green-600"
            iconBg="bg-green-100"
            statusColor="text-green-700 bg-green-100 border-green-200"
          />
          <Request
            icon={ShoppingBag}
            title="Tư vấn chọn mua Samsung Galaxy S24 Ultra"
            status="Đang xử lý"
            date="15/10/2023"
            refCode="Qua Email"
            iconColor="text-secondary"
            iconBg="bg-secondary/10"
            statusColor="text-blue-700 bg-blue-100 border-blue-200"
          />
          <Request
            icon={MessageSquare}
            title="Góp ý về giao diện ứng dụng (Website)"
            status="Đã tiếp nhận"
            date="18/10/2023"
            iconColor="text-primary"
            iconBg="bg-primary/20"
            statusColor="text-amber-700 bg-amber-100 border-amber-200"
          />
        </div>
      </section>
    </AccountShell>
  );
}

export function LinkedAccountsPage() {
  return (
    <AccountShell
      title="Liên kết tài khoản"
      description="Quản lý các phương thức đăng nhập và bảo mật tài khoản PinkPhone."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LinkedCard
          icon={Phone}
          name="Số điện thoại"
          value="090****567"
          linked
        />
        <LinkedCard
          icon={Mail}
          name="Email"
          value="nguyen***@gmail.com"
          linked
        />
        <LinkedCard
          icon={Link2}
          name="Google"
          value="Liên kết để đăng nhập nhanh chóng"
        />
        <LinkedCard
          icon={Link2}
          name="Facebook"
          value="Kết nối để đăng nhập thuận tiện"
        />
      </div>
      <div className="mt-6 flex gap-3 rounded-2xl border border-primary bg-pink-50 p-5 text-sm leading-6 text-primary">
        <ShieldCheck className="shrink-0" />
        <p>
          <strong>Bảo mật thông tin.</strong> PinkPhone chỉ sử dụng thông tin
          liên kết cho mục đích xác thực đăng nhập và nâng cao trải nghiệm.
        </p>
      </div>
    </AccountShell>
  );
}

export function TermsPage() {
  return (
    <AccountShell
      title="Điều khoản sử dụng"
      description="Cập nhật lần cuối: Ngày 24 tháng 05 năm 2024"
    >
      <Panel className="p-5 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="#purchase"
            className="rounded-xl bg-surface-soft p-4 font-bold text-primary"
          >
            Điều khoản mua hàng
          </a>
          <a
            href="#privacy"
            className="rounded-xl bg-surface-soft p-4 font-bold text-primary"
          >
            Chính sách bảo mật
          </a>
        </div>
        <TermsSection
          number="1"
          id="purchase"
          title="Điều khoản mua hàng trực tuyến"
        >
          <p>
            Chào mừng quý khách đến với hệ thống bán lẻ điện thoại PinkPhone.
            Khi thực hiện giao dịch trên website, quý khách mặc nhiên đồng ý với
            các quy định sau:
          </p>
          <ul>
            <li>Xác nhận đơn hàng qua điện thoại hoặc email.</li>
            <li>
              Giá niêm yết đã bao gồm VAT, chưa bao gồm phí vận chuyển nếu có.
            </li>
            <li>
              Hỗ trợ thanh toán COD, chuyển khoản ngân hàng và ví điện tử.
            </li>
            <li>
              Khách hàng có thể hủy trước khi đơn được bàn giao vận chuyển.
            </li>
          </ul>
        </TermsSection>
        <TermsSection
          number="2"
          id="privacy"
          title="Chính sách bảo mật thông tin"
        >
          <blockquote className="rounded-xl border-l-4 border-primary bg-surface-soft p-4 italic">
            Sự an tâm của khách hàng là ưu tiên số một của PinkPhone.
          </blockquote>
          <p>
            Chúng tôi thu thập thông tin cần thiết để xử lý đơn hàng, cung cấp
            bảo hành, cải thiện trải nghiệm và không chia sẻ ngoài phạm vi vận
            hành dịch vụ.
          </p>
        </TermsSection>
        <TermsSection number="3" id="disputes" title="Giải quyết tranh chấp">
          <p>
            Mọi tranh chấp được ưu tiên giải quyết thông qua thương lượng và hòa
            giải giữa khách hàng với PinkPhone theo quy định pháp luật Việt Nam.
          </p>
        </TermsSection>
        <section className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-primary p-6 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-black">Bạn cần thêm sự hỗ trợ?</h2>
            <p className="mt-1 text-sm text-white/85">
              Đội ngũ pháp lý và chăm sóc khách hàng luôn sẵn sàng.
            </p>
          </div>
          <a
            href="mailto:support@pinkphone.vn"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 font-bold text-primary"
          >
            Gửi email
          </a>
        </section>
      </Panel>
    </AccountShell>
  );
}

export function LogoutConfirmationPage() {
  const navigate = useNavigate();
  return (
    <AccountShell
      title="Xác nhận đăng xuất"
      description="Quản lý hoạt động và quyền lợi thành viên PinkPhone."
    >
      <Panel className="grid min-h-80 place-items-center p-8 text-center">
        <div>
          <LockKeyhole className="mx-auto text-primary" size={40} />
          <h2 className="mt-4 text-xl font-black">Khu vực tài khoản của bạn</h2>
          <p className="mt-2 text-muted">
            Phiên đăng nhập hiện đang hoạt động.
          </p>
        </div>
      </Panel>
      <div className="fixed inset-0 z-[60] grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card"
        >
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-pink-100 text-primary">
            <LogOut size={24} />
          </div>
          <h2 id="logout-title" className="mt-4 text-center text-xl font-black">
            Xác nhận đăng xuất
          </h2>
          <p className="mt-3 text-center text-sm leading-6 text-muted">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản? Phiên làm việc sẽ
            kết thúc ngay lập tức.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate("/tai-khoan")}
              className="min-h-11 rounded-xl bg-neutral-soft font-bold"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => navigate("/dang-nhap")}
              className="min-h-11 rounded-xl bg-primary font-bold text-white"
            >
              Đăng xuất
            </button>
          </div>
        </section>
      </div>
    </AccountShell>
  );
}

function TextField({
  label,
  type = "text",
  defaultValue,
  placeholder,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-12 rounded-xl border border-border px-4 font-normal outline-none focus:border-primary"
      />
    </label>
  );
}
function PasswordField({
  label,
  visible,
  onToggle,
}: {
  label: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <span className="relative">
        <input
          required
          minLength={8}
          type={visible ? "text" : "password"}
          className="min-h-12 w-full rounded-xl border border-border px-4 pr-12 font-normal outline-none focus:border-primary"
          defaultValue="Pink@2024"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}
function Tip({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <Panel className="flex gap-3 p-5">
      <Icon className="shrink-0 text-primary" />
      <div>
        <h2 className="font-extrabold">{title}</h2>
        <p className="mt-1 text-sm text-muted">{text}</p>
      </div>
    </Panel>
  );
}
function Request({
  icon: Icon,
  title,
  status,
  date,
  refCode,
  iconColor,
  iconBg,
  statusColor,
}: {
  icon: LucideIcon;
  title: string;
  status: string;
  date: string;
  refCode?: string;
  iconColor: string;
  iconBg: string;
  statusColor: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
        >
          <Icon size={24} />
        </div>
        <div>
          <h4 className="text-[15px] font-black mb-1.5 text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-4 text-[13px] text-on-surface-variant font-medium">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="opacity-70" />
              {date}
            </span>
            {refCode && (
              <span className="flex items-center gap-1.5">
                <Ticket size={14} className="opacity-70" />
                {refCode}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-transparent border-outline-variant/30">
        <span
          className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${statusColor}`}
        >
          {status}
        </span>
        <button className="text-outline-variant hover:bg-surface-container-low rounded-full p-2 group-hover:text-primary transition-colors cursor-pointer">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
function LinkedCard({
  icon: Icon,
  name,
  value,
  linked,
}: {
  icon: typeof Phone;
  name: string;
  value: string;
  linked?: boolean;
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-11 place-items-center rounded-xl bg-pink-100 text-primary">
          <Icon size={20} />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${linked ? "bg-primary text-white" : "bg-neutral-soft text-muted"}`}
        >
          {linked ? "Đã liên kết" : "Chưa liên kết"}
        </span>
      </div>
      <h2 className="mt-4 text-xl font-black">{name}</h2>
      <p className="mt-1 text-sm text-muted">{value}</p>
      <button
        type="button"
        className={`mt-5 min-h-11 w-full rounded-xl font-bold ${linked ? "bg-pink-100 text-primary" : "bg-primary text-white"}`}
      >
        {linked ? "Hủy liên kết" : "Liên kết ngay"}
      </button>
    </Panel>
  );
}
function TermsSection({
  number,
  id,
  title,
  children,
}: {
  number: string;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-8 scroll-mt-32">
      <h2 className="flex items-center gap-3 text-xl font-black">
        <span className="grid size-8 place-items-center rounded-lg bg-pink-100 text-sm text-primary">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 pl-0 text-sm leading-7 text-muted sm:pl-11 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
