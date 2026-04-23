import { PATHS } from "@/app/routes/route.constant";
import QuotationStatusBadge from "@/modules/sales/quotation/components/QuotationStatusBadge";
import { QUOTATION_STATUS_OPTIONS } from "@/modules/sales/quotation/constants/quotation.constant";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import type { Quotation } from "@/modules/sales/quotation/types/quotation.type";
import AppSelect from "@/shared/components/common/AppSelect";
import { AppTable } from "@/shared/components/common/AppTable";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_ALL = "all";
const statusFilterOptions = [{ value: STATUS_ALL, label: "Tất cả" }, ...QUOTATION_STATUS_OPTIONS];

export default function QuotationListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [quotations, setQuotations] = useState<Quotation[]>(() => quotationMockStore.getAll());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_ALL);

  const refresh = () => setQuotations(quotationMockStore.getAll());

  const filtered = useMemo(
    () =>
      quotations.filter((q) => {
        if (statusFilter !== STATUS_ALL && q.status !== statusFilter) return false;
        if (search && !q.customerName.toLowerCase().includes(search.toLowerCase()) && !q.code.toLowerCase().includes(search.toLowerCase()))
          return false;
        return true;
      }),
    [quotations, search, statusFilter]
  );

  const handleDelete = async (q: Quotation) => {
    if (q.status !== "draft") {
      await confirm({
        description: `Không thể xóa báo giá "${q.code}" — chỉ có thể xóa báo giá ở trạng thái "Bản nháp". Báo giá đã gửi chỉ được cập nhật trạng thái.`,
      });
      return;
    }
    const ok = await confirm({
      description: `Bạn có chắc chắn muốn xóa báo giá "${q.code} - ${q.customerName}"? Hành động này không thể hoàn tác.`,
    });
    if (!ok) return;
    quotationMockStore.delete(q.id);
    refresh();
  };

  const columns: ColumnDef<Quotation>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    {
      header: "Mã báo giá",
      accessorKey: "code",
    },
    { header: "Tên khách hàng / Đoàn", accessorKey: "customerName" },
    {
      header: "Tour mẫu",
      accessorKey: "tourTemplateName",
      enableSorting: false,
    },
    {
      header: "Số khách",
      accessorKey: "numberOfPeople",
    },
    {
      header: "Ngày đi (dự kiến)",
      accessorKey: "departureDateEst",
    },
    {
      header: "Phiên bản",
      id: "version",
      enableSorting: false,
      cell: ({ row }) => row.original.currentVersion > 0 && <span className='text-sm'>v{row.original.currentVersion}</span>,
    },
    {
      header: "Trạng thái",
      id: "status",
      enableSorting: false,
      cell: ({ row }) => <QuotationStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Hành động",
      enableSorting: false,
      cell: ({ row }) => {
        const q = row.original;
        return (
          <div className='flex items-center gap-1.5'>
            <ActionButton
              action='edit'
              size='icon-sm'
              variant='outline'
              onClick={() => navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", q.id))}
            />
            <ActionButton action='delete' size='icon-sm' variant='destructive' onClick={() => handleDelete(q)} />
          </div>
        );
      },
    },
  ];

  return (
    <div className='space-y-4'>
      <TableToolbar
        title='Báo giá'
        description='Quản lý báo giá tour cho khách hàng'
        icon={FileText}
        onAdd={() => navigate(PATHS.SALES.QUOTATION_CREATE)}
      />

      <div className='flex flex-wrap items-center gap-3'>
        <SearchBox value={search} onChange={setSearch} placeholder='Tìm theo mã báo giá hoặc tên khách...' />
        <AppSelect
          options={statusFilterOptions}
          value={statusFilter}
          onChange={(v) => setStatusFilter(String(v))}
          placeholder='Lọc theo trạng thái'
          className='w-52'
        />
      </div>

      <AppTable columns={columns} data={filtered} />
    </div>
  );
}
