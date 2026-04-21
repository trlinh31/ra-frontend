import { PATHS } from "@/app/routes/route.constant";
import TourGuideFilterBar from "@/modules/masterData/tourGuide/components/TourGuideFilterBar";
import { tourGuideMockStore } from "@/modules/masterData/tourGuide/data/tourGuide.mock-store";
import type { TourGuide } from "@/modules/masterData/tourGuide/types/tourGuide.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DEFAULT_FILTERS = {
  name: "",
  country: "",
  city: "",
};

export default function TourGuideListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [tourGuides, setTourGuides] = useState<TourGuide[]>(() => tourGuideMockStore.getAll());
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);

  const filteredTourGuides = useMemo(() => {
    return tourGuides.filter((item) => {
      if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.country && item.country !== filters.country) return false;
      if (filters.city && item.city !== filters.city) return false;
      return true;
    });
  }, [tourGuides, filters]);

  const handleAdd = () => navigate(PATHS.MASTER_DATA.TOUR_GUIDE_CREATE);

  const handleEdit = (tourGuide: TourGuide) => {
    navigate(PATHS.MASTER_DATA.TOUR_GUIDE_EDIT.replace(":id", tourGuide.id));
  };

  const handleDelete = async (tourGuide: TourGuide) => {
    if (!tourGuide) return;

    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa hướng dẫn viên này không? Hành động này không thể hoàn tác.",
    });

    if (!ok) return;

    tourGuideMockStore.delete(tourGuide.id);
    setTourGuides(tourGuideMockStore.getAll());
  };

  const columns: ColumnDef<TourGuide>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Quốc gia", accessorKey: "country" },
    { header: "Thành phố", accessorKey: "city" },
    { header: "Mã hướng dẫn viên", accessorKey: "code" },
    { header: "Tên hướng dẫn viên", accessorKey: "name" },
    { header: "CMND/CCCD", accessorKey: "nationalId" },
    { header: "Số điện thoại", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    { header: "Phí thuê / ngày", accessorKey: "pricePerDay", cell: ({ row }) => row.original.pricePerDay.toLocaleString("vi-VN") + " ₫" },
    {
      header: "Hoạt động",
      accessorKey: "isActive",
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
      <TableToolbar title='Quản lý hướng dẫn viên' description='Danh sách các hướng dẫn viên của hệ thống' icon={UserRound} onAdd={handleAdd} />
      <TourGuideFilterBar onFilter={setFilters} />
      <AppTable columns={columns} data={filteredTourGuides} />
    </div>
  );
}
