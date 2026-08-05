export type UserAccountStatus = "HOẠT ĐỘNG" | "CHỜ XÁC MINH" | "BỊ KHÓA";
export type ProfileType = "Customer" | "Staff";

export interface UserAccountItem {
  id: string;
  userIdCode: string;
  name: string;
  avatar?: string;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  isPhoneVerified: boolean;
  profileType: ProfileType;
  roleNames?: string[];
  status: UserAccountStatus;
  lastLogin: string;
  createdAt: string;
}

export type StaffEmploymentStatus = "ĐANG LÀM VIỆC" | "NGHỈ PHÉP" | "TẠM ĐÌNH CHỈ";

export interface StaffMemberItem {
  id: string;
  empCode: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  position: string;
  directManager?: string;
  hireDate: string;
  status: StaffEmploymentStatus;
  roleNames?: string[];
  isSelf?: boolean;
}

export interface CustomerItem {
  id: string;
  customerCode: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  province: string;
  totalSpend: number;
  orderCount: number;
  marketingOptIn: boolean;
  status: "Hoạt động" | "Tạm khóa";
}

export interface CreateStaffPayload {
  fullName: string;
  companyEmail: string;
  phone?: string;
  dob?: string;
  empCode: string;
  department: string;
  position: string;
  directManager?: string;
  permissions: {
    basic: boolean;
    editor: boolean;
    admin: boolean;
  };
}
