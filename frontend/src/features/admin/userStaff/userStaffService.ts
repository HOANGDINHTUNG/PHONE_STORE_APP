import { apiClient } from "../../../api/client";
import {
  CreateStaffPayload,
  CustomerItem,
  StaffMemberItem,
  UserAccountItem,
} from "./userStaffTypes";

const INITIAL_USERS: UserAccountItem[] = [
  {
    id: "usr-1",
    userIdCode: "USR-00124",
    name: "Nguyễn Văn A",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    email: "nva@example.com",
    isEmailVerified: true,
    phone: "0901234567",
    isPhoneVerified: true,
    profileType: "Customer",
    status: "HOẠT ĐỘNG",
    lastLogin: "10:45 12/10/2023",
    createdAt: "01/01/2023",
  },
  {
    id: "usr-2",
    userIdCode: "USR-00892",
    name: "Trần Thị B",
    avatar: "",
    email: "tranb@pinkphone.vn",
    isEmailVerified: true,
    phone: "0987654321",
    isPhoneVerified: true,
    profileType: "Staff",
    status: "HOẠT ĐỘNG",
    lastLogin: "14:20 11/10/2023",
    createdAt: "15/06/2022",
  },
  {
    id: "usr-3",
    userIdCode: "USR-01005",
    name: "Lê Văn C",
    avatar: "",
    email: "levanc@mail.com",
    isEmailVerified: false,
    phone: "0912345678",
    isPhoneVerified: false,
    profileType: "Customer",
    status: "CHỜ XÁC MINH",
    lastLogin: "-",
    createdAt: "12/10/2023",
  },
  {
    id: "usr-4",
    userIdCode: "USR-00442",
    name: "Phạm Văn D",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    email: "phamvd@spam.com",
    isEmailVerified: true,
    phone: "0933445566",
    isPhoneVerified: false,
    profileType: "Customer",
    status: "BỊ KHÓA",
    lastLogin: "05/09/2023",
    createdAt: "10/01/2023",
  },
];

const INITIAL_STAFF: StaffMemberItem[] = [
  {
    id: "emp-1",
    empCode: "EMP-0012",
    name: "Nguyễn Văn An",
    email: "an.nguyen@pinkphone.vn",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    department: "Phát triển Phần mềm",
    position: "Senior Frontend Developer",
    directManager: "Trần Thị B (EMP-0005)",
    hireDate: "12/05/2021",
    status: "ĐANG LÀM VIỆC",
  },
  {
    id: "emp-2",
    empCode: "EMP-0005",
    name: "Trần Thị Bích",
    email: "bich.tran@pinkphone.vn",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    department: "Phát triển Phần mềm",
    position: "Engineering Manager",
    directManager: "Không có (Cấp cao)",
    hireDate: "01/02/2019",
    status: "ĐANG LÀM VIỆC",
    isSelf: true,
  },
  {
    id: "emp-3",
    empCode: "EMP-0145",
    name: "Lê Minh",
    email: "minh.le@pinkphone.vn",
    avatar: "",
    department: "Marketing",
    position: "Content Specialist",
    directManager: "Hoàng Văn C (EMP-0042)",
    hireDate: "15/08/2022",
    status: "NGHỈ PHÉP",
  },
  {
    id: "emp-4",
    empCode: "EMP-0210",
    name: "Phạm Dũng",
    email: "dung.pham@pinkphone.vn",
    avatar: "",
    department: "Kho hàng",
    position: "Nhân viên kho",
    directManager: "Ngô Văn E (EMP-0111)",
    hireDate: "10/11/2023",
    status: "TẠM ĐÌNH CHỈ",
  },
];

const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: "cust-1",
    customerCode: "CUST-84920",
    name: "Nguyễn Trần Vân Anh",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    email: "vananh.nt@example.com",
    phone: "0901 234 567",
    dob: "15/08/1992 (Nữ)",
    gender: "Nữ",
    province: "Hồ Chí Minh",
    totalSpend: 12450000,
    orderCount: 15,
    marketingOptIn: true,
    status: "Hoạt động",
  },
  {
    id: "cust-2",
    customerCode: "CUST-84919",
    name: "Trần Hoàng Minh",
    avatar: "",
    email: "minh.tran@example.com",
    phone: "0988 765 432",
    dob: "22/11/1988 (Nam)",
    gender: "Nam",
    province: "Hà Nội",
    totalSpend: 3200000,
    orderCount: 2,
    marketingOptIn: false,
    status: "Hoạt động",
  },
  {
    id: "cust-3",
    customerCode: "CUST-84918",
    name: "Lê Thị Thanh",
    avatar: "",
    email: "thanh.le95@example.com",
    phone: "0973 111 222",
    dob: "05/02/1995 (Nữ)",
    gender: "Nữ",
    province: "Đà Nẵng",
    totalSpend: 0,
    orderCount: 0,
    marketingOptIn: true,
    status: "Tạm khóa",
  },
];

const USERS_KEY = "pinkphone_admin_userstaff_users_v1";
const STAFF_KEY = "pinkphone_admin_userstaff_staff_v1";
const CUSTOMERS_KEY = "pinkphone_admin_userstaff_customers_v1";

const fetchActiveRoleNamesByUser = async (): Promise<Map<string, string[]>> => {
  const assignments = await apiClient.get<any[]>("/admin/role-assignments");
  return (Array.isArray(assignments.data) ? assignments.data : []).reduce((map, assignment) => {
    if (assignment.status === "ACTIVE" && assignment.userId && assignment.role?.name) {
      const userId = String(assignment.userId);
      map.set(userId, [...(map.get(userId) || []), assignment.role.name]);
    }
    return map;
  }, new Map<string, string[]>());
};

