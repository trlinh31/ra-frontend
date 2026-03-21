export const PATHS = {
  ROOT: "/",

  FORBIDDEN: "/forbidden",

  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
  },

  DASHBOARD: "/dashboard",

  MASTER_DATA: {
    ROOT: "/master-data",
    HOTEL: "/master-data/hotel",
    HOTEL_CREATE: "/master-data/hotel/create",
    HOTEL_EDIT: "/master-data/hotel/:id",
    TRANSPORTATION: "/master-data/transportation",
    TRANSPORT_KM: "/master-data/transportation/km",
    TRANSPORT_ROUTE: "/master-data/transportation/route",
    TRANSPORT_KM_CREATE: "/master-data/transportation/km/create",
    TRANSPORT_KM_EDIT: "/master-data/transportation/km/:id",
    TRANSPORT_ROUTE_CREATE: "/master-data/transportation/route/create",
    TRANSPORT_ROUTE_EDIT: "/master-data/transportation/route/:id",
    GROUP_TOUR: "/master-data/group-tour",
    VISA_FAST_TRACK: "/master-data/visa-fast-track",
    ENTRANCE_FEE: "/master-data/entrance-fee",
    FLIGHTS: "/master-data/flights",
  },

  TOUR: {
    ROOT: "/tour",
    DAYS: "/tour/days",
    DAY_CREATE: "/tour/days/create",
    DAY_EDIT: "/tour/days/:id",
    TOURS: "/tour/tours",
    TOUR_CREATE: "/tour/tours/create",
    TOUR_EDIT: "/tour/tours/:id",
  },
} as const;
