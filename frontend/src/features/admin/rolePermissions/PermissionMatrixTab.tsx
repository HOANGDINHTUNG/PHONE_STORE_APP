import React, { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Input, message } from "antd";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  FileCheck,
  Megaphone,
  MinusCircle,
  PlusCircle,
  Receipt,
  Save,
  Search,
  ShieldCheck,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import { rolePermissionService } from "./rolePermissionService";
import { PermissionGroup, RoleItem } from "./rolePermissionTypes";

interface PermissionMatrixTabProps {
  role?: RoleItem | null;
  onBack?: () => void;
}

export function PermissionMatrixTab({ role, onBack }: PermissionMatrixTabProps) {
  const [searchText, setSearchText] = useState("");
  const [onlySensitive, setOnlySensitive] = useState(false);
  const [onlySelected, setOnlySelected] = useState(false);

  const roleCode = role ? role.roleCode : "ROLE-003";
  const roleName = role ? role.roleName : "Quản lý Kho Cấp cao";
  const description = role
    ? role.description
    : "Giám sát nhập xuất, tồn kho và điều chuyển linh kiện vật tư.";

  // Permission selection state dynamically loaded per role
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [initialState, setInitialState] = useState<Record<string, boolean>>({});
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);

  useEffect(() => {
    const loaded = rolePermissionService.getRolePermissions(roleCode);
    setCheckedState(loaded);
    setInitialState(loaded);
  }, [roleCode]);

  useEffect(() => {
    rolePermissionService.fetchPermissionGroupsFromBackend().then((groups) => {
      setPermissionGroups(groups);
    });
  }, []);

  // Compute added & removed permission codes for summary sidebar
  const { addedItems, removedItems } = useMemo(() => {
    const added: string[] = [];
    const removed: string[] = [];

    Object.keys(checkedState).forEach((code) => {
      if (checkedState[code] && !initialState[code]) {
        added.push(code);
      } else if (!checkedState[code] && initialState[code]) {
        removed.push(code);
      }
    });

    return { addedItems: added, removedItems: removed };
  }, [checkedState, initialState]);

  const handleToggle = (code: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const handleGroupToggleAll = (groupPermissions: any[], selectAll: boolean) => {
    setCheckedState((prev) => {
      const next = { ...prev };
      groupPermissions.forEach((p) => {
        next[p.code] = selectAll;
      });
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await rolePermissionService.saveRolePermissions(roleCode, checkedState);
      setInitialState(checkedState);
      message.success(`Đã lưu thay đổi phân quyền cho vai trò ${roleName}!`);
      if (onBack) onBack();
    } catch {
      message.error("Không thể lưu phân quyền.");
    }
  };
  const getGroupIcon = (name: string) => {
    switch (name) {
      case "Kho hàng":
        return <Warehouse size={20} className="text-[#c2185b]" />;
      case "Nhập hàng":
        return <Boxes size={20} className="text-[#c2185b]" />;
      case "Đơn hàng":
        return <ShoppingCart size={20} className="text-[#c2185b]" />;
      case "Hậu mãi & Bảo hành":
        return <FileCheck size={20} className="text-[#c2185b]" />;
      case "Sản phẩm & Giá":
        return <Receipt size={20} className="text-[#c2185b]" />;
      case "Khuyến mãi & Marketing":
        return <Megaphone size={20} className="text-[#c2185b]" />;
      case "Người dùng & Phân quyền":
        return <Users size={20} className="text-[#c2185b]" />;
      default:
        return <ShieldCheck size={20} className="text-[#c2185b]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner matching Image 2 */}
      <section className="rounded-2xl border border-[#eed2db] bg-[#fffafb] p-6 shadow-[0_3px_10px_rgba(79,20,45,0.02)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#c2185b] hover:underline"
              >
                <ArrowLeft size={14} /> Quay lại danh sách vai trò
              </button>
            )}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-950">{roleName}</h1>
              <span className="rounded-md bg-slate-200 px-2.5 py-1 font-mono text-xs font-bold text-slate-700">
                {roleCode}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 max-w-3xl leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {onBack && (
              <Button size="large" onClick={onBack} className="font-bold">
                Hủy bỏ
              </Button>
            )}
            <Button
              type="primary"
              icon={<Save size={18} />}
              size="large"
              onClick={handleSave}
              className="rounded-xl bg-[#c2185b] font-bold hover:bg-[#a70f4b]"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </section>

      {/* Main 2-Column Grid */}
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left Column: Permission Accordions */}
        <div className="space-y-6">
          {/* Top Filter Bar */}
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#eed2db] bg-white p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
            <Input
              placeholder="Tìm quyền, mã code hoặc mô tả..."
              prefix={<Search size={16} className="mr-1 text-slate-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-80"
              size="large"
              allowClear
            />

            <Checkbox
              checked={onlySensitive}
              onChange={(e) => setOnlySensitive(e.target.checked)}
              className="font-bold text-slate-700"
            >
              Chỉ hiện quyền nhạy cảm
            </Checkbox>

            <Checkbox
              checked={onlySelected}
              onChange={(e) => setOnlySelected(e.target.checked)}
              className="font-bold text-slate-700"
            >
              Chỉ hiện quyền đã chọn
            </Checkbox>
          </div>

          {/* Render Groups dynamically */}
          {permissionGroups.map((group) => {
            let filteredPerms = group.permissions;

            if (onlySensitive) {
              filteredPerms = filteredPerms.filter((p) => p.isSensitive);
            }

            if (onlySelected) {
              filteredPerms = filteredPerms.filter((p) => checkedState[p.code]);
            }

            if (searchText.trim()) {
              const q = searchText.toLowerCase().trim();
              filteredPerms = filteredPerms.filter(
                (p) =>
                  p.name.toLowerCase().includes(q) ||
                  p.code.toLowerCase().includes(q) ||
                  p.description.toLowerCase().includes(q)
              );
            }

            if (filteredPerms.length === 0) return null;

            const isAllGroupChecked = filteredPerms.every((p) => checkedState[p.code]);

            return (
              <div
                key={group.groupName}
                className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]"
              >
                <div className="flex items-center justify-between border-b border-[#f3dce4] bg-[#fffafb] p-4">
                  <div className="flex items-center gap-2">
                    {getGroupIcon(group.groupName)}
                    <h3 className="text-base font-black text-slate-950">
                      {group.groupName}
                    </h3>
                    <span className="rounded-full bg-[#fff0f5] px-2.5 py-0.5 text-xs font-bold text-[#c2185b]">
                      {group.permissions.length} Quyền
                    </span>
                  </div>
                  <Checkbox
                    checked={isAllGroupChecked}
                    onChange={(e) =>
                      handleGroupToggleAll(filteredPerms, e.target.checked)
                    }
                    className="font-bold text-slate-700"
                  >
                    Chọn tất cả
                  </Checkbox>
                </div>

                <div className="divide-y divide-slate-100">
                  {filteredPerms.map((p) => (
                    <div
                      key={p.code}
                      className="flex items-center justify-between p-4 hover:bg-slate-50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{p.name}</span>
                          {p.isSensitive && (
                            <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">
                              <AlertTriangle size={12} /> Nhạy cảm
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs text-slate-400">{p.code}</div>
                        <div className="mt-1 text-xs text-slate-600 max-w-2xl">
                          {p.description}
                        </div>
                      </div>
                      <Checkbox
                        checked={!!checkedState[p.code]}
                        onChange={() => handleToggle(p.code)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: TÓM TẮT THAY ĐỔI Sidebar matching Image 2 */}
        <aside className="space-y-4 rounded-2xl border border-[#eed2db] bg-white p-5 shadow-[0_3px_10px_rgba(79,20,45,0.02)] h-fit">
          <div className="flex items-center justify-between border-b border-[#f3dce4] pb-3">
            <h3 className="text-base font-black text-slate-950">TÓM TẮT THAY ĐỔI</h3>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#c2185b] text-xs font-black text-white">
              {addedItems.length + removedItems.length}
            </span>
          </div>

          {/* Sensitive Alert Box */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-700 text-xs">
              <AlertTriangle size={15} /> Cảnh báo quyền nhạy cảm
            </div>
            <p className="text-[11px] leading-relaxed text-red-600">
              Bạn đang cấp/gỡ quyền nhạy cảm. Hành động này sẽ được ghi lại trong <b>Nhật ký kiểm toán</b>.
            </p>
          </div>

          {/* Added Permissions Box */}
          {addedItems.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <PlusCircle size={15} /> Đã thêm ({addedItems.length})
              </div>
              {addedItems.map((code) => (
                <div key={code}>
                  <div className="font-extrabold text-slate-900">{code}</div>
                  <div className="font-mono text-[11px] text-slate-500">{code}</div>
                </div>
              ))}
            </div>
          )}

          {/* Removed Permissions Box */}
          {removedItems.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-700">
                <MinusCircle size={15} /> Đã gỡ bỏ ({removedItems.length})
              </div>
              {removedItems.map((code) => (
                <div key={code}>
                  <div className="font-extrabold text-slate-900">{code}</div>
                  <div className="font-mono text-[11px] text-slate-500">{code}</div>
                </div>
              ))}
            </div>
          )}

          {addedItems.length === 0 && removedItems.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-400 font-medium">
              Chưa có thay đổi nào. Bật/tắt các quyền bên trái để thiết lập.
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
