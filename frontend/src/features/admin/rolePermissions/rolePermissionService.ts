import { apiClient } from "../../../api/client";
import {
  AssignRolePayload,
  PermissionGroup,
  RoleAssignmentRecord,
  RoleItem,
} from "./rolePermissionTypes";

const INITIAL_ROLES: RoleItem[] = [
  {
    id: "role-1",
    roleCode: "ROLE-001",
    roleName: "Quản trị viên (Admin)",
    description: "Toàn quyền truy cập tất cả các module và tính năng hệ thống.",
    type: "SYSTEM",
    status: "Hoạt động",
    permissionCount: 142,
    userCount: 3,
  },
  {
    id: "role-2",
    roleCode: "ROLE-002",
    roleName: "Quản lý Cửa hàng",
    description: "Quản lý hoạt động bán lẻ, đơn hàng, khách hàng và nhân viên cửa hàng.",
    type: "SYSTEM",
    status: "Hoạt động",
    permissionCount: 86,
    userCount: 12,
  },
  {
    id: "role-3",
    roleCode: "ROLE-003",
    roleName: "Quản lý Kho Cấp cao",
    description: "Giám sát nhập xuất, tồn kho và điều chuyển linh kiện vật tư.",
    type: "SYSTEM",
    status: "Hoạt động",
    permissionCount: 45,
    userCount: 8,
  },
  {
    id: "role-4",
    roleCode: "CUST-089",
    roleName: "Chuyên viên Marketing",
    description: "Quản lý chiến dịch khuyến mại, voucher và gửi tin nhắn truyền thông.",
    type: "CUSTOM",
    status: "Hoạt động",
    permissionCount: 32,
    userCount: 5,
  },
  {
    id: "role-5",
    roleCode: "CUST-092",
    roleName: "Thực tập sinh (View Only)",
    description: "Chỉ xem dữ liệu tổng quan, không có quyền chỉnh sửa dữ liệu.",
    type: "CUSTOM",
    status: "Không hoạt động",
    permissionCount: 15,
    userCount: 0,
  },
];

