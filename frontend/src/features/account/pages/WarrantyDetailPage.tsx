import { AccountShell } from "../components/AccountShell";
import {
  Info,
  UploadCloud,
  History,
  CheckCircle2,
  Package,
  RefreshCw,
  Wrench,
  CheckCircle,
  FileEdit,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export function WarrantyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  return (
    <AccountShell title="" description="">
      {/* Mobile Back & Custom Title Header */}
      <div className="flex items-center gap-4 mb-6 relative -top-2">
        <button
          onClick={() => navigate("/account/returns")}
          className="text-on-surface-variant hover:text-primary transition-colors p-2 -ml-2 rounded-full hover:bg-surface-variant/50"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-headline-md font-headline-md font-bold text-on-surface">
          Chi tiết bảo hành & Yêu cầu
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Warranty Info Card (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-sm relative overflow-hidden border border-outline-variant/30">
            {/* Decorative bubble */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>

            <div className="flex gap-6 items-start relative z-10">
              <div className="w-24 h-24 bg-surface-variant rounded-lg p-2 flex items-center justify-center shrink-0">
                <img
                  className="w-full h-full object-contain mix-blend-multiply"
                  alt="Product"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmfPjzPYUnE51HZc3CemA86DSY4YW4SWAOSkyCV3gqr4EaYuAhFrXw9EEQg83npoH1-rXsXme7ffwSSREF_4pdEIDFi53G5F63ixQWfVDfk1su_sQ3s-tAIaQE1hMBlBBPgkKKNb2X6t77OJ6PVU1FRHQxyBQdAW3x0OGHlvoCfih7RIYFzqZOnnp84XHwV6lTIv9NAr_6LAHeMDwyGYJZmyP8zJbYL0zidSYjkVVcpcFVYzvRAP_Q"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-body-lg font-body-lg font-bold text-on-surface mb-1">
                      PinkPhone 15 Pro Max 256GB - Rose Gold
                    </h2>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">
                      Serial: S/N: PP-8472-XXXXX-938
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-primary/20 shrink-0 ml-2">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                    <p className="text-[11px] text-on-surface-variant mb-1">
                      Ngày mua
                    </p>
                    <p className="text-label-sm font-label-sm font-semibold text-on-surface">
                      15/08/2023
                    </p>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                    <p className="text-[11px] text-on-surface-variant mb-1">
                      Hạn bảo hành
                    </p>
                    <p className="text-label-sm font-label-sm font-semibold text-on-surface">
                      15/08/2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-body-md font-body-md font-bold text-on-surface mb-2">
              Gói PinkCare+
            </h3>
            <p className="text-[12px] text-on-surface-variant text-center mb-4 leading-relaxed">
              Bảo vệ toàn diện, bao gồm rơi vỡ và vào nước.
            </p>
            <button className="text-primary text-[13px] font-bold hover:underline">
              Xem chi tiết quyền lợi
            </button>
          </div>
        </div>

        {/* Two Column Layout: Claim Form & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Claim Form Section */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <h2 className="text-body-lg font-body-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <FileEdit className="text-primary" size={24} />
              Tạo yêu cầu bảo hành mới
            </h2>

            <form className="flex flex-col gap-5">
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface mb-2">
                  Loại sự cố *
                </label>
                <div className="relative">
                  <select className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-lg px-4 py-3.5 text-body-md focus:ring-2 focus:ring-primary/50 appearance-none font-medium">
                    <option disabled selected value="">
                      Chọn loại sự cố
                    </option>
                    <option value="screen">Màn hình (Nứt vỡ, kẻ sọc...)</option>
                    <option value="battery">Pin / Sạc</option>
                    <option value="camera">Camera</option>
                    <option value="software">Phần mềm / Treo logo</option>
                    <option value="other">Khác</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-3.5 text-on-surface-variant pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-on-surface mb-2">
                  Mô tả chi tiết vấn đề *
                </label>
                <textarea
                  className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-lg px-4 py-3.5 text-body-md focus:ring-2 focus:ring-primary/50 resize-none font-medium"
                  placeholder="Vui lòng mô tả rõ tình trạng máy, thời điểm phát hiện lỗi..."
                  rows={4}
                ></textarea>
                <p className="text-[11px] text-on-surface-variant mt-1.5 text-right font-medium">
                  0/500 kí tự
                </p>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-on-surface mb-2">
                  Đính kèm hình/Video (Tùy chọn)
                </label>
                <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center bg-surface/50 hover:bg-surface-variant/30 transition-colors cursor-pointer group">
                  <UploadCloud
                    className="text-on-surface-variant group-hover:text-primary transition-colors mb-3"
                    size={36}
                  />
                  <p className="text-label-sm font-label-sm text-on-surface text-center mb-1">
                    Nhấn tải lên hoặc kéo thả tệp
                  </p>
                  <p className="text-[11px] text-on-surface-variant text-center font-medium">
                    JPG, PNG, MP4 (Tối đa 10MB)
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-lg flex gap-3 items-start border border-outline-variant/30 mt-2">
                <Info className="text-primary shrink-0 mt-0.5" size={18} />
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Sau khi gửi yêu cầu, vui lòng mang thiết bị đến cửa hàng
                  PinkPhone gần nhất hoặc đóng gói cẩn thận chờ nhân viên đến
                  lấy.
                </p>
              </div>

              <button
                type="button"
                className="w-full bg-primary hover:bg-secondary text-on-primary font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] shadow-sm mt-2 flex items-center justify-center gap-2"
              >
                Gửi yêu cầu bảo hành
              </button>
            </form>
          </div>

          {/* Timeline Section */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <h2 className="text-body-lg font-body-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <History className="text-primary" size={24} />
              Lịch sử yêu cầu gần đây
            </h2>

            {/* Claim #1 (Active) */}
            <div className="mb-6 border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/50 flex justify-between items-center">
                <div>
                  <span className="text-label-sm font-label-sm font-bold text-on-surface">
                    Yêu cầu #PP-WAR-2024-001
                  </span>
                  <p className="text-[11px] text-on-surface-variant">
                    Lỗi màn hình sọc xanh
                  </p>
                </div>
                <span className="bg-primary-container text-on-primary-container px-2.5 py-1 rounded-md text-[11px] font-bold">
                  Đang xử lý
                </span>
              </div>

              <div className="p-5 pl-7 relative overflow-hidden">
                {/* Vertical Line */}
                <div className="absolute left-[47px] top-[40px] bottom-10 w-[2px] bg-outline-variant/40 z-0"></div>

                <ul className="relative z-10 flex flex-col gap-8">
                  {/* Step 1 */}
                  <li className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 border-4 border-white z-10 shadow-sm text-on-primary">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="pt-1.5">
                      <h4 className="text-label-sm font-label-sm font-bold text-on-surface">
                        Đã tiếp nhận yêu cầu (SUBMITTED)
                      </h4>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        10:05 - 12/05/2024
                      </p>
                    </div>
                  </li>

                  {/* Step 2 */}
                  <li className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 border-4 border-white z-10 shadow-sm text-on-primary">
                      <Package size={20} />
                    </div>
                    <div className="pt-1.5">
                      <h4 className="text-label-sm font-label-sm font-bold text-on-surface">
                        Đã nhận thiết bị (RECEIVED)
                      </h4>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        14:30 - 13/05/2024 • Nhận tại Store Quận 1
                      </p>
                    </div>
                  </li>

                  {/* Step 3 */}
                  <li className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-surface-lowest border-2 border-primary flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <RefreshCw
                        className="text-primary animate-spin"
                        size={18}
                      />
                    </div>
                    <div className="pt-1.5">
                      <h4 className="text-label-sm font-label-sm font-bold text-primary">
                        Đang kiểm tra (INSPECTING)
                      </h4>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        09:15 - 14/05/2024
                      </p>
                      <div className="mt-2.5 bg-surface-variant/40 p-3 rounded-lg text-[12px] text-on-surface border border-outline-variant/30 leading-relaxed font-medium">
                        Kỹ thuật viên đang đánh giá mức độ hỏng hóc... quá trình
                        này có thể mất 24h.
                      </div>
                    </div>
                  </li>

                  {/* Step 4 (Pending) */}
                  <li className="flex gap-4 items-start opacity-40">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border-4 border-white z-10 text-on-surface-variant">
                      <Wrench size={18} />
                    </div>
                    <div className="pt-2">
                      <h4 className="text-[13px] font-bold text-on-surface-variant">
                        Đang sửa chữa (REPAIRING)
                      </h4>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Claim #2 (Rejected / Collapsed) */}
            <div className="border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm opacity-75">
              <div
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/50 flex justify-between items-center cursor-pointer hover:bg-surface-variant/40 transition-colors"
              >
                <div>
                  <span className="text-label-sm font-label-sm font-bold text-on-surface">
                    Yêu cầu #PP-WAR-2023-089
                  </span>
                  <p className="text-[11px] text-on-surface-variant">
                    Rơi nước mất nguồn
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-md text-[11px] font-bold">
                    Từ chối bảo hành
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-on-surface-variant transition-transform ${isHistoryExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              {isHistoryExpanded && (
                <div className="p-4 bg-surface/30">
                  <div className="flex items-start gap-3 bg-error-container/20 p-4 rounded-lg border border-error/20">
                    <AlertCircle
                      className="text-error mt-0.5 shrink-0"
                      size={20}
                    />
                    <div>
                      <p className="text-label-sm font-label-sm font-bold text-on-surface mb-1">
                        Lý do từ chối (REJECTED)
                      </p>
                      <p className="text-[12px] text-on-surface-variant leading-relaxed">
                        Thiết bị có dấu hiệu bị can thiệp phần cứng bởi bên thứ
                        3 (phát hiện gioăng keo không chính hãng). Thiết bị vi
                        phạm điều khoản từ chối bảo hành tại khoản 4.2.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
