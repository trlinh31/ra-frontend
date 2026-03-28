import { PATHS } from "@/app/routes/route.constant";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import HotelFilterBar, { type HotelFilters } from "@/modules/masterData/hotel/components/HotelFilterBar";
import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import { getMinMaxPrice } from "@/modules/masterData/hotel/helpers/getMinMaxPrice";
import type { Hotel } from "@/modules/masterData/hotel/types/hotel.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { HotelIcon, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DEFAULT_FILTERS: HotelFilters = {
  name: "",
  rate: "",
  country: "",
  city: "",
  isActive: "",
};

export default function HotelListPage() {
  const navigate = useNavigate();

  const { confirm } = useConfirm();

  const [hotels, setHotels] = useState<Hotel[]>(() => hotelMockStore.getAll());
  const [filters, setFilters] = useState<HotelFilters>(DEFAULT_FILTERS);

  const { data: countries } = useCountries();

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      if (filters.name && !h.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.rate && h.rate !== Number(filters.rate)) return false;
      if (filters.country && h.country !== filters.country) return false;
      if (filters.city && h.city !== filters.city) return false;
      if (filters.isActive !== "" && h.isActive !== (filters.isActive === "true")) return false;
      return true;
    });
  }, [hotels, filters]);

  const handleAdd = () => {
    navigate(PATHS.MASTER_DATA.HOTEL_CREATE);
  };

  const handleEdit = (hotel: Hotel) => {
    navigate(`${PATHS.MASTER_DATA.HOTEL}/${hotel.id}`);
  };

  const handleDelete = async (hotel: Hotel) => {
    if (!hotel) return;

    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa khách sạn này không? Hành động này không thể hoàn tác.",
    });

    if (!ok) return;

    hotelMockStore.delete(hotel.id);
    setHotels(hotelMockStore.getAll());
  };

  const columns: ColumnDef<Hotel>[] = [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Quốc gia",
      accessorKey: "country",
    },
    {
      header: "Thành phố",
      accessorKey: "city",
    },
    {
      header: "Tên khách sạn",
      accessorKey: "name",
    },
    {
      id: "priceRange",
      header: "Khoảng giá (VNĐ)",
      enableSorting: false,
      cell: ({ row }) => {
        const { min, max } = getMinMaxPrice(row.original.rooms);
        return `${formatNumberVN(min)} - ${formatNumberVN(max)}`;
      },
    },
    {
      header: "Đánh giá",
      accessorKey: "rate",
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          {row.original.rate}
          <Star strokeWidth={2.25} className='w-3 h-3 text-yellow-300' />
        </div>
      ),
    },
    {
      id: "roomCount",
      header: "Số phòng",
      enableSorting: false,
      cell: ({ row }) => row.original.rooms.length,
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
      <TableToolbar title='Quản lý khách sạn' description='Danh sách các khách sạn của hệ thống' icon={HotelIcon} onAdd={handleAdd} />

      <HotelFilterBar countries={countries ?? []} onFilter={setFilters} />

      <AppTable columns={columns} data={filteredHotels} />
    </div>
  );
}
