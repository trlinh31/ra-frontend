import { PATHS } from "@/app/routes/route.constant";
import TourDaysTable from "@/modules/tour/tour/components/TourDaysTable";
import TourFilterBar, { type TourFilters } from "@/modules/tour/tour/components/TourFilterBar";
import { tourMockStore } from "@/modules/tour/tour/data/tour.mock-store";
import type { Tour } from "@/modules/tour/tour/types/tour.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { Map } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TourListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [tours, setTours] = useState<Tour[]>(() => tourMockStore.getAll());
  const [filters, setFilters] = useState<TourFilters>({ search: "" });

  const filteredTours = useMemo(() => {
    return tours.filter((t) => {
      if (
        filters.search &&
        !t.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.code.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [tours, filters]);

  const handleAdd = () => navigate(PATHS.TOUR.TOUR_CREATE);

  const handleEdit = (tour: Tour) => navigate(PATHS.TOUR.TOUR_EDIT.replace(":id", tour.id));

  const handleDelete = async (tour: Tour) => {
    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa tour này không? Hành động này không thể hoàn tác.",
    });
    if (!ok) return;
    tourMockStore.delete(tour.id);
    setTours(tourMockStore.getAll());
  };

  const columns: ColumnDef<Tour>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Mã", accessorKey: "code" },
    { header: "Tên tour", accessorKey: "name" },
    { header: "Mô tả", accessorKey: "description", enableSorting: false },
    {
      id: "dayCount",
      header: "Số ngày",
      enableSorting: false,
      cell: ({ row }) => row.original.days.length,
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
      <TableToolbar title='Quản lý tour' description='Danh sách các tour du lịch của hệ thống' icon={Map} onAdd={handleAdd} />
      <TourFilterBar onFilter={setFilters} />
      <AppTable columns={columns} data={filteredTours} enableExpanding renderExpandedRow={(item) => <TourDaysTable item={item} />} />
    </div>
  );
}
