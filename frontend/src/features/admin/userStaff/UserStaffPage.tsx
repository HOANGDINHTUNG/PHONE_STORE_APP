import React, { useState } from "react";
import { AllUsersTab } from "./AllUsersTab";
import { StaffManagementTab } from "./StaffManagementTab";
import { CustomerManagementTab } from "./CustomerManagementTab";

type UserStaffTabKey = "all-users" | "staff" | "customers";

export function UserStaffPage() {
  const [activeTab, setActiveTab] = useState<UserStaffTabKey>("all-users");

  const getPageTitle = () => {
    switch (activeTab) {
      case "all-users":
        return "Người dùng & Nhân sự";
      case "staff":
        return "Quản lý Nhân sự";
      case "customers":
        return "Quản lý Khách hàng";
      default:
        return "Người dùng & Nhân sự";
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case "staff":
        return "Theo dõi danh sách nhân sự, phân quyền và quản lý tài khoản nhân viên.";
      case "customers":
        return "Tổng hợp và quản lý thông tin người dùng khách hàng trên hệ thống.";
      default:
        return "Quản lý danh sách tài khoản, phân quyền và trạng thái hoạt động.";
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
            onClick={() => setActiveTab("all-users")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "all-users"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tất cả Người dùng
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "staff"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quản lý Nhân sự
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "customers"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quản lý Khách hàng
          </button>
        </nav>
      </section>

      {/* Tab Content */}
      <main className="mt-6">
        {activeTab === "all-users" && <AllUsersTab />}
        {activeTab === "staff" && <StaffManagementTab />}
        {activeTab === "customers" && <CustomerManagementTab />}
      </main>
    </div>
  );
}
