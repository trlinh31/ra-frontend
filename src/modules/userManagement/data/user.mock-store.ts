import type { User } from "@/modules/userManagement/types/user.type";

let _users: User[] = [
  {
    id: "u1",
    code: "USR-001",
    fullName: "Nguyễn Quản Trị",
    email: "admin@ratravel.vn",
    phone: "0900000001",
    role: "ADMIN",
    isActive: true,
    createdAt: "2026-01-01",
  },
  {
    id: "u2",
    code: "USR-002",
    fullName: "Trần Sale Manager",
    email: "sale-manager@ratravel.vn",
    phone: "0900000002",
    role: "SALE_MANAGER",
    isActive: true,
    createdAt: "2026-01-05",
  },
  {
    id: "u3",
    code: "USR-003",
    fullName: "Seller A",
    email: "seller-a@ratravel.vn",
    phone: "0900000003",
    role: "SELLER",
    isActive: true,
    createdAt: "2026-01-10",
  },
  {
    id: "u4",
    code: "USR-004",
    fullName: "Seller B",
    email: "seller-b@ratravel.vn",
    phone: "0900000004",
    role: "SELLER",
    isActive: true,
    createdAt: "2026-01-10",
  },
  {
    id: "u5",
    code: "USR-005",
    fullName: "Lê Vận Hành",
    email: "op-manager@ratravel.vn",
    phone: "0900000005",
    role: "OPERATION_MANAGER",
    isActive: true,
    createdAt: "2026-01-12",
  },
  {
    id: "u6",
    code: "USR-006",
    fullName: "Nguyễn Thị Mai",
    email: "mai.operator@ratravel.vn",
    phone: "0900000006",
    role: "OPERATOR",
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: "u7",
    code: "USR-007",
    fullName: "Hoàng Kế Toán",
    email: "accountant-a@ratravel.vn",
    phone: "0900000007",
    role: "ACCOUNTANT",
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: "u8",
    code: "USR-008",
    fullName: "Ngô Kế Toán Viên",
    email: "accountant@ratravel.vn",
    phone: "0900000008",
    role: "ACCOUNTANT",
    isActive: true,
    createdAt: "2026-01-20",
  },
  {
    id: "u9",
    code: "USR-009",
    fullName: "Đinh Seller Cũ",
    email: "seller-old@ratravel.vn",
    phone: "0900000009",
    role: "SELLER",
    isActive: false,
    note: "Đã nghỉ việc tháng 3/2026",
    createdAt: "2026-02-01",
  },
  {
    id: "u10",
    code: "USR-010",
    fullName: "Phan Thị Seller C",
    email: "seller-c@ratravel.vn",
    phone: "0900000010",
    role: "SELLER",
    isActive: true,
    createdAt: "2026-02-15",
  },
  {
    id: "u11",
    code: "USR-011",
    fullName: "Trần Văn Bình",
    email: "binh.operator@ratravel.vn",
    phone: "0900000011",
    role: "OPERATOR",
    isActive: true,
    createdAt: "2026-02-15",
  },
  {
    id: "u12",
    code: "USR-012",
    fullName: "Lê Hoàng Nam",
    email: "nam.operator@ratravel.vn",
    phone: "0900000012",
    role: "OPERATOR",
    isActive: true,
    createdAt: "2026-02-20",
  },
  {
    id: "u13",
    code: "USR-013",
    fullName: "Phạm Thu Hà",
    email: "ha.operator@ratravel.vn",
    phone: "0900000013",
    role: "OPERATOR",
    isActive: true,
    createdAt: "2026-02-20",
  },
];

let _nextId = 14;

function genId(): string {
  return `u${_nextId++}`;
}

function genCode(): string {
  return `USR-${String(_nextId).padStart(3, "0")}`;
}

export const userMockStore = {
  getAll: (): User[] => [..._users],

  getById: (id: string): User | undefined => _users.find((u) => u.id === id),

  create: (data: Omit<User, "id" | "createdAt">): User => {
    const newUser: User = {
      ...data,
      id: genId(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    _users = [..._users, newUser];
    return newUser;
  },

  update: (id: string, data: Partial<Omit<User, "id" | "createdAt">>): void => {
    _users = _users.map((u) => (u.id === id ? { ...u, ...data } : u));
  },

  delete: (id: string): void => {
    _users = _users.filter((u) => u.id !== id);
  },

  toggleActive: (id: string): void => {
    _users = _users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u));
  },

  generateCode: (): string => genCode(),
};
