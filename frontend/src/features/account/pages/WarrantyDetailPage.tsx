import { AccountShell } from "../components/AccountShell";
import { Link, useParams } from "react-router-dom";
import {
  Shield,
  History,
  FileEdit,
  CloudUpload,
  Info,
  Check,
  Package,
  RefreshCcw,
  Wrench,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

export function WarrantyDetailPage() {
  const { id } = useParams();

  return (
    <AccountShell
      title="Chi tiết bảo hành & Yêu cầu"
      description="Xem thông tin bảo hành, lịch sử yêu cầu và gửi yêu cầu sửa chữa."
    >
      <div className="-mt-2 w-full mx-auto flex flex-col gap-8">
        {/* Warranty Info Card (Bento Grid Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-[1.25rem] p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>

            <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
              <div className="w-24 h-24 bg-surface-container-low rounded-xl p-2 flex items-center justify-center shrink-0 border border-outline-variant/20">
                <img
                  className="w-full h-full object-contain mix-blend-multiply"
                  alt="Product"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmfPjzPYUnE51HZc3CemA86DSY4YW4SWAOSkyCV3gqr4EaYuAhFrXw9EEQg83npoH1-rXsXme7ffwSSREF_4pdEIDFi53G5F63ixQWfVDfk1su_sQ3s-tAIaQE1hMBlBBPgkKKNb2X6t77OJ6PVU1FRHQxyBQdAW3x0OGHlvoCfih7RIYFzqZOnnp84XHwV6lTIv9NAr_6LAHeMDwyGYJZmyP8zJbYL0zidSYjkVVcpcFVYzvRAP_Q"
                />
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                  <div>
                    <h2 className="text-[18px] font-black text-on-surface mb-1">
                      PinkPhone Pro Max 256GB - Rose Gold
                    </h2>
                    <p className="text-[13px] font-medium text-on-surface-variant flex gap-1">
                      <span className="font-bold">Serial:</span>
                      <span className="font-mono">PP-8472-XXXXX-938</span>
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 shrink-0">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                    <p className="text-xs font-bold text-outline-variant mb-1 uppercase tracking-wider">
                      Ngày mua
                    </p>
                    <p className="text-[15px] font-black text-on-surface">
                      15/08/2023
                    </p>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                    <p className="text-xs font-bold text-outline-variant mb-1 uppercase tracking-wider">
                      Hạn bảo hành
                    </p>
                    <p className="text-[15px] font-black text-on-surface">
                      15/08/2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-surface-container-lowest rounded-[1.25rem] p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-secondary-container/20 rounded-full flex items-center justify-center text-secondary mb-4 border border-secondary/20">
              <Shield
                size={32}
                strokeWidth={2.5}
                className="fill-secondary/20"
              />
            </div>
            <h3 className="text-[16px] font-black text-on-surface mb-2">
              Gói PinkCare+
            </h3>
            <p className="text-[13px] text-on-surface-variant text-center mb-4 font-medium leading-relaxed">
              Bảo vệ toàn diện, bao gồm rơi vỡ và vào nước.
            </p>
            <Link
              to="#"
              className="text-primary text-[14px] hover:underline font-bold transition-all"
            >
              Xem chi tiết quyền lợi
            </Link>
          </div>
        </div>

        {/* Two Column Layout for Claim Form and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Claim Form Section */}
          <div className="bg-surface-container-lowest rounded-[1.25rem] p-6 md:p-8 shadow-sm border border-outline-variant/30">
            <h2 className="text-[18px] font-black text-on-surface mb-6 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <FileEdit size={22} />
              </div>
              Tạo yêu cầu bảo hành mới
            </h2>

            <form className="flex flex-col gap-5">
              <div>
                <label className="block text-[14px] font-bold text-on-surface mb-2">
                  Loại sự cố *
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer text-on-surface outline-none transition-all"
                    defaultValue=""
                  >
                    <option disabled value="">
                      Chọn loại sự cố
                    </option>
                    <option value="screen">Màn hình (Nứt vỡ, kẻ sọc...)</option>
                    <option value="battery">Pin / Sạc</option>
                    <option value="camera">Camera</option>
                    <option value="software">Phần mềm / Treo logo</option>
                    <option value="other">Khác</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-on-surface mb-2">
                  Mô tả chi tiết vấn đề *
                </label>
                <textarea
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-on-surface outline-none transition-all placeholder:text-outline-variant/80"
                  placeholder="Vui lòng mô tả rõ tình trạng máy, thời điểm phát hiện lỗi..."
                  rows={4}
                ></textarea>
                <p className="text-[12px] font-bold text-outline-variant mt-1.5 text-right tracking-wider">
                  0/500
                </p>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-on-surface mb-2">
                  Đính kèm hình ảnh/Video (Tùy chọn)
                </label>
                <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-6 flex flex-col items-center justify-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <div className="bg-primary/5 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <CloudUpload size={28} className="text-primary" />
                  </div>
                  <p className="text-[14px] font-bold text-on-surface text-center mb-1">
                    Nhấn để tải lên hoặc kéo thả tệp
                  </p>
                  <p className="text-[12px] font-medium text-on-surface-variant text-center">
                    JPG, PNG, MP4 (Tối đa 10MB)
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl flex gap-3 items-start border border-outline-variant/30 mt-2">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[13px] font-medium text-on-surface-variant leading-relaxed">
                  Sau khi gửi yêu cầu, vui lòng mang thiết bị đến cửa hàng
                  PinkPhone gần nhất hoặc đóng gói cẩn thận chờ nhân viên giao
                  nhận.
                </p>
              </div>

              <button
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] mt-2 shadow-md flex items-center justify-center gap-2 group"
                type="button"
              >
                Gửi yêu cầu bảo hành
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </form>
          </div>

          {/* Claim History / Timeline Section */}
          <div className="bg-surface-container-lowest rounded-[1.25rem] p-6 md:p-8 shadow-sm border border-outline-variant/30">
            <h2 className="text-[18px] font-black text-on-surface mb-6 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <History size={22} />
              </div>
              Lịch sử yêu cầu gần đây
            </h2>

            {/* Claim Item #1: In Progress */}
            <div className="mb-8 border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-4 py-3.5 border-b border-outline-variant/30 flex justify-between items-center">
                <div>
                  <span className="text-[14px] font-black text-on-surface block mb-0.5">
                    Mã YC: #PP-WAR-2024-001
                  </span>
                  <p className="text-[12px] font-medium text-on-surface-variant flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                    Lỗi màn hình sọc xanh
                  </p>
                </div>
                <span className="bg-primary-container text-white px-2.5 py-1 rounded border border-primary/20 text-[12px] font-bold tracking-wide">
                  Đang xử lý
                </span>
              </div>

              <div className="p-5 relative ml-2 md:ml-4 overflow-hidden">
                {/* Vertical Line for timeline */}
                <div className="absolute left-[37px] top-8 bottom-4 w-0.5 bg-outline-variant/40 z-0"></div>

                <ul className="relative z-10 flex flex-col gap-6">
                  {/* SUBMITTED */}
                  <li className="flex gap-4 items-start relative bg-surface-container-lowest">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 border-[3px] border-surface-container-lowest z-10 shadow-sm">
                      <Check size={16} strokeWidth={3} className="text-white" />
                    </div>
                    <div className="pt-1.5">
                      <h4 className="text-[14px] font-black text-on-surface mb-0.5">
                        Đã tiếp nhận yêu cầu (SUBMITTED)
                      </h4>
                      <p className="text-[13px] font-medium text-on-surface-variant font-mono">
                        10:05 - 12/05/2024
                      </p>
                    </div>
                  </li>

                  {/* RECEIVED */}
                  <li className="flex gap-4 items-start relative bg-surface-container-lowest">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 border-[3px] border-surface-container-lowest z-10 shadow-sm">
                      <Package
                        size={16}
                        strokeWidth={2.5}
                        className="text-white"
                      />
                    </div>
                    <div className="pt-1.5">
                      <h4 className="text-[14px] font-black text-on-surface mb-0.5">
                        Đã nhận thiết bị (RECEIVED)
                      </h4>
                      <p className="text-[13px] font-medium text-on-surface-variant flex items-center gap-1 flex-wrap">
                        <span className="font-mono">14:30 - 13/05/2024</span>
                        <span className="text-outline-variant px-1">•</span>
                        <span>Nhận tại Store Quận 1</span>
                      </p>
                    </div>
                  </li>

                  {/* INSPECTING */}
                  <li className="flex gap-4 items-start relative bg-surface-container-lowest">
                    <div className="w-9 h-9 rounded-full bg-primary-fixed border-2 border-primary flex items-center justify-center shrink-0 z-10">
                      <RefreshCcw
                        size={16}
                        strokeWidth={2.5}
                        className="text-primary animate-spin-slow"
                      />
                    </div>
                    <div className="pt-1.5 w-full pr-2">
                      <h4 className="text-[14px] font-black text-primary mb-0.5">
                        Đang kiểm tra (INSPECTING)
                      </h4>
                      <p className="text-[13px] font-medium text-on-surface-variant font-mono mb-2">
                        09:15 - 14/05/2024
                      </p>
                      <div className="bg-surface-container-low p-3 rounded-lg text-[13px] font-medium text-on-surface border border-outline-variant/30 leading-relaxed shadow-inner">
                        Kỹ thuật viên đang đánh giá mức độ hỏng hóc của màn
                        hình.
                      </div>
                    </div>
                  </li>

                  {/* REPAIRING (Future) */}
                  <li className="flex gap-4 items-start relative bg-surface-container-lowest opacity-40 grayscale">
                    <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border-[3px] border-surface-container-lowest z-10">
                      <Wrench
                        size={16}
                        strokeWidth={2.5}
                        className="text-on-surface-variant"
                      />
                    </div>
                    <div className="pt-1.5">
                      <h4 className="text-[14px] font-black text-on-surface-variant">
                        Đang sửa chữa (REPAIRING)
                      </h4>
                    </div>
                  </li>

                  {/* COMPLETED (Future) */}
                  <li className="flex gap-4 items-start relative bg-surface-container-lowest opacity-40 grayscale">
                    <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border-[3px] border-surface-container-lowest z-10">
                      <CheckCircle2
                        size={18}
                        strokeWidth={2.5}
                        className="text-on-surface-variant"
                      />
                    </div>
                    <div className="pt-1.5">
                      <h4 className="text-[14px] font-black text-on-surface-variant">
                        Hoàn thành (COMPLETED)
                      </h4>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Claim Item #2: Rejected / Cancelled state */}
            <div className="border border-outline-variant/30 rounded-xl overflow-hidden opacity-75 grayscale-[0.2]">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/30 flex justify-between items-center cursor-pointer hover:bg-surface-variant/80 transition-colors">
                <div>
                  <span className="text-[14px] font-black text-on-surface block mb-0.5">
                    Mã YC: #PP-WAR-2023-089
                  </span>
                  <p className="text-[12px] font-medium text-on-surface-variant flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                    Rơi nước mất nguồn
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#fff0f1] text-error border border-error/20 px-2.5 py-1 rounded text-[12px] font-bold">
                    Từ chối bảo hành
                  </span>
                  <ChevronDown size={18} className="text-outline-variant" />
                </div>
              </div>

              {/* Collapsed content (simulated expanded for design) */}
              <div className="p-4 bg-surface-container-lowest">
                <div className="flex items-start gap-3 bg-error-container/20 p-4 rounded-xl border border-error/20">
                  <AlertCircle
                    size={20}
                    className="text-error shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-error mb-1 uppercase tracking-wide">
                      Lý do từ chối (REJECTED)
                    </p>
                    <p className="text-[13px] font-medium text-on-surface-variant leading-relaxed">
                      Thiết bị có dấu hiệu bị can thiệp phần cứng bởi bên thứ 3
                      không được ủy quyền. Vi phạm điều khoản bảo hành tiêu
                      chuẩn mục 4.2.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
