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
    <AccountShell
      title="Thông tin tài khoản"
      description="Quản lý thông tin cá nhân của bạn để bảo mật tài khoản"
    >
      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl animate-bounce">
          <CheckCircle className="text-green-600" size={20} />
          <span className="text-sm font-semibold">Cập nhật thành công</span>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6 mb-8 mt-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-fixed shadow-md ring-2 ring-primary/10">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2bZvDn7uo1TgAlkFmJk00vw6AuxmZ40QUMAn_UPm0a1H-Hq_ZYxzNFaG_MjqM7J40FyU8e7DV2UB8Dik856Q4NXcU7iGHZaVCVsIAn3blHCLnBH2woxe_KByenZffilHHn2nBk3bRg90EBDpt6iylqpJjChx9BkvtQiLH-gWByqwfKzlW3GujzVzlrUxOSS7vnCAe_sHIiXGCWO6CjJ37CV55zAS_bDRGVbANNJ66M9ipptYRcmdJ"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform"
                title="Thay đổi ảnh đại diện"
              >
                <Edit size={14} />
              </button>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-on-surface">
                Ảnh đại diện
              </h4>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">
                Định dạng .JPG, .PNG. Tối đa 5MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">
                Họ và tên
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base outline-none focus:border-primary-fixed-dim focus:ring-4 focus:ring-primary-fixed-dim/20 transition-all font-medium"
                placeholder="Nhập họ và tên"
                type="text"
                defaultValue="Nguyễn Minh Anh"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">
                Ngày sinh
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base outline-none focus:border-primary-fixed-dim focus:ring-4 focus:ring-primary-fixed-dim/20 transition-all appearance-none font-medium"
                  type="date"
                  defaultValue="1995-10-20"
                />
                <Calendar
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">
                Giới tính
              </label>
              <div className="flex items-center gap-6 flex-wrap py-2 md:py-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 transition-all"
                    name="gender"
                    type="radio"
                    value="male"
                  />
                  <span className="text-base font-medium text-on-surface group-hover:text-primary transition-colors">
                    Nam
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 transition-all"
                    name="gender"
                    type="radio"
                    value="female"
                    defaultChecked
                  />
                  <span className="text-base font-medium text-on-surface group-hover:text-primary transition-colors">
                    Nữ
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 transition-all"
                    name="gender"
                    type="radio"
                    value="other"
                  />
                  <span className="text-base font-medium text-on-surface group-hover:text-primary transition-colors">
                    Khác
                  </span>
                </label>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">
                Số điện thoại
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base outline-none focus:border-primary-fixed-dim focus:ring-4 focus:ring-primary-fixed-dim/20 transition-all font-medium"
                placeholder="Số điện thoại của bạn"
                type="tel"
                defaultValue="098***4567"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">
                Email
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base outline-none focus:border-primary-fixed-dim focus:ring-4 focus:ring-primary-fixed-dim/20 transition-all font-medium"
                placeholder="Địa chỉ email"
                type="email"
                defaultValue="contact@pinkphone.vn"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">
                Địa chỉ mặc định
              </label>
              <textarea
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base outline-none focus:border-primary-fixed-dim focus:ring-4 focus:ring-primary-fixed-dim/20 transition-all font-medium min-h-[100px]"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                rows={3}
                defaultValue="123 Đường Sáng Tạo, Phường Công Nghệ, Quận 1, TP. Hồ Chí Minh"
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-4 pt-6 border-t border-border">
            <button
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95"
              type="button"
            >
              Hủy
            </button>
            <button
              className="w-full sm:w-auto px-10 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-secondary active:scale-95 transition-all"
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
