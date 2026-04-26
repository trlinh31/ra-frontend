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
  // cp3 – CT-2026-005 (BIDV, completed) – đã thanh toán đủ
  {
    id: "cp3",
    confirmedTourId: "ct5",
    confirmedTourCode: "CT-2026-005",
    customerName: "Đoàn khách Ngân hàng BIDV",
    customerPhone: "0243332211",
    totalAmount: 140_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst3-1",
        label: "Đặt cọc 30%",
        dueDate: "2026-02-01",
        expectedAmount: 42_000_000,
        actualAmount: 42_000_000,
        paidAt: "2026-01-30",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst3-2",
        label: "Thanh toán 50%",
        dueDate: "2026-02-28",
        expectedAmount: 70_000_000,
        actualAmount: 70_000_000,
        paidAt: "2026-02-26",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst3-3",
        label: "Thanh toán còn lại",
        dueDate: "2026-03-09",
        expectedAmount: 28_000_000,
        actualAmount: 28_000_000,
        paidAt: "2026-03-08",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "Thanh toán đầy đủ trước tour 1 ngày",
      },
    ],
    createdBy: "Kế toán A",
    createdAt: "2026-01-25",
  },
  // cp4 – CT-2026-004 (Vingroup) – tour lớn, đặt cọc xong, còn lại chưa thanh toán
  {
    id: "cp4",
    confirmedTourId: "ct4",
    confirmedTourCode: "CT-2026-004",
    customerName: "Đoàn khách Công ty Vingroup",
    customerPhone: "0912000999",
    customerEmail: "travel@vingroup.net",
    totalAmount: 480_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst4-1",
        label: "Đặt cọc 20%",
        dueDate: "2026-04-25",
        expectedAmount: 96_000_000,
        actualAmount: 96_000_000,
        paidAt: "2026-04-24",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst4-2",
        label: "Thanh toán 50% (trước 60 ngày)",
        dueDate: "2026-08-06",
        expectedAmount: 240_000_000,
        status: "pending",
        note: "",
      },
      {
        id: "inst4-3",
        label: "Thanh toán còn lại (trước 14 ngày)",
        dueDate: "2026-09-21",
        expectedAmount: 144_000_000,
        status: "pending",
        note: "",
      },
    ],
    createdBy: "Kế toán A",
    createdAt: "2026-04-23",
  },
  // cp5 – CT-2026-009 (Masan, in_operation) – đặt cọc + lần 2 đã trả, lần cuối pending
  {
    id: "cp5",
    confirmedTourId: "ct9",
    confirmedTourCode: "CT-2026-009",
    customerName: "Đoàn khách Tập đoàn Masan",
    customerPhone: "0288000333",
    totalAmount: 200_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst5-1",
        label: "Đặt cọc 30%",
        dueDate: "2026-04-01",
        expectedAmount: 60_000_000,
        actualAmount: 60_000_000,
        paidAt: "2026-03-30",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst5-2",
        label: "Thanh toán 50%",
        dueDate: "2026-04-20",
        expectedAmount: 100_000_000,
        actualAmount: 100_000_000,
        paidAt: "2026-04-18",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst5-3",
        label: "Thanh toán còn lại",
        dueDate: "2026-05-05",
        expectedAmount: 40_000_000,
        status: "pending",
        note: "Thanh toán sau khi tour kết thúc",
      },
    ],
    createdBy: "Kế toán B",
    createdAt: "2026-03-25",
  },
  // cp6 – CT-2026-007 (Leo núi Hà Nội, draft) – chỉ đặt cọc
  {
    id: "cp6",
    confirmedTourId: "ct7",
    confirmedTourCode: "CT-2026-007",
    customerName: "Câu lạc bộ leo núi Hà Nội",
    customerPhone: "0989334455",
    totalAmount: 45_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst6-1",
        label: "Đặt cọc giữ chỗ",
        dueDate: "2026-04-30",
        expectedAmount: 9_000_000,
        actualAmount: 9_000_000,
        paidAt: "2026-04-25",
        paymentMethod: "cash",
        status: "paid",
        note: "Nhận tiền mặt tại văn phòng",
      },
      {
        id: "inst6-2",
        label: "Thanh toán 60%",
        dueDate: "2026-06-01",
        expectedAmount: 27_000_000,
        status: "pending",
        note: "",
      },
      {
        id: "inst6-3",
        label: "Thanh toán còn lại",
        dueDate: "2026-06-10",
        expectedAmount: 9_000_000,
        status: "pending",
        note: "",
      },
    ],
    createdBy: "Kế toán B",
    createdAt: "2026-04-24",
  },
  // cp7 – CT-2026-008 (Trường Chu Văn An) – đoàn lớn, đặt cọc trả thiếu
  {
    id: "cp7",
    confirmedTourId: "ct8",
    confirmedTourCode: "CT-2026-008",
    customerName: "Trường THPT Chu Văn An",
    customerPhone: "0243456789",
    customerEmail: "chuvan.travel@gmail.com",
    totalAmount: 125_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst7-1",
        label: "Đặt cọc 25%",
        dueDate: "2026-04-26",
        expectedAmount: 31_250_000,
        actualAmount: 25_000_000,
        paidAt: "2026-04-25",
        paymentMethod: "bank_transfer",
        status: "partial",
        note: "Nhà trường chỉ chuyển được 25M, hứa bù phần còn thiếu tuần tới",
      },
      {
        id: "inst7-2",
        label: "Thanh toán 50%",
        dueDate: "2026-05-10",
        expectedAmount: 62_500_000,
        status: "pending",
        note: "",
      },
      {
        id: "inst7-3",
        label: "Thanh toán còn lại",
        dueDate: "2026-05-20",
        expectedAmount: 31_250_000,
        status: "pending",
        note: "",
      },
    ],
    createdBy: "Kế toán A",
    createdAt: "2026-04-25",
  },
  // cp8 – CT-2026-002 (Gia đình anh Minh) – nhỏ, đặt cọc xong
  {
    id: "cp8",
    confirmedTourId: "ct2",
    confirmedTourCode: "CT-2026-002",
    customerName: "Gia đình anh Minh",
    totalAmount: 18_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst8-1",
        label: "Đặt cọc",
        dueDate: "2026-04-20",
        expectedAmount: 5_400_000,
        actualAmount: 5_400_000,
        paidAt: "2026-04-19",
        paymentMethod: "cash",
        status: "paid",
        note: "",
      },
      {
        id: "inst8-2",
        label: "Thanh toán còn lại",
        dueDate: "2026-05-25",
        expectedAmount: 12_600_000,
        status: "pending",
        note: "",
      },
    ],
    createdBy: "Kế toán B",
    createdAt: "2026-04-18",
  },
  // cp9 – CT-2026-010 (Gia đình anh Khôi, Nhật Bản) – tour xa, đặt cọc
  {
    id: "cp9",
    confirmedTourId: "ct10",
    confirmedTourCode: "CT-2026-010",
    customerName: "Gia đình anh Khôi",
    customerPhone: "0908765432",
    customerEmail: "khoi.family@gmail.com",
    totalAmount: 160_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst9-1",
        label: "Đặt cọc 20%",
        dueDate: "2026-04-30",
        expectedAmount: 32_000_000,
        actualAmount: 32_000_000,
        paidAt: "2026-04-26",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst9-2",
        label: "Thanh toán 50% (trước 60 ngày)",
        dueDate: "2026-09-11",
        expectedAmount: 80_000_000,
        status: "pending",
        note: "",
      },
      {
        id: "inst9-3",
        label: "Thanh toán còn lại (trước 14 ngày)",
        dueDate: "2026-10-27",
        expectedAmount: 48_000_000,
        status: "pending",
        note: "",
      },
    ],
    createdBy: "Kế toán A",
    createdAt: "2026-04-25",
  },
  // cp10 – CT-2026-006 (Phú Quốc, cancelled) – đã thu và hoàn tiền 80%
  {
    id: "cp10",
    confirmedTourId: "ct6",
    confirmedTourCode: "CT-2026-006",
    customerName: "Nhóm khách lẻ Phú Quốc",
    customerPhone: "0977998877",
    totalAmount: 35_000_000,
    currency: "VND",
    installments: [
      {
        id: "inst10-1",
        label: "Đặt cọc 30%",
        dueDate: "2026-03-20",
        expectedAmount: 10_500_000,
        actualAmount: 10_500_000,
        paidAt: "2026-03-19",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "",
      },
      {
        id: "inst10-2",
        label: "Hoàn tiền 80% (sau hủy tour)",
        dueDate: "2026-04-15",
        expectedAmount: 8_400_000,
        actualAmount: 8_400_000,
        paidAt: "2026-04-12",
        paymentMethod: "bank_transfer",
        status: "paid",
        note: "Đã hoàn 80% tiền cọc theo chính sách hủy tour",
      },
    ],
    createdBy: "Kế toán B",
    createdAt: "2026-03-18",
  },
];

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
