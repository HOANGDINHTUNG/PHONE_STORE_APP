import React, { useEffect, useState } from "react";
import { OrderSummarySidebar } from "./components/OrderSummarySidebar";
import { Checkbox, Select, message, Button } from "antd";
import { CheckoutData } from "./index";
import { useStore } from "../../context/StoreContext";
import axios from "axios";

type ShippingStepProps = {
  onNext: () => void;
  checkoutData: CheckoutData;
  setCheckoutData: React.Dispatch<React.SetStateAction<CheckoutData>>;
};

const ShippingStep = ({
  onNext,
  checkoutData,
  setCheckoutData,
}: ShippingStepProps) => {
  const { user } = useStore();
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => {
        setProvinces(res.data);
      })
      .catch(() => message.error("Không thể tải dữ liệu Tỉnh/Thành!"));
  }, []);

  // Update districts when province changes
  useEffect(() => {
    if (checkoutData.guestProvinceCode) {
      const p = provinces.find(
        (x) => x.name === checkoutData.guestProvinceCode,
      );
      if (p) {
        setDistricts(p.districts);
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [checkoutData.guestProvinceCode, provinces]);

  // Update wards when district changes
  useEffect(() => {
    if (checkoutData.guestDistrictCode) {
      const d = districts.find(
        (x) => x.name === checkoutData.guestDistrictCode,
      );
      if (d) {
        setWards(d.wards);
      } else {
        setWards([]);
      }
    } else {
      setWards([]);
    }
  }, [checkoutData.guestDistrictCode, districts]);

  const handleChange = (field: keyof CheckoutData, value: string) => {
    setCheckoutData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAutofill = () => {
    if (user) {
      const name =
        user.name || (user as any).fullName || (user as any).customerName || "";
      if (!checkoutData.guestName && name) handleChange("guestName", name);
      if (!checkoutData.guestPhone && user.phone)
        handleChange("guestPhone", user.phone);
      if (!checkoutData.guestEmail && user.email)
        handleChange("guestEmail", user.email);
    } else {
      message.info("Bạn chưa đăng nhập. Vui lòng đăng nhập để lấy thông tin.");
    }
  };

  const handleNextWithValidation = () => {
    const {
      guestName,
      guestPhone,
      guestEmail,
      guestProvinceCode,
      guestDistrictCode,
      guestWardCode,
      guestDetailAddress,
    } = checkoutData;

    const newErrors: Record<string, string> = {};

    if (!guestName || guestName.trim().length < 2) {
      newErrors.guestName = "Họ và tên bắt buộc và phải có ít nhất 2 ký tự.";
    }
    const phoneRegex = /^0\d{9}$/;
    if (!guestPhone || !phoneRegex.test(guestPhone)) {
      newErrors.guestPhone =
        "Số điện thoại bắt buộc, phải có 10 chữ số và bắt đầu bằng số 0.";
    }
    if (!guestEmail || !guestEmail.toLowerCase().endsWith("@gmail.com")) {
      newErrors.guestEmail = "Email bắt buộc và phải có đuôi @gmail.com.";
    }
    if (!guestProvinceCode) {
      newErrors.guestProvinceCode = "Vui lòng chọn Tỉnh/Thành phố.";
    }
    if (!guestDistrictCode) {
      newErrors.guestDistrictCode = "Vui lòng chọn Quận/Huyện.";
    }
    if (!guestWardCode) {
      newErrors.guestWardCode = "Vui lòng chọn Phường/Xã.";
    }
    if (!guestDetailAddress || guestDetailAddress.trim().length === 0) {
      newErrors.guestDetailAddress = "Số nhà, tên đường bắt buộc nhập.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Nhập thông tin
        </h1>

        <div className="space-y-6">
          {/* Contact Info */}
          <section className="bg-white rounded-2xl border border-[#FAFAFA] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Thông tin liên hệ
              </h2>
              <Button
                type="primary"
                onClick={handleAutofill}
                className="bg-[#E91E63] font-bold text-sm h-8 rounded-md hover:bg-[#D81B60]"
              >
                Lấy thông tin cá nhân
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={checkoutData.guestName}
                  onChange={(e) => handleChange("guestName", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={`w-full h-11 px-4 rounded-xl border bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors ${
                    errors.guestName ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.guestName && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.guestName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  value={checkoutData.guestPhone}
                  onChange={(e) => handleChange("guestPhone", e.target.value)}
                  placeholder="0901234567"
                  className={`w-full h-11 px-4 rounded-xl border bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors ${
                    errors.guestPhone ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.guestPhone && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.guestPhone}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email * (Bắt buộc đuôi @gmail.com)
                </label>
                <input
                  type="email"
                  value={checkoutData.guestEmail}
                  onChange={(e) => handleChange("guestEmail", e.target.value)}
                  placeholder="nguyenvana@gmail.com"
                  className={`w-full h-11 px-4 rounded-xl border bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors text-gray-900 ${
                    errors.guestEmail ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.guestEmail && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.guestEmail}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Địa chỉ giao hàng
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tỉnh/Thành phố *
                </label>
                <div className="relative">
                  <Select
                    showSearch
                    value={checkoutData.guestProvinceCode || null}
                    placeholder="Chọn Tỉnh/Thành phố"
                    autoClearSearchValue
                    optionFilterProp="children"
                    onChange={(val) => {
                      handleChange("guestProvinceCode", val);
                      handleChange("guestDistrictCode", "");
                      handleChange("guestWardCode", "");
                    }}
                    options={provinces.map((p) => ({
                      label: p.name,
                      value: p.name,
                    }))}
                    className={`w-full text-sm block h-11 styled-select ${errors.guestProvinceCode ? "has-error" : ""}`}
                  />
                </div>
                {errors.guestProvinceCode && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.guestProvinceCode}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quận/Huyện *
                </label>
                <div className="relative">
                  <Select
                    showSearch
                    value={checkoutData.guestDistrictCode || null}
                    placeholder="Chọn Quận/Huyện"
                    autoClearSearchValue
                    optionFilterProp="children"
                    disabled={!checkoutData.guestProvinceCode}
                    onChange={(val) => {
                      handleChange("guestDistrictCode", val);
                      handleChange("guestWardCode", "");
                    }}
                    options={districts.map((d) => ({
                      label: d.name,
                      value: d.name,
                    }))}
                    className={`w-full text-sm block h-11 styled-select ${errors.guestDistrictCode ? "has-error" : ""}`}
                  />
                </div>
                {errors.guestDistrictCode && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.guestDistrictCode}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phường/Xã *
                </label>
                <div className="relative">
                  <Select
                    showSearch
                    value={checkoutData.guestWardCode || null}
                    placeholder="Chọn Phường/Xã"
                    autoClearSearchValue
                    optionFilterProp="children"
                    disabled={!checkoutData.guestDistrictCode}
                    onChange={(val) => handleChange("guestWardCode", val)}
                    options={wards.map((w) => ({
                      label: w.name,
                      value: w.name,
                    }))}
                    className={`w-full text-sm block h-11 styled-select ${errors.guestWardCode ? "has-error" : ""}`}
                  />
                </div>
                {errors.guestWardCode && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.guestWardCode}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số nhà, tên đường *
              </label>
              <input
                type="text"
                value={checkoutData.guestDetailAddress}
                onChange={(e) =>
                  handleChange("guestDetailAddress", e.target.value)
                }
                placeholder="Ví dụ: 123 Lê Lợi"
                className={`w-full h-11 px-4 rounded-xl border bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors text-gray-900 ${
                  errors.guestDetailAddress
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.guestDetailAddress && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.guestDetailAddress}
                </p>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Ghi chú đơn hàng
            </h2>
            <textarea
              value={checkoutData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              placeholder="Ghi chú về thời gian giao hàng, hướng dẫn tìm nhà... (Tuỳ chọn)"
              className="w-full h-24 p-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors resize-none placeholder-gray-400"
            ></textarea>
          </section>
        </div>
      </div>

      <OrderSummarySidebar
        buttonText="Tiếp tục đến thanh toán"
        onNext={handleNextWithValidation}
      />
      <style>{`
        .styled-select .ant-select-selector {
          height: 44px !important;
          border-radius: 12px !important;
          border: 1px solid #e5e7eb !important;
          background-color: #FAFAFA !important;
          box-shadow: none !important;
          display: flex !important;
          align-items: center !important;
          padding: 0 16px !important;
        }
        .styled-select.ant-select-focused .ant-select-selector {
          border-color: #E91E63 !important;
          background-color: #ffffff !important;
        }
        .styled-select.has-error .ant-select-selector {
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
};

export default ShippingStep;
