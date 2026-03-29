import type { Supplier } from "@/modules/masterData/supplier/types/supplier.type";

const initialSuppliers: Supplier[] = [
  {
    id: "1",
    code: "SUP101",
    name: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    phone: "0123456789",
    email: "contact@anhduong.com",
    taxCode: "0101234567",
    country: "Vietnam",
    city: "Hanoi",
    address: "123 Đường Láng, Đống Đa",
    isActive: true,
  },
  {
    id: "2",
    code: "SUP102",
    name: "SB Tân Sơn Nhất",
    phone: "0123456789",
    email: "contact@anhduong.com",
    taxCode: "0101234567",
    country: "Vietnam",
    city: "Phu Nhuan",
    address: "Tân Sơn Nhất, Phú Nhuận",
    isActive: true,
  },
  {
    id: "3",
    code: "SUP103",
    name: "SB Nội Bài",
    phone: "0123456789",
    email: "contact@anhduong.com",
    taxCode: "0101234567",
    country: "Vietnam",
    city: "Hanoi",
    address: "Nội Bài, Sóc Sơn",
    isActive: true,
  },
  {
    id: "4",
    code: "SUP104",
    name: "SB Đà Nẵng",
    phone: "0123456789",
    email: "contact@anhduong.com",
    taxCode: "0101234567",
    country: "Vietnam",
    city: "Da Nang",
    address: "SB Đà Nẵng, Đà Nẵng",
    isActive: true,
  },
];

let _suppliers: Supplier[] = [...initialSuppliers];

export const supplierMockStore = {
  getAll: (): Supplier[] => [..._suppliers],

  getById: (id: string): Supplier | undefined => _suppliers.find((supplier) => supplier.id === id),

  create: (data: Omit<Supplier, "id">) => {
    const supplier: Supplier = { ...data, id: String(Date.now()) };
    _suppliers = [..._suppliers, supplier];
    return supplier;
  },

  update: (id: string, data: Omit<Supplier, "id">) => {
    const supplier: Supplier = { ...data, id };
    _suppliers = _suppliers.map((s) => (s.id === id ? supplier : s));
    return supplier;
  },

  delete: (id: string) => {
    _suppliers = _suppliers.filter((s) => s.id !== id);
  },
};
