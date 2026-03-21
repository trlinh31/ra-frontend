import { PATHS } from "@/app/routes/route.constant";
import EntranceFeeFilterBar, { type EntranceFeeFilters } from "@/modules/masterData/entranceFee/components/EntranceFeeFilterBar";
import { entranceFeeMockStore } from "@/modules/masterData/entranceFee/data/entrance-fee.mock-store";
import type { EntranceFee } from "@/modules/masterData/entranceFee/types/entrance-fee.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { Ticket } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EntranceFeeListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [items, setItems] = useState<EntranceFee[]>(() => entranceFeeMockStore.getAllItems());
  const [filters, setFilters] = useState<EntranceFeeFilters>({ serviceName: "", isActive: "" });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.serviceName && !item.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase())) return false;
      if (filters.isActive !== "" && item.isActive !== (filters.isActive === "true")) return false;
      return true;
    });
  }, [items, filters]);

  const handleAdd = () => navigate(PATHS.MASTER_DATA.ENTRANCE_FEE_CREATE);

  const handleEdit = (item: EntranceFee) => {
    navigate(PATHS.MASTER_DATA.ENTRANCE_FEE_EDIT.replace(":id", item.id));
  };

  const handleDelete = async (item: EntranceFee) => {
    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa phí vào cổng này không? Hành động này không thể hoàn tác.",
    });

    if (!ok) return;

    entranceFeeMockStore.deleteItem(item.id);
    setItems(entranceFeeMockStore.getAllItems());
  };

  const columns: ColumnDef<EntranceFee>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Mã", accessorKey: "code" },
    { header: "Tên dịch vụ", accessorKey: "serviceName" },
    { header: "Quốc gia", accessorKey: "country" },
    { header: "Thành phố", accessorKey: "city" },
    { header: "Giá tiền (VNĐ)", accessorKey: "price", cell: ({ row }) => formatNumberVN(row.original.price) },
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
      <TableToolbar title='Quản lý phí vào cổng' description='Danh sách các phí vào cổng của hệ thống' icon={Ticket} onAdd={handleAdd} />
      <EntranceFeeFilterBar onFilter={setFilters} />
      <AppTable columns={columns} data={filteredItems} />
    </div>
  );
}
