import type { CustomerPayment, PaymentInstallment, PaymentInstallmentStatus } from "@/modules/accounting/customerPayment/types/customer-payment.type";

let _payments: CustomerPayment[] = [
  {
    id: "cp1",
    confirmedTourId: "ct1",
    confirmedTourCode: "CT-2026-001",
    customerName: "Đoàn khách Công ty ABC",
    totalAmount: 50_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst1-1",
        label: "Đặt cọc 30%",
        dueDate: "2026-04-20",
        expectedAmount: 15_000_000,
        actualAmount: 15_000_000,
        paidAt: "2026-04-19",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst1-2",
        label: "Thanh toán lần 2 (trước 30 ngày)",
        dueDate: "2026-04-15",
        expectedAmount: 20_000_000,
        status: "overdue",
        note: "Khách hứa sẽ chuyển khoản trong tuần",
      },
      {
        id: "inst1-3",
        label: "Thanh toán còn lại",
        dueDate: "2026-05-08",
        expectedAmount: 15_000_000,
        status: "pending",
        note: "",
      },
    ],
    createdBy: "Kế toán A",
    createdAt: "2026-04-10",
  },
  {
    id: "cp2",
    confirmedTourId: "ct3",
    confirmedTourCode: "CT-2026-003",
    customerName: "Công ty TNHH Ánh Sáng",
    customerPhone: "0901234567",
    customerEmail: "contact@anhsang.com",
    totalAmount: 80_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst2-1",
        label: "Đặt cọc",
        dueDate: "2026-04-18",
        expectedAmount: 24_000_000,
        actualAmount: 24_000_000,
        paidAt: "2026-04-17",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst2-2",
        label: "Lần 2",
        dueDate: "2026-06-10",
        expectedAmount: 32_000_000,
        actualAmount: 20_000_000,
        paidAt: "2026-04-20",
        paymentMethod: "cash",
        status: "partial",
        note: "Khách chỉ có thể trả được 20 triệu trước",
      },
      {
        id: "inst2-3",
        label: "Lần cuối",
        dueDate: "2026-07-03",
        expectedAmount: 24_000_000,
        status: "pending",
        note: "",
      },
    ],
    createdBy: "Kế toán A",
    createdAt: "2026-04-15",
  },
];

let _counter = 3;

function deriveInstallmentStatus(inst: Pick<PaymentInstallment, "expectedAmount" | "actualAmount" | "dueDate">): PaymentInstallmentStatus {
  const paid = inst.actualAmount ?? 0;
  if (paid >= inst.expectedAmount) return "paid";
  if (paid > 0) return "partial";
  if (new Date(inst.dueDate) < new Date()) return "overdue";
  return "pending";
}

/** Tính lại trạng thái overdue của từng installment dựa trên ngày hiện tại */
function withDerivedStatuses(payment: CustomerPayment): CustomerPayment {
  return {
    ...payment,
    installments: payment.installments.map((inst) => {
      // Không ghi đè nếu đã paid hoặc partial (đã có actualAmount)
      if (inst.status === "paid" || inst.status === "partial") return inst;
      return { ...inst, status: deriveInstallmentStatus(inst) };
    }),
  };
}

export const customerPaymentMockStore = {
  getAll: (): CustomerPayment[] => [..._payments].map(withDerivedStatuses),

  getById: (id: string): CustomerPayment | undefined => {
    const p = _payments.find((p) => p.id === id);
    return p ? withDerivedStatuses(p) : undefined;
  },

  getByTourId: (tourId: string): CustomerPayment | undefined => {
    const p = _payments.find((p) => p.confirmedTourId === tourId);
    return p ? withDerivedStatuses(p) : undefined;
  },

  create: (data: Omit<CustomerPayment, "id" | "createdAt">): CustomerPayment => {
    const payment: CustomerPayment = {
      ...data,
      id: `cp${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      installments: data.installments.map((inst, i) => ({
        ...inst,
        id: `inst${Date.now()}-${i}`,
        status: "pending" as PaymentInstallmentStatus,
      })),
    };
    _payments = [..._payments, payment];
    return payment;
  },

  recordInstallmentPayment: (
    paymentId: string,
    installmentId: string,
    data: { actualAmount: number; paidAt: string; paymentMethod: string; note: string }
  ): void => {
    _payments = _payments.map((p) => {
      if (p.id !== paymentId) return p;
      return {
        ...p,
        installments: p.installments.map((inst) => {
          if (inst.id !== installmentId) return inst;
          return {
            ...inst,
            ...data,
            status: deriveInstallmentStatus({ ...inst, actualAmount: data.actualAmount }),
          };
        }),
      };
    });
  },

  delete: (id: string): { success: boolean; message?: string } => {
    const payment = _payments.find((p) => p.id === id);
    if (!payment) return { success: false, message: "Không tìm thấy phiếu thu." };
    const hasRecorded = payment.installments.some((inst) => inst.actualAmount !== undefined && inst.actualAmount > 0);
    if (hasRecorded) {
      return { success: false, message: "Không thể xóa phiếu thu đã có ghi nhận thanh toán. Chỉ được cập nhật trạng thái." };
    }
    _payments = _payments.filter((p) => p.id !== id);
    return { success: true };
  },

  // Computed helpers
  getCollectedAmount: (payment: CustomerPayment): number => payment.installments.reduce((sum, inst) => sum + (inst.actualAmount ?? 0), 0),

  getOverallStatus: (payment: CustomerPayment): PaymentInstallmentStatus => {
    const statuses = payment.installments.map((i) => i.status);
    if (statuses.every((s) => s === "paid")) return "paid";
    if (statuses.some((s) => s === "overdue")) return "overdue";
    if (statuses.some((s) => s === "partial" || s === "paid")) return "partial";
    return "pending";
  },
};