const INITIAL_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    groupName: "Kho hàng",
    permissions: [
      {
        id: "perm-1",
        code: "WH_VIEW_LIST",
        name: "Xem danh sách kho",
        description: "Cho phép xem danh sách tất cả các kho hàng và số lượng tồn kho tổng quan.",
        group: "Kho hàng",
      },
      {
        id: "perm-2",
        code: "WH_ADJUST_STOCK",
        name: "Điều chỉnh tồn kho",
        description: "Thay đổi số lượng tồn kho trực tiếp mà không qua đơn hàng hoặc phiếu nhập.",
        group: "Kho hàng",
        isSensitive: true,
      },
      {
        id: "perm-3",
        code: "WH_APPROVE_OUTBOUND",
        name: "Duyệt phiếu xuất kho",
        description: "Phê duyệt các yêu cầu xuất kho vật tư, hàng hóa.",
        group: "Kho hàng",
      },
      {
        id: "perm-4",
        code: "WH_TRANSFER_STOCK",
        name: "Điều chuyển tồn kho",
        description: "Điều chuyển số lượng thiết bị giữa các chi nhánh cửa hàng.",
        group: "Kho hàng",
      },
    ],
  },
  {
    groupName: "Nhập hàng",
    permissions: [
      {
        id: "perm-5",
        code: "PO_VIEW_LIST",
        name: "Xem đơn nhập hàng",
        description: "Xem danh sách các đơn mua hàng PO từ nhà cung cấp.",
        group: "Nhập hàng",
      },
      {
        id: "perm-6",
        code: "PO_CREATE_NEW",
        name: "Tạo mới đơn nhập hàng",
        description: "Lập đơn mua hàng mới gửi nhà cung cấp.",
        group: "Nhập hàng",
      },
      {
        id: "perm-7",
        code: "PO_RECEIVE_ITEMS",
        name: "Nhập kho thực tế",
        description: "Xác nhận số lượng nhận thực tế và cập nhật tăng tồn kho.",
        group: "Nhập hàng",
      },
      {
        id: "perm-8",
        code: "PO_CANCEL",
        name: "Hủy đơn nhập hàng",
        description: "Hủy bỏ phiếu mua hàng PO (Chỉ khi chưa nhập kho).",
        group: "Nhập hàng",
        isSensitive: true,
      },
    ],
  },
  {
    groupName: "Đơn hàng",
    permissions: [
      {
        id: "perm-9",
        code: "ORD_VIEW_LIST",
        name: "Xem danh sách đơn hàng",
        description: "Cho phép xem danh sách đơn đặt hàng của khách hàng.",
        group: "Đơn hàng",
      },
      {
        id: "perm-10",
        code: "ORD_UPDATE_STATUS",
        name: "Cập nhật trạng thái đơn",
        description: "Xác nhận, chuyển trạng thái chế biến và đóng gói đơn hàng.",
        group: "Đơn hàng",
      },
      {
        id: "perm-11",
        code: "ORD_DELETE",
        name: "Xóa đơn hàng",
        description: "Xóa vĩnh viễn đơn hàng khỏi hệ thống (Không khuyến nghị).",
        group: "Đơn hàng",
        isSensitive: true,
      },
      {
        id: "perm-12",
        code: "ORD_REFUND_APPROVE",
        name: "Duyệt hoàn tiền đơn hàng",
        description: "Phê duyệt các giao dịch hoàn tiền trực tiếp cho khách.",
        group: "Đơn hàng",
        isSensitive: true,
      },
    ],
  },
  {
    groupName: "Hậu mãi & Bảo hành",
    permissions: [
      {
        id: "perm-13",
        code: "AS_MODERATE_REVIEW",
        name: "Kiểm duyệt đánh giá",
        description: "Duyệt hoặc ẩn các nhận xét, đánh giá sản phẩm của khách.",
        group: "Hậu mãi & Bảo hành",
      },
      {
        id: "perm-14",
        code: "AS_CREATE_WARRANTY",
        name: "Tạo phiếu bảo hành",
        description: "Tiếp nhận và lập phiếu bảo hành thiết bị.",
        group: "Hậu mãi & Bảo hành",
      },
      {
        id: "perm-15",
        code: "AS_APPROVE_RETURN",
        name: "Duyệt đổi trả hàng",
        description: "Thẩm định và chấp thuận yêu cầu đổi trả hàng.",
        group: "Hậu mãi & Bảo hành",
      },
    ],
  },
  {
    groupName: "Sản phẩm & Giá",
    permissions: [
      {
        id: "perm-16",
        code: "PROD_VIEW_CATALOG",
        name: "Xem danh mục sản phẩm",
        description: "Xem chi tiết sản phẩm, cấu hình và bảng giá bán lẻ.",
        group: "Sản phẩm & Giá",
      },
      {
        id: "perm-17",
        code: "PROD_CREATE_EDIT",
        name: "Thêm & Sửa sản phẩm",
        description: "Chỉnh sửa mô tả, hình ảnh và biến thể sản phẩm.",
        group: "Sản phẩm & Giá",
      },
      {
        id: "perm-18",
        code: "PROD_UPDATE_PRICE",
        name: "Cập nhật giá bán",
        description: "Thay đổi giá niêm yết và giá bán lẻ trực tiếp.",
        group: "Sản phẩm & Giá",
        isSensitive: true,
      },
    ],
  },
  {
    groupName: "Khuyến mãi & Marketing",
    permissions: [
      {
        id: "perm-19",
        code: "MKT_VIEW_CAMPAIGNS",
        name: "Xem chiến dịch khuyến mãi",
        description: "Xem báo cáo hiệu quả mã giảm giá và voucher.",
        group: "Khuyến mãi & Marketing",
      },
      {
        id: "perm-20",
        code: "MKT_CREATE_VOUCHER",
        name: "Tạo mã giảm giá",
        description: "Thiết lập chương trình khuyến mãi và phát hành voucher.",
        group: "Khuyến mãi & Marketing",
      },
      {
        id: "perm-21",
        code: "MKT_SEND_NOTIF",
        name: "Gửi thông báo Marketing",
        description: "Bắn tin nhắn SMS/Email khuyến mãi hàng loạt.",
        group: "Khuyến mãi & Marketing",
      },
    ],
  },
  {
    groupName: "Người dùng & Phân quyền",
    permissions: [
      {
        id: "perm-22",
        code: "USER_VIEW_LIST",
        name: "Xem danh sách người dùng",
        description: "Xem thông tin các tài khoản khách hàng và nhân viên.",
        group: "Người dùng & Phân quyền",
      },
      {
        id: "perm-23",
        code: "STAFF_MANAGE",
        name: "Quản lý nhân sự",
        description: "Tạo mới và cập nhật hồ sơ thông tin nhân viên.",
        group: "Người dùng & Phân quyền",
      },
      {
        id: "perm-24",
        code: "ROLE_MANAGE_PERM",
        name: "Quản lý vai trò & quyền",
        description: "Thiết lập ma trận phân quyền hệ thống và gán vai trò.",
        group: "Người dùng & Phân quyền",
        isSensitive: true,
      },
    ],
  },
];

