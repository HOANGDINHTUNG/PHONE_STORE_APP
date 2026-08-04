import React, { useState } from "react";
import { ShoppingBag, HelpCircle, CheckCircle2 } from "lucide-react";
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";
import ConfirmationStep from "./ConfirmationStep";
import { useNavigate } from "react-router-dom";

export type CheckoutStep = "shipping" | "payment" | "confirmation";

export type CheckoutData = {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestProvinceCode: string;
  guestProvinceName?: string;
  guestDistrictCode: string;
  guestDistrictName?: string;
  guestWardCode: string;
  guestWardName?: string;
  guestDetailAddress: string;
  note: string;
  paymentMethod: "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";
};

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    guestName: "Nguyễn Văn A",
    guestPhone: "0901234567",
    guestEmail: "nguyenvana@example.com",
    guestProvinceCode: "HCM",
    guestProvinceName: "Hồ Chí Minh",
    guestDistrictCode: "Q1",
    guestDistrictName: "Quận 1",
    guestWardCode: "BN",
    guestWardName: "Phường Bến Nghé",
    guestDetailAddress: "123 Lê Lợi",
    note: "",
    paymentMethod: "COD",
  });

  const navigate = useNavigate();

  const handleNext = (nextStep: CheckoutStep) => {
    setCurrentStep(nextStep);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex-1">
            <div
              className="text-[#C2185B] text-[22px] font-extrabold tracking-tight cursor-pointer"
              onClick={() => navigate("/")}
            >
              PinkPhone
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center gap-4 text-[13px]">
            {/* SHIPPING STEP */}
            <div
              className={`flex items-center gap-1.5 ${currentStep === "shipping" ? "text-[#C2185B] font-bold" : "text-gray-600 font-semibold"}`}
            >
              {currentStep !== "shipping" ? (
                <CheckCircle2
                  size={16}
                  strokeWidth={1.5}
                  className="text-gray-600"
                />
              ) : (
                <div className="w-4 h-4 rounded-full border-[1.5px] border-[#C2185B] flex items-center justify-center p-[2px]">
                  <div className="w-full h-full bg-[#C2185B] rounded-full"></div>
                </div>
              )}
              <span>Shipping</span>
            </div>
            <div className="w-6 border-b border-gray-300"></div>
            {/* PAYMENT STEP */}
            <div
              className={`flex items-center gap-1.5 ${currentStep === "payment" ? "text-[#C2185B] font-bold" : "text-gray-600 font-semibold"}`}
            >
              {currentStep === "confirmation" ? (
                <CheckCircle2
                  size={16}
                  strokeWidth={1.5}
                  className="text-gray-600"
                />
              ) : currentStep === "payment" ? (
                <div className="w-4 h-4 rounded-full border-[1.5px] border-[#C2185B] flex items-center justify-center p-[2px]">
                  <div className="w-full h-full bg-[#C2185B] rounded-full"></div>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border-[1.5px] border-gray-300"></div>
              )}
              <span>Payment</span>
            </div>
            <div className="w-6 border-b border-gray-300"></div>
            {/* CONFIRMATION STEP */}
            <div
              className={`flex items-center gap-1.5 ${currentStep === "confirmation" ? "text-[#C2185B] font-bold" : "text-gray-600 font-semibold"}`}
            >
              {currentStep === "confirmation" ? (
                <div className="w-4 h-4 rounded-full border-[1.5px] border-[#C2185B] flex items-center justify-center p-[2px]">
                  <div className="w-full h-full bg-[#C2185B] rounded-full"></div>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border-[1.5px] border-gray-300"></div>
              )}
              <span>Confirmation</span>
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
              <HelpCircle
                size={20}
                strokeWidth={1.5}
                className="text-[#C2185B]"
              />
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.5}
                className="text-[#C2185B]"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {currentStep === "shipping" && (
          <ShippingStep
            onNext={() => handleNext("payment")}
            checkoutData={checkoutData}
            setCheckoutData={setCheckoutData}
          />
        )}
        {currentStep === "payment" && (
          <PaymentStep
            onNext={() => handleNext("confirmation")}
            onBack={() => handleNext("shipping")}
            checkoutData={checkoutData}
            setCheckoutData={setCheckoutData}
            isSubmitting={false}
          />
        )}
        {currentStep === "confirmation" && (
          <ConfirmationStep
            onBack={() => handleNext("payment")}
            checkoutData={checkoutData}
          />
        )}
      </main>

      <footer className="mt-16 bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2024 PinkPhone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
