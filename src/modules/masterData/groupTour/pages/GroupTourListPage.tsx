import { PATHS } from "@/app/routes/route.constant";
import GroupTourFilterBar, { type GroupTourFilters } from "@/modules/masterData/groupTour/components/GroupTourFilterBar";
import { groupTourMockStore } from "@/modules/masterData/groupTour/data/group-tour.mock-store";
import type { GroupTour } from "@/modules/masterData/groupTour/types/group-tour.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GroupTourListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [items, setItems] = useState<GroupTour[]>(() => groupTourMockStore.getAll());
  const [filters, setFilters] = useState<GroupTourFilters>({ tourName: "", isActive: "" });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.tourName && !item.tourName.toLowerCase().includes(filters.tourName.toLowerCase())) return false;
      if (filters.isActive !== "" && item.isActive !== (filters.isActive === "true")) return false;
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
    { header: "Tên tour", accessorKey: "tourName" },
    { header: "Nhà cung cấp", accessorKey: "supplier" },
    { header: "Giá tiền (VNĐ)", accessorKey: "price", cell: ({ row }) => formatNumberVN(row.original.price) },
    { header: "Nội dung", accessorKey: "content", enableSorting: false },
    { header: "Ghi chú", accessorKey: "notes", enableSorting: false },
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
      <AppTable columns={columns} data={filteredItems} />
    </div>
  );
}
