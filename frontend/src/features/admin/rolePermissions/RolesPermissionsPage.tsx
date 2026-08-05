import React, { useState } from "react";
import { RolesListTab } from "./RolesListTab";
import { PermissionMatrixTab } from "./PermissionMatrixTab";
import { RoleAssignmentTab } from "./RoleAssignmentTab";
import { RoleItem } from "./rolePermissionTypes";

type RolePermissionTabKey = "roles-list" | "permissions-matrix" | "assignments";

export function RolesPermissionsPage() {
  const [activeTab, setActiveTab] = useState<RolePermissionTabKey>("roles-list");
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

  const handleEditRole = (role: RoleItem) => {
    setSelectedRole(role);
    setActiveTab("permissions-matrix");
  };

  const handleBackToList = () => {
    setSelectedRole(null);
    setActiveTab("roles-list");
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header Section matching Image 1, 2, 3 */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Vai trò & Quyền
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage system access levels, permissions, and administrative roles.
          </p>
        </div>
      </section>

      {/* Sub-Navigation Sub-Tabs matching Mockup Images */}
      <section className="border-b border-[#eed2db]">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab("roles-list")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "roles-list"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Danh sách Vai trò
          </button>

          <button
            onClick={() => setActiveTab("permissions-matrix")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "permissions-matrix"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Chỉnh sửa Quyền hạn
            {selectedRole && (
              <span className="ml-2 rounded-full bg-[#ffe4ed] px-2 py-0.5 text-xs text-[#c2185b]">
                {selectedRole.roleName}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("assignments")}
            className={`pb-4 text-base font-extrabold transition-colors ${
              activeTab === "assignments"
                ? "border-b-2 border-[#c2185b] text-[#c2185b]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gán Vai trò & Phân quyền
          </button>
        </nav>
      </section>

      {/* Tab Content */}
      <main className="mt-6">
        {activeTab === "roles-list" && <RolesListTab onEditRole={handleEditRole} />}
        {activeTab === "permissions-matrix" && (
          <PermissionMatrixTab role={selectedRole} onBack={handleBackToList} />
        )}
        {activeTab === "assignments" && <RoleAssignmentTab />}
      </main>
    </div>
  );
}
