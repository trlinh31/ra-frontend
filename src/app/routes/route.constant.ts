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
    GROUP_TOUR: "/master-data/group-tour",
    VISA_FAST_TRACK: "/master-data/visa-fast-track",
    ENTRANCE_FEE: "/master-data/entrance-fee",
    FLIGHTS: "/master-data/flights",
  },
} as const;
