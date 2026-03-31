import { Car, FileText, Hotel, Plane, Ticket, Users } from "lucide-react";

export enum ServiceType {
  HOTEL = "hotel",
  TRANSPORT = "transport",
  GROUP_TOUR = "group_tour",
  VISA = "visa",
  ENTRANCE_FEE = "entrance_fee",
  FLIGHT = "flight",
}

type ServiceConfig = {
  label: string;
  icon: React.ReactNode;
};

export const SERVICE_TYPE_CONFIG: Record<ServiceType, ServiceConfig> = {
  [ServiceType.HOTEL]: {
    label: "Khách sạn",
    icon: <Hotel size={16} />,
  },
  [ServiceType.TRANSPORT]: {
    label: "Vận chuyển",
    icon: <Car size={16} />,
  },
  [ServiceType.GROUP_TOUR]: {
    label: "Nhóm tour",
    icon: <Users size={16} />,
  },
  [ServiceType.VISA]: {
    label: "Visa",
    icon: <FileText size={16} />,
  },
  [ServiceType.ENTRANCE_FEE]: {
    label: "Phí vào cổng",
    icon: <Ticket size={16} />,
  },
  [ServiceType.FLIGHT]: {
    label: "Chuyến bay",
    icon: <Plane size={16} />,
  },
};

export type DayService = {
  id: string;
  serviceType: ServiceType;
  name: string;
  unitPrice: number;
  currency: string;
  hotelDetail?: {
    hotelId: string;
    pricingPeriodId: string;
    dayGroupId: string;
    roomTypeId: string;
  };
};

export type Day = {
  id: string;
  code: string;
  title: string;
  country: string;
  city: string;
  description: string;
  services: DayService[];
};
