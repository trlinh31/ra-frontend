import { PATHS } from "@/app/routes/route.constant";
import type { VisaFastTrackFilters } from "@/modules/masterData/visaFastTrack/components/VisaFastTrackFilterBar";
import VisaFastTrackFilterBar from "@/modules/masterData/visaFastTrack/components/VisaFastTrackFilterBar";
import { visaFastTrackMockStore } from "@/modules/masterData/visaFastTrack/data/visa-fast-track.mock-store";
import type { Service, VisaService } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supplierMockStore } from "../../supplier/data/supplier.mock-store";
import { useCountries } from "../../country/hooks/useCountries";

export default function VisaFastTrackListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [items, setItems] = useState<VisaService[]>(() => visaFastTrackMockStore.getAll());
  const [filters, setFilters] = useState<VisaFastTrackFilters>({ serviceName: "", group: "", provider: "", country: "", city: "" });
  const { data: countries } = useCountries();

  const filteredItems = useMemo(() => {
    
    return items.filter((item) => {
    if (filters.serviceName && !item.services.some((s) => s.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase()))) return false;
    if (filters.group && !item.services.some((s) => s.group === filters.group)) return false;
    if (filters.provider && item.provider !== filters.provider) return false;
    if (filters.country && item.country !== filters.country) return false;
    if (filters.city && item.city !== filters.city) return false;
    return true;
  });
  }, [ items,filters]);


  const providerOptions = useMemo(() => {
    const providers = Array.from(new Set(items.map((i) => i.provider)));

    return providers.map((p) => ({
      label: p,
      value: p,
    }));
  }, [items]);

  const handleAdd = () => navigate(PATHS.MASTER_DATA.VISA_FAST_TRACK_CREATE);

  const handleEdit = (item: VisaService) => {
    navigate(PATHS.MASTER_DATA.VISA_FAST_TRACK_EDIT.replace(":id", item.id));
  };

  const handleDelete = async (item: VisaService) => {
    const ok = await confirm({ description: "Xóa service này?" });
    if (!ok) return;
    
    visaFastTrackMockStore.delete(item.id);
    setItems(visaFastTrackMockStore.getAll());
  };

  const columns: ColumnDef<VisaService>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Quốc gia", accessorKey: "country" },
    { header: "Thành phố", accessorKey: "city" },
    { header: "Nhà cung cấp", accessorKey: "provider" },
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
      <VisaFastTrackFilterBar countries={countries ?? []} onFilter={setFilters} providerOptions={providerOptions}/>
      <AppTable columns={columns} data={filteredItems} enableExpanding renderExpandedRow={(visa) => <VisaFastTrackDetailRow services={ visa.services} />} />
    </div>
  );
}

const VisaFastTrackDetailRow = ({ services }: { services: Service[] }) => {
  
  const columns: ColumnDef<Service>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
    { header: "Nhóm", accessorKey: "group" },
    { header: "Tên dịch vụ", accessorKey: "serviceName" },
    { header: "Giá", accessorKey: "price", cell: ({ row }) => formatNumberVN(row.original.price) },
    { header: "Đơn vị", accessorKey: "priceUnit" },
    { header: "Địa điểm đón", accessorKey: "pickupLocation", enableSorting: false },
    { header: "Mô tả", accessorKey: "description", enableSorting: false },
  ];

  return <AppTable columns={columns} data={services} enablePagination={false} />;
};
