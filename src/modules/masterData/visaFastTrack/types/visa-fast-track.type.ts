export type VisaServiceGroup = {
  id: string;
  name: string; // ĐÓN, TIỀN, Dịch vụ thêm
};

export type VisaServiceItem = {
  id: string;
  groupId: string;
  serviceName: string;
  priceUsd?: number;
  priceUnit?: string; // e.g. "PAX"
  description: string;
  pickupLocation: string;
};
