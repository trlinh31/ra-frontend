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
    name: "Công ty CP Du Lịch Sao Việt",
    phone: "0234567890",
    email: "info@saoviet.com",
    taxCode: "0201234568",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    address: "45 Nguyễn Huệ, Quận 1",
    isActive: true,
  },
  {
    id: "3",
    code: "SUP103",
    name: "Công ty TNHH Dịch Vụ Lữ Hành Phương Nam",
    phone: "0345678901",
    email: "booking@phuongnam.vn",
    taxCode: "0301234569",
    country: "Vietnam",
    city: "Da Nang",
    address: "78 Bạch Đằng, Hải Châu",
    isActive: true,
  },
  {
    id: "4",
    code: "SUP104",
    name: "Công ty CP Vận Chuyển Du Lịch Hoàng Gia",
    phone: "0456789012",
    email: "support@hoanggiatravel.com",
    taxCode: "0401234570",
    country: "Vietnam",
    city: "Hanoi",
    address: "56 Trần Duy Hưng, Cầu Giấy",
    isActive: true,
  },
  {
    id: "5",
    code: "SUP105",
    name: "Công ty TNHH Khách Sạn Và Resort Biển Xanh",
    phone: "0567890123",
    email: "contact@bienxanh.com.vn",
    taxCode: "0501234571",
    country: "Vietnam",
    city: "Nha Trang",
    address: "12 Trần Phú, Lộc Thọ",
    isActive: true,
  },
  {
    id: "6",
    code: "SUP106",
    name: "Công ty CP Hàng Không Dịch Vụ Thiên Long",
    phone: "0678901234",
    email: "ops@thienlong-aviation.com",
    taxCode: "0601234572",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    address: "200 Hoàng Văn Thụ, Phú Nhuận",
    isActive: false,
  },
  {
    id: "7",
    code: "SUP107",
    name: "Công ty TNHH Du Lịch Mekong Explorer",
    phone: "0789012345",
    email: "hello@mekongexplorer.vn",
    taxCode: "0701234573",
    country: "Vietnam",
    city: "Can Tho",
    address: "34 Hòa Bình, Ninh Kiều",
    isActive: true,
  },
  {
    id: "8",
    code: "SUP108",
    name: "Công ty CP Dịch Vụ Du Lịch Đông Dương",
    phone: "0890123456",
    email: "sales@dongduong-travel.com",
    taxCode: "0801234574",
    country: "Vietnam",
    city: "Hue",
    address: "99 Lê Lợi, Vĩnh Ninh",
    isActive: true,
  },
  {
    id: "9",
    code: "SUP109",
    name: "Công ty TNHH Dịch Vụ Visa Và Hộ Chiếu Toàn Cầu",
    phone: "0901234567",
    email: "visa@toancau-service.vn",
    taxCode: "0901234575",
    country: "Vietnam",
    city: "Hanoi",
    address: "18 Lý Thường Kiệt, Hoàn Kiếm",
    isActive: true,
  },
  {
    id: "10",
    code: "SUP110",
    name: "Công ty CP Giải Trí Và Du Lịch Mặt Trời",
    phone: "0912345678",
    email: "contact@mattroitravel.vn",
    taxCode: "1001234576",
    country: "Vietnam",
    city: "Phu Quoc",
    address: "5 Đường Trần Hưng Đạo, Dương Đông",
    isActive: false,
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