// Per-Role distinct active permission mappings
const ROLE_PERMISSIONS_MAP: Record<string, Record<string, boolean>> = {
  "ROLE-001": {
    // Admin: ALL permissions active
    WH_VIEW_LIST: true,
    WH_ADJUST_STOCK: true,
    WH_APPROVE_OUTBOUND: true,
    WH_TRANSFER_STOCK: true,
    PO_VIEW_LIST: true,
    PO_CREATE_NEW: true,
    PO_RECEIVE_ITEMS: true,
    PO_CANCEL: true,
    ORD_VIEW_LIST: true,
    ORD_UPDATE_STATUS: true,
    ORD_DELETE: true,
    ORD_REFUND_APPROVE: true,
    AS_MODERATE_REVIEW: true,
    AS_CREATE_WARRANTY: true,
    AS_APPROVE_RETURN: true,
    PROD_VIEW_CATALOG: true,
    PROD_CREATE_EDIT: true,
    PROD_UPDATE_PRICE: true,
    MKT_VIEW_CAMPAIGNS: true,
    MKT_CREATE_VOUCHER: true,
    MKT_SEND_NOTIF: true,
    USER_VIEW_LIST: true,
    STAFF_MANAGE: true,
    ROLE_MANAGE_PERM: true,
  },
  "ROLE-002": {
    // Quản lý cửa hàng
    ORD_VIEW_LIST: true,
    ORD_UPDATE_STATUS: true,
    ORD_REFUND_APPROVE: true,
    AS_MODERATE_REVIEW: true,
    AS_CREATE_WARRANTY: true,
    AS_APPROVE_RETURN: true,
    PROD_VIEW_CATALOG: true,
    PROD_CREATE_EDIT: true,
    MKT_VIEW_CAMPAIGNS: true,
    MKT_CREATE_VOUCHER: true,
    USER_VIEW_LIST: true,
    STAFF_MANAGE: true,
    WH_VIEW_LIST: true,
  },
  "ROLE-003": {
    // Quản lý Kho Cấp cao (ROLE_WH_MGR)
    WH_VIEW_LIST: true,
    WH_ADJUST_STOCK: true,
    WH_APPROVE_OUTBOUND: true,
    WH_TRANSFER_STOCK: true,
    PO_VIEW_LIST: true,
    PO_CREATE_NEW: true,
    PO_RECEIVE_ITEMS: true,
    PO_CANCEL: true,
    ORD_VIEW_LIST: true,
    PROD_VIEW_CATALOG: true,
  },
  "CUST-089": {
    // Chuyên viên Marketing
    MKT_VIEW_CAMPAIGNS: true,
    MKT_CREATE_VOUCHER: true,
    MKT_SEND_NOTIF: true,
    PROD_VIEW_CATALOG: true,
    AS_MODERATE_REVIEW: true,
    USER_VIEW_LIST: true,
  },
  "CUST-092": {
    // Thực tập sinh (View Only)
    WH_VIEW_LIST: true,
    PO_VIEW_LIST: true,
    ORD_VIEW_LIST: true,
    PROD_VIEW_CATALOG: true,
    MKT_VIEW_CAMPAIGNS: true,
    USER_VIEW_LIST: true,
  },
};

