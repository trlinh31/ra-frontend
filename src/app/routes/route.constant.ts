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
    HOTEL_EDIT: "/master-data/hotel/:id/edit",
    HOTEL_DETAIL: "/master-data/hotel/:id",
    TRANSPORTATION: "/master-data/transportation",
    TRANSPORTATION_CREATE: "/master-data/transportation/create",
    TRANSPORTATION_EDIT: "/master-data/transportation/:id",
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
    SUPPLIER: "/master-data/supplier",
    SUPPLIER_CREATE: "/master-data/supplier/create",
    SUPPLIER_EDIT: "/master-data/supplier/:id",
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
