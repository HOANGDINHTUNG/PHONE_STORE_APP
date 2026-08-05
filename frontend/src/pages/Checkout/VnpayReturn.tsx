import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckoutShell } from "../../features/checkout/components/CheckoutShell";
import { OrderSuccessView } from "../../features/checkout/components/OrderSuccessView";
import { OrderFailedView } from "../../features/checkout/components/OrderFailedView";
import { useStore } from "../../context/StoreContext";

const VnpayReturn = () => {
  const location = useLocation();
  const { cartItems } = useStore();
  const [status, setStatus] = useState<"processing" | "success" | "failed">(
    "processing",
  );
  const [txnRef, setTxnRef] = useState<string>("");
  const [responseCode, setResponseCode] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vnp_ResponseCode = params.get("vnp_ResponseCode");
    const vnp_TxnRef = params.get("vnp_TxnRef");

    if (vnp_TxnRef) setTxnRef(vnp_TxnRef);
    if (vnp_ResponseCode) setResponseCode(vnp_ResponseCode);

    if (vnp_ResponseCode === "00") {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, [location]);

  // Calculate a mock amount based on current cart if vnpay didn't return an explicit amount parsing logic yet.
  const totalAmount = cartItems.reduce(
    (acc, item) =>
      acc + (parseFloat(item.price.replace(/[^\d]/g, "")) || 0) * item.quantity,
    0,
  );
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(totalAmount);

  return (
    <CheckoutShell>
      {status === "processing" && (
        <div className="flex flex-col items-center py-10 fade-in text-center">
          <div className="w-16 h-16 border-4 border-surface-variant border-t-primary rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">
            Đang xử lý kết quả...
          </h1>
          <p className="text-on-surface-variant">Vui lòng đợi trong giây lát</p>
        </div>
      )}

      {status === "success" && (
        <OrderSuccessView
          transactionId={txnRef}
          amount={totalAmount > 0 ? formattedAmount : "Đang tính..."}
        />
      )}

      {status === "failed" && (
        <OrderFailedView
          transactionId={txnRef}
          amount={totalAmount > 0 ? formattedAmount : "Đang tính..."}
          errorCode={responseCode}
        />
      )}
    </CheckoutShell>
  );
};

export default VnpayReturn;