const INITIAL_ASSIGNMENT_HISTORY: RoleAssignmentRecord[] = [
  {
    id: "asgn-1",
    userEmail: "a.nguyen@pinkphone.vn",
    roleCode: "CS_REP",
    status: "ACTIVE",
    expiryText: "Vĩnh viễn",
    assignedBy: "admin.sys",
    assignedAt: "12/10/2023 14:30",
    reason: "Ticket: REQ-8992 - Onboarding...",
  },
  {
    id: "asgn-2",
    userEmail: "b.tran@pinkphone.vn",
    roleCode: "STORE_MANAGER",
    status: "REVOKED",
    expiryText: "Đã thu hồi: 10/10/2023",
    assignedBy: "admin.sys",
    assignedAt: "01/05/2023 09:00",
    revokedAt: "10/10/2023",
    reason: "Lý do thu hồi: Chuyển công tác",
  },
  {
    id: "asgn-3",
    userEmail: "c.le@partner.vn",
    roleCode: "FINANCE_AUDITOR",
    status: "ACTIVE",
    expiryText: "31/12/2023",
    assignedBy: "sec.lead",
    assignedAt: "15/09/2023 10:15",
    reason: "Kiểm toán nội bộ Q4",
  },
];

const ROLES_KEY = "pinkphone_admin_roles_v1";
const ASSIGNMENTS_KEY = "pinkphone_admin_assignments_v1";

