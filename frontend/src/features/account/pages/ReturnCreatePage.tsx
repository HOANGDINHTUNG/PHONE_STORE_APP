import { useState } from "react";
import { Link } from "react-router-dom";
import { AccountShell } from "../components/AccountShell";

export function ReturnCreatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isChecked1, setIsChecked1] = useState(false);
  const [termChecked, setTermChecked] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <AccountShell
      title="Tạo yêu cầu đổi trả"
      description="Vui lòng cung cấp chi tiết lỗi để được hỗ trợ bảo hành."
    >
      <div className="flex-grow w-full max-w-4xl mx-auto space-y-8 -mt-2">
        <header className="mb-8 border-b border-outline-variant/30 pb-4">
          <h1 className="text-display-lg-mobile md:text-headline-md font-display-lg-mobile text-primary mb-2">
            Tạo yêu cầu đổi trả
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {currentStep === 1
              ? "Vui lòng làm theo các bước dưới đây để gửi yêu cầu đổi/trả sản phẩm của bạn."
              : currentStep === 2
                ? "Cung cấp chi tiết lý do đổi trả và hình thức bạn mong muốn."
                : "Xác nhận lại các thông tin trước khi gửi yêu cầu."}
          </p>
        </header>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 relative max-w-2xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-variant rounded-full z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-300"
            style={{
              width:
                currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
            }}
          ></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 shadow-sm transition-colors ${
                currentStep >= 1
                  ? "bg-primary text-white"
                  : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              {currentStep > 1 ? (
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  check
                </span>
              ) : (
                "1"
              )}
            </div>
            <span
              className={`text-label-sm font-label-sm ${
                currentStep >= 1
                  ? "text-primary font-bold"
                  : "text-on-surface-variant"
              }`}
            >
              Chọn sản phẩm
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 shadow-sm transition-colors ${
                currentStep >= 2
                  ? currentStep === 2
                    ? "bg-primary-container text-on-primary-container border-2 border-primary"
                    : "bg-primary text-white"
                  : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              {currentStep > 2 ? (
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  check
                </span>
              ) : (
                "2"
              )}
            </div>
            <span
              className={`text-label-sm font-label-sm ${
                currentStep >= 2
                  ? "text-primary font-bold"
                  : "text-on-surface-variant"
              }`}
            >
              Lý do & Tình trạng
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                currentStep === 3
                  ? "bg-surface border-2 border-primary text-primary shadow-[0_0_0_4px_rgba(255,217,223,0.5)]"
                  : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              3
            </div>
            <span
              className={`text-label-sm font-label-sm ${
                currentStep === 3
                  ? "text-primary font-bold"
                  : "text-on-surface-variant"
              }`}
            >
              Xác nhận
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/30">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold text-on-surface mb-6">
                Bước 1: Chọn đơn hàng & sản phẩm
              </h2>

              {/* Order Selection */}
              <div className="mb-8">
                <label
                  className="block font-label-sm text-label-sm text-on-surface-variant mb-2"
                  htmlFor="order-select"
                >
                  Chọn đơn hàng gần đây
                </label>
                <div className="relative max-w-md">
                  <select
                    className="w-full appearance-none bg-surface-container-low border border-outline-variant/50 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-on-surface transition-shadow"
                    id="order-select"
                    defaultValue="ORD-2023-10492"
                  >
                    <option disabled value="">
                      -- Chọn đơn hàng --
                    </option>
                    <option value="ORD-2023-10492">
                      #ORD-2023-10492 (Đặt ngày 12/10/2023)
                    </option>
                    <option value="ORD-2023-09381">
                      #ORD-2023-09381 (Đặt ngày 05/09/2023)
                    </option>
                  </select>
                  <span
                    className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    expand_more
                  </span>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-4">
                <h3 className="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                  Sản phẩm trong đơn #ORD-2023-10492
                </h3>

                {/* Product Item 1 */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors group">
                  <div className="flex items-center gap-4">
                    <input
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                      id="item-1"
                      type="checkbox"
                      checked={isChecked1}
                      onChange={(e) => setIsChecked1(e.target.checked)}
                    />
                    <div className="w-20 h-20 bg-surface-container-low rounded-md flex-shrink-0 flex items-center justify-center p-2 border border-outline-variant/20">
                      <img
                        alt="Smartphone Product"
                        className="w-full h-full object-contain mix-blend-multiply"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuByP9-Zi72N1W6IBWPpkLykC08XdmhNZ61WDYPkixITYUN7b817L7aD9ue_MPXOOAeV8nnTl6syY-4-ZiFbEwwgWbJl_9VfrkH1180RXAsEyoFRYchCrsbeqBEsZBKbobihnI_IePQQXqO7RsGEyId9Rq5NNBG8mo0y3hEQ-MNH2U0XOhmKf0rq0HGYPoypgY3K4fjOTxxgM6JTzqhX4nMdIWw34G1hfNMk4y38QrmJLq5a4nV3rdt2"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label
                      className="font-body-md text-on-surface font-bold cursor-pointer group-hover:text-primary transition-colors block"
                      htmlFor="item-1"
                    >
                      Phonétique Pro Max 1TB - Blush Pink
                    </label>
                    <p className="text-[13px] text-on-surface-variant mt-1">
                      SKU: PHN-PM-1TB-BP
                    </p>
                    <p className="text-[13px] text-on-surface-variant">
                      Đơn giá: 24.990.000 đ
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-[13px] font-bold text-on-surface-variant">
                      SL trả:
                    </label>
                    <input
                      className="w-16 text-center border border-outline-variant/50 rounded-md py-1 bg-surface focus:ring-1 focus:ring-primary/20 focus:border-primary disabled:opacity-50 font-bold outline-none"
                      disabled={!isChecked1}
                      max="1"
                      min="1"
                      type="number"
                      defaultValue="1"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-outline-variant/30 flex justify-end gap-3">
                <Link
                  to="/account/returns"
                  className="w-full md:w-auto px-6 py-2.5 rounded-lg font-label-sm text-label-sm text-on-surface-variant bg-surface-container hover:bg-surface-variant transition-colors text-center"
                >
                  Hủy bỏ
                </Link>
                <button
                  className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-label-sm text-label-sm text-white transition-all flex justify-center items-center gap-2 ${
                    isChecked1
                      ? "bg-primary hover:bg-secondary active:scale-95 shadow-md"
                      : "bg-primary opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isChecked1}
                  onClick={handleNext}
                  type="button"
                >
                  Tiếp tục{" "}
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              {/* Reason & Condition */}
              {/* Reason & Condition */}
              <section>
                <h2 className="text-headline-md font-headline-md text-primary mb-4 flex items-center gap-2">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    help_clinic
                  </span>{" "}
                  Lý do & Tình trạng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-label-sm font-label-sm text-on-surface-variant mb-2"
                      htmlFor="return-reason"
                    >
                      Lý do đổi/trả
                    </label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-surface p-4 pr-10 rounded-lg border border-outline focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all text-body-md"
                        id="return-reason"
                        defaultValue="DEFECTIVE"
                      >
                        <option value="DEFECTIVE">
                          Sản phẩm bị lỗi kỹ thuật
                        </option>
                        <option value="DAMAGED">
                          Sản phẩm bị hư hỏng khi giao
                        </option>
                        <option value="WRONG_ITEM">Giao sai sản phẩm</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-label-sm font-label-sm text-on-surface-variant mb-2"
                      htmlFor="item-condition"
                    >
                      Tình trạng sản phẩm
                    </label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-surface p-4 pr-10 rounded-lg border border-outline focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all text-body-md"
                        id="item-condition"
                        defaultValue="UNOPENED"
                      >
                        <option value="UNOPENED">
                          Chưa mở hộp (Nguyên seal)
                        </option>
                        <option value="OPENED">Đã mở hộp</option>
                        <option value="DAMAGED">Bị trầy xước / Móp méo</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    className="block text-label-sm font-label-sm text-on-surface-variant mb-2"
                    htmlFor="return-notes"
                  >
                    Ghi chú thêm (Tùy chọn)
                  </label>
                  <textarea
                    className="w-full bg-surface p-4 rounded-lg border border-outline focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all text-body-md resize-none"
                    id="return-notes"
                    placeholder="Mô tả chi tiết hơn về vấn đề..."
                    rows={3}
                  ></textarea>
                </div>
              </section>

              {/* Return Type */}
              <section className="pt-6 border-t border-outline-variant/30">
                <h2 className="text-headline-md font-headline-md text-primary mb-4 flex items-center gap-2">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    sync_alt
                  </span>{" "}
                  Hình thức xử lý
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input
                      className="peer sr-only radio-custom"
                      id="type-refund"
                      name="return_type"
                      type="radio"
                      value="refund"
                      defaultChecked
                    />
                    <label
                      className="flex flex-col p-4 border-2 border-outline-variant rounded-xl cursor-pointer hover:bg-surface-variant/30 transition-all peer-checked:border-primary peer-checked:bg-primary-fixed/30"
                      htmlFor="type-refund"
                    >
                      <span className="flex items-center gap-2 text-body-lg font-bold text-on-background mb-1">
                        <span className="material-symbols-outlined text-primary">
                          currency_exchange
                        </span>{" "}
                        Hoàn tiền
                      </span>
                      <span className="text-label-sm text-on-surface-variant font-medium">
                        Hoàn tiền qua phương thức thanh toán ban đầu.
                      </span>
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      className="peer sr-only radio-custom"
                      id="type-exchange"
                      name="return_type"
                      type="radio"
                      value="exchange"
                    />
                    <label
                      className="flex flex-col p-4 border-2 border-outline-variant rounded-xl cursor-pointer hover:bg-surface-variant/30 transition-all peer-checked:border-primary peer-checked:bg-primary-fixed/30"
                      htmlFor="type-exchange"
                    >
                      <span className="flex items-center gap-2 text-body-lg font-bold text-on-background mb-1">
                        <span className="material-symbols-outlined text-secondary">
                          swap_horizontal_circle
                        </span>{" "}
                        Đổi sản phẩm
                      </span>
                      <span className="text-label-sm text-on-surface-variant font-medium">
                        Đổi sang sản phẩm mới cùng loại hoặc bù trừ chênh lệch.
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Contact Info */}
              <section className="pt-6 border-t border-outline-variant/30">
                <h2 className="text-headline-md font-headline-md text-primary mb-4 flex items-center gap-2">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    contact_mail
                  </span>{" "}
                  Thông tin liên hệ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
                      Họ và tên
                    </label>
                    <input
                      className="w-full bg-surface-variant/50 p-3 rounded-lg border border-transparent text-on-surface-variant cursor-not-allowed outline-none"
                      readOnly
                      type="text"
                      defaultValue="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
                      Số điện thoại
                    </label>
                    <input
                      className="w-full bg-surface-variant/50 p-3 rounded-lg border border-transparent text-on-surface-variant cursor-not-allowed outline-none"
                      readOnly
                      type="tel"
                      defaultValue="0901234567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
                      Email
                    </label>
                    <input
                      className="w-full bg-surface-variant/50 p-3 rounded-lg border border-transparent text-on-surface-variant cursor-not-allowed outline-none"
                      readOnly
                      type="email"
                      defaultValue="nguyenvana@example.com"
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-tertiary-fixed/20 rounded-lg border border-tertiary-fixed-dim">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body-md font-semibold">
                      Số tiền hoàn dự kiến:
                    </span>
                    <span className="text-headline-md font-bold text-primary">
                      24.990.000 ₫
                    </span>
                  </div>
                  <p className="text-label-sm text-on-surface-variant italic flex items-start gap-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      info
                    </span>
                    Giá trị hoàn tiền cuối cùng sẽ được quyết định sau khi chúng
                    tôi nhận và kiểm tra tình trạng thực tế của thiết bị.
                  </p>
                </div>
              </section>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-outline-variant/30 flex justify-end gap-3">
                <button
                  className="w-full md:w-auto px-6 py-2.5 rounded-lg font-label-sm text-label-sm text-on-surface-variant bg-surface-container hover:bg-surface-variant transition-colors"
                  onClick={handlePrev}
                  type="button"
                >
                  Quay lại
                </button>
                <button
                  className="w-full md:w-auto px-6 py-2.5 rounded-lg font-label-sm text-label-sm text-white bg-primary hover:bg-secondary active:scale-95 shadow-md flex justify-center items-center gap-2 transition-all"
                  onClick={handleNext}
                  type="button"
                >
                  Tiếp tục{" "}
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-headline-md text-[20px] text-on-surface mb-6 flex items-center gap-2 pb-4 border-b border-surface-variant w-full">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  fact_check
                </span>{" "}
                Xác nhận thông invoice
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low/50">
                    <span
                      className="material-symbols-outlined text-tertiary mt-1"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      smartphone
                    </span>
                    <div>
                      <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-1">
                        Sản phẩm
                      </h3>
                      <p className="font-body-md font-semibold text-on-surface">
                        Phonétique Pro Max 1TB - Blush Pink
                      </p>
                      <p className="font-body-md text-on-surface-variant text-sm mt-1">
                        Số lượng: 1
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low/50">
                    <span
                      className="material-symbols-outlined text-tertiary mt-1"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      report
                    </span>
                    <div>
                      <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-1">
                        Lý do đổi trả
                      </h3>
                      <p className="font-body-md font-semibold text-on-surface">
                        Sản phẩm bị lỗi kỹ thuật
                      </p>
                      <p className="font-body-md text-on-surface-variant text-sm mt-1">
                        Màn hình bị sọc khi hiển thị màu tối. Tình trạng máy còn
                        nguyên tem, chưa qua sửa chữa.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action & Contact */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low/50">
                    <span
                      className="material-symbols-outlined text-tertiary mt-1"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      cached
                    </span>
                    <div>
                      <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-1">
                        Hình thức xử lý
                      </h3>
                      <p className="font-body-md font-semibold text-primary">
                        Hoàn tiền
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low/50">
                    <span
                      className="material-symbols-outlined text-tertiary mt-1"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      contact_mail
                    </span>
                    <div>
                      <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-1">
                        Thông tin liên hệ
                      </h3>
                      <p className="font-body-md font-semibold text-on-surface">
                        Nguyễn Văn A
                      </p>
                      <p className="font-body-md text-on-surface-variant text-sm mt-1">
                        0901234567
                        <br />
                        nguyenvana@example.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="mt-8 pt-6 border-t border-surface-variant">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      className="peer appearance-none w-5 h-5 rounded border border-outline checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                      type="checkbox"
                      checked={termChecked}
                      onChange={(e) => setTermChecked(e.target.checked)}
                    />
                    <span className="material-symbols-outlined absolute text-white text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      check
                    </span>
                  </div>
                  <span className="font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors select-none">
                    Tôi cam đoan thông tin cung cấp ở trên là hoàn toàn chính
                    xác và tôi đã đọc, hiểu rõ{" "}
                    <a className="text-primary hover:underline" href="#">
                      Các điều khoản & chính sách đổi trả
                    </a>{" "}
                    của Phonétique.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 mt-lg">
                <button
                  className="w-full md:w-auto px-6 py-3 rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-all font-label-sm active:scale-95"
                  onClick={handlePrev}
                  type="button"
                >
                  Quay lại
                </button>
                <Link
                  to="/account/returns/RT-12345"
                  className={`w-full md:w-auto px-8 py-3 rounded-lg bg-primary text-on-primary font-bold shadow-[0_4px_12px_rgba(214,51,108,0.2)] hover:shadow-[0_6px_16px_rgba(214,51,108,0.3)] transition-all flex items-center justify-center gap-2 ${
                    termChecked
                      ? "hover:bg-secondary active:scale-95"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{ pointerEvents: termChecked ? "auto" : "none" }}
                >
                  Gửi yêu cầu đổi trả{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
