import { AccountShell } from "../components/AccountShell";
import {
  Mail,
  UploadCloud,
  Headphones,
  MessageCircle,
  Store,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export function AccountSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    "Chính sách đổi trả trong 30 ngày?",
    "Kiểm tra thời hạn bảo hành điện thoại?",
    "Làm sao để thay đổi địa chỉ giao hàng?",
    "Hướng dẫn sao lưu dữ liệu trước khi bảo hành?",
  ];

  return (
    <AccountShell title="" description="">
      <div className="flex-grow w-full flex flex-col gap-8 -mt-2">
        {/* Page Header */}
        <div>
          <h1
            className="text-display-lg-mobile md:text-display-lg text-primary mb-2 font-black tracking-tight"
            style={{ fontSize: "32px", lineHeight: "40px" }}
          >
            Góp ý & Hỗ trợ
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Chúng tôi luôn lắng nghe để mang đến trải nghiệm mua sắm công nghệ
            tốt nhất. Vui lòng chọn phương thức hỗ trợ phù hợp dưới đây.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Form (Bento Large) */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm p-6 relative overflow-hidden border border-outline-variant/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>

            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2 font-bold">
              <Mail className="text-primary" size={24} />
              Gửi phản hồi cho chúng tôi
            </h3>

            <form className="flex flex-col gap-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
                    Chủ đề
                  </label>
                  <select className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-lg px-4 py-3 font-medium focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/50 outline-none transition-all appearance-none">
                    <option>Bảo hành & Sửa chữa</option>
                    <option>Phản ánh chất lượng dịch vụ</option>
                    <option>Hỗ trợ kỹ thuật sản phẩm</option>
                    <option>Đơn hàng & Giao nhận</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
                    Mã đơn hàng (nếu có)
                  </label>
                  <input
                    className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-lg px-4 py-3 font-medium focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/50 outline-none transition-all placeholder-outline-variant/70"
                    placeholder="VD: PKP123456"
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
                  Nội dung chi tiết
                </label>
                <textarea
                  className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-lg px-4 py-3 font-medium focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/50 outline-none transition-all placeholder-outline-variant/70 resize-none"
                  placeholder="Vui lòng mô tả chi tiết vấn đề của bạn..."
                  rows={4}
                ></textarea>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
                  Đính kèm tệp (Tối đa 5MB)
                </label>
                <div className="border-2 border-dashed border-outline-variant/70 rounded-lg p-6 flex flex-col items-center justify-center bg-surface hover:bg-surface-variant/50 transition-colors cursor-pointer text-center group">
                  <UploadCloud
                    className="text-on-surface-variant group-hover:text-primary transition-colors mb-2"
                    size={32}
                  />
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Kéo thả tệp vào đây hoặc{" "}
                    <span className="text-primary font-bold">chọn tệp</span>
                  </p>
                  <p className="text-[12px] text-on-surface-variant/80 font-medium mt-1">
                    Hỗ trợ: JPG, PNG, PDF
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="bg-primary text-on-primary font-bold px-8 py-3.5 rounded-xl hover:bg-secondary active:scale-[0.98] transition-all w-full md:w-auto shadow-sm"
                >
                  Gửi Phản Hồi
                </button>
              </div>
            </form>
          </div>

          {/* Direct Contact Methods (Bento Column) */}
          <div className="flex flex-col gap-6">
            <div className="bg-primary hover:bg-secondary text-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer border border-primary/20">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                <Headphones size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
                  <Headphones size={24} />
                </div>
                <h4 className="font-headline-md text-headline-md mb-1 font-bold">
                  Hotline 24/7
                </h4>
                <p className="font-medium opacity-90 mb-4 text-[14px]">
                  Gọi miễn phí để được hỗ trợ ngay lập tức
                </p>
                <p className="text-[32px] font-black tracking-tight leading-none">
                  1800 1234
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all group border border-outline-variant/30 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-fixed-dim/30 rounded-full flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <MessageCircle size={20} className="fill-current" />
                </div>
                <div>
                  <h4 className="font-label-sm text-label-sm text-on-surface mb-1">
                    Chat trực tuyến
                  </h4>
                  <p className="font-medium text-on-surface-variant text-[13px] mb-2">
                    Trò chuyện với tư vấn viên (8:00 - 22:00)
                  </p>
                  <span className="text-primary font-label-sm text-label-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Bắt đầu chat{" "}
                    <ChevronDown size={16} className="-rotate-90" />
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all group border border-outline-variant/30 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-fixed-dim/30 rounded-full flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Store size={20} className="fill-current" />
                </div>
                <div>
                  <h4 className="font-label-sm text-label-sm text-on-surface mb-1">
                    Hỗ trợ tại cửa hàng
                  </h4>
                  <p className="font-medium text-on-surface-variant text-[13px] mb-2">
                    Mang máy đến trung tâm bảo hành gần nhất
                  </p>
                  <span className="text-primary font-label-sm text-label-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Tìm cửa hàng{" "}
                    <ChevronDown size={16} className="-rotate-90" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-2">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-4 font-bold">
            Câu hỏi thường gặp
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setOpenFaq(idx === openFaq ? null : idx)}
                className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex justify-between items-center group"
              >
                <span className="font-medium text-on-surface group-hover:text-primary transition-colors text-[14px]">
                  {faq}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-on-surface-variant group-hover:text-primary transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="text-primary font-bold text-[14px] hover:underline underline-offset-4">
              Xem tất cả câu hỏi thường gặp
            </button>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
