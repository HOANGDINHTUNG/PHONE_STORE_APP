import { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";

export function AccountInformationPage() {
  const [saved, setSaved] = useState(false);
  return (
    <AccountShell title="Thông tin tài khoản" description="Quản lý thông tin cá nhân và địa chỉ mặc định của bạn.">
      {saved && <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-success"><CheckCircle2 size={18} /> Cập nhật thông tin thành công.</div>}
      <Panel className="p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="relative grid size-20 place-items-center rounded-full bg-surface-soft text-2xl font-black text-primary">
            MA
            <button type="button" className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-primary text-white" aria-label="Thay ảnh đại diện"><Camera size={15} /></button>
          </div>
          <div><h2 className="font-extrabold">Ảnh đại diện</h2><p className="mt-1 text-xs text-muted">Định dạng JPG, PNG. Tối đa 5MB.</p></div>
        </div>
        <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
          <TextField label="Họ và tên" defaultValue="Nguyễn Minh Anh" />
          <TextField label="Ngày sinh" defaultValue="20/10/1995" type="date" />
          <TextField label="Số điện thoại" defaultValue="0901234567" />
          <TextField label="Email" defaultValue="minhanh@pinkphone.vn" type="email" />
          <label className="grid gap-2 text-sm font-bold sm:col-span-2">Địa chỉ mặc định<textarea className="min-h-28 rounded-xl border border-border p-4 font-normal outline-none focus:border-primary" defaultValue="123 Đường Sáng Tạo, Phường Công Nghệ, Quận 1, TP. Hồ Chí Minh" /></label>
          <div className="flex justify-end gap-3 border-t border-border pt-5 sm:col-span-2"><button type="reset" className="min-h-11 px-5 font-bold text-muted">Hủy</button><button type="submit" className="min-h-11 rounded-xl bg-primary px-6 font-bold text-white">Lưu thay đổi</button></div>
        </form>
      </Panel>
    </AccountShell>
  );
}

export function ChangePasswordPage() {
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  return (
    <AccountShell title="Đổi mật khẩu" description="Sử dụng mật khẩu mạnh và không dùng chung với các tài khoản khác.">
      {success && <div role="status" className="mb-5 flex items-center gap-2 rounded-xl bg-primary p-4 text-sm font-bold text-white"><CheckCircle2 size={18} /> Đổi mật khẩu thành công.</div>}
      <Panel className="p-5 sm:p-7">
        <form className="max-w-xl space-y-5" onSubmit={(event) => { event.preventDefault(); setSuccess(true); }}>
          <PasswordField label="Mật khẩu hiện tại" visible={visible} onToggle={() => setVisible(!visible)} />
          <PasswordField label="Mật khẩu mới" visible={visible} onToggle={() => setVisible(!visible)} />
          <div><div className="flex justify-between text-xs"><span>Độ mạnh mật khẩu</span><strong className="text-warning">Trung bình</strong></div><div className="mt-2 h-2 rounded-full bg-neutral-soft"><div className="h-full w-2/3 rounded-full bg-warning" /></div></div>
          <PasswordField label="Xác nhận mật khẩu mới" visible={visible} onToggle={() => setVisible(!visible)} />
          <button type="submit" className="min-h-12 rounded-xl bg-primary px-7 font-bold text-white">Đổi mật khẩu</button>
        </form>
      </Panel>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Tip icon={ShieldCheck} title="Bảo mật hai lớp" text="Bật xác minh qua số điện thoại mỗi khi đăng nhập." />
        <Tip icon={KeyRound} title="Mật khẩu an toàn" text="Nên gồm chữ cái viết hoa, số và ký tự đặc biệt." />
      </div>
    </AccountShell>
  );
}

export function SupportPage() {
  const [sent, setSent] = useState(false);
  return (
    <AccountShell title="Góp ý & Hỗ trợ" description="Chúng tôi luôn lắng nghe để cải thiện trải nghiệm của bạn.">
      <section className="mb-5 rounded-2xl bg-primary p-6 text-white"><MessageCircleQuestion size={28} /><h2 className="mt-3 text-xl font-black">PinkPhone luôn sẵn sàng hỗ trợ</h2><p className="mt-2 text-sm text-white/85">Phản hồi trong vòng 24 giờ qua điện thoại hoặc email.</p></section>
      {sent && <div role="status" className="mb-5 rounded-xl bg-green-50 p-4 text-sm font-bold text-success">Yêu cầu đã được gửi thành công.</div>}
      <Panel className="p-5 sm:p-7">
        <h2 className="text-xl font-black text-primary">Gửi yêu cầu mới</h2>
        <form className="mt-5 grid gap-5 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
          <label className="grid gap-2 text-sm font-bold">Chọn chủ đề<select className="min-h-12 rounded-xl border border-border bg-white px-4 font-normal"><option>Tư vấn mua điện thoại</option><option>Bảo hành</option><option>Đơn hàng</option></select></label>
          <TextField label="Mã đơn hàng (không bắt buộc)" placeholder="Ví dụ: PP-123456" />
          <label className="grid gap-2 text-sm font-bold sm:col-span-2">Nội dung chi tiết<textarea required className="min-h-32 rounded-xl border border-border p-4 font-normal outline-none focus:border-primary" placeholder="Vui lòng mô tả chi tiết vấn đề..." /></label>
          <button type="button" className="flex min-h-28 items-center justify-center gap-2 rounded-xl border border-dashed border-primary bg-surface-soft text-sm font-bold text-primary sm:col-span-2"><Upload size={19} /> Đính kèm hình ảnh</button>
          <TextField label="Số điện thoại liên hệ" placeholder="09xx xxx xxx" />
          <TextField label="Email nhận phản hồi" type="email" placeholder="example@pinkphone.vn" />
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-bold text-white sm:col-start-2"><Send size={18} /> Gửi yêu cầu</button>
        </form>
      </Panel>
      <h2 className="mt-7 text-xl font-black">Yêu cầu đã gửi gần đây</h2>
      <div className="mt-4 space-y-3">
        <Request icon={Phone} title="Lỗi màn hình iPhone 15 Pro Max" status="Hoàn thành" />
        <Request icon={Smartphone} title="Tư vấn chọn Samsung Galaxy S24 Ultra" status="Đang xử lý" />
        <Request icon={FileImage} title="Góp ý về giao diện website" status="Đã tiếp nhận" />
      </div>
    </AccountShell>
  );
}

export function LinkedAccountsPage() {
  return (
    <AccountShell title="Liên kết tài khoản" description="Quản lý các phương thức đăng nhập và bảo mật tài khoản PinkPhone.">
      <div className="grid gap-4 sm:grid-cols-2">
        <LinkedCard icon={Phone} name="Số điện thoại" value="090****567" linked />
        <LinkedCard icon={Mail} name="Email" value="nguyen***@gmail.com" linked />
        <LinkedCard icon={Link2} name="Google" value="Liên kết để đăng nhập nhanh chóng" />
        <LinkedCard icon={Link2} name="Facebook" value="Kết nối để đăng nhập thuận tiện" />
      </div>
      <div className="mt-6 flex gap-3 rounded-2xl border border-primary bg-pink-50 p-5 text-sm leading-6 text-primary">
        <ShieldCheck className="shrink-0" /><p><strong>Bảo mật thông tin.</strong> PinkPhone chỉ sử dụng thông tin liên kết cho mục đích xác thực đăng nhập và nâng cao trải nghiệm.</p>
      </div>
    </AccountShell>
  );
}

export function TermsPage() {
  return (
    <AccountShell title="Điều khoản sử dụng" description="Cập nhật lần cuối: Ngày 24 tháng 05 năm 2024">
      <Panel className="p-5 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <a href="#purchase" className="rounded-xl bg-surface-soft p-4 font-bold text-primary">Điều khoản mua hàng</a>
          <a href="#privacy" className="rounded-xl bg-surface-soft p-4 font-bold text-primary">Chính sách bảo mật</a>
        </div>
        <TermsSection number="1" id="purchase" title="Điều khoản mua hàng trực tuyến">
          <p>Chào mừng quý khách đến với hệ thống bán lẻ điện thoại PinkPhone. Khi thực hiện giao dịch trên website, quý khách mặc nhiên đồng ý với các quy định sau:</p>
          <ul><li>Xác nhận đơn hàng qua điện thoại hoặc email.</li><li>Giá niêm yết đã bao gồm VAT, chưa bao gồm phí vận chuyển nếu có.</li><li>Hỗ trợ thanh toán COD, chuyển khoản ngân hàng và ví điện tử.</li><li>Khách hàng có thể hủy trước khi đơn được bàn giao vận chuyển.</li></ul>
        </TermsSection>
        <TermsSection number="2" id="privacy" title="Chính sách bảo mật thông tin">
          <blockquote className="rounded-xl border-l-4 border-primary bg-surface-soft p-4 italic">Sự an tâm của khách hàng là ưu tiên số một của PinkPhone.</blockquote>
          <p>Chúng tôi thu thập thông tin cần thiết để xử lý đơn hàng, cung cấp bảo hành, cải thiện trải nghiệm và không chia sẻ ngoài phạm vi vận hành dịch vụ.</p>
        </TermsSection>
        <TermsSection number="3" id="disputes" title="Giải quyết tranh chấp">
          <p>Mọi tranh chấp được ưu tiên giải quyết thông qua thương lượng và hòa giải giữa khách hàng với PinkPhone theo quy định pháp luật Việt Nam.</p>
        </TermsSection>
        <section className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-primary p-6 text-white sm:flex-row sm:items-center">
          <div><h2 className="text-xl font-black">Bạn cần thêm sự hỗ trợ?</h2><p className="mt-1 text-sm text-white/85">Đội ngũ pháp lý và chăm sóc khách hàng luôn sẵn sàng.</p></div>
          <a href="mailto:support@pinkphone.vn" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 font-bold text-primary">Gửi email</a>
        </section>
      </Panel>
    </AccountShell>
  );
}

export function LogoutConfirmationPage() {
  const navigate = useNavigate();
  return (
    <AccountShell title="Xác nhận đăng xuất" description="Quản lý hoạt động và quyền lợi thành viên PinkPhone.">
      <Panel className="grid min-h-80 place-items-center p-8 text-center"><div><LockKeyhole className="mx-auto text-primary" size={40} /><h2 className="mt-4 text-xl font-black">Khu vực tài khoản của bạn</h2><p className="mt-2 text-muted">Phiên đăng nhập hiện đang hoạt động.</p></div></Panel>
      <div className="fixed inset-0 z-[60] grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
        <section role="dialog" aria-modal="true" aria-labelledby="logout-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-pink-100 text-primary"><LogOut size={24} /></div>
          <h2 id="logout-title" className="mt-4 text-center text-xl font-black">Xác nhận đăng xuất</h2>
          <p className="mt-3 text-center text-sm leading-6 text-muted">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản? Phiên làm việc sẽ kết thúc ngay lập tức.</p>
          <div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => navigate("/tai-khoan")} className="min-h-11 rounded-xl bg-neutral-soft font-bold">Hủy</button><button type="button" onClick={() => navigate("/dang-nhap")} className="min-h-11 rounded-xl bg-primary font-bold text-white">Đăng xuất</button></div>
        </section>
      </div>
    </AccountShell>
  );
}

function TextField({ label, type = "text", defaultValue, placeholder }: { label: string; type?: string; defaultValue?: string; placeholder?: string }) {
  return <label className="grid gap-2 text-sm font-bold">{label}<input type={type} defaultValue={defaultValue} placeholder={placeholder} className="min-h-12 rounded-xl border border-border px-4 font-normal outline-none focus:border-primary" /></label>;
}
function PasswordField({ label, visible, onToggle }: { label: string; visible: boolean; onToggle: () => void }) {
  return <label className="grid gap-2 text-sm font-bold">{label}<span className="relative"><input required minLength={8} type={visible ? "text" : "password"} className="min-h-12 w-full rounded-xl border border-border px-4 pr-12 font-normal outline-none focus:border-primary" defaultValue="Pink@2024" /><button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>;
}
function Tip({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return <Panel className="flex gap-3 p-5"><Icon className="shrink-0 text-primary" /><div><h2 className="font-extrabold">{title}</h2><p className="mt-1 text-sm text-muted">{text}</p></div></Panel>;
}
function Request({ icon: Icon, title, status }: { icon: typeof Phone; title: string; status: string }) {
  return <Panel className="flex items-center gap-4 p-4"><div className="grid size-11 place-items-center rounded-xl bg-surface-soft text-primary"><Icon size={19} /></div><div className="min-w-0 flex-1"><h3 className="truncate font-bold">{title}</h3><p className="mt-1 text-xs text-muted"><CalendarDays className="mr-1 inline" size={12} /> 12/10/2024</p></div><span className="rounded-full bg-neutral-soft px-3 py-1 text-xs font-bold">{status}</span></Panel>;
}
function LinkedCard({ icon: Icon, name, value, linked }: { icon: typeof Phone; name: string; value: string; linked?: boolean }) {
  return <Panel className="p-5"><div className="flex items-start justify-between gap-3"><div className="grid size-11 place-items-center rounded-xl bg-pink-100 text-primary"><Icon size={20} /></div><span className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${linked ? "bg-primary text-white" : "bg-neutral-soft text-muted"}`}>{linked ? "Đã liên kết" : "Chưa liên kết"}</span></div><h2 className="mt-4 text-xl font-black">{name}</h2><p className="mt-1 text-sm text-muted">{value}</p><button type="button" className={`mt-5 min-h-11 w-full rounded-xl font-bold ${linked ? "bg-pink-100 text-primary" : "bg-primary text-white"}`}>{linked ? "Hủy liên kết" : "Liên kết ngay"}</button></Panel>;
}
function TermsSection({ number, id, title, children }: { number: string; id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="mt-8 scroll-mt-32"><h2 className="flex items-center gap-3 text-xl font-black"><span className="grid size-8 place-items-center rounded-lg bg-pink-100 text-sm text-primary">{number}</span>{title}</h2><div className="mt-4 space-y-4 pl-0 text-sm leading-7 text-muted sm:pl-11 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">{children}</div></section>;
}
