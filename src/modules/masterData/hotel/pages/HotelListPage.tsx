import { PATHS } from "@/app/routes/route.constant";
import { getMinMaxPrice } from "@/modules/masterData/hotel/helpers/getMinMaxPrice";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { HotelIcon, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelMockStore } from "../data/hotel.mock-store";
import { type Hotel } from "../types/hotel.type";

export default function HotelListPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>(() => hotelMockStore.getAll());
  const [deleteTarget, setDeleteTarget] = useState<Hotel | null>(null);

  const handleEdit = (hotel: Hotel) => {
    navigate(`${PATHS.MASTER_DATA.HOTEL}/${hotel.id}`);
  };

  const handleAdd = () => {
    navigate(PATHS.MASTER_DATA.HOTEL_CREATE);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    hotelMockStore.delete(deleteTarget.id);
    setHotels(hotelMockStore.getAll());
    setDeleteTarget(null);
  };

  const columns: ColumnDef<Hotel>[] = [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => row.index + 1,
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
      header: "Quốc gia",
      accessorKey: "country",
    },
    {
      header: "Thành phố",
      accessorKey: "city",
    },
    {
      header: "Ghi chú",
      accessorKey: "notes",
      enableSorting: false,
    },
    {
      header: "Trạng thái",
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
          <ActionButton action='delete' onClick={() => setDeleteTarget(row.original)} />
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <TableToolbar title='Quản lý khách sạn' description='Danh sách các khách sạn của hệ thống' icon={HotelIcon} onAdd={handleAdd} />

      <AppTable columns={columns} data={hotels} />

      {/* <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phòng <strong>{deleteTarget ? ROOM_TYPE_LABELS[deleteTarget.roomType] : ""}</strong> không? Hành động này
              không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
