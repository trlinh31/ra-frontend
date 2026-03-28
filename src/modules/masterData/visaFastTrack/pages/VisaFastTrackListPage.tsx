import { PATHS } from "@/app/routes/route.constant";
import type { VisaFastTrackFilters } from "@/modules/masterData/visaFastTrack/components/VisaFastTrackFilterBar";
import VisaFastTrackFilterBar from "@/modules/masterData/visaFastTrack/components/VisaFastTrackFilterBar";
import { visaFastTrackMockStore } from "@/modules/masterData/visaFastTrack/data/visa-fast-track.mock-store";
import type { VisaService } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VisaFastTrackListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [items, setItems] = useState<VisaService[]>(() => visaFastTrackMockStore.getAll());
  const [filters, setFilters] = useState<VisaFastTrackFilters>({ serviceName: "", group: "", provider: "" });

  const flattenedItems = useMemo(() => {
    return items.flatMap((item) =>
      item.services.map((service, index) => ({
        id: `${item.id}-${index}`,
        provider: item.provider,
        ...service,
        parentId: item.id, // để edit/delete
      }))
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    
    return flattenedItems.filter((item) => {
    if (filters.serviceName && !item.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase())) return false;
    if (filters.group && item.group !== filters.group) return false;
    if (filters.provider && item.provider !== filters.provider) return false;
    return true;
  });
  }, [flattenedItems, filters]);


  const providerOptions = useMemo(() => {
    const providers = Array.from(new Set(items.map((i) => i.provider)));

    return providers.map((p) => ({
      label: p,
      value: p,
    }));
  }, [items]);

  const handleAdd = () => navigate(PATHS.MASTER_DATA.VISA_FAST_TRACK_CREATE);

  const handleEdit = (item: VisaService) => {
    navigate(PATHS.MASTER_DATA.VISA_FAST_TRACK_EDIT.replace(":id", item.parentId));
  };

  const handleDelete = async (item: VisaService) => {
    const ok = await confirm({ description: "Xóa service này?" });
    if (!ok) return;

    const parent = items.find((i) => i.id === item.parentId);
    if (!parent) return;

    parent.services = parent.services.filter(
      (s) => s.serviceName !== item.serviceName
    );

    visaFastTrackMockStore.update(parent.id, parent);
    setItems(visaFastTrackMockStore.getAll());
  };

  const columns: ColumnDef<VisaService>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Nhà cung cấp", accessorKey: "provider" },
    // { header: "Mã", accessorKey: "code" },
    { header: "Nhóm", accessorKey: "group" },
    { header: "Tên dịch vụ", accessorKey: "serviceName" },
    { header: "Giá", accessorKey: "price", cell: ({ row }) => formatNumberVN(row.original.price) },
    { header: "Đơn vị", accessorKey: "priceUnit" },
    { header: "Địa điểm đón", accessorKey: "pickupLocation", enableSorting: false },
    { header: "Mô tả", accessorKey: "description", enableSorting: false },
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
      <TableToolbar title='Quản lý Visa + Fast Track' description='Danh sách các dịch vụ Visa và Fast Track' icon={Shield} onAdd={handleAdd} />
      <VisaFastTrackFilterBar onFilter={setFilters} providerOptions={providerOptions}/>
      <AppTable columns={columns} data={filteredItems} />
    </div>
  );
}
