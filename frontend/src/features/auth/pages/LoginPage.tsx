import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "../../../shared/components/BrandLogo";
import { Button } from "../../../shared/components/Button";
import { FormField } from "../../../shared/components/FormField";
import { AuthShell } from "../components/AuthShell";

import { useStore } from "../../../context/StoreContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (email.trim() && password.length >= 6) {
      await login(email, password);
      navigate("/tai-khoan");
    }
  };

  return (
    <AuthShell mode="login">
      <div className="mb-10 lg:hidden">
        <BrandLogo />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Xin chào bạn
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-foreground">
          Đăng nhập tài khoản
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Theo dõi đơn hàng, lưu sản phẩm yêu thích và mua sắm thuận tiện hơn.
        </p>
      </div>

      <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
        <FormField
          id="login-email"
          label="Email hoặc số điện thoại"
          icon={<Mail size={19} />}
          placeholder="name@example.com"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={submitted && !email.trim() ? "Vui lòng nhập email hoặc số điện thoại." : undefined}
        />

        <FormField
          id="login-password"
          label="Mật khẩu"
          icon={<LockKeyhole size={19} />}
          placeholder="Ít nhất 6 ký tự"
          autoComplete="current-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={submitted && password.length < 6 ? "Mật khẩu cần có ít nhất 6 ký tự." : undefined}
          action={
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-strong"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-muted">
            <input
              type="checkbox"
              className="size-4 rounded border-border accent-primary"
            />
            Ghi nhớ đăng nhập
          </label>
          <a href="#forgot-password" className="font-semibold text-primary underline-offset-4 hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <Button type="submit" className="w-full">
          Đăng nhập
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
        <span className="h-px flex-1 bg-border" />
        Hoặc tiếp tục với
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" aria-label="Tiếp tục với Google">
          <span className="font-extrabold text-[#4285F4]">G</span>
          Google
        </Button>
        <Button variant="outline" aria-label="Tiếp tục với Facebook">
          <span className="grid size-5 place-items-center rounded-full bg-[#1877F2] text-xs font-extrabold text-white">
            f
          </span>
          Facebook
        </Button>
      </div>

      <p className="mt-9 text-center text-sm text-muted">
        Bạn chưa có tài khoản?{" "}
        <Link to="/dang-ky" className="font-bold text-primary underline-offset-4 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </AuthShell>
  );
}
