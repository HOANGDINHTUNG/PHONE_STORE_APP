import { Button, Form, Input, message } from "antd";
import { LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

type AdminLoginValues = {
  username: string;
  password: string;
};

export function AdminLoginPage() {
  const { login, logout } = useStore();
  const navigate = useNavigate();

  const onFinish = async ({ username, password }: AdminLoginValues) => {
    const loggedUser = await login(username, password, true);

    if (!loggedUser) {
      message.error("Thông tin đăng nhập không chính xác.");
      return;
    }

    if (loggedUser.role !== "ADMIN") {
      await logout();
      message.error("Tài khoản này không có quyền truy cập khu vực quản trị.");
      return;
    }

    message.success("Đăng nhập quản trị thành công.");
    navigate("/admin", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#fff8fa] p-5 sm:p-10 flex items-center justify-center">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#f1d4df] bg-white shadow-[0_24px_70px_rgba(126,12,58,0.13)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden min-h-[620px] flex-col justify-between bg-gradient-to-br from-[#c2185b] via-[#df2f71] to-[#7f0b3b] p-12 text-white lg:flex">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-xl font-extrabold tracking-tight">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#c2185b]">
                <ShieldCheck size={25} />
              </span>
              PinkPhone Admin
            </Link>
            <p className="mt-16 w-full max-w-[400px] text-4xl font-black leading-tight">
              Quản trị vận hành cửa hàng trong một không gian.
            </p>
            <p className="mt-5 w-full max-w-[400px] text-sm leading-6 text-white/80">
              Theo dõi đơn hàng, tồn kho, doanh thu và hoạt động nội bộ theo thời gian thực.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm text-white/85 backdrop-blur">
            Khu vực này chỉ dành cho nhân sự được cấp quyền quản trị.
          </div>
        </div>

        <div className="flex min-h-[620px] items-center p-7 sm:p-12">
          <div className="w-full">
            <div className="mb-10 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-[#c2185b]">
                <ShieldCheck size={24} /> PinkPhone Admin
              </Link>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff0f5] px-3 py-1.5 text-xs font-bold text-[#c2185b]">
              <LockKeyhole size={14} /> CỔNG QUẢN TRỊ
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">Đăng nhập quản trị</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Dùng tài khoản quản trị được cấp để tiếp tục vào hệ thống PinkPhone.
            </p>

            <Form<AdminLoginValues> layout="vertical" requiredMark={false} className="mt-8" onFinish={onFinish}>
              <Form.Item
                label="Tên đăng nhập hoặc email"
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập hoặc email." }]}
              >
                <Input size="large" prefix={<UserRound size={17} className="mr-1 text-slate-400" />} placeholder="admin" autoComplete="username" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
              >
                <Input.Password size="large" prefix={<LockKeyhole size={17} className="mr-1 text-slate-400" />} placeholder="Nhập mật khẩu" autoComplete="current-password" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" block className="mt-2 h-11 font-bold">
                Đăng nhập quản trị
              </Button>
            </Form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Bạn muốn mua sắm? <Link className="font-bold text-[#c2185b]" to="/login">Đăng nhập khách hàng</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
