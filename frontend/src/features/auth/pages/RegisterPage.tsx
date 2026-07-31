import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "../../../shared/components/BrandLogo";
import { Button } from "../../../shared/components/Button";
import { FormField } from "../../../shared/components/FormField";
import { AuthShell } from "../components/AuthShell";

import { useStore } from "../../../context/StoreContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const valid =
      form.name.trim() &&
      form.phone.trim() &&
      form.password.length >= 6 &&
      form.password === form.confirmPassword &&
      accepted;
    if (valid) {
      await registerUser({
        fullName: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });
      navigate("/tai-khoan");
    }
  };

  return (
    <AuthShell mode="register">
      <div className="mb-8">
        <BrandLogo />
      </div>
      <h1 className="text-3xl font-extrabold tracking-[-0.035em]">Tạo tài khoản</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Quản lý đơn hàng, lưu sản phẩm yêu thích và nhận ưu đãi dành riêng cho bạn.
      </p>

      <form className="mt-7 grid gap-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="register-name"
          label="Họ và tên"
          icon={<UserRound size={18} />}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          error={submitted && !form.name.trim() ? "Vui lòng nhập họ và tên." : undefined}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="register-phone"
            label="Số điện thoại"
            icon={<Phone size={18} />}
            placeholder="0901 234 567"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            error={submitted && !form.phone.trim() ? "Vui lòng nhập số điện thoại." : undefined}
          />
          <FormField
            id="register-email"
            label="Email (tuỳ chọn)"
            icon={<Mail size={18} />}
            placeholder="name@example.com"
            autoComplete="email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </div>

        <FormField
          id="register-password"
          label="Mật khẩu"
          icon={<LockKeyhole size={18} />}
          placeholder="Ít nhất 8 ký tự"
          autoComplete="new-password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          error={submitted && form.password.length < 8 ? "Mật khẩu cần có ít nhất 8 ký tự." : undefined}
          action={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-muted hover:text-primary"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />

        <div className="h-1.5 overflow-hidden rounded-full bg-surface-soft" aria-label="Độ mạnh mật khẩu">
          <span
            className={`block h-full rounded-full transition-all ${
              form.password.length >= 12
                ? "w-full bg-success"
                : form.password.length >= 8
                  ? "w-2/3 bg-primary"
                  : form.password.length > 0
                    ? "w-1/3 bg-warning"
                    : "w-0"
            }`}
          />
        </div>

        <FormField
          id="register-confirm"
          label="Xác nhận mật khẩu"
          icon={<LockKeyhole size={18} />}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          type={showPassword ? "text" : "password"}
          value={form.confirmPassword}
          onChange={(event) => update("confirmPassword", event.target.value)}
          error={
            submitted && form.password !== form.confirmPassword
              ? "Mật khẩu xác nhận chưa khớp."
              : undefined
          }
        />

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-muted">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>
            Tôi đồng ý với{" "}
            <a href="#terms" className="font-semibold text-primary hover:underline">
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="#privacy" className="font-semibold text-primary hover:underline">
              Chính sách bảo mật
            </a>
            .
          </span>
        </label>
        {submitted && !accepted && (
          <p className="-mt-2 text-xs font-medium text-danger">
            Bạn cần đồng ý với điều khoản để tiếp tục.
          </p>
        )}

        <label className="flex cursor-pointer items-center gap-3 text-sm text-muted">
          <input type="checkbox" className="size-4 accent-primary" />
          Tôi muốn nhận thông tin ưu đãi
        </label>

        <Button type="submit" className="mt-1 w-full">
          Tạo tài khoản
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-muted">
        Bạn đã có tài khoản?{" "}
        <Link to="/dang-nhap" className="font-bold text-primary hover:underline">
          Đăng nhập ngay
        </Link>
      </p>
    </AuthShell>
  );
}
