import CreateCustomerPaymentPage from "@/modules/accounting/customerPayment/pages/CreateCustomerPaymentPage";
import CustomerPaymentDetailPage from "@/modules/accounting/customerPayment/pages/CustomerPaymentDetailPage";
import CustomerPaymentListPage from "@/modules/accounting/customerPayment/pages/CustomerPaymentListPage";
import CreateVendorPaymentPage from "@/modules/accounting/vendorPayment/pages/CreateVendorPaymentPage";
import VendorPaymentListPage from "@/modules/accounting/vendorPayment/pages/VendorPaymentListPage";
import DashboardPage from "@/modules/dashboard";
import EntranceFeeListPage from "@/modules/masterData/entranceFee";
import EditEntranceFeePage from "@/modules/masterData/entranceFee/pages/EditEntranceFeePage";
import FlightListPage from "@/modules/masterData/flights";
import EditFlightPage from "@/modules/masterData/flights/pages/EditFlightPage";
import GroupTourListPage from "@/modules/masterData/groupTour";
import EditGroupTourPage from "@/modules/masterData/groupTour/pages/EditGroupTourPage";
import { EditHotelPage, HotelDetailPage, HotelListPage } from "@/modules/masterData/hotel";
import EditRestaurantPage from "@/modules/masterData/restaurant/pages/EditRestaurantPage";
import RestaurantListPage from "@/modules/masterData/restaurant/pages/RestaurantListPage";
import EditSupplierPage from "@/modules/masterData/supplier/pages/EditSupplierPage";
import SupplierListPage from "@/modules/masterData/supplier/pages/SupplierListPage";
import EditTourGuidePage from "@/modules/masterData/tourGuide/pages/EditTourGuidePage";
import TourGuideListPage from "@/modules/masterData/tourGuide/pages/TourGuideListPage";
import TransportationListPage from "@/modules/masterData/transportation";
import EditTransportationPage from "@/modules/masterData/transportation/pages/EditTransportationPage";
import VisaFastTrackListPage from "@/modules/masterData/visaFastTrack";
import EditVisaFastTrackPage from "@/modules/masterData/visaFastTrack/pages/EditVisaFastTrackPage";
import ConfirmedTourDetailPage from "@/modules/sales/confirmedTour/pages/ConfirmedTourDetailPage";
import ConfirmedTourListPage from "@/modules/sales/confirmedTour/pages/ConfirmedTourListPage";
import CreateConfirmedTourPage from "@/modules/sales/confirmedTour/pages/CreateConfirmedTourPage";
import CreateQuotationPage from "@/modules/sales/quotation/pages/CreateQuotationPage";
import QuotationDetailPage from "@/modules/sales/quotation/pages/QuotationDetailPage";
import QuotationListPage from "@/modules/sales/quotation/pages/QuotationListPage";
import QuotationPrintPage from "@/modules/sales/quotation/pages/QuotationPrintPage";
import CreateTripRequestPage from "@/modules/sales/tripRequest/pages/CreateTripRequestPage";
import TripRequestDetailPage from "@/modules/sales/tripRequest/pages/TripRequestDetailPage";
import TripRequestListPage from "@/modules/sales/tripRequest/pages/TripRequestListPage";
import DayListPage from "@/modules/tour/day";
import EditDayPage from "@/modules/tour/day/pages/EditDayPage";
import TourListPage from "@/modules/tour/tour";
import EditTourPage from "@/modules/tour/tour/pages/EditTourPage";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import {
  Banknote,
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
  UserRound,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { PATHS } from "./route.constant";
import type { AppRoute } from "./route.type";

export const APP_ROUTES: AppRoute[] = [
  {
    path: PATHS.ROOT,
    element: <Navigate to={PATHS.DASHBOARD} replace />,
  },
  // ── Trang in báo giá — full-screen, ngoài DashboardLayout ──
  {
    path: PATHS.SALES.QUOTATION_PRINT,
    element: <QuotationPrintPage />,
    showInSidebar: false,
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
    ],
  },
];
