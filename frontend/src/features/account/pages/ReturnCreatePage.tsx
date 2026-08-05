import { AccountShell } from "../components/AccountShell";
import { Link } from "react-router-dom";
import {
  PackageSearch,
  HelpCircle,
  Repeat,
  Contact2,
  ChevronRight,
  Info,
  CircleDollarSign,
  ArrowRightLeft,
} from "lucide-react";

export function ReturnCreatePage() {
  return (
    <AccountShell
      title="Tạo yêu cầu đổi trả"
      description="Vui lòng cung cấp chi tiết lỗi để được hỗ trợ bảo hành."
    >
      <div className="-mt-2 w-full max-w-3xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="mb-4 border-b-2 border-primary/20 pb-4">
          <h1
            className="text-display-lg-mobile md:text-display-lg font-black text-primary tracking-tight mb-2"
            style={{ fontSize: "32px", lineHeight: "40px" }}
          >
            Tạo yêu cầu đổi trả
          </h1>
          <p className="text-body-md text-on-surface-variant font-medium">
            Vui lòng cung cấp thông tin chi tiết về sản phẩm bạn muốn đổi trả để
            chúng tôi có thể hỗ trợ tốt nhất.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-4 relative px-4">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-surface-variant rounded-full z-0"></div>
          <div className="absolute left-8 right-1/2 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-300"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-2 shadow-sm">
              1
            </div>
            <span className="text-label-sm font-bold text-primary">
              Chọn sản phẩm
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#fff0f1] text-primary flex items-center justify-center font-black mb-2 shadow-md border-2 border-primary">
              2
            </div>
            <span className="text-label-sm font-black text-primary">
              Lý do & Tình trạng
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold mb-2">
              3
            </div>
            <span className="text-[13px] font-bold text-on-surface-variant">
              Xác nhận
            </span>
          </div>
        </div>

        <form className="space-y-8">
          {/* Section 1: Order Selection */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <h2 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <PackageSearch size={22} />
              </div>
              Sản phẩm cần đổi trả
            </h2>

            <div className="mb-6">
              <label
                className="block text-label-sm font-bold text-on-surface-variant mb-2"
                htmlFor="order-select"
              >
                Chọn đơn hàng
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-surface-container-low p-4 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-[15px] font-medium text-on-surface"
                  id="order-select"
                  defaultValue=""
                >
                  <option disabled value="">
                    Chọn một đơn hàng hợp lệ...
                  </option>
                  <option value="ORD-2024-001">
                    Đơn hàng #ORD-2024-001 - Giao ngày 15/05/2024
                  </option>
                  <option value="ORD-2024-045">
                    Đơn hàng #ORD-2024-045 - Giao ngày 02/06/2024
                  </option>
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

            {/* Simulated Selected Item */}
            <div className="space-y-4">
              <div className="p-4 border border-outline-variant/30 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center">
                <div className="w-24 h-24 rounded-xl bg-surface-container-low flex-shrink-0 relative overflow-hidden border border-outline-variant/20 p-2">
                  <img
                    className="w-full h-full object-contain"
                    alt="PinkPhone Pro Max"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOtaLNp4AbIxXudQ-T5dF30AaZrj0rlXky1i4mlFj_1JrAqO7oytFQopENAL1th91csOjYfeEMFr_Ld-Ve_Jq6RPamKsv4Qy-VHvIHRZjyb3vJeFKqUrLiRpNxqZtHqtS59o61t9KsA4tZAUrz37Sk4u7XcjqcZelHhkresI8ws3kWJWHUrtyNMoxYzBb9U4JyojkD-jRUY47iamarZJ4CnZlCwaYD6zofRipspPLkDP7KeOQZBCBI"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-[15px] font-black text-on-surface mb-1">
                    PinkPhone Pro Max 256GB - Rose Gold
                  </h3>
                  <p className="text-[13px] font-medium text-on-surface-variant flex gap-2">
                    <span className="font-bold text-outline-variant">SN:</span>{" "}
                    <span className="font-mono">89432095832</span>
                  </p>
                </div>
                <div className="w-full md:w-auto flex items-center gap-3 bg-surface-container-low p-2 rounded-xl border border-outline-variant/30">
                  <label className="text-[13px] font-bold text-on-surface-variant px-2">
                    Số lượng:
                  </label>
                  <input
                    className="w-14 p-2 text-center rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none text-[15px] font-bold"
                    max="1"
                    min="1"
                    type="number"
                    defaultValue="1"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Reason & Condition */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <h2 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <HelpCircle size={22} />
              </div>
              Lý do & Tình trạng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-label-sm font-bold text-on-surface-variant mb-2"
                  htmlFor="return-reason"
                >
                  Lý do đổi/trả
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-surface-container-low p-4 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-[15px] font-medium text-on-surface"
                    id="return-reason"
                    defaultValue=""
                  >
                    <option disabled value="">
                      Chọn lý do...
                    </option>
                    <option value="DEFECTIVE">Sản phẩm bị lỗi kỹ thuật</option>
                    <option value="DAMAGED">
                      Sản phẩm bị hư hỏng khi giao
                    </option>
                    <option value="WRONG_ITEM">Giao sai sản phẩm</option>
                    <option value="NOT_AS_DESCRIBED">
                      Sản phẩm không như mô tả
                    </option>
                    <option value="CHANGED_MIND">
                      Đổi ý (Chỉ áp dụng vỏ nguyên seal)
                    </option>
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
                <label
                  className="block text-label-sm font-bold text-on-surface-variant mb-2"
                  htmlFor="item-condition"
                >
                  Tình trạng sản phẩm
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-surface-container-low p-4 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-[15px] font-medium text-on-surface"
                    id="item-condition"
                    defaultValue=""
                  >
                    <option disabled value="">
                      Chọn tình trạng...
                    </option>
                    <option value="UNOPENED">Chưa mở hộp (Nguyên seal)</option>
                    <option value="OPENED">Đã mở hộp</option>
                    <option value="DAMAGED">Bị trầy xước / Móp méo</option>
                    <option value="OTHER">Khác (Vui lòng ghi chú)</option>
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
            </div>

            <div className="mt-6">
              <label
                className="block text-label-sm font-bold text-on-surface-variant mb-2"
                htmlFor="return-notes"
              >
                Ghi chú thêm (Tùy chọn)
              </label>
              <textarea
                className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-[15px] font-medium text-on-surface resize-none"
                id="return-notes"
                placeholder="Mô tả chi tiết hơn về vấn đề gặp phải để kỹ thuật viên nắm rõ..."
                rows={3}
              ></textarea>
            </div>
          </section>

          {/* Section 3: Return Type */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <h2 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Repeat size={22} />
              </div>
              Hình thức xử lý
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  defaultChecked
                  className="peer sr-only"
                  id="type-refund"
                  name="return_type"
                  type="radio"
                  value="refund"
                />
                <label
                  className="flex flex-col p-6 border-2 border-outline-variant/30 rounded-2xl cursor-pointer hover:bg-surface-variant/30 transition-all peer-checked:border-primary peer-checked:bg-[#fff0f1]/50"
                  htmlFor="type-refund"
                >
                  <span className="flex items-center gap-3 text-[16px] font-black text-on-surface mb-2">
                    <CircleDollarSign
                      size={24}
                      className="text-primary group-hover:scale-110 transition-transform"
                    />
                    Hoàn tiền
                  </span>
                  <span className="text-[13px] font-medium text-on-surface-variant pl-9 leading-relaxed">
                    Hoàn tiền qua thẻ tín dụng/ví điện tử hoặc phương thức thanh
                    toán ban đầu.
                  </span>
                </label>

                {/* Checkmark icon for active state */}
                <div className="absolute right-4 top-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              </div>

              <div className="relative group">
                <input
                  className="peer sr-only"
                  id="type-exchange"
                  name="return_type"
                  type="radio"
                  value="exchange"
                />
                <label
                  className="flex flex-col p-6 border-2 border-outline-variant/30 rounded-2xl cursor-pointer hover:bg-surface-variant/30 transition-all peer-checked:border-primary peer-checked:bg-[#fff0f1]/50"
                  htmlFor="type-exchange"
                >
                  <span className="flex items-center gap-3 text-[16px] font-black text-on-surface mb-2">
                    <ArrowRightLeft
                      size={24}
                      className="text-secondary group-hover:scale-110 transition-transform"
                    />
                    Đổi sản phẩm
                  </span>
                  <span className="text-[13px] font-medium text-on-surface-variant pl-9 leading-relaxed">
                    Đổi sang sản phẩm ưu việt hơn, mới tinh cùng loại hoặc bù
                    trừ chênh lệch model khác.
                  </span>
                </label>

                {/* Checkmark icon for active state */}
                <div className="absolute right-4 top-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Contact Info & Summary */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <h2 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Contact2 size={22} />
              </div>
              Thông tin liên hệ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-[13px] font-bold text-outline-variant mb-1 uppercase tracking-wider">
                  Họ và tên
                </label>
                <input
                  className="w-full bg-surface-container p-3.5 rounded-xl border border-transparent text-[15px] font-bold text-on-surface cursor-not-allowed outline-none"
                  readOnly
                  type="text"
                  defaultValue="Hoang Dinh Tung"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-outline-variant mb-1 uppercase tracking-wider">
                  Số điện thoại
                </label>
                <input
                  className="w-full bg-surface-container p-3.5 rounded-xl border border-transparent text-[15px] font-bold text-on-surface cursor-not-allowed outline-none font-mono"
                  readOnly
                  type="tel"
                  defaultValue="0987654321"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-outline-variant mb-1 uppercase tracking-wider">
                  Thư điện tử (Email)
                </label>
                <input
                  className="w-full bg-surface-container p-3.5 rounded-xl border border-transparent text-[15px] font-bold text-on-surface cursor-not-allowed outline-none"
                  readOnly
                  type="email"
                  defaultValue="tung.hd@pinkphone.com"
                />
              </div>
            </div>

            <div className="p-5 bg-[#fffdf0] rounded-2xl border-l-[6px] border-[#ffe066] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[14px] font-bold text-on-surface block mb-1">
                  Số tiền hoàn (Dự kiến):
                </span>
                <p className="text-[13px] text-on-surface-variant font-medium flex items-start gap-1 max-w-sm">
                  <Info size={16} className="shrink-0 mt-0.5 text-[#b29400]" />
                  Giá trị hoàn tiền cuối cùng sẽ được quyết định sau khi kỹ
                  thuật viên nhận và kiểm tra máy.
                </p>
              </div>
              <span className="text-2xl font-black text-[#8a7200]">
                24.990.000 ₫
              </span>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t-[3px] border-outline-variant/10">
            <Link
              to="/account/returns"
              className="w-full md:w-auto px-8 py-3.5 rounded-full bg-surface-container hover:bg-surface-variant/80 text-on-surface-variant font-bold transition-all text-center"
            >
              Hủy bỏ
            </Link>
            <button
              className="w-full md:w-auto px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-md hover:bg-secondary transition-all active:scale-95 flex items-center justify-center gap-2 group"
              type="button"
            >
              Tiếp tục{" "}
              <ChevronRight
                size={18}
                strokeWidth={3}
                className="text-white group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </form>
      </div>
    </AccountShell>
  );
}
