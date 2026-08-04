import {
  Search,
  CheckCircle2,
  Headphones,
  History,
  Info,
  Award,
} from "lucide-react";
import { AccountShell } from "../components/AccountShell";

export function WarrantyPage() {
  return (
    <AccountShell
      title="Tra cứu bảo hành - PinkPhone"
      description="Kiểm tra thông tin chi tiết về gói bảo hành và tình trạng thiết bị của bạn."
    >
      <section className="flex-1 space-y-8">
        {/* Search Header */}
        <div className="space-y-2">
          <h2 className="font-display-lg text-headline-md text-primary font-black">
            Tra cứu bảo hành
          </h2>
          <p className="text-on-surface-variant font-body-md">
            Kiểm tra thông tin chi tiết về gói bảo hành và tình trạng thiết bị
            của bạn.
          </p>
        </div>

        {/* Lookup Form Card */}
        <div className="bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-[1.5rem] p-6 border-2 border-primary/10">
          <form
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end"
            id="warrantyForm"
          >
            <div className="space-y-2">
              <label className="font-label-sm text-on-surface-variant px-1">
                Số điện thoại mua hàng
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-light focus:outline-none transition-all font-body-md"
                placeholder="09xx xxx xxx"
                type="tel"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-on-surface-variant px-1">
                IMEI / Serial / Mã đơn
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-light focus:outline-none transition-all font-body-md"
                placeholder="Nhập mã định danh thiết bị"
                type="text"
              />
            </div>
            <div className="flex">
              <button
                className="w-full bg-primary text-on-primary font-bold py-3 px-8 rounded-xl active:scale-98 hover:bg-secondary shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all"
                type="submit"
                onClick={(e) => e.preventDefault()}
              >
                <Search size={20} /> Tra cứu
              </button>
            </div>
          </form>
        </div>

        {/* Search Result Section (Visible by default for demo) */}
        <div
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          id="resultSection"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-on-surface text-xl font-bold">
              Kết quả tra cứu
            </h3>
            <span className="flex items-center gap-1 text-secondary font-bold font-label-sm bg-secondary-fixed/30 px-3 py-1 rounded-full">
              <CheckCircle2 size={16} /> Đã xác thực thông tin
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Device Info Bento Card */}
            <div className="lg:col-span-8 bg-white shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-[1.5rem] p-6 flex flex-col md:flex-row gap-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
              <div className="w-full md:w-48 aspect-square rounded-2xl bg-surface-container-low flex items-center justify-center p-4 border border-outline-variant/30">
                <img
                  className="w-full h-full object-contain"
                  alt="Thiết bị của bạn"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvc1A3Cj52rbkYWLSKSMdRiC8YOkl9hH3PFZ27ikLLr5X129HcKe1ZGCyARhIItgxzVIl1EzlRa3qQdLgxTDptjUzKaoV4L3RIjpCSPlTzXVqBYJ1vU7cckhukV3zbmrGqWFwZutaE9x7BxLUyZ2JRa99eyDvcCXDMThdkOQKd_urljHOPGcrh3OxMrOgE103pSzxlwG53T0anN3ndQhAt6i1CNgeRWFBuhvAU2q3s6GTvO0gyY9fM"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-primary font-bold text-sm uppercase tracking-wider">
                    Thiết bị của bạn
                  </p>
                  <h4 className="font-display-lg text-headline-md font-bold text-on-surface">
                    iPhone 15 Pro Max 256GB - Pink Edition
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <p className="font-label-sm text-sm text-on-surface-variant">
                      IMEI
                    </p>
                    <p className="font-body-md font-bold text-on-surface">
                      352940xxxxxxxx7
                    </p>
                  </div>
                  <div>
                    <p className="font-label-sm text-sm text-on-surface-variant">
                      Ngày mua
                    </p>
                    <p className="font-body-md font-bold text-on-surface">
                      15/02/2024
                    </p>
                  </div>
                  <div>
                    <p className="font-label-sm text-sm text-on-surface-variant">
                      Gói bảo hành
                    </p>
                    <p className="font-body-md font-bold text-secondary flex items-center gap-1">
                      PinkCare+ <Award size={16} />
                    </p>
                  </div>
                  <div>
                    <p className="font-label-sm text-sm text-on-surface-variant">
                      Tình trạng
                    </p>
                    <span className="inline-flex px-2 py-0.5 mt-1 rounded-md bg-green-100 text-green-700 font-bold text-xs uppercase shadow-sm">
                      Còn hạn
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-label-sm text-sm text-on-surface-variant">
                      Thời hạn còn lại
                    </p>
                    <p className="font-label-sm text-sm font-bold text-primary">
                      280 ngày
                    </p>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-[12px] text-on-surface-variant mt-2 italic">
                    Dự kiến hết hạn: 15/02/2025
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Bento Card */}
            <div className="lg:col-span-4 bg-primary text-on-primary shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-[1.5rem] p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Headphones size={24} className="text-on-primary" />
                </div>
                <h4 className="font-headline-md font-bold text-xl">
                  Cần hỗ trợ kỹ thuật?
                </h4>
                <p className="font-body-md text-on-primary/80">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 đối với mọi vấn đề về
                  thiết bị.
                </p>
              </div>
              <button className="w-full bg-white text-primary font-bold py-3 rounded-xl mt-6 active:scale-98 hover:bg-primary-fixed-dim transition-colors shadow-lg">
                Yêu cầu hỗ trợ ngay
              </button>
            </div>

            {/* Repair History Bento Card */}
            <div className="lg:col-span-12 bg-white shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-[1.5rem] p-6">
              <div className="flex items-center gap-2 mb-6">
                <History className="text-primary" size={24} />
                <h4 className="font-headline-md text-on-surface text-xl font-bold">
                  Lịch sử sửa chữa
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-outline-variant/30">
                      <th className="pb-4 font-label-sm text-sm text-on-surface-variant uppercase whitespace-nowrap">
                        Mã phiếu
                      </th>
                      <th className="pb-4 font-label-sm text-sm text-on-surface-variant uppercase whitespace-nowrap">
                        Ngày tiếp nhận
                      </th>
                      <th className="pb-4 font-label-sm text-sm text-on-surface-variant uppercase min-w-[200px]">
                        Nội dung
                      </th>
                      <th className="pb-4 font-label-sm text-sm text-on-surface-variant uppercase whitespace-nowrap">
                        Trạng thái
                      </th>
                      <th className="pb-4 font-label-sm text-sm text-on-surface-variant uppercase text-right whitespace-nowrap">
                        Chi phí
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    <tr className="group hover:bg-surface-container-low transition-colors">
                      <td className="py-4 font-body-md font-bold text-on-surface">
                        PK-BH-9821
                      </td>
                      <td className="py-4 font-body-md text-on-surface-variant">
                        20/03/2024
                      </td>
                      <td className="py-4 font-body-md text-on-surface">
                        Vệ sinh máy định kỳ (Gói PinkCare+)
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                          Hoàn thành
                        </span>
                      </td>
                      <td className="py-4 font-body-md font-bold text-right text-green-600">
                        Miễn phí
                      </td>
                    </tr>
                    <tr className="group hover:bg-surface-container-low transition-colors">
                      <td className="py-4 font-body-md font-bold text-on-surface">
                        PK-BH-7742
                      </td>
                      <td className="py-4 font-body-md text-on-surface-variant">
                        05/03/2024
                      </td>
                      <td className="py-4 font-body-md text-on-surface">
                        Kiểm tra lỗi cảm ứng màn hình
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                          Hoàn thành
                        </span>
                      </td>
                      <td className="py-4 font-body-md font-bold text-right text-green-600">
                        Miễn phí
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant flex items-start gap-4">
                <Info className="text-primary shrink-0 mt-1" size={24} />
                <p className="text-on-surface-variant font-body-md">
                  Bạn chưa có lịch sử thay thế linh kiện phần cứng lớn. Hãy yên
                  tâm sử dụng và định kỳ ghé thăm cửa hàng để được vệ sinh máy
                  miễn phí.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AccountShell>
  );
}
