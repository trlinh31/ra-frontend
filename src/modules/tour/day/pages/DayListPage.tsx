import { PATHS } from "@/app/routes/route.constant";
import DayFilterBar from "@/modules/tour/day/components/DayFilterBar";
import DayServicesTable from "@/modules/tour/day/components/DayServicesTable";
import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import type { Day } from "@/modules/tour/day/types/day.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DEFAULT_FILTERS = {
  name: "",
  country: "",
  city: "",
};

export default function DayListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [days, setDays] = useState<Day[]>(() => dayMockStore.getAll());
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);

  const filteredDays = useMemo(() => {
    return days.filter((item) => {
      if (filters.name && !item.title.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.country && item.country !== filters.country) return false;
      if (filters.city && item.city !== filters.city) return false;
      return true;
    });
  }, [days, filters]);

  const handleAdd = () => navigate(PATHS.TOUR.DAY_CREATE);

  const handleEdit = (day: Day) => {
    navigate(PATHS.TOUR.DAY_EDIT.replace(":id", day.id));
  };

  const handleDelete = async (day: Day) => {
    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa ngày hành trình này không? Hành động này không thể hoàn tác.",
    });
    if (!ok) return;
    dayMockStore.delete(day.id);
    setDays(dayMockStore.getAll());
  };

  const columns: ColumnDef<Day>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Mã", accessorKey: "code" },
    { header: "Quốc gia", accessorKey: "country" },
    { header: "Thành phố", accessorKey: "city" },
    { header: "Tên hành trình", accessorKey: "title", maxSize: 200 },
    { header: "Mô tả", accessorKey: "description", enableSorting: false, maxSize: 200 },
    {
      id: "serviceCount",
      header: "Số dịch vụ",
      enableSorting: false,
      cell: ({ row }) => row.original.services.length,
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
      <TableToolbar title='Quản lý ngày hành trình' description='Danh sách các ngày hành trình của hệ thống' icon={CalendarDays} onAdd={handleAdd} />
      <DayFilterBar onFilter={setFilters} />
      <AppTable columns={columns} data={filteredDays} enableExpanding renderExpandedRow={(item) => <DayServicesTable item={item} />} />
    </div>
  );
}
