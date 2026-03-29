import { PATHS } from "@/app/routes/route.constant";
import FlightFilterBar, { type FlightFilters } from "@/modules/masterData/flights/components/FlightFilterBar";
import { flightMockStore } from "@/modules/masterData/flights/data/flight.mock-store";
import { getRouteCode } from "@/modules/masterData/flights/helpers/getRouteCode";
import type { Flight } from "@/modules/masterData/flights/types/flight.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { Plane } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCountries } from "../../country/hooks/useCountries";

export default function FlightListPage() {
  const navigate = useNavigate();

  const { confirm } = useConfirm();

  const [flights, setFlights] = useState<Flight[]>(() => flightMockStore.getAll());
  const [filters, setFilters] = useState<FlightFilters>({ routeCode: "", isActive: "" });

  const { data: countries } = useCountries();

  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      if (filters.routeCode && !getRouteCode(f).toLowerCase().includes(filters.routeCode.toLowerCase())) return false;
      if (filters.isActive !== "" && f.isActive !== (filters.isActive === "true")) return false;
      return true;
    });
  }, [flights, filters]);

  const handleAdd = () => {
    navigate(PATHS.MASTER_DATA.FLIGHTS_CREATE);
  };

  const handleEdit = (flight: Flight) => {
    navigate(`${PATHS.MASTER_DATA.FLIGHTS_EDIT.replace(":id", flight.id)}`);
  };

  const handleDelete = async (flight: Flight) => {
    if (!flight) return;

    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa chuyến bay này không? Hành động này không thể hoàn tác.",
    });

    if (!ok) return;

    flightMockStore.delete(flight.id);
    setFlights(flightMockStore.getAll());
  };

  const columns: ColumnDef<Flight>[] = [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => row.index + 1,
    },
     {
      header: "Tuyến bay",
      accessorKey: "routeFull",
      cell: ({ row }) => `${row.original.fromCity} (${row.original.fromCountry}) → ${row.original.toCity} (${row.original.toCountry})`,
    },
    {
      header: "Mã chuyến bay",
      accessorKey: "code",
    },
    {
      id: "route",
      header: "Mã tuyến đường",
      cell: ({ row }) => getRouteCode(row.original),
    },
    {
      header: "Hãng bay",
      accessorKey: "airline",
    },
    
    {
      header: "Thời gian bay",
      accessorKey: "flightTime",
    },
    {
      header: "Giá bay",
      accessorKey: "price",
      cell: ({ row }) => formatNumberVN(row.original.price),
    },
    
    {
      header: "Đơn vị tiền tệ",
      accessorKey: "unitPrice",
    },
     {
      header: "Nhà cung cấp",
      accessorKey: "provider",
    },
    {
      header: "Ghi chú",
      accessorKey: "notes",
      enableSorting: false,
      maxSize: 200,
    },
    {
      header: "Hoạt động",
      accessorKey: "status",
      enableSorting: false,
      cell: ({ row }) => <Switch defaultChecked={row.original.isActive} />,
    },
    {
      id: "actions",
      header: "Hành động",
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <ActionButton action='edit' onClick={() => handleEdit(row.original)} />
          <ActionButton action='delete' onClick={() => handleDelete(row.original)} />
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <TableToolbar title='Quản lý chuyến bay' description='Danh sách các chuyến bay của hệ thống' icon={Plane} onAdd={handleAdd} />

      <FlightFilterBar onFilter={setFilters} />

      <AppTable columns={columns} data={filteredFlights} />
    </div>
  );
}
