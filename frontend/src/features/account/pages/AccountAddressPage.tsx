import { useState } from "react";
import { AccountShell } from "../components/AccountShell";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Smartphone,
  CheckCircle,
  Compass,
} from "lucide-react";

export function AccountAddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AccountShell title="Sổ địa chỉ">
        <style>{`
          html { scroll-behavior: smooth; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0bec4; border-radius: 10px; }
        `}</style>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              Sổ địa chỉ của bạn
            </h1>
            <p className="text-on-surface-variant font-body-md mt-1">
              Quản lý các địa chỉ nhận hàng để thanh toán nhanh chóng hơn.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-secondary transition-all shadow-md active:scale-95 group"
          >
            <Plus
              className="group-hover:rotate-90 transition-transform"
              size={20}
            />
            Thêm địa chỉ mới
          </button>
        </div>

        {/* Address Bento Grid / List */}
        <div className="grid grid-cols-1 gap-6">
          {/* Default Address Card */}
          <div className="bg-surface-container-lowest border-2 border-primary p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-on-primary px-4 py-1 rounded-bl-xl font-semibold flex items-center gap-1.5 text-[14px]">
                <CheckCircle size={16} className="fill-primary text-white" />
                Mặc định
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3 pt-2 md:pt-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[20px] font-bold text-on-surface line-clamp-1">
                    Nguyễn Minh Anh
                  </h2>
                  <span className="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Cá nhân
                  </span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant text-[16px]">
                  <Smartphone size={18} className="text-primary shrink-0" />
                  <span>0987 654 321</span>
                </div>
                <div className="flex items-start gap-3 text-on-surface-variant text-[16px]">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Số 123, Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí
                    Minh
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap md:flex-col gap-2 min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/30 text-[14px]">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-on-surface-variant font-bold border border-outline-variant rounded-lg hover:bg-surface-container transition-all active:scale-95"
                >
                  <Edit size={16} /> Chỉnh sửa
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-error font-bold border border-error/20 rounded-lg hover:bg-error-container transition-all active:scale-95">
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Address Cards */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-[20px] font-bold text-on-surface line-clamp-1">
                    Trần Thị Bích Ngọc
                  </h2>
                  <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Văn phòng
                  </span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant text-[16px]">
                  <Smartphone size={18} className="shrink-0" />
                  <span>0901 234 567</span>
                </div>
                <div className="flex items-start gap-3 text-on-surface-variant text-[16px]">
                  <MapPin size={18} className="shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Tòa nhà Landmark 81, Vinhomes Central Park, Quận Bình Thạnh,
                    TP. Hồ Chí Minh
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap md:flex-col gap-2 min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                <button className="flex-1 px-4 py-2 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-primary-fixed-dim/30 transition-all active:scale-95 text-[14px]">
                  Đặt làm mặc định
                </button>
                <div className="flex gap-2 w-full text-[14px]">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-on-surface-variant font-bold border border-outline-variant rounded-lg hover:bg-surface-container transition-all active:scale-95"
                  >
                    <Edit size={16} /> Sửa
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-error font-bold border border-error/20 rounded-lg hover:bg-error-container transition-all active:scale-95">
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-[20px] font-bold text-on-surface line-clamp-1">
                    Hoàng Văn Nam
                  </h2>
                  <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Nhà riêng
                  </span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant text-[16px]">
                  <Smartphone size={18} className="shrink-0" />
                  <span>0912 345 678</span>
                </div>
                <div className="flex items-start gap-3 text-on-surface-variant text-[16px]">
                  <MapPin size={18} className="shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Số 45, Ngõ 12, Đường Xuân Thủy, Quận Cầu Giấy, Hà Nội
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap md:flex-col gap-2 min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                <button className="flex-1 px-4 py-2 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-primary-fixed-dim/30 transition-all active:scale-95 text-[14px]">
                  Đặt làm mặc định
                </button>
                <div className="flex gap-2 w-full text-[14px]">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-on-surface-variant font-bold border border-outline-variant rounded-lg hover:bg-surface-container transition-all active:scale-95"
                  >
                    <Edit size={16} /> Sửa
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-error font-bold border border-error/20 rounded-lg hover:bg-error-container transition-all active:scale-95">
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map Visualization Aspect (Subtle) */}
          <div className="mt-4 rounded-3xl overflow-hidden h-64 border border-outline-variant/20 shadow-inner group relative">
            <div
              className="bg-cover bg-center w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXNuVpa0MnNd2cVRhdBneHQj02VxblxV825rp_4O8cw9UWyheZQwWz6VlNaOy3HLqLY3Huo2pAxEbuF9Z60FzyqevwOuuScTB5iNx0Ti05MPTk8dIlnesxO7IqsGYaEXd25AYxl4z0VdYhJ-oaN8I5GI3UT7o4YQOlzytDCyiujJbCWGusDs4cP6GI6HD4SpNn_4UH0g0mJAItu8QUCTGqy1LGgf_f5Nhs_WKnxtWsZm1QSwqvKrL9')",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-primary/90 text-on-primary px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2.5 animate-bounce">
                <Compass size={20} className="shrink-0" />
                <span className="text-[14px]">Xem cửa hàng gần nhất</span>
              </div>
            </div>
          </div>
        </div>
      </AccountShell>

      {/* Add/Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant/30 shrink-0">
              <h2 className="text-[20px] text-on-surface font-bold">
                Thêm địa chỉ mới
              </h2>
              <button
                className="text-on-surface-variant hover:text-primary transition-colors p-1 bg-surface-container hover:bg-surface-variant rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 text-[15px] font-bold text-primary">
                  Thông tin liên hệ
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-on-surface mb-2">
                    Họ và tên
                  </label>
                  <input
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                    placeholder="Nhập họ và tên"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-on-surface mb-2">
                    Số điện thoại
                  </label>
                  <input
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                    placeholder="Nhập số điện thoại"
                    type="tel"
                  />
                </div>

                <div className="md:col-span-2 text-[15px] font-bold text-primary mt-3">
                  Địa chỉ giao hàng
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[14px] font-semibold text-on-surface mb-2">
                      Tỉnh/Thành phố
                    </label>
                    <select className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface font-medium appearance-none">
                      <option disabled selected value="">
                        Chọn Tỉnh/Thành
                      </option>
                      <option>Hà Nội</option>
                      <option>Hồ Chí Minh</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-on-surface mb-2">
                      Quận/Huyện
                    </label>
                    <select className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface font-medium appearance-none">
                      <option disabled selected value="">
                        Chọn Quận/Huyện
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-on-surface mb-2">
                      Phường/Xã
                    </label>
                    <select className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface font-medium appearance-none">
                      <option disabled selected value="">
                        Chọn Phường/Xã
                      </option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 mt-2">
                  <label className="block text-[14px] font-semibold text-on-surface mb-2">
                    Địa chỉ cụ thể (Số nhà, tên đường)
                  </label>
                  <input
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                    placeholder="VD: Số 10, Ngõ 123 Đường ABC"
                    type="text"
                  />
                </div>

                <div
                  className="md:col-span-2 mt-2 p-4 bg-surface-container-low border border-outline-variant/30 rounded-xl flex items-center gap-3 hover:bg-surface-container transition-colors cursor-pointer select-none"
                  onClick={(e) => {
                    const check = document.getElementById(
                      "default-address",
                    ) as HTMLInputElement;
                    if (e.target !== check) check.checked = !check.checked;
                  }}
                >
                  <input
                    className="w-5 h-5 text-primary rounded border border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface cursor-pointer"
                    id="default-address"
                    type="checkbox"
                  />
                  <label
                    className="text-[14px] font-semibold text-on-surface-variant cursor-pointer flex-1"
                    htmlFor="default-address"
                  >
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-low rounded-b-2xl shrink-0">
              <button
                className="px-6 py-2.5 rounded-xl text-on-surface-variant font-bold hover:bg-surface-variant/70 border border-outline-variant/50 transition-colors text-[14px]"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button className="bg-primary hover:bg-secondary text-on-primary px-8 py-2.5 rounded-xl text-[14px] font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
