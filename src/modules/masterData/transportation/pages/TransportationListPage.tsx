import { PATHS } from "@/app/routes/route.constant";
import TransportationFilterBar, { type TransportationFilters } from "@/modules/masterData/transportation/components/TransportationFilterBar";
import { transportMockStore } from "@/modules/masterData/transportation/data/transportation.mock-store";
import { getMinMaxPrice } from "@/modules/masterData/transportation/helpers/getMinMaxPrice";
import type { TransportKm, TransportRoute } from "@/modules/masterData/transportation/types/transportation.type";
import { AppTable } from "@/shared/components/common/AppTable";
import Section from "@/shared/components/common/Section";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { Bus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TransportationListPage() {
  const navigate = useNavigate();

  const { confirm } = useConfirm();

  const [TransportKms, setTransportKms] = useState<TransportKm[]>(() => transportMockStore.getAllKmItems());
  const [TransportRoutes, setTransportRoutes] = useState<TransportRoute[]>(() => transportMockStore.getAllRouteItems());
  const [kmFilters, setKmFilters] = useState<TransportationFilters>({ search: "" });
  const [routeFilters, setRouteFilters] = useState<TransportationFilters>({ search: "" });

  const filteredKms = useMemo(() => {
    if (!kmFilters.search) return TransportKms;
    const q = kmFilters.search.toLowerCase();
    return TransportKms.filter((k) => k.code.toLowerCase().includes(q) || k.city.toLowerCase().includes(q) || k.category.toLowerCase().includes(q));
  }, [TransportKms, kmFilters]);

  const filteredRoutes = useMemo(() => {
    if (!routeFilters.search) return TransportRoutes;
    const q = routeFilters.search.toLowerCase();
    return TransportRoutes.filter(
      (r) => r.code.toLowerCase().includes(q) || r.startLocation.toLowerCase().includes(q) || r.endLocation.toLowerCase().includes(q)
    );
  }, [TransportRoutes, routeFilters]);

  const handleEdit = (item: TransportKm | TransportRoute) => {
    if ("km" in item) {
      navigate(`${PATHS.MASTER_DATA.TRANSPORT_KM}/${item.id}`);
    } else {
      navigate(`${PATHS.MASTER_DATA.TRANSPORT_ROUTE}/${item.id}`);
    }
  };

  const handleDelete = async (item: TransportKm | TransportRoute) => {
    if (!item) return;

    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa phí vận chuyển này không? Hành động này không thể hoàn tác.",
    });

    if (!ok) return;

    if ("km" in item) {
      transportMockStore.deleteKmItem(item.id);
      setTransportKms(transportMockStore.getAllKmItems());
    } else {
      transportMockStore.deleteRouteItem(item.id);
      setTransportRoutes(transportMockStore.getAllRouteItems());
    }
  };

  const transportKmColumns: ColumnDef<TransportKm>[] = [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Mã vận chuyển",
      accessorKey: "code",
      enableSorting: false,
    },
    {
      header: "Địa điểm",
      accessorKey: "city",
    },
    {
      header: "Danh mục",
      accessorKey: "category",
      maxSize: 200,
    },
    {
      header: "Số Kilômét",
      accessorKey: "km",
    },
    {
      header: "Giá tiền (VNĐ)",
      accessorKey: "price",
      cell: ({ row }) => formatNumberVN(row.original.price),
    },
    {
      header: "Ghi chú",
      accessorKey: "notes",
      enableSorting: false,
      maxSize: 200,
    },
    {
      header: "Hoạt động",
      accessorKey: "status",
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

  const transportRouteColumns: ColumnDef<TransportRoute>[] = [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Mã vận chuyển",
      accessorKey: "code",
      enableSorting: false,
    },
    {
      id: "route",
      header: "Lộ trình",
      enableSorting: false,
      cell: ({ row }) => `${row.original.startLocation} → ${row.original.endLocation}`,
    },
    {
      id: "vehicleCapacityPrice",
      header: "Giá theo loại xe (VNĐ)",
      enableSorting: false,
      cell: ({ row }) => {
        const { min, max } = getMinMaxPrice(row.original.vehicleCapacityPrice);
        return `${formatNumberVN(min)} - ${formatNumberVN(max)}`;
      },
    },
    {
      header: "Ghi chú",
      accessorKey: "notes",
      enableSorting: false,
      maxSize: 200,
    },
    {
      header: "Hoạt động",
      accessorKey: "status",
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
      <TableToolbar title='Quản lý phí vận chuyển' description='Danh sách các phí vận chuyển của hệ thống' icon={Bus} />

      <div className='flex justify-between items-center bg-yellow-400/20 px-4 py-2 rounded-md'>
        <h2 className='font-semibold text-yellow-800'>Tính theo Kilômét</h2>
      </div>

      <TransportationFilterBar onFilter={setKmFilters} placeholder='Tìm theo mã, địa điểm, danh mục...' />

      <Section>
        <AppTable columns={transportKmColumns} data={filteredKms} />
      </Section>

      <div className='flex justify-between items-center bg-yellow-400/20 px-4 py-2 rounded-md'>
        <h2 className='font-semibold text-yellow-800'>Tính theo Lộ trình</h2>
      </div>

      <TransportationFilterBar onFilter={setRouteFilters} placeholder='Tìm theo mã, điểm đón, điểm đến...' />

      <Section>
        <AppTable columns={transportRouteColumns} data={filteredRoutes} />
      </Section>
    </div>
  );
}
