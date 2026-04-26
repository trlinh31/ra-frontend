import type { VendorPayment, VendorPaymentStatus } from "@/modules/accounting/vendorPayment/types/vendor-payment.type";

let _payments: VendorPayment[] = [
  {
    id: "vp1",
    confirmedTourId: "ct1",
    confirmedTourCode: "CT-2026-001",
    vendorName: "Khách sạn Ánh Dương",
    vendorType: "hotel",
    serviceDescription: "Phòng đôi 2 đêm (13–15/05/2026) × 6 phòng",
    expectedAmount: 10_200_000,
    currency: "VND",
    dueDate: "2026-05-10",
    status: "pending",
    note: "",
    createdBy: "Kế toán A",
    createdAt: "2026-04-12",
  },
  {
    id: "vp2",
    confirmedTourId: "ct1",
    confirmedTourCode: "CT-2026-001",
    vendorName: "Nhà hàng Hải Sản Biển Đông",
    vendorType: "restaurant",
    serviceDescription: "Bữa tối ngày 14/05/2026 × 12 khách",
    expectedAmount: 3_600_000,
    currency: "VND",
    dueDate: "2026-05-14",
    status: "pending",
    note: "",
    createdBy: "Kế toán A",
    createdAt: "2026-04-12",
  },
  {
    id: "vp3",
    confirmedTourId: "ct3",
    confirmedTourCode: "CT-2026-003",
    vendorName: "Vietnam Airlines",
    vendorType: "flight",
    serviceDescription: "HAN–SGN Economy × 20 khách (10/07/2026)",
    expectedAmount: 2_200,
    actualAmount: 2_200,
    currency: "USD",
    dueDate: "2026-06-30",
    paidAt: "2026-04-20",
    paymentMethod: "bank_transfer",
    status: "paid",
    note: "",
    createdBy: "Kế toán A",
    createdAt: "2026-04-16",
  },
  // vp4 – CT-2026-005 (BIDV, completed) – khách sạn Đà Nẵng, đã thanh toán
  {
    id: "vp4",
    confirmedTourId: "ct5",
    confirmedTourCode: "CT-2026-005",
    vendorName: "Khách sạn Mường Thanh Grand Đà Nẵng",
    vendorType: "hotel",
    serviceDescription: "Phòng đôi 2 đêm (10–12/03/2026) × 18 phòng",
    expectedAmount: 36_000_000,
    actualAmount: 36_000_000,
    currency: "VND",
    dueDate: "2026-03-08",
    paidAt: "2026-03-07",
    paymentMethod: "bank_transfer",
    status: "paid",
    note: "",
    createdBy: "Kế toán A",
    createdAt: "2026-02-25",
  },
  // vp5 – CT-2026-005 (BIDV) – vé máy bay, đã thanh toán
  {
    id: "vp5",
    confirmedTourId: "ct5",
    confirmedTourCode: "CT-2026-005",
    vendorName: "VietJet Air",
    vendorType: "flight",
    serviceDescription: "HAN–DAD Economy × 35 khách (10/03/2026)",
    expectedAmount: 52_500_000,
    actualAmount: 52_500_000,
    currency: "VND",
    dueDate: "2026-03-03",
    paidAt: "2026-03-02",
    paymentMethod: "bank_transfer",
    status: "paid",
    note: "",
    createdBy: "Kế toán A",
    createdAt: "2026-02-25",
  },
  // vp6 – CT-2026-004 (Vingroup) – khách sạn Singapore, sắp đến hạn
  {
    id: "vp6",
    confirmedTourId: "ct4",
    confirmedTourCode: "CT-2026-004",
    vendorName: "Marina Bay Sands",
    vendorType: "hotel",
    serviceDescription: "Deluxe Room 3 đêm (05–08/10/2026) × 15 phòng",
    expectedAmount: 8_500,
    currency: "USD",
    dueDate: "2026-04-30",
    status: "pending",
    note: "Cần thanh toán deposit 50% trước 30/04 để giữ phòng",
    createdBy: "Kế toán A",
    createdAt: "2026-04-23",
  },
  // vp7 – CT-2026-009 (Masan) – hướng dẫn viên, đang chờ
  {
    id: "vp7",
    confirmedTourId: "ct9",
    confirmedTourCode: "CT-2026-009",
    vendorName: "Hướng dẫn viên Nguyễn Văn Lực",
    vendorType: "tour_guide",
    serviceDescription: "Hướng dẫn tour Nha Trang - Đà Lạt 4 ngày (24–27/04/2026)",
    expectedAmount: 4_800_000,
    currency: "VND",
    dueDate: "2026-04-28",
    status: "pending",
    note: "Thanh toán sau khi kết thúc tour",
    createdBy: "Kế toán B",
    createdAt: "2026-04-15",
  },
  // vp8 – CT-2026-009 (Masan) – nhà hàng Nha Trang, đã trả
  {
    id: "vp8",
    confirmedTourId: "ct9",
    confirmedTourCode: "CT-2026-009",
    vendorName: "Nhà hàng Cầu Đá Nha Trang",
    vendorType: "restaurant",
    serviceDescription: "Tiệc hải sản tối ngày 24/04/2026 × 50 khách",
    expectedAmount: 12_500_000,
    actualAmount: 12_500_000,
    currency: "VND",
    dueDate: "2026-04-24",
    paidAt: "2026-04-24",
    paymentMethod: "cash",
    status: "paid",
    note: "",
    createdBy: "Kế toán B",
    createdAt: "2026-04-15",
  },
  // vp9 – CT-2026-008 (Chu Văn An) – vận chuyển xe 45 chỗ
  {
    id: "vp9",
    confirmedTourId: "ct8",
    confirmedTourCode: "CT-2026-008",
    vendorName: "Xe du lịch Phúc Lộc",
    vendorType: "transport",
    serviceDescription: "3 xe 45 chỗ HN–Củ Chi–HN (25/05/2026)",
    expectedAmount: 15_000_000,
    currency: "VND",
    dueDate: "2026-05-22",
    status: "pending",
    note: "Đặt cọc 5M đã thỏa thuận, phần còn lại thanh toán trước ngày đi",
    createdBy: "Kế toán A",
    createdAt: "2026-04-25",
  },
  // vp10 – CT-2026-004 (Vingroup) – vé máy bay Singapore, chờ thanh toán
  {
    id: "vp10",
    confirmedTourId: "ct4",
    confirmedTourCode: "CT-2026-004",
    vendorName: "Singapore Airlines",
    vendorType: "flight",
    serviceDescription: "HAN–SIN Business × 30 khách (05/10/2026)",
    expectedAmount: 72_000,
    currency: "USD",
    dueDate: "2026-09-05",
    status: "pending",
    note: "Giá đã bao gồm phí hành lý và bữa ăn",
    createdBy: "Kế toán A",
    createdAt: "2026-04-23",
  },
];

export const vendorPaymentMockStore = {
  getAll: (): VendorPayment[] => [..._payments],

  getById: (id: string): VendorPayment | undefined => _payments.find((p) => p.id === id),

  getByTourId: (tourId: string): VendorPayment[] => _payments.filter((p) => p.confirmedTourId === tourId),

  create: (data: Omit<VendorPayment, "id" | "createdAt">): VendorPayment => {
    const payment: VendorPayment = {
      ...data,
      id: `vp${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    _payments = [..._payments, payment];
    return payment;
  },

  recordPayment: (id: string, data: { actualAmount: number; paidAt: string; paymentMethod: string; note: string }): void => {
    _payments = _payments.map((p) => {
      if (p.id !== id) return p;
      const status: VendorPaymentStatus = data.actualAmount >= p.expectedAmount ? "paid" : "partial";
      return { ...p, ...data, status };
    });
  },

  delete: (id: string): void => {
    _payments = _payments.filter((p) => p.id !== id);
  },
};
