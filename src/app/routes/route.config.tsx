import {
  Banknote,
  Bell,
  Box,
  Bus,
  CalendarDays,
  ClipboardCheck,
  Compass,
  Container,
  CreditCard,
  FileText,
  Hotel,
  LayoutGrid,
  MapPin,
  PhoneCall,
  Plane,
  Shield,
  ShoppingBag,
  Ticket,
  Truck,
  UserCog,
  UserRound,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { PATHS } from "./route.constant";
import type { AppRoute } from "./route.type";

// ── Lazy page imports ──────────────────────────────────────────────────────
// Accounting
const CreateCustomerPaymentPage = lazy(() => import("@/modules/accounting/customerPayment/pages/CreateCustomerPaymentPage"));
const CustomerPaymentDetailPage = lazy(() => import("@/modules/accounting/customerPayment/pages/CustomerPaymentDetailPage"));
const CustomerPaymentListPage = lazy(() => import("@/modules/accounting/customerPayment/pages/CustomerPaymentListPage"));
const CreateVendorPaymentPage = lazy(() => import("@/modules/accounting/vendorPayment/pages/CreateVendorPaymentPage"));
const VendorPaymentListPage = lazy(() => import("@/modules/accounting/vendorPayment/pages/VendorPaymentListPage"));
// Auth
const LoginPage = lazy(() => import("@/modules/auth/login").then((m) => ({ default: m.LoginPage })));
// Dashboard
const DashboardPage = lazy(() => import("@/modules/dashboard"));
// Master Data
const EntranceFeeListPage = lazy(() => import("@/modules/masterData/entranceFee"));
const EditEntranceFeePage = lazy(() => import("@/modules/masterData/entranceFee/pages/EditEntranceFeePage"));
const FlightListPage = lazy(() => import("@/modules/masterData/flights"));
const EditFlightPage = lazy(() => import("@/modules/masterData/flights/pages/EditFlightPage"));
const GroupTourListPage = lazy(() => import("@/modules/masterData/groupTour"));
const EditGroupTourPage = lazy(() => import("@/modules/masterData/groupTour/pages/EditGroupTourPage"));
const HotelListPage = lazy(() => import("@/modules/masterData/hotel").then((m) => ({ default: m.HotelListPage })));
const EditHotelPage = lazy(() => import("@/modules/masterData/hotel").then((m) => ({ default: m.EditHotelPage })));
const HotelDetailPage = lazy(() => import("@/modules/masterData/hotel").then((m) => ({ default: m.HotelDetailPage })));
const EditRestaurantPage = lazy(() => import("@/modules/masterData/restaurant/pages/EditRestaurantPage"));
const RestaurantListPage = lazy(() => import("@/modules/masterData/restaurant/pages/RestaurantListPage"));
const EditSupplierPage = lazy(() => import("@/modules/masterData/supplier/pages/EditSupplierPage"));
const SupplierListPage = lazy(() => import("@/modules/masterData/supplier/pages/SupplierListPage"));
const EditTourGuidePage = lazy(() => import("@/modules/masterData/tourGuide/pages/EditTourGuidePage"));
const TourGuideListPage = lazy(() => import("@/modules/masterData/tourGuide/pages/TourGuideListPage"));
const TransportationListPage = lazy(() => import("@/modules/masterData/transportation"));
const EditTransportationPage = lazy(() => import("@/modules/masterData/transportation/pages/EditTransportationPage"));
const VisaFastTrackListPage = lazy(() => import("@/modules/masterData/visaFastTrack"));
const EditVisaFastTrackPage = lazy(() => import("@/modules/masterData/visaFastTrack/pages/EditVisaFastTrackPage"));
// Sales — Confirmed Tour
const ConfirmedTourDetailPage = lazy(() => import("@/modules/sales/confirmedTour/pages/ConfirmedTourDetailPage"));
const ConfirmedTourListPage = lazy(() => import("@/modules/sales/confirmedTour/pages/ConfirmedTourListPage"));
const CreateConfirmedTourPage = lazy(() => import("@/modules/sales/confirmedTour/pages/CreateConfirmedTourPage"));
// Sales — Quotation
const CreateQuotationPage = lazy(() => import("@/modules/sales/quotation/pages/CreateQuotationPage"));
const EditQuotationPage = lazy(() => import("@/modules/sales/quotation/pages/EditQuotationPage"));
const QuotationDetailPage = lazy(() => import("@/modules/sales/quotation/pages/QuotationDetailPage"));
const QuotationListPage = lazy(() => import("@/modules/sales/quotation/pages/QuotationListPage"));
const QuotationPrintPage = lazy(() => import("@/modules/sales/quotation/pages/QuotationPrintPage"));
// Sales — Trip Request
const CreateTripRequestPage = lazy(() => import("@/modules/sales/tripRequest/pages/CreateTripRequestPage"));
const TripRequestDetailPage = lazy(() => import("@/modules/sales/tripRequest/pages/TripRequestDetailPage"));
const TripRequestListPage = lazy(() => import("@/modules/sales/tripRequest/pages/TripRequestListPage"));
// Tour
const DayListPage = lazy(() => import("@/modules/tour/day"));
const EditDayPage = lazy(() => import("@/modules/tour/day/pages/EditDayPage"));
const TourListPage = lazy(() => import("@/modules/tour/tour"));
const EditTourPage = lazy(() => import("@/modules/tour/tour/pages/EditTourPage"));
// Notification
const NotificationListPage = lazy(() => import("@/modules/notification").then((m) => ({ default: m.NotificationListPage })));
// Operations
const OperationDetailPage = lazy(() => import("@/modules/operations").then((m) => ({ default: m.OperationDetailPage })));
const OperatorToursPage = lazy(() => import("@/modules/operations").then((m) => ({ default: m.OperatorToursPage })));
// User Management
const EditUserPage = lazy(() => import("@/modules/userManagement/pages/EditUserPage"));
const UserListPage = lazy(() => import("@/modules/userManagement/pages/UserListPage"));
// Layout
import DashboardLayout from "@/shared/layouts/DashboardLayout";

export const APP_ROUTES: AppRoute[] = [
  {
    path: PATHS.ROOT,
    element: <Navigate to={PATHS.DASHBOARD} replace />,
  },
  // ── Auth — ngoài DashboardLayout, không cần đăng nhập ────────────────────
  {
    path: PATHS.AUTH.LOGIN,
    element: <LoginPage />,
    showInSidebar: false,
    isPublic: true,
  },
  // ── Trang in báo giá — full-screen, ngoài DashboardLayout ──
  {
    path: PATHS.SALES.QUOTATION_PRINT,
    element: <QuotationPrintPage />,
    showInSidebar: false,
    isPublic: true,
  },
  {
    path: PATHS.ROOT,
    element: <DashboardLayout />,
    children: [
      {
        path: PATHS.DASHBOARD,
        title: "Dashboard",
        pageTitle: "Tổng quan hệ thống",
        element: <DashboardPage />,
        icon: LayoutGrid,
        showInSidebar: true,
      },
      {
        path: PATHS.MASTER_DATA.ROOT,
        title: "Quản lý Master Data",
        pageTitle: "Quản lý Master Data",
        icon: Box,
        showInSidebar: true,
        children: [
          {
            path: PATHS.MASTER_DATA.SUPPLIER,
            title: "Nhà cung cấp",
            pageTitle: "Quản lý nhà cung cấp",
            element: <SupplierListPage />,
            icon: Container,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.SUPPLIER_CREATE,
            element: <EditSupplierPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.SUPPLIER_EDIT,
            element: <EditSupplierPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.TOUR_GUIDE,
            title: "Hướng dẫn viên",
            pageTitle: "Quản lý hướng dẫn viên",
            element: <TourGuideListPage />,
            icon: UserRound,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.TOUR_GUIDE_CREATE,
            element: <EditTourGuidePage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.TOUR_GUIDE_EDIT,
            element: <EditTourGuidePage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.RESTAURANT,
            title: "Nhà hàng",
            pageTitle: "Quản lý nhà hàng",
            element: <RestaurantListPage />,
            icon: UtensilsCrossed,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.RESTAURANT_CREATE,
            element: <EditRestaurantPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.RESTAURANT_EDIT,
            element: <EditRestaurantPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.HOTEL,
            title: "Khách sạn",
            pageTitle: "Quản lý khách sạn",
            element: <HotelListPage />,
            icon: Hotel,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.HOTEL_CREATE,
            element: <EditHotelPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.HOTEL_EDIT,
            element: <EditHotelPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.HOTEL_DETAIL,
            element: <HotelDetailPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.TRANSPORTATION,
            title: "Vận chuyển",
            pageTitle: "Quản lý vận chuyển",
            element: <TransportationListPage />,
            icon: Bus,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.TRANSPORTATION_CREATE,
            element: <EditTransportationPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.TRANSPORTATION_EDIT,
            element: <EditTransportationPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.GROUP_TOUR,
            title: "Nhóm Tour",
            pageTitle: "Quản lý Nhóm Tour",
            element: <GroupTourListPage />,
            icon: MapPin,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.GROUP_TOUR_CREATE,
            element: <EditGroupTourPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.GROUP_TOUR_EDIT,
            element: <EditGroupTourPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.VISA_FAST_TRACK,
            title: "Visa + Fast Track",
            pageTitle: "Quản lý Visa + Fast Track",
            element: <VisaFastTrackListPage />,
            icon: Shield,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.VISA_FAST_TRACK_CREATE,
            element: <EditVisaFastTrackPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.VISA_FAST_TRACK_EDIT,
            element: <EditVisaFastTrackPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.ENTRANCE_FEE,
            title: "Phí vào cổng",
            pageTitle: "Quản lý phí vào cổng",
            element: <EntranceFeeListPage />,
            icon: Ticket,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.ENTRANCE_FEE_CREATE,
            element: <EditEntranceFeePage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.ENTRANCE_FEE_EDIT,
            element: <EditEntranceFeePage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.FLIGHTS,
            title: "Chuyến bay",
            pageTitle: "Quản lý Chuyến bay",
            element: <FlightListPage />,
            icon: Plane,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.FLIGHTS_CREATE,
            element: <EditFlightPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.FLIGHTS_EDIT,
            element: <EditFlightPage />,
            showInSidebar: false,
          },
        ],
      },
      {
        path: PATHS.TOUR.ROOT,
        title: "Quản lý Tour",
        pageTitle: "Quản lý Tour",
        icon: Compass,
        showInSidebar: true,
        children: [
          {
            path: PATHS.TOUR.DAYS,
            title: "Ngày hành trình",
            pageTitle: "Quản lý ngày hành trình",
            element: <DayListPage />,
            icon: CalendarDays,
            showInSidebar: true,
          },
          {
            path: PATHS.TOUR.DAY_CREATE,
            element: <EditDayPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.TOUR.DAY_EDIT,
            element: <EditDayPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.TOUR.TOURS,
            title: "Danh sách tour",
            pageTitle: "Quản lý danh sách tour",
            element: <TourListPage />,
            icon: Compass,
            showInSidebar: true,
          },
          {
            path: PATHS.TOUR.TOUR_CREATE,
            element: <EditTourPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.TOUR.TOUR_EDIT,
            element: <EditTourPage />,
            showInSidebar: false,
          },
        ],
      },
      {
        path: PATHS.SALES.ROOT,
        title: "Phòng Sales",
        pageTitle: "Phòng Sales",
        icon: ShoppingBag,
        showInSidebar: true,
        children: [
          // ── Trip Request ──────────────────────────────────────────
          {
            path: PATHS.SALES.TRIP_REQUESTS,
            title: "Trip Request",
            pageTitle: "Danh sách Trip Request",
            element: <TripRequestListPage />,
            icon: PhoneCall,
            showInSidebar: true,
          },
          {
            path: PATHS.SALES.TRIP_REQUEST_CREATE,
            element: <CreateTripRequestPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.SALES.TRIP_REQUEST_DETAIL,
            element: <TripRequestDetailPage />,
            showInSidebar: false,
          },
          // ── Báo giá ──────────────────────────────────────────────
          {
            path: PATHS.SALES.QUOTATIONS,
            title: "Báo giá",
            pageTitle: "Quản lý Báo giá",
            element: <QuotationListPage />,
            icon: FileText,
            showInSidebar: true,
          },
          {
            path: PATHS.SALES.QUOTATION_CREATE,
            element: <CreateQuotationPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.SALES.QUOTATION_DETAIL,
            element: <QuotationDetailPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.SALES.QUOTATION_EDIT,
            element: <EditQuotationPage />,
            showInSidebar: false,
          },
          // ── Xác nhận Tour ──────────────────────────────────────────
          {
            path: PATHS.SALES.CONFIRMED_TOURS,
            title: "Xác nhận Tour",
            pageTitle: "Danh sách Xác nhận Tour",
            element: <ConfirmedTourListPage />,
            icon: ClipboardCheck,
            showInSidebar: true,
          },
          {
            path: PATHS.SALES.CONFIRMED_TOUR_CREATE,
            element: <CreateConfirmedTourPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.SALES.CONFIRMED_TOUR_DETAIL,
            element: <ConfirmedTourDetailPage />,
            showInSidebar: false,
          },
        ],
      },
      // ── Vận hành ─────────────────────────────────────────────────────────
      {
        path: PATHS.OPERATIONS.ROOT,
        title: "Vận hành Tour",
        pageTitle: "Vận hành Tour",
        icon: Truck,
        showInSidebar: true,
        children: [
          {
            path: PATHS.OPERATIONS.TOUR_LIST,
            title: "Danh sách vận hành",
            pageTitle: "Vận hành Tour",
            element: <OperatorToursPage />,
            icon: Truck,
            showInSidebar: true,
          },
          {
            path: PATHS.OPERATIONS.TOUR_DETAIL,
            element: <OperationDetailPage />,
            showInSidebar: false,
          },
        ],
      },
      {
        path: PATHS.ACCOUNTING.ROOT,
        title: "Kế toán",
        pageTitle: "Kế toán",
        icon: Wallet,
        showInSidebar: true,
        children: [
          {
            path: PATHS.ACCOUNTING.CUSTOMER_PAYMENTS,
            title: "Phiếu Thu Khách Hàng",
            pageTitle: "Phiếu Thu Khách Hàng",
            element: <CustomerPaymentListPage />,
            icon: CreditCard,
            showInSidebar: true,
          },
          {
            path: PATHS.ACCOUNTING.CUSTOMER_PAYMENT_CREATE,
            element: <CreateCustomerPaymentPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.ACCOUNTING.CUSTOMER_PAYMENT_DETAIL,
            element: <CustomerPaymentDetailPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.ACCOUNTING.VENDOR_PAYMENTS,
            title: "Phiếu Chi Nhà Cung Cấp",
            pageTitle: "Phiếu Chi Nhà Cung Cấp",
            element: <VendorPaymentListPage />,
            icon: Banknote,
            showInSidebar: true,
          },
          {
            path: PATHS.ACCOUNTING.VENDOR_PAYMENT_CREATE,
            element: <CreateVendorPaymentPage />,
            showInSidebar: false,
          },
        ],
      },
      {
        path: PATHS.USER_MANAGEMENT.ROOT,
        title: "Quản lý Người dùng",
        pageTitle: "Quản lý Người dùng",
        icon: UserCog,
        showInSidebar: true,
        children: [
          {
            path: PATHS.USER_MANAGEMENT.USERS,
            title: "Danh sách người dùng",
            pageTitle: "Quản lý người dùng",
            element: <UserListPage />,
            icon: Users,
            showInSidebar: true,
          },
          {
            path: PATHS.USER_MANAGEMENT.USER_CREATE,
            element: <EditUserPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.USER_MANAGEMENT.USER_EDIT,
            element: <EditUserPage />,
            showInSidebar: false,
          },
        ],
      },
      {
        path: PATHS.NOTIFICATIONS.ROOT,
        title: "Thông báo",
        pageTitle: "Thông báo hệ thống",
        element: <NotificationListPage />,
        icon: Bell,
        showInSidebar: true,
      },
    ],
  },
];
