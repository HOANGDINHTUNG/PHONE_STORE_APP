export type RoleType = "SYSTEM" | "CUSTOM";
export type RoleStatus = "Hoạt động" | "Không hoạt động";

export interface RoleItem {
  id: string;
  roleCode: string;
  roleName: string;
  description: string;
  type: RoleType;
  status: RoleStatus;
  permissionCount: number;
  userCount: number;
}

export interface PermissionItem {
  id: string;
  code: string;
  name: string;
  description: string;
  group: string;
  isSensitive?: boolean;
}

export interface PermissionGroup {
  groupName: string;
  iconName?: string;
  permissions: PermissionItem[];
}

export interface RoleAssignmentRecord {
  id: string;
  userId?: string;
  userEmail: string;
  roleCode: string;
  roleName?: string;
  status: "ACTIVE" | "REVOKED";
  expiryText: string;
  assignedBy: string;
  assignedAt: string;
  revokedAt?: string;
  reason: string;
}

export interface AssignRolePayload {
  userId: string;
  userEmail: string;
  roleCode: string;
  expiryDate?: string;
  reason: string;
}
