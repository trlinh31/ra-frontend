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
