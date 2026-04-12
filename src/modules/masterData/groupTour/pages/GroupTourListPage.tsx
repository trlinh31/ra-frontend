import { PATHS } from "@/app/routes/route.constant";
import GroupTourFilterBar from "@/modules/masterData/groupTour/components/GroupTourFilterBar";
import GroupTourPricingPeriodsTable from "@/modules/masterData/groupTour/components/GroupTourPricingPeriodsTable";
import { groupTourMockStore } from "@/modules/masterData/groupTour/data/group-tour.mock-store";
import type { GroupTour } from "@/modules/masterData/groupTour/types/group-tour.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DEFAULT_FILTERS = {
  tourName: "",
  country: "",
  city: "",
};

export default function GroupTourListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [items, setItems] = useState<GroupTour[]>(() => groupTourMockStore.getAll());
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.tourName && !item.tourName.toLowerCase().includes(filters.tourName.toLowerCase())) return false;
      if (filters.country && item.country !== filters.country) return false;
      if (filters.city && item.city !== filters.city) return false;
      return true;
    });
  }, [items, filters]);

  const handleAdd = () => navigate(PATHS.MASTER_DATA.GROUP_TOUR_CREATE);

  const handleEdit = (item: GroupTour) => {
    navigate(PATHS.MASTER_DATA.GROUP_TOUR_EDIT.replace(":id", item.id));
  };

  const handleDelete = async (item: GroupTour) => {
    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa tour này không? Hành động này không thể hoàn tác.",
    });
    if (!ok) return;
    groupTourMockStore.delete(item.id);
    setItems(groupTourMockStore.getAll());
  };

  const columns: ColumnDef<GroupTour>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Mã", accessorKey: "code" },
    { header: "Quốc gia", accessorKey: "country" },
    { header: "Thành phố", accessorKey: "city" },
    { header: "Tên tour", accessorKey: "tourName" },
    { header: "Nhà cung cấp", accessorKey: "supplier" },
    { header: "Ghi chú", accessorKey: "notes", enableSorting: false, maxSize: 200 },
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
      <TableToolbar title='Quản lý Nhóm Tour' description='Danh sách các nhóm tour của hệ thống' icon={MapPin} onAdd={handleAdd} />
      <GroupTourFilterBar onFilter={setFilters} />
      <AppTable
        columns={columns}
        data={filteredItems}
        enableExpanding
        renderExpandedRow={(item) => (
          <div className='space-y-4'>
            <GroupTourPricingPeriodsTable item={item} />
            {item.content && <div className='px-4 py-3 max-w-none prose prose-sm' dangerouslySetInnerHTML={{ __html: item.content }} />}
          </div>
        )}
      />
    </div>
  );
}
