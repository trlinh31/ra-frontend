export type VendorPaymentStatus = "pending" | "partial" | "paid" | "overdue";

export type VendorPayment = {
  id: string;
  confirmedTourId: string;
  confirmedTourCode: string;
  vendorName: string;
  vendorType: string;
  serviceDescription: string;
  expectedAmount: number;
  actualAmount?: number;
  currency: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  status: VendorPaymentStatus;
  note: string;
  createdBy: string;
  createdAt: string;
};
