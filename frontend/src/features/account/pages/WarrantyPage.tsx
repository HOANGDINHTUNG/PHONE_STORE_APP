import { AccountShell } from "../components/AccountShell";
import { Link } from "react-router-dom";
import {
  Search,
  CheckCircle2,
  Headphones,
  History,
  Info,
  Award,
} from "lucide-react";
import { useState } from "react";

export function WarrantyPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showDetail, setShowDetail] = useState(false);

  return (
    <AccountShell
      title="Bảo hành của tôi - PinkPhone"
      description="Kiểm tra thông tin chi tiết về gói bảo hành và tình trạng thiết bị của bạn."
    >
      <div className="-mt-2 space-y-8">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b-2 border-primary/20 pb-4">
          <h1
            className="text-display-lg-mobile md:text-display-lg font-black text-primary tracking-tight"
            style={{ fontSize: "32px", lineHeight: "40px" }}
          >
            Bảo hành của tôi
          </h1>
          <div className="relative w-full md:w-96">
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant/50 text-body-md rounded-full py-3.5 pl-12 pr-4 focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all font-medium shadow-sm outline-none"
              placeholder="Tìm theo mã bảo hành, đơn hàng..."
              type="text"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant"
              size={20}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2.5 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors shadow-sm ${activeTab === "all" ? "bg-primary text-white pointer-events-none" : "bg-surface-container text-on-surface-variant hover:bg-surface-variant/80"}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2.5 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors shadow-sm ${activeTab === "active" ? "bg-primary text-white pointer-events-none" : "bg-surface-container text-on-surface-variant hover:bg-surface-variant/80"}`}
          >
            Đang hiệu lực
          </button>
          <button
            onClick={() => setActiveTab("expired")}
            className={`px-6 py-2.5 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors shadow-sm ${activeTab === "expired" ? "bg-primary text-white pointer-events-none" : "bg-surface-container text-on-surface-variant hover:bg-surface-variant/80"}`}
          >
            Hết hạn
          </button>
        </div>

        {/* List of Warranties */}
        <div className="flex flex-col gap-6">
          {/* Warranty Card 1: ACTIVE */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row gap-8 hover:shadow-md transition-shadow relative overflow-hidden">
            <div
              className={`w-32 h-32 bg-surface-container-low rounded-xl flex items-center justify-center flex-shrink-0 p-2`}
            >
              <img
                className="w-full h-full object-contain"
                alt="Product"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO6v5Q31yGSQ8gZV9DiOXaL9UKKA3aQDh86eBWAOe6JB_JByJxVq-9sTdKCB7wdLGaP1GphvHFPBMbFADBojBNagC8TwCV9ke38Iy87SASIQCXMu09VQl6Rbqp8TvlT9tEvmrQBm0epVT9q_4uag9yx_g__y2AtkEYYx4GvbBlqY9EvExSxVzOwEmMmDOH-P8r-d7LphjaLSXV7fyg9f77Vks2YiqiKrxkj88nypnftuBvGhV3zWNO"
              />
            </div>

            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 flex-col md:flex-row gap-2 md:gap-0">
                  <h3 className="text-body-lg font-black text-on-surface leading-tight">
                    PinkPhone 15 Pro Max
                  </h3>
                  <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-label-sm tracking-wider font-bold border border-green-200">
                    ĐANG HIỆU LỰC
                  </span>
                </div>
                <p className="text-[15px] font-medium text-on-surface-variant mb-5">
                  256GB / Màu Rose Gold
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-xs text-outline-variant font-bold block mb-1">
                    Mã bảo hành
                  </span>
                  <span className="text-sm font-bold text-on-surface font-mono">
                    W-8472-X9M
                  </span>
                </div>
                <div>
                  <span className="text-xs text-outline-variant font-bold block mb-1">
                    Thiết bị IMEI
                  </span>
                  <span className="text-sm font-bold text-on-surface font-mono">
                    *****5921
                  </span>
                </div>
                <div>
                  <span className="text-xs text-outline-variant font-bold block mb-1">
                    Thời hạn
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    12/2023 - 12/2024
                  </span>
                </div>
                <div>
                  <span className="text-xs text-outline-variant font-bold block mb-1">
                    Gói dịch vụ
                  </span>
                  <span className="text-sm font-bold text-secondary flex items-center gap-1">
                    PinkCare+ <Award size={14} />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end lg:justify-start gap-3 items-end border-t border-outline-variant/20 lg:border-t-0 pt-4 lg:pt-0">
              <button
                onClick={() => setShowDetail(!showDetail)}
                className="w-full lg:w-auto bg-surface-container text-on-surface hover:bg-surface-variant/80 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap shadow-sm"
              >
                Tra cứu chi tiết
              </button>
              <Link
                to={`/account/warranty/W-8472-X9M`}
                className="w-full lg:w-auto bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:bg-secondary active:scale-[0.98] transition-all whitespace-nowrap shadow-sm inline-flex justify-center"
              >
                Yêu cầu đổi trả
              </Link>
            </div>
          </div>

          {/* Detailed Info expansion simulating the Warranty Lookup Results */}
          {showDetail && (
            <div className="space-y-6 animate-[slideUp_0.3s_ease-out]">
              <div className="flex items-center justify-between mt-2">
                <h3 className="font-headline-md text-on-surface text-xl font-black">
                  Hồ sơ bảo hành
                </h3>
                <span className="flex items-center gap-1.5 text-secondary font-bold text-[13px] bg-secondary-fixed/50 px-4 py-1.5 rounded-full border border-secondary-fixed-dim/30">
                  <CheckCircle2 size={16} /> Đã xác thực trên hệ thống
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Repair History Bento Card */}
                <div className="lg:col-span-8 bg-surface-container-lowest shadow-sm rounded-[1.5rem] p-6 border border-outline-variant/30">
                  <div className="flex items-center gap-3 mb-6 border-b border-primary/10 pb-4">
                    <History className="text-primary" size={24} />
                    <h4 className="font-black text-on-surface text-xl">
                      Lịch sử sửa chữa (PinkCare+)
                    </h4>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-outline-variant/30">
                          <th className="pb-4 text-[13px] font-bold text-outline-variant uppercase whitespace-nowrap tracking-wide">
                            Mã phiếu
                          </th>
                          <th className="pb-4 text-[13px] font-bold text-outline-variant uppercase whitespace-nowrap tracking-wide">
                            Tiếp nhận
                          </th>
                          <th className="pb-4 text-[13px] font-bold text-outline-variant uppercase min-w-[200px] tracking-wide">
                            Nội dung xử lý
                          </th>
                          <th className="pb-4 text-[13px] font-bold text-outline-variant uppercase text-right whitespace-nowrap tracking-wide">
                            Chi phí
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        <tr className="group hover:bg-surface-container-low transition-colors">
                          <td className="py-4 font-bold text-on-surface text-[15px]">
                            PK-BH-9821
                          </td>
                          <td className="py-4 font-medium text-on-surface-variant text-[15px]">
                            20/03/2024
                          </td>
                          <td className="py-4 font-medium text-on-surface text-[15px]">
                            Vệ sinh máy định kỳ
                          </td>
                          <td className="py-4 font-bold text-right text-green-600 text-[15px]">
                            Miễn phí
                          </td>
                        </tr>
                        <tr className="group hover:bg-surface-container-low transition-colors">
                          <td className="py-4 font-bold text-on-surface text-[15px]">
                            PK-BH-7742
                          </td>
                          <td className="py-4 font-medium text-on-surface-variant text-[15px]">
                            05/03/2024
                          </td>
                          <td className="py-4 font-medium text-on-surface text-[15px]">
                            Khắc phục lỗi phím nguồn
                          </td>
                          <td className="py-4 font-bold text-right text-green-600 text-[15px]">
                            Miễn phí
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-[#fff0f1] border-l-4 border-primary flex items-start gap-4">
                    <Info className="text-primary shrink-0 mt-0.5" size={20} />
                    <p className="text-on-surface-variant/90 font-medium text-[14px] leading-relaxed">
                      Thiết bị vẫn còn quyền lợi bảo hành giới hạn bao gồm miễn
                      phí thay thế linh kiện lỗi từ nhà sản xuất. Hãy yên tâm sử
                      dụng!
                    </p>
                  </div>
                </div>

                {/* CTA Bento Card */}
                <div className="lg:col-span-4 bg-primary text-on-primary shadow-lg shadow-primary/20 rounded-[1.5rem] p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6">
                      <Headphones size={28} className="text-white" />
                    </div>
                    <h4 className="font-black text-2xl tracking-tight">
                      Cần hỗ trợ kỹ thuật?
                    </h4>
                    <p className="font-medium text-white/90 leading-relaxed text-[15px]">
                      Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 đối với mọi vấn đề
                      về thiết bị đang trong diện bảo hành.
                    </p>
                  </div>
                  <button className="w-full bg-white text-primary font-black py-4 rounded-xl mt-8 active:scale-[0.98] hover:bg-surface transition-all shadow-md">
                    Liên hệ kỹ thuật viên
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Warranty Card 2: EXPIRED */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row gap-8 opacity-75 grayscale-[0.3]">
            <div className="w-32 h-32 bg-surface-container-low rounded-xl flex items-center justify-center flex-shrink-0 p-2">
              <img
                className="w-full h-full object-contain"
                alt="Product"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVlUQuIURzcuQSHdgLA_m0m4WrzKc7sjKRqDq1BkaRh3V7LAbNSSZcpgxrwcNTnv3F8YvWt8wAVJYPTwLqt8D_xmdu0jZq_c5UeBsyYxccNkopUx8EmKetNN-g59nyywL7R5rEho6kCyu9MSD-RKbDPI66tIA-ld5SeDf2yLbRqmnlxjuYZ-GpmXWXv_RvdSDuQEHLAjzsKN57jBoYh5W61j5lBe7tNoO-2Hv-5P33KQwveXnepvID"
              />
            </div>

            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 flex-col md:flex-row gap-2 md:gap-0">
                  <h3 className="text-body-lg font-black text-on-surface leading-tight">
                    PinkPhone 13
                  </h3>
                  <span className="bg-surface-variant text-on-surface-variant px-4 py-1.5 rounded-full text-label-sm tracking-wider font-bold border border-outline-variant/50">
                    ĐÃ HẾT HẠN
                  </span>
                </div>
                <p className="text-[15px] font-medium text-on-surface-variant mb-5">
                  128GB / Màu Midnight
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-xs text-outline-variant font-bold block mb-1">
                    Mã bảo hành
                  </span>
                  <span className="text-sm font-bold text-on-surface font-mono">
                    W-2210-P4A
                  </span>
                </div>
                <div>
                  <span className="text-xs text-outline-variant font-bold block mb-1">
                    Thiết bị IMEI
                  </span>
                  <span className="text-sm font-bold text-on-surface font-mono">
                    *****1042
                  </span>
                </div>
                <div>
                  <span className="text-xs text-outline-variant font-bold block mb-1">
                    Thời hạn
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    06/2021 - 06/2022
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end lg:justify-start border-t border-outline-variant/20 lg:border-t-0 pt-4 lg:pt-0">
              <button
                disabled
                className="bg-surface-variant/50 text-on-surface-variant/50 px-6 py-3 rounded-xl font-bold cursor-not-allowed whitespace-nowrap shadow-sm border border-outline-variant/20"
              >
                Gia hạn bảo hành
              </button>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
