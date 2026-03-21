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
    GROUP_TOUR_CREATE: "/master-data/group-tour/create",
    GROUP_TOUR_EDIT: "/master-data/group-tour/:id",
    VISA_FAST_TRACK: "/master-data/visa-fast-track",
    VISA_FAST_TRACK_CREATE: "/master-data/visa-fast-track/create",
    VISA_FAST_TRACK_EDIT: "/master-data/visa-fast-track/:id",
    ENTRANCE_FEE: "/master-data/entrance-fee",
    ENTRANCE_FEE_CREATE: "/master-data/entrance-fee/create",
    ENTRANCE_FEE_EDIT: "/master-data/entrance-fee/:id",
    FLIGHTS: "/master-data/flights",
    FLIGHTS_CREATE: "/master-data/flights/create",
    FLIGHTS_EDIT: "/master-data/flights/:id",
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
