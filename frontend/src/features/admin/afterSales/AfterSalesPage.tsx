import React, { useState } from "react";
import { ReviewModerationTab } from "./ReviewModerationTab";
import { WarrantyClaimsTab } from "./WarrantyClaimsTab";
import { ReturnsRefundsTab } from "./ReturnsRefundsTab";

type AfterSalesTabKey = "reviews" | "warranty" | "returns";

export function AfterSalesPage() {
  const [activeTab, setActiveTab] = useState<AfterSalesTabKey>("reviews");

  const getPageTitle = () => {
    switch (activeTab) {
      case "reviews":
        return "Trung tâm Hậu mãi";
      case "warranty":
        return "Quản lý Bảo hành";
      case "returns":
        return "Quản lý Hậu mãi - Đổi trả & Hoàn tiền";
      default:
        return "Trung tâm Hậu mãi";
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case "warranty":
        return "Theo dõi và xử lý các yêu cầu bảo hành từ khách hàng.";
      default:
        return "Quản lý phản hồi khách hàng, yêu cầu bảo hành và quy trình đổi trả.";
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header Section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            {getPageTitle()}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{getPageSubtitle()}</p>
        </div>
      </section>

      {/* Navigation Sub-Tabs matching Mockup Images */}
      <section className="border-b border-[#eed2db]">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "reviews"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Kiểm duyệt Đánh giá
          </button>

          <button
            onClick={() => setActiveTab("warranty")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "warranty"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Yêu cầu Bảo hành
          </button>

          <button
            onClick={() => setActiveTab("returns")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "returns"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Đổi trả & Hoàn tiền
          </button>
        </nav>
      </section>

      {/* Tab Content */}
      <main className="mt-6">
        {activeTab === "reviews" && <ReviewModerationTab />}
        {activeTab === "warranty" && <WarrantyClaimsTab />}
        {activeTab === "returns" && <ReturnsRefundsTab />}
      </main>
    </div>
  );
}