export const rolePermissionService = {
  getRoles(): RoleItem[] {
    try {
      const raw = localStorage.getItem(ROLES_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(ROLES_KEY, JSON.stringify(INITIAL_ROLES));
    return INITIAL_ROLES;
  },

  async fetchRolesFromBackend(): Promise<RoleItem[]> {
    try {
      const [res, assignmentsResponse] = await Promise.all([
        apiClient.get<any>("/admin/roles"),
        apiClient.get<any[]>("/admin/role-assignments").catch(() => ({ data: [] })),
      ]);
      const content = res.data?.items || res.data;
      if (Array.isArray(content)) {
        const activeUsersByRole = (Array.isArray(assignmentsResponse.data) ? assignmentsResponse.data : []).reduce((count, assignment) => {
          if (assignment.status === "ACTIVE" && assignment.role?.id) {
            const roleId = String(assignment.role.id);
            count.set(roleId, (count.get(roleId) || 0) + 1);
          }
          return count;
        }, new Map<string, number>());
        const mapped: RoleItem[] = content.map((r, idx) => {
          const roleCode = r.code || `ROLE-00${idx + 1}`;
          const permissions = Object.fromEntries((r.permissions || []).map((permission: any) => [permission.code, true]));
          localStorage.setItem(`pinkphone_role_perm_${roleCode}`, JSON.stringify(permissions));
          return {
          id: r.id || `role-${idx}`,
          roleCode,
          roleName: r.name || "Vai trò",
          description: r.description || "Mô tả vai trò",
          type: r.roleType === "SYSTEM" ? "SYSTEM" : "CUSTOM",
          status: r.status === "INACTIVE" ? "Không hoạt động" : "Hoạt động",
          permissionCount: Array.isArray(r.permissions) ? r.permissions.length : 0,
          userCount: activeUsersByRole.get(String(r.id)) || 0,
        }; });
        localStorage.setItem(ROLES_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn("Backend API /admin/roles failed, using local database fallback", e);
    }
    return this.getRoles();
  },

  getPermissionGroups(): PermissionGroup[] {
    return INITIAL_PERMISSION_GROUPS;
  },

  async fetchPermissionGroupsFromBackend(): Promise<PermissionGroup[]> {
    try {
      const response = await apiClient.get<any>("/admin/permissions", { params: { size: 100 } });
      const permissions = response.data?.items || response.data || [];
      if (!Array.isArray(permissions) || permissions.length === 0) return this.getPermissionGroups();
      const groups = new Map<string, PermissionGroup>();
      permissions.forEach((permission: any) => {
        const groupName = permission.module || "Khác";
        const group = groups.get(groupName) || { groupName, permissions: [] };
        group.permissions.push({
          id: String(permission.id),
          code: permission.code,
          name: String(permission.code || "Quyền").replaceAll("_", " "),
          description: permission.description || "Không có mô tả.",
          group: groupName,
          isSensitive: /DELETE|APPROVE|ADJUST|MANAGE|REFUND/i.test(permission.code || ""),
        });
        groups.set(groupName, group);
      });
      return [...groups.values()];
    } catch {
      return this.getPermissionGroups();
    }
  },

  getRolePermissions(roleCode: string): Record<string, boolean> {
    const roleKey = ROLE_PERMISSIONS_MAP[roleCode] ? roleCode : "ROLE-003";
    const storedKey = `pinkphone_role_perm_${roleCode}`;
    try {
      const raw = localStorage.getItem(storedKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    const initial = ROLE_PERMISSIONS_MAP[roleKey] || ROLE_PERMISSIONS_MAP["ROLE-003"];
    localStorage.setItem(storedKey, JSON.stringify(initial));
    return initial;
  },

  async saveRolePermissions(roleCode: string, state: Record<string, boolean>) {
    const [rolesResponse, permissionsResponse] = await Promise.all([apiClient.get<any>("/admin/roles"), apiClient.get<any>("/admin/permissions")]);
    const roles = rolesResponse.data?.items || rolesResponse.data || [];
    const permissions = permissionsResponse.data?.items || permissionsResponse.data || [];
    const role = roles.find((item: any) => item.code === roleCode);
    if (!role) throw new Error("Không tìm thấy vai trò.");
    const permissionIds = permissions.filter((permission: any) => state[permission.code]).map((permission: any) => permission.id);
    await apiClient.put(`/admin/roles/${role.id}/permissions`, permissionIds);
    localStorage.setItem(`pinkphone_role_perm_${roleCode}`, JSON.stringify(state));
  },
  getAssignments(): RoleAssignmentRecord[] {
    try {
      const raw = localStorage.getItem(ASSIGNMENTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(INITIAL_ASSIGNMENT_HISTORY));
    return INITIAL_ASSIGNMENT_HISTORY;
  },

  async fetchAssignmentsFromBackend(): Promise<RoleAssignmentRecord[]> {
    const [assignmentsResponse, usersResponse] = await Promise.all([
      apiClient.get<any[]>("/admin/role-assignments"),
      apiClient.get<any[]>("/admin/users"),
    ]);
    const users = new Map((Array.isArray(usersResponse.data) ? usersResponse.data : []).map((user: any) => [String(user.id), user]));
    const records: RoleAssignmentRecord[] = (Array.isArray(assignmentsResponse.data) ? assignmentsResponse.data : []).map((assignment: any) => {
      const user = users.get(String(assignment.userId));
      return {
        id: String(assignment.id), userId: String(assignment.userId), userEmail: user?.email || "Tài khoản đã xóa",
        roleCode: assignment.role?.code || "—", roleName: assignment.role?.name,
        status: assignment.status === "REVOKED" ? "REVOKED" : "ACTIVE",
        expiryText: assignment.expiresAt ? new Date(assignment.expiresAt).toLocaleString("vi-VN") : "Không thời hạn",
        assignedBy: assignment.assignedBy || "—",
        assignedAt: assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleString("vi-VN") : "—",
        revokedAt: assignment.revokedAt ? new Date(assignment.revokedAt).toLocaleString("vi-VN") : undefined,
        reason: assignment.assignedReason || assignment.revokedReason || "Cấp quyền quản trị",
      };
    });
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(records));
    return records;
  },

  async assignRole(payload: AssignRolePayload): Promise<RoleAssignmentRecord> {
    const [usersResponse, rolesResponse] = await Promise.all([apiClient.get<any[]>("/admin/users"), apiClient.get<any>("/admin/roles")]);
    const user = (usersResponse.data || []).find((item: any) => String(item.id) === payload.userId);
    const roles = rolesResponse.data?.items || rolesResponse.data || [];
    const role = roles.find((item: any) => item.code === payload.roleCode);
    if (!user || !role) throw new Error("Không tìm thấy người dùng hoặc vai trò.");
    const response = await apiClient.post<any>(`/admin/users/${user.id}/role-assignments`, { roleId: role.id, expiresAt: payload.expiryDate || undefined, reason: payload.reason });
    const assignment = response.data;
    const record: RoleAssignmentRecord = { id: assignment.id || `asgn-${Date.now()}`, userId: String(user.id), userEmail: payload.userEmail, roleCode: payload.roleCode, roleName: role.name, status: "ACTIVE", expiryText: assignment.expiresAt ? new Date(assignment.expiresAt).toLocaleString("vi-VN") : "Không thời hạn", assignedBy: assignment.assignedBy || "admin", assignedAt: assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleString("vi-VN") : new Date().toLocaleString("vi-VN"), reason: payload.reason };
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify([record, ...this.getAssignments()]));
    return record;
  },

  async revokeRole(assignment: Pick<RoleAssignmentRecord, "id" | "userId">, reason: string) {
    await apiClient.post(`/admin/users/${assignment.userId}/role-assignments/${assignment.id}/revoke`, null, {
      params: { reason },
    });
  },
};