export const userStaffService = {
  // Users
  getUsers(): UserAccountItem[] {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  },

  async fetchUsersFromBackend(): Promise<UserAccountItem[]> {
    try {
      const [res, roleNamesByUser] = await Promise.all([
        apiClient.get<any[]>("/admin/users"),
        fetchActiveRoleNamesByUser().catch(() => new Map<string, string[]>()),
      ]);
      if (Array.isArray(res.data)) {
        const mapped: UserAccountItem[] = res.data.map((u, idx) => ({
          id: u.id || `usr-${idx}`,
          userIdCode: u.username ? u.username.toUpperCase() : `USR-00${idx + 100}`,
          name: u.fullName || u.username || u.email,
          avatar: u.avatarUrl || "",
          email: u.email || "",
          isEmailVerified: !!u.emailVerifiedAt,
          phone: u.phone || "",
          isPhoneVerified: !!u.phoneVerifiedAt,
          profileType: u.role === "STAFF" || u.role === "ADMIN" ? "Staff" : "Customer",
          roleNames: roleNamesByUser.get(String(u.id)) || [],
          status: u.accountStatus === "LOCKED" ? "BỊ KHÓA" : u.accountStatus === "PENDING_VERIFICATION" ? "CHỜ XÁC MINH" : "HOẠT ĐỘNG",
          lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("vi-VN") : "10:45 12/10/2023",
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "01/01/2023",
        }));
        localStorage.setItem(USERS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn("Backend API /admin/users failed, using local database fallback", e);
    }
    return this.getUsers();
  },

  async changeUserAccountStatus(userId: string, status: "ACTIVE" | "LOCKED") {
    await apiClient.patch(`/admin/users/${userId}/status`, null, { params: { status } });
  },

  // Staff
  getStaff(): StaffMemberItem[] {
    try {
      const raw = localStorage.getItem(STAFF_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(STAFF_KEY, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  },

  async fetchStaffFromBackend(): Promise<StaffMemberItem[]> {
    try {
      const [res, roleNamesByUser] = await Promise.all([
        apiClient.get<any>("/admin/staff"),
        fetchActiveRoleNamesByUser().catch(() => new Map<string, string[]>()),
      ]);
      const content = res.data?.items || res.data?.content || res.data;
      if (Array.isArray(content)) {
        const mapped: StaffMemberItem[] = content.map((s: any, idx: number) => ({
          id: s.userId || `emp-${idx}`,
          empCode: s.employeeCode || `EMP-00${idx + 1}`,
          name: s.fullName || "Nhân viên PinkPhone",
          email: s.companyEmail || s.email || `nv${idx}@pinkphone.vn`,
          avatar: s.avatarUrl || "",
          roleNames: roleNamesByUser.get(String(s.userId)) || [],
          department: s.departmentName || "Phát triển Phần mềm",
          position: s.positionName || "Chuyên viên",
          directManager: s.managerName || "Không có",
          hireDate: s.hireDate ? new Date(s.hireDate).toLocaleDateString("vi-VN") : "12/05/2021",
          status: s.employmentStatus === "SUSPENDED" ? "TẠM ĐÌNH CHỈ" : s.employmentStatus === "LEAVE" ? "NGHỈ PHÉP" : "ĐANG LÀM VIỆC",
        }));
        localStorage.setItem(STAFF_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn("Backend API /admin/staff failed", e);
    }
    return [];
  },

  createStaff(payload: CreateStaffPayload): StaffMemberItem {
    const list = this.getStaff();
    const newStaff: StaffMemberItem = {
      id: `emp-${Date.now()}`,
      empCode: payload.empCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: payload.fullName,
      email: payload.companyEmail,
      department: payload.department,
      position: payload.position,
      directManager: payload.directManager || "Chưa phân công",
      hireDate: new Date().toLocaleDateString("vi-VN"),
      status: "ĐANG LÀM VIỆC",
    };
    list.unshift(newStaff);
    localStorage.setItem(STAFF_KEY, JSON.stringify(list));

    // Try posting to Spring Boot backend API
    apiClient.post("/admin/staff", {
      employeeCode: newStaff.empCode,
      fullName: newStaff.name,
      companyEmail: newStaff.email,
    }).catch(() => {});

    return newStaff;
  },

  // Customers
  getCustomers(): CustomerItem[] {
    try {
      const raw = localStorage.getItem(CUSTOMERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  },

  async fetchCustomersFromBackend(): Promise<CustomerItem[]> {
    const response = await apiClient.get<any[]>("/admin/users");
    const mapped: CustomerItem[] = (Array.isArray(response.data) ? response.data : [])
      .filter((user) => user.role === "USER")
      .map((user, index) => ({
        id: user.id || `customer-${index}`, customerCode: (user.username || `CUS-${index + 1}`).toUpperCase(),
        name: user.fullName || user.username || user.email, avatar: user.avatarUrl || "", email: user.email || "",
        phone: user.phone || "", dob: "—", gender: "—", province: "—", totalSpend: 0, orderCount: 0,
        marketingOptIn: false, status: user.accountStatus === "DISABLED" || user.accountStatus === "LOCKED" ? "Tạm khóa" : "Hoạt động",
      }));
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(mapped));
    return mapped;
  },
};
