import { PATHS } from "@/app/routes/route.constant";
import TransportationFilterBar from "@/modules/masterData/transportation/components/TransportationFilterBar";
import { transportMockStore } from "@/modules/masterData/transportation/data/transportation.mock-store";
import type { Transportation } from "@/modules/masterData/transportation/types/transportation.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { Bus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DEFAULT_FILTERS = {
  name: "",
  country: "",
  city: "",
};

export default function TransportationListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [items, setItems] = useState<Transportation[]>(() => transportMockStore.getAll());
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.country && item.country !== filters.country) return false;
      if (filters.city && item.city !== filters.city) return false;
      return true;
    });
  }, [items, filters]);

  const handleEdit = (item: Transportation) => {
    navigate(PATHS.MASTER_DATA.TRANSPORTATION_EDIT.replace(":id", item.id));
  };

  const handleDelete = async (item: Transportation) => {
    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa lịch trình này không? Hành động này không thể hoàn tác.",
    });
    if (!ok) return;
    transportMockStore.delete(item.id);
    setItems(transportMockStore.getAll());
  };

  const columns: ColumnDef<Transportation>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Mã lịch trình", accessorKey: "code" },
    { header: "Tên lịch trình", accessorKey: "name" },
    { header: "Quốc gia", accessorKey: "country" },
    { header: "Thành phố", accessorKey: "city" },
    { header: "Nhà cung cấp", accessorKey: "supplier" },
    { header: "Số KM", accessorKey: "km" },
    {
      id: "priceRange",
      header: "Khoảng giá",
      enableSorting: false,
      cell: ({ row }) => {
        const prices = row.original.vehicleCapacityPrice;
        if (!prices.length) return "—";
        const currency = prices[0].currency;
        const min = Math.min(...prices.map((p) => p.price));
        const max = Math.max(...prices.map((p) => p.price));
        return `${formatNumberVN(min)} - ${formatNumberVN(max)} ${currency}`;
      },
    },
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
      <TableToolbar
        title='Quản lý vận chuyển'
        description='Danh sách các lịch trình vận chuyển của hệ thống'
        icon={Bus}
        onAdd={() => navigate(PATHS.MASTER_DATA.TRANSPORTATION_CREATE)}
      />
      <TransportationFilterBar onFilter={setFilters} />
      <AppTable
        columns={columns}
        data={filteredItems}
        enableExpanding
        renderExpandedRow={(item) => (
          <div className='px-4 py-3'>
            <table className='border border-border w-full text-sm text-center'>
              <thead>
                <tr className='bg-slate-700 text-primary-foreground'>
                  <th className='px-3 py-2 border border-border font-semibold'>STT</th>
                  <th className='px-3 py-2 border border-border font-semibold'>Sức chứa (chỗ)</th>
                  <th className='px-3 py-2 border border-border font-semibold'>Đơn vị tiền tệ</th>
                  <th className='px-3 py-2 border border-border font-semibold'>Giá</th>
                </tr>
              </thead>
              <tbody>
                {item.vehicleCapacityPrice.map((vcp, idx) => (
                  <tr key={idx} className='even:bg-muted/40'>
                    <td className='px-3 py-2 border border-border'>{idx + 1}</td>
                    <td className='px-3 py-2 border border-border'>{vcp.capacity} chỗ</td>
                    <td className='px-3 py-2 border border-border'>{vcp.currency}</td>
                    <td className='px-3 py-2 border border-border'>{formatNumberVN(vcp.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      />
    </div>
  );
}
