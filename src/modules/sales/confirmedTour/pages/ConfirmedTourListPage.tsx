import { PATHS } from "@/app/routes/route.constant";
import AssignTourDialog from "@/modules/sales/confirmedTour/components/AssignTourDialog";
import ConfirmedTourStatusBadge from "@/modules/sales/confirmedTour/components/ConfirmedTourStatusBadge";
import { CONFIRMED_TOUR_STATUS_LABEL, CONFIRMED_TOUR_STATUS_OPTIONS } from "@/modules/sales/confirmedTour/constants/confirmed-tour.constant";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import type { ConfirmedTour } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import AppSelect from "@/shared/components/common/AppSelect";
import { AppTable } from "@/shared/components/common/AppTable";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Button } from "@/shared/components/ui/button";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardCheck, UserRoundCog } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_ALL = "all";
const statusFilterOptions = [{ value: STATUS_ALL, label: "Tất cả" }, ...CONFIRMED_TOUR_STATUS_OPTIONS];

export default function ConfirmedTourListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [tours, setTours] = useState<ConfirmedTour[]>(() => confirmedTourMockStore.getAll());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_ALL);
  const [assignTarget, setAssignTarget] = useState<ConfirmedTour | null>(null);

  const refresh = () => setTours(confirmedTourMockStore.getAll());

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      if (statusFilter !== STATUS_ALL && t.status !== statusFilter) return false;
      if (search && !t.customerName.toLowerCase().includes(search.toLowerCase()) && !t.code.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [tours, search, statusFilter]);

  const handleDelete = async (tour: ConfirmedTour) => {
    if (tour.status === "in_operation" || tour.status === "completed") {
      await confirm({
        description: `Không thể xóa tour đã ở trạng thái "${CONFIRMED_TOUR_STATUS_LABEL[tour.status]}". Vui lòng sử dụng chức năng Hủy Tour nếu cần.`,
      });
      return;
    }
    const ok = await confirm({
      description: `Bạn có chắc chắn muốn xóa tour "${tour.code} - ${tour.customerName}"? Hành động này không thể hoàn tác.`,
    });
    if (!ok) return;
    confirmedTourMockStore.delete(tour.id);
    refresh();
  };

  const columns: ColumnDef<ConfirmedTour>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    {
      header: "Mã tour",
      accessorKey: "code",
    },
    { header: "Tên đoàn / Khách hàng", accessorKey: "customerName" },
    {
      header: "Nguồn",
      id: "source",
      enableSorting: false,
      cell: ({ row }) => {
        const t = row.original;
        if (t.quotationId) {
          return <span className='bg-blue-50 px-2 py-0.5 border border-blue-200 rounded-full text-blue-700 text-xs'>Từ báo giá</span>;
        }
        return t.tourTemplateName ? (
          <span className='text-muted-foreground text-xs'>{t.tourTemplateName}</span>
        ) : (
          <span className='text-muted-foreground text-xs'>—</span>
        );
      },
    },
    {
      id: "numberOfPeople",
      header: "Số khách",
      cell: ({ row }) => `${row.original.numberOfPeople} người`,
    },
    { header: "Ngày khởi hành", accessorKey: "departureDate" },
    {
      id: "totalCost",
      header: "Chi phí",
      enableSorting: false,
      cell: ({ row }) => {
        const entries = Object.entries(row.original.totalCost);
        if (!entries.length) return <span className='text-muted-foreground'>—</span>;
        return (
          <div className='space-y-0.5'>
            {entries.map(([cur, amt]) => (
              <div key={cur} className='font-medium whitespace-nowrap'>
                {formatNumberVN(amt)} {cur}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "assignedTo",
      header: "Vận hành",
      enableSorting: false,
      cell: ({ row }) => {
        const name = userMockStore.getById(row.original.assignedTo ?? "")?.fullName;
        return name ? <span className='text-sm'>{name}</span> : "";
      },
    },
    {
      id: "status",
      header: "Trạng thái",
      enableSorting: false,
      cell: ({ row }) => <ConfirmedTourStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Hành động",
      enableSorting: false,
      cell: ({ row }) => {
        const tour = row.original;
        return (
          <div className='flex items-center gap-1.5'>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => setAssignTarget(tour)}
              disabled={tour.status !== "confirmed"}
              title='Gán nhân viên vận hành'>
              <UserRoundCog className='w-4 h-4' />
            </Button>
            <ActionButton
              action='edit'
              size='icon-sm'
              variant='outline'
              onClick={() => navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", tour.id))}
            />
            <ActionButton action='delete' size='icon-sm' variant='destructive' onClick={() => handleDelete(tour)} />
          </div>
        );
      },
    },
  ];

  return (
    <div className='space-y-4'>
      <TableToolbar
        title='Booking Tour'
        description='Danh sách Booking Tour đã xác nhận với đoàn khách'
        icon={ClipboardCheck}
        onAdd={() => navigate(PATHS.SALES.CONFIRMED_TOUR_CREATE)}
      />

      <div className='flex flex-wrap items-center gap-3'>
        <SearchBox value={search} onChange={setSearch} placeholder='Tìm theo mã tour hoặc tên đoàn...' />
        <AppSelect
          options={statusFilterOptions}
          value={statusFilter}
          onChange={(v) => setStatusFilter(String(v))}
          placeholder='Lọc theo trạng thái'
          className='w-52'
        />
      </div>

      <AppTable columns={columns} data={filtered} />

      <AssignTourDialog
        tour={assignTarget}
        open={Boolean(assignTarget)}
        onOpenChange={(open) => {
          if (!open) setAssignTarget(null);
        }}
        onAssigned={() => {
          setAssignTarget(null);
          refresh();
        }}
      />
    </div>
  );
}
