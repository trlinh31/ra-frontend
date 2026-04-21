export type PaymentInstallmentStatus = "pending" | "partial" | "paid" | "overdue";

export type PaymentInstallment = {
  id: string;
  label: string;
  dueDate: string;
  expectedAmount: number;
  actualAmount?: number;
  paidAt?: string;
  paymentMethod?: string;
  status: PaymentInstallmentStatus;
  note: string;
};

export type CustomerPayment = {
  id: string;
  confirmedTourId: string;
  confirmedTourCode: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  installments: PaymentInstallment[];
  createdBy: string;
  createdAt: string;
};
