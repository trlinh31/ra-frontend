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
  const [filters, setFilters] = useState<FlightFilters>({fromCountry: "", toCountry: "", fromCity: "", toCity: "", provider: "", airline: "" });

  const { data: countries } = useCountries();

  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      if (filters.fromCountry && f.fromCountry !== filters.fromCountry) return false;
      if (filters.toCountry && f.toCountry !== filters.toCountry) return false;
      if (filters.fromCity && f.fromCity !== filters.fromCity) return false;
      if (filters.toCity && f.toCity !== filters.toCity) return false;
      if (filters.provider && f.provider !== filters.provider) return false;
      if (filters.airline && f.airline !== filters.airline) return false;
      // if (filters.isActive !== "" && f.isActive !== (filters.isActive === "true")) return false;
      return true;
    });
  }, [flights, filters]);

  const providerOptions = useMemo(() => {
    const providers = Array.from(new Set(flights.map((i) => i.provider)));

    return providers.map((p) => ({
      label: p,
      value: p,
    }));
  }, [flights]);

  const airlineOptions = useMemo(() => {
    const airlines = Array.from(new Set(flights.map((i) => i.airline)));

    return airlines.map((a) => ({
      label: a,
      value: a,
    }));
  }, [flights]);

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
      header: "Nhà cung cấp",
      accessorKey: "provider",
    },
    // {
    //   header: "Mã chuyến bay",
    //   accessorKey: "code",
    // },
    // {
    //   id: "route",
    //   header: "Mã tuyến đường",
    //   cell: ({ row }) => getRouteCode(row.original),
    // },
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

      <FlightFilterBar countries={countries ?? []} onFilter={setFilters} providerOptions={providerOptions} airlineOptions={airlineOptions} />

      <AppTable columns={columns} data={filteredFlights} />
    </div>
  );
}
