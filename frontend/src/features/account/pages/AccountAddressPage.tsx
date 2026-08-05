import { useState } from "react";
import { AccountShell } from "../components/AccountShell";
import { Plus, Edit, Trash2, MapPin, Phone } from "lucide-react";

export function AccountAddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AccountShell
        title="Sổ địa chỉ"
        description="Quản lý địa chỉ nhận hàng để thanh toán nhanh chóng và tiện lợi hơn."
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-headline-md font-headline-md text-on-background font-bold">
            Sổ địa chỉ
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-secondary text-on-primary px-6 py-2 rounded-full text-label-sm font-label-sm shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus size={18} />
            Thêm địa chỉ mới
          </button>
        </div>

        {/* Address Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Default Address Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[12px] font-semibold px-3 py-1 rounded-bl-lg">
              Mặc định
            </div>
            <div className="mb-4 pr-12">
              <h3 className="text-body-lg font-body-lg font-bold text-on-background mb-1">
                Nguyễn Văn A
              </h3>
              <p className="text-on-surface-variant flex items-center gap-1.5 text-[14px]">
                <Phone size={16} />
                090 123 4567
              </p>
            </div>

            <div className="mb-6">
              <p className="text-on-surface-variant text-[14px] leading-relaxed flex items-start gap-1.5">
                <MapPin size={16} className="mt-[2px] text-primary shrink-0" />
                <span>
                  Số 123 Đường Lê Lợi, Phường Bến Thành,
                  <br />
                  Quận 1, Thành phố Hồ Chí Minh
                </span>
              </p>
            </div>

            <div className="flex gap-4 border-t border-outline-variant/30 pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary hover:text-secondary text-[14px] font-semibold transition-colors flex items-center gap-1.5"
              >
                <Edit size={16} /> Chỉnh sửa
              </button>
              <button className="text-outline hover:text-error text-[14px] font-semibold transition-colors flex items-center gap-1.5">
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>

          {/* Secondary Address Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="mb-4 pr-12">
              <h3 className="text-body-lg font-body-lg font-bold text-on-background mb-1">
                Công ty XYZ (Văn phòng)
              </h3>
              <p className="text-on-surface-variant flex items-center gap-1.5 text-[14px]">
                <Phone size={16} />
                098 765 4321
              </p>
            </div>

            <div className="mb-6">
              <p className="text-on-surface-variant text-[14px] leading-relaxed flex items-start gap-1.5">
                <MapPin size={16} className="mt-[2px] text-outline shrink-0" />
                <span>
                  Tòa nhà A, 456 Đường Nguyễn Văn Linh, Phường Tân Phong,
                  <br />
                  Quận 7, Thành phố Hồ Chí Minh
                </span>
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-outline-variant/30 pt-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary hover:text-secondary text-[14px] font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Edit size={16} /> Chỉnh sửa
                </button>
                <button className="text-outline hover:text-error text-[14px] font-semibold transition-colors flex items-center gap-1.5">
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
              <button className="text-primary text-[12px] font-medium px-3 py-1 border border-primary/30 rounded-full hover:bg-primary-fixed transition-colors">
                Đặt mặc định
              </button>
            </div>
          </div>
        </div>
      </AccountShell>

      {/* Add/Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-on-background/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant/30 shrink-0">
              <h2 className="text-headline-md font-headline-md text-on-background font-bold">
                Thêm địa chỉ mới
              </h2>
              <button
                className="text-on-surface-variant hover:text-primary transition-colors p-1"
                onClick={() => setIsModalOpen(false)}
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 text-[14px] font-bold text-primary mb-1">
                  Thông tin liên hệ
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-on-surface mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/30 transition-all text-on-surface"
                    placeholder="Nhập họ và tên"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-on-surface mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/30 transition-all text-on-surface"
                    placeholder="Nhập số điện thoại"
                    type="tel"
                  />
                </div>

                <div className="md:col-span-2 text-[14px] font-bold text-primary mt-2 mb-1">
                  Địa chỉ giao hàng
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[14px] font-medium text-on-surface mb-1.5">
                      Tỉnh/Thành phố
                    </label>
                    <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/30 text-on-surface font-medium">
                      <option disabled selected value="">
                        Chọn Tỉnh/Thành
                      </option>
                      <option>Hà Nội</option>
                      <option>Hồ Chí Minh</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-on-surface mb-1.5">
                      Quận/Huyện
                    </label>
                    <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/30 text-on-surface font-medium">
                      <option disabled selected value="">
                        Chọn Quận/Huyện
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-on-surface mb-1.5">
                      Phường/Xã
                    </label>
                    <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/30 text-on-surface font-medium">
                      <option disabled selected value="">
                        Chọn Phường/Xã
                      </option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 mt-1">
                  <label className="block text-[14px] font-medium text-on-surface mb-1.5">
                    Địa chỉ cụ thể (Số nhà, tên đường)
                  </label>
                  <input
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/30 transition-all text-on-surface"
                    placeholder="VD: Số 10, Ngõ 123 Đường ABC"
                    type="text"
                  />
                </div>

                <div className="md:col-span-2 mt-2 flex items-center gap-3">
                  <input
                    className="w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface cursor-pointer"
                    id="default-address"
                    type="checkbox"
                  />
                  <label
                    className="text-[14px] font-medium text-on-surface-variant cursor-pointer select-none"
                    htmlFor="default-address"
                  >
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-outline-variant/30 flex justify-end gap-4 bg-surface-container-low rounded-b-xl shrink-0">
              <button
                className="px-6 py-2.5 rounded-full text-primary hover:bg-primary-fixed transition-colors text-label-sm font-bold"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button className="bg-primary hover:bg-secondary text-on-primary px-8 py-2.5 rounded-full text-label-sm font-bold shadow-sm transition-all active:scale-95">
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
