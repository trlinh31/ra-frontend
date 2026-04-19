import { Car, FileText, Hotel, Plane, Ticket, UserRound, UtensilsCrossed } from "lucide-react";

export enum ServiceType {
  HOTEL = "hotel",
  TRANSPORT = "transport",
  VISA = "visa",
  ENTRANCE_FEE = "entrance_fee",
  FLIGHT = "flight",
  TOUR_GUIDE = "tour_guide",
  RESTAURANT = "restaurant",
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
  [ServiceType.TOUR_GUIDE]: {
    label: "Hướng dẫn viên",
    icon: <UserRound size={16} />,
  },
  [ServiceType.RESTAURANT]: {
    label: "Nhà hàng",
    icon: <UtensilsCrossed size={16} />,
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
  transportDetail?: {
    transportId: string;
    capacity: string;
  };
  visaDetail?: {
    providerId: string;
    serviceName: string;
  };
  entranceFeeDetail?: {
    entranceFeeId: string;
    pricingPeriodId: string;
    ticketTypeIndex: string;
    dayGroupId: string;
    count: number;
  };
  flightDetail?: {
    flightId: string;
    pricingPeriodId: string;
    seatClassId: string;
    dayGroupId: string;
  };
  tourGuideDetail?: {
    tourGuideId: string;
  };
  restaurantDetail?: {
    restaurantId: string;
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
