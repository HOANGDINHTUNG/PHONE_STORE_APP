import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Smartphone,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  requestPasswordResetApi,
  confirmPasswordResetApi,
} from "../../api/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { text: "Chưa nhập", color: "#999", progress: 0 };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score < 3)
      return {
        text: "Yếu (Cần thêm ký tự, số)",
        color: "#ff4d4f",
        progress: 33,
      };
    if (score < 5)
      return { text: "Trung bình", color: "#faad14", progress: 66 };
    return { text: "Mạnh", color: "#52c41a", progress: 100 };
  };

  const strength = getPasswordStrength(newPassword);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg("");
    const response = await requestPasswordResetApi(email);
    setLoading(false);

    if (response.success) {
      setStep(2);
    } else {
      setErrorMsg(
        response.message ||
          "Không thể gửi OTP. Vui lòng kiểm tra lại email hoặc thử lại sau.",
      );
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    const success = await confirmPasswordResetApi(otp, newPassword);
    setLoading(false);

    if (success) {
      alert("Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.");
      navigate("/login");
    } else {
      setErrorMsg("Mã OTP không hợp lệ hoặc đã hết hạn.");
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth > 1024) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        const overlay = document.querySelector("[data-alt]") as HTMLElement;
        if (overlay) {
          overlay.style.transform = `translate(${moveX}px, calc(-50% + ${moveY}px))`;
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-background text-on-surface h-screen overflow-hidden">
      <main className="flex h-full w-full">
        {/* Left Side: Aesthetic Brand Image */}
        <div className="hidden lg:flex w-1/2 relative bg-primary overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
            <div className="flex items-center gap-2">
              <Smartphone
                className="text-on-primary w-10 h-10"
                strokeWidth={1.5}
              />
              <span className="text-headline-md font-bold text-on-primary tracking-tight">
                PinkPhone
              </span>
            </div>

            <div className="max-w-[440px]">
              <h1 className="text-display-lg text-on-primary mb-6 leading-tight font-bold tracking-tight">
                Nâng tầm trải nghiệm công nghệ.
              </h1>
              <p className="text-body-lg text-on-primary/90 opacity-80">
                Khám phá thế giới smartphone đẳng cấp với phong cách riêng biệt
                và dịch vụ tận tâm tại PinkPhone.
              </p>
            </div>

            <div className="flex gap-8 text-on-primary/60 text-label-sm font-semibold">
              <span>© 2026 PinkPhone Retail</span>
              <span className="cursor-pointer hover:text-on-primary transition-colors">
                Bảo mật
              </span>
              <span className="cursor-pointer hover:text-on-primary transition-colors">
                Điều khoản
              </span>
            </div>
          </div>

          <div
            className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[120%] h-[80%] opacity-20 pointer-events-none transition-transform duration-75"
            data-alt="Aesthetic product background"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBvxuDe1fKltqt5Unt8jeHsVLSQVhj6DufGaKK8QLKRTysUoUBZzgJuwQwStR1dyWPlcXbuclbDe0tKtq0xSCRGQh2FWk7kg66SM8Wty6gI_GErxK88PkErseLSQ8E1GpUK9lREQFoomi0dNFVqrZV1vAxzeZT-wIijZLwN4HuYPsumU7LNOySTEKHSKTgYAhjRU5YzqmPjYye6OwT7XuiHLEf5KKH-5FtuZqZLgQMAcTgTJOlT5z4')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* Right Side: Reset Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-surface">
          <div className="w-full max-w-[440px] flex flex-col space-y-8">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <Smartphone className="text-primary w-9 h-9" strokeWidth={1.5} />
              <span className="text-headline-md font-bold text-primary tracking-tight">
                PinkPhone
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl lg:text-headline-md font-bold text-on-surface">
                Khôi phục mật khẩu
              </h2>
              <p className="text-body-md text-on-surface-variant">
                {step === 1 &&
                  "Nhập email của bạn để nhận mã xác nhận OTP. Chúng tôi sẽ gửi một mã an toàn tới hộp thư của bạn."}
                {step === 2 &&
                  "Mã xác nhận gồm 6 chữ số đã được gửi đến email của bạn. Vui lòng nhập mã để tiếp tục."}
                {step === 3 &&
                  "Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn."}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {step === 1 && (
              <form className="space-y-6" onSubmit={handleRequestOtp}>
                <div className="space-y-2">
                  <label
                    className="text-label-sm font-semibold text-on-surface-variant ml-1"
                    htmlFor="email"
                  >
                    Địa chỉ Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-on-surface-variant">
                      <Mail size={20} />
                    </div>
                    <input
                      className="block w-full pl-11 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-on-surface-variant/40"
                      id="email"
                      name="email"
                      placeholder="example@email.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-primary text-on-primary py-4 px-6 rounded-xl text-label-sm font-semibold flex items-center justify-center gap-2 hover:bg-secondary active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-80 disabled:cursor-not-allowed"
                  type="submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>Nhận Mã OTP</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (otp.length === 6) setStep(3);
                  else setErrorMsg("Vui lòng nhập đủ 6 chữ số Mã OTP");
                }}
              >
                <div className="space-y-2">
                  <label
                    className="text-label-sm font-semibold text-on-surface-variant ml-1"
                    htmlFor="otp"
                  >
                    Mã OTP (6 chữ số)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-on-surface-variant">
                      <KeyRound size={20} />
                    </div>
                    <input
                      className="block w-full pl-11 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-on-surface-variant/40 text-center tracking-widest text-lg font-bold font-mono"
                      id="otp"
                      name="otp"
                      placeholder="123456"
                      maxLength={6}
                      required
                      autoComplete="off"
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                </div>

                <button
                  className="w-full bg-primary text-on-primary py-4 px-6 rounded-xl text-label-sm font-semibold flex items-center justify-center gap-2 hover:bg-secondary active:scale-[0.98] transition-all duration-200 shadow-sm"
                  type="submit"
                >
                  <span>Tiếp tục thiết lập Mật khẩu</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {step === 3 && (
              <form className="space-y-6" onSubmit={handleConfirmReset}>
                <div className="space-y-2">
                  <label
                    className="text-label-sm font-semibold text-on-surface-variant ml-1"
                    htmlFor="password"
                  >
                    Mật khẩu mới
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-on-surface-variant">
                      <Lock size={20} />
                    </div>
                    <input
                      className="block w-full pl-11 pr-12 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-on-surface-variant/40"
                      id="password"
                      name="password"
                      placeholder="Nhập mật khẩu mới"
                      required
                      autoComplete="new-password"
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="pt-1 pb-2">
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-on-surface-variant">
                          Độ bảo mật:
                        </span>
                        <span style={{ color: strength.color }}>
                          {strength.text}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300 rounded-full"
                          style={{
                            width: `${strength.progress}%`,
                            backgroundColor: strength.color,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-label-sm font-semibold text-on-surface-variant ml-1"
                    htmlFor="confirmPassword"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-on-surface-variant">
                      <Lock size={20} />
                    </div>
                    <input
                      className="block w-full pl-11 pr-12 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-on-surface-variant/40"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      autoComplete="new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-surface-container-highest text-on-surface-variant py-4 px-6 rounded-xl text-label-sm font-semibold flex items-center justify-center hover:bg-outline-variant transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    disabled={loading}
                    className="w-2/3 bg-primary text-on-primary py-4 px-6 rounded-xl text-label-sm font-semibold flex items-center justify-center gap-2 hover:bg-secondary active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-80 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <span>Khôi Phục Mật Khẩu</span>
                        <CheckCircle size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Secondary Actions */}
            <div className="pt-4 flex flex-col items-center gap-4">
              <Link
                to="/login"
                className="group flex items-center gap-2 text-label-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200"
              >
                <ArrowLeft size={18} />
                <span>Quay lại Đăng nhập</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
