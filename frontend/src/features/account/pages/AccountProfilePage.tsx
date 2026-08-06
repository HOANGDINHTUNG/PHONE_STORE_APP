import React, { useState } from "react";
import { CheckCircle, Edit, Calendar } from "lucide-react";
import { AccountShell } from "../components/AccountShell";

export function AccountProfilePage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <AccountShell title="Thông tin tài khoản">
      <style>{`
        .input-focus-effect:focus {
            border-color: #FFB6C1;
            box-shadow: 0 0 0 4px rgba(255, 182, 193, 0.2);
            outline: none;
        }
      `}</style>

      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl animate-bounce">
          <CheckCircle className="text-green-600" size={20} />
          <span className="text-[14px] font-semibold">Cập nhật thành công</span>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgb(214,51,108,0.08)] p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-[24px] font-semibold text-on-surface mb-1">
            Thông tin tài khoản
          </h1>
          <p className="text-[16px] text-on-surface-variant">
            Quản lý thông tin cá nhân của bạn để bảo mật tài khoản
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8" id="profile-form">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            <div className="relative group self-start">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-fixed shadow-md ring-2 ring-primary/10">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWBRa6pi5-C16cEHYHEFcGwXCS5ZSbeG6tZW-aTnS1ZBlVZc0Z8lVjhJ9GfgeI_3MpRn7bmQjaOdHPishCKIEo_uqsjWihZu2jwTxoELAdFlaXyPUx7sFmdCaWQJdnhwG_rrS6NLyvkk2LuSed3vpcGUDYxkHYrHjHa0lucz3Mg8_Mh0wY17gTKWSuIqnR2V2dxk6TVLjMgH_Yb2i47_kks4D0Z5-geaP5QdFGS7EvYnM2PuvZE5rp"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform"
                title="Thay đổi ảnh đại diện"
              >
                <Edit size={16} />
              </button>
            </div>
            <div>
              <h4 className="text-[14px] font-semibold text-on-surface">
                Ảnh đại diện
              </h4>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">
                Định dạng .JPG, .PNG. Tối đa 5MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-on-surface-variant">
                Họ và tên
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] input-focus-effect transition-all font-medium"
                placeholder="Nhập họ và tên"
                type="text"
                defaultValue="Nguyễn Văn Pink"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-on-surface-variant">
                Ngày sinh
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] input-focus-effect transition-all font-medium appearance-none"
                  type="date"
                  defaultValue="1995-10-20"
                />
                <Calendar
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-on-surface-variant">
                Số điện thoại
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] input-focus-effect transition-all font-medium"
                placeholder="Số điện thoại của bạn"
                type="tel"
                defaultValue="0901234567"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-on-surface-variant">
                Email
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] input-focus-effect transition-all font-medium"
                placeholder="Địa chỉ email"
                type="email"
                defaultValue="contact@pinkphone.vn"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[14px] font-semibold text-on-surface-variant">
                Địa chỉ mặc định
              </label>
              <textarea
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] input-focus-effect transition-all font-medium"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                rows={3}
                defaultValue="123 Đường Sáng Tạo, Phường Công Nghệ, Quận 1, TP. Hồ Chí Minh"
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-4 pt-6 border-t border-outline-variant">
            <button
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-[14px] font-semibold text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95"
              type="button"
            >
              Hủy
            </button>
            <button
              className="w-full sm:w-auto px-10 py-3 bg-primary text-on-primary rounded-xl text-[14px] font-semibold shadow-md hover:bg-secondary active:scale-95 transition-all"
              type="submit"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </AccountShell>
  );
}
