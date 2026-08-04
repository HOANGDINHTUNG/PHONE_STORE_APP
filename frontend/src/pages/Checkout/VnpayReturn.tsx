import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const VnpayReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col items-center justify-center my-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center max-w-lg w-full border border-gray-100">
          {status === "processing" && (
            <div className="flex flex-col items-center py-10">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#C2185B] rounded-full animate-spin mb-6"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Đang xử lý kết quả...
              </h1>
              <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center py-6">
              <CheckCircle size={80} className="text-green-500 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mb-2">
                Cảm ơn bạn đã mua sắm tại PinkPhone. Đơn hàng của bạn đã được
                thanh toán hoàn tất.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 w-full text-left my-6 text-sm text-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Mã giao dịch</span>
                  <span className="font-semibold">{txnRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã kết quả</span>
                  <span className="font-semibold text-green-600">
                    00 (Thành công)
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-[#C2185B] text-white py-3.5 rounded-xl font-bold hover:bg-[#AD1457] transition-colors"
              >
                Trở về trang chủ
              </button>
            </div>
          )}

          {status === "failed" && (
            <div className="flex flex-col items-center py-6">
              <XCircle size={80} className="text-red-500 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Giao dịch thất bại
              </h1>
              <p className="text-gray-600 mb-2">
                Giao dịch của bạn đã bị hủy hoặc xảy ra lỗi trong quá trình xử
                lý.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 w-full text-left my-6 text-sm text-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Mã giao dịch</span>
                  <span className="font-semibold">{txnRef || "Không rõ"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã lỗi</span>
                  <span className="font-semibold text-red-600">
                    {responseCode || "Lỗi không xác định"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors"
              >
                Quay lại giỏ hàng
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VnpayReturn;
