import { PATHS } from "@/app/routes/route.constant";
import SupplierFilterBar from "@/modules/masterData/supplier/components/SupplierFilterBar";
import { supplierMockStore } from "@/modules/masterData/supplier/data/supplier.mock-store";
import type { Supplier } from "@/modules/masterData/supplier/types/supplier.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { ContainerIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DEFAULT_FILTERS = {
  name: "",
  country: "",
  city: "",
};

export default function SupplierListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => supplierMockStore.getAll());
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((item) => {
      if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.country && item.country !== filters.country) return false;
      if (filters.city && item.city !== filters.city) return false;
      return true;
    });
  }, [suppliers, filters]);

  const handleAdd = () => navigate(PATHS.MASTER_DATA.SUPPLIER_CREATE);

  const handleEdit = (supplier: Supplier) => {
    navigate(PATHS.MASTER_DATA.SUPPLIER_EDIT.replace(":id", supplier.id));
  };

  const handleDelete = async (supplier: Supplier) => {
    if (!supplier) return;

    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa nhà cung cấp này không? Hành động này không thể hoàn tác.",
    });

    if (!ok) return;

    supplierMockStore.delete(supplier.id);
    setSuppliers(supplierMockStore.getAll());
  };

  const columns: ColumnDef<Supplier>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Mã nhà cung cấp", accessorKey: "code" },
    { header: "Quốc gia", accessorKey: "country" },
    { header: "Thành phố", accessorKey: "city" },
    { header: "Tên nhà cung cấp", accessorKey: "name" },
    { header: "Mã số thuế", accessorKey: "taxCode" },
    { header: "Email", accessorKey: "email" },
    { header: "Số điện thoại", accessorKey: "phone" },
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
      <TableToolbar title='Quản lý nhà cung cấp' description='Danh sách các nhà cung cấp của hệ thống' icon={ContainerIcon} onAdd={handleAdd} />
      <SupplierFilterBar onFilter={setFilters} />
      <AppTable columns={columns} data={filteredSuppliers} />
    </div>
  );
}
