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
    TOUR_GUIDE: "/master-data/tour-guide",
    TOUR_GUIDE_CREATE: "/master-data/tour-guide/create",
    TOUR_GUIDE_EDIT: "/master-data/tour-guide/:id",
    RESTAURANT: "/master-data/restaurant",
    RESTAURANT_CREATE: "/master-data/restaurant/create",
    RESTAURANT_EDIT: "/master-data/restaurant/:id",
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

  SALES: {
    ROOT: "/sales",
    /** Trip Request */
    TRIP_REQUESTS: "/sales/trip-requests",
    TRIP_REQUEST_CREATE: "/sales/trip-requests/create",
    TRIP_REQUEST_DETAIL: "/sales/trip-requests/:id",
    /** Báo giá */
    QUOTATIONS: "/sales/quotations",
    QUOTATION_CREATE: "/sales/quotations/create",
    QUOTATION_DETAIL: "/sales/quotations/:id",
    QUOTATION_PRINT: "/sales/quotations/:id/print",
    QUOTATION_EDIT: "/sales/quotations/:id/edit",
    /** Confirm Tour */
    CONFIRMED_TOURS: "/sales/confirmed-tours",
    CONFIRMED_TOUR_CREATE: "/sales/confirmed-tours/create",
    CONFIRMED_TOUR_DETAIL: "/sales/confirmed-tours/:id",
  },

  ACCOUNTING: {
    ROOT: "/accounting",
    CUSTOMER_PAYMENTS: "/accounting/customer-payments",
    CUSTOMER_PAYMENT_CREATE: "/accounting/customer-payments/create",
    CUSTOMER_PAYMENT_DETAIL: "/accounting/customer-payments/:id",
    VENDOR_PAYMENTS: "/accounting/vendor-payments",
    VENDOR_PAYMENT_CREATE: "/accounting/vendor-payments/create",
  },

  USER_MANAGEMENT: {
    ROOT: "/users",
    USERS: "/users",
    USER_CREATE: "/users/create",
    USER_EDIT: "/users/:id/edit",
  },

  NOTIFICATIONS: {
    ROOT: "/notifications",
  },
} as const;
