import { PATHS } from "@/app/routes/route.constant";
import TripRequestStatusBadge from "@/modules/sales/tripRequest/components/TripRequestStatusBadge";
import {
  LEAD_SOURCE_LABEL,
  SERVICE_LEVEL_BADGE,
  SERVICE_LEVEL_LABEL,
  TRIP_REQUEST_STATUS_OPTIONS,
} from "@/modules/sales/tripRequest/constants/trip-request.constant";
import { tripRequestMockStore } from "@/modules/sales/tripRequest/data/trip-request.mock-store";
import type { TripRequest } from "@/modules/sales/tripRequest/types/trip-request.type";
import { AppTable } from "@/shared/components/common/AppTable";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { PhoneCall } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ALL_STATUS = "__all__";

export default function TripRequestListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [requests, setRequests] = useState<TripRequest[]>(() => tripRequestMockStore.getAll());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_STATUS);

  const refresh = () => setRequests(tripRequestMockStore.getAll());

  const filtered = useMemo(() => {
    let list = requests;
    if (statusFilter !== ALL_STATUS) {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          (r.destination ?? "").toLowerCase().includes(q) ||
          (r.assignedTo ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, search, statusFilter]);

  const handleDelete = async (r: TripRequest) => {
    if (r.status === "converted") {
      await confirm({ description: "Không thể xóa Trip Request đã chốt thành công." });
      return;
    }
    const ok = await confirm({
      description: `Xóa Trip Request "${r.code}" — ${r.customerName}?`,
    });
    if (!ok) return;
    tripRequestMockStore.delete(r.id);
    refresh();
  };

  const columns: ColumnDef<TripRequest>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1, maxSize: 55 },
    {
      id: "code",
      header: "Mã TR",
      accessorKey: "code",
    },
    { header: "Khách hàng / Đoàn", accessorKey: "customerName" },
    {
      id: "destination",
      header: "Điểm đến",
      cell: ({ row }) => row.original.destination ?? <span className='text-muted-foreground'>—</span>,
    },
    {
      id: "people",
      header: "Số khách",
      cell: ({ row }) => {
        const r = row.original;
        const total = r.numberOfAdults + r.numberOfChildren;
        return (
          <span className='text-sm'>
            {total}
            {r.numberOfChildren > 0 && <span className='ml-1 text-muted-foreground text-xs'>({r.numberOfChildren} trẻ em)</span>}
          </span>
        );
      },
    },
    {
      id: "serviceLevel",
      header: "Mức DV",
      cell: ({ row }) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SERVICE_LEVEL_BADGE[row.original.serviceLevel]}`}>
          {SERVICE_LEVEL_LABEL[row.original.serviceLevel]}
        </span>
      ),
    },
    {
      id: "leadSource",
      header: "Nguồn",
      cell: ({ row }) => <span className='text-muted-foreground text-xs'>{LEAD_SOURCE_LABEL[row.original.leadSource]}</span>,
    },
    {
      id: "assignedTo",
      header: "Phụ trách",
      cell: ({ row }) =>
        row.original.assignedTo ? (
          <span className='text-sm'>{row.original.assignedTo}</span>
        ) : (
          <span className='text-muted-foreground text-xs italic'>Chưa phân công</span>
        ),
    },
    {
      id: "status",
      header: "Trạng thái",
      enableSorting: false,
      cell: ({ row }) => <TripRequestStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Hành động",
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex items-center gap-1.5'>
          <ActionButton action='edit' size='icon-sm' onClick={() => navigate(PATHS.SALES.TRIP_REQUEST_DETAIL.replace(":id", row.original.id))} />
          <ActionButton action='delete' size='icon-sm' variant='destructive' onClick={() => handleDelete(row.original)} />
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <TableToolbar
        title='Trip Request'
        description='Danh sách yêu cầu chuyến đi từ khách hàng'
        icon={PhoneCall}
        onAdd={() => navigate(PATHS.SALES.TRIP_REQUEST_CREATE)}
      />

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-3'>
        <SearchBox value={search} onChange={setSearch} placeholder='Tìm theo tên khách, mã TR, điểm đến...' />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-44'>
            <SelectValue placeholder='Tất cả trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUS}>Tất cả trạng thái</SelectItem>
            {TRIP_REQUEST_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AppTable columns={columns} data={filtered} />
    </div>
  );
}
