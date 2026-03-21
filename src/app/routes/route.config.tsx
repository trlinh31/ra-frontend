import DashboardPage from "@/modules/dashboard";
import EntranceFeeListPage from "@/modules/masterData/entranceFee";
import FlightListPage from "@/modules/masterData/flights";
import GroupTourListPage from "@/modules/masterData/groupTour";
import HotelListPage from "@/modules/masterData/hotel";
import EditHotelPage from "@/modules/masterData/hotel/pages/EditHotelPage";
import TransportationListPage from "@/modules/masterData/transportation";
import EditTransportKmPage from "@/modules/masterData/transportation/pages/EditTransportKmPage";
import EditTransportRoutePage from "@/modules/masterData/transportation/pages/EditTransportRoutePage";
import VisaFastTrackListPage from "@/modules/masterData/visaFastTrack";
import DayListPage from "@/modules/tour/day";
import EditDayPage from "@/modules/tour/day/pages/EditDayPage";
import TourListPage from "@/modules/tour/tour";
import EditTourPage from "@/modules/tour/tour/pages/EditTourPage";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Box, Bus, CalendarDays, Compass, Hotel, LayoutGrid, MapPin, Plane, Shield, Ticket } from "lucide-react";
import { Navigate } from "react-router-dom";
import { PATHS } from "./route.constant";
import type { AppRoute } from "./route.type";

export const APP_ROUTES: AppRoute[] = [
  {
    path: PATHS.ROOT,
    element: <Navigate to={PATHS.DASHBOARD} replace />,
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
            path: PATHS.MASTER_DATA.TRANSPORTATION,
            title: "Vận chuyển",
            pageTitle: "Quản lý vận chuyển",
            element: <TransportationListPage />,
            icon: Bus,
            showInSidebar: true,
          },
          {
            path: PATHS.MASTER_DATA.TRANSPORT_KM_CREATE,
            element: <EditTransportKmPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.TRANSPORT_KM_EDIT,
            element: <EditTransportKmPage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.TRANSPORT_ROUTE_CREATE,
            element: <EditTransportRoutePage />,
            showInSidebar: false,
          },
          {
            path: PATHS.MASTER_DATA.TRANSPORT_ROUTE_EDIT,
            element: <EditTransportRoutePage />,
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
            path: PATHS.MASTER_DATA.VISA_FAST_TRACK,
            title: "Visa + Fast Track",
            pageTitle: "Quản lý Visa + Fast Track",
            element: <VisaFastTrackListPage />,
            icon: Shield,
            showInSidebar: true,
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
            path: PATHS.MASTER_DATA.FLIGHTS,
            title: "Chuyến bay",
            pageTitle: "Quản lý Chuyến bay",
            element: <FlightListPage />,
            icon: Plane,
            showInSidebar: true,
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
    ],
  },
];
