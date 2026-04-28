import { PATHS } from "@/app/routes/route.constant";
import RecordVendorPaymentDialog from "@/modules/accounting/vendorPayment/components/RecordVendorPaymentDialog";
import VendorPaymentStatusBadge from "@/modules/accounting/vendorPayment/components/VendorPaymentStatusBadge";
import { VENDOR_TYPE_LABEL } from "@/modules/accounting/vendorPayment/constants/vendor-payment.constant";
import { vendorPaymentMockStore } from "@/modules/accounting/vendorPayment/data/vendor-payment.mock-store";
import type { VendorPayment } from "@/modules/accounting/vendorPayment/types/vendor-payment.type";
import { AppTable } from "@/shared/components/common/AppTable";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Button } from "@/shared/components/ui/button";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { Banknote, HandCoins } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorPaymentListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [payments, setPayments] = useState<VendorPayment[]>(() => vendorPaymentMockStore.getAll());
  const [search, setSearch] = useState("");
  const [recordTarget, setRecordTarget] = useState<VendorPayment | null>(null);

  const refresh = () => setPayments(vendorPaymentMockStore.getAll());

  const filtered = useMemo(() => {
    if (!search) return payments;
    const q = search.toLowerCase();
    return payments.filter(
      (p) => p.vendorName.toLowerCase().includes(q) || p.confirmedTourCode.toLowerCase().includes(q) || p.serviceDescription.toLowerCase().includes(q)
    );
  }, [payments, search]);

  const handleDelete = async (payment: VendorPayment) => {
    if (payment.status === "paid") {
      await confirm({ description: `Không thể xóa phiếu chi đã thanh toán.` });
      return;
    }
    const ok = await confirm({
      description: `Bạn có chắc chắn muốn xóa phiếu chi cho "${payment.vendorName}"?`,
    });
    if (!ok) return;
    vendorPaymentMockStore.delete(payment.id);
    refresh();
  };

  const columns: ColumnDef<VendorPayment>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1, maxSize: 60 },
    { header: "Mã tour", accessorKey: "confirmedTourCode", maxSize: 130 },
    { header: "Nhà cung cấp", accessorKey: "vendorName" },
    {
      id: "vendorType",
      header: "Loại",
      cell: ({ row }) => VENDOR_TYPE_LABEL[row.original.vendorType] ?? row.original.vendorType,
    },
    { header: "Dịch vụ", accessorKey: "serviceDescription", enableSorting: false },
    {
      id: "expectedAmount",
      header: "Phải trả",
      cell: ({ row }) => (
        <span className='font-medium'>
          {formatNumberVN(row.original.expectedAmount)} {row.original.currency}
        </span>
      ),
    },
    {
      id: "actualAmount",
      header: "Đã trả",
      cell: ({ row }) => {
        const amt = row.original.actualAmount;
        return amt !== undefined ? (
          <span className='font-medium text-green-700'>
            {formatNumberVN(amt)} {row.original.currency}
          </span>
        ) : null;
      },
    },
    { header: "Hạn TT", accessorKey: "dueDate" },
    {
      id: "status",
      header: "Trạng thái",
      enableSorting: false,
      cell: ({ row }) => <VendorPaymentStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Hành động",
      enableSorting: false,
      cell: ({ row }) => {
        const vp = row.original;
        return (
          <div className='flex items-center gap-1.5'>
            <Button type='button' size='sm' variant='outline' disabled={vp.status === "paid"} onClick={() => setRecordTarget(vp)}>
              <HandCoins className='w-4 h-4' />
            </Button>
            <ActionButton action='delete' size='icon-sm' variant='destructive' onClick={() => handleDelete(vp)} />
          </div>
        );
      },
    },
  ];

  return (
    <div className='space-y-4'>
      <TableToolbar
        title='Phiếu Chi Nhà Cung Cấp'
        description='Theo dõi các khoản thanh toán cho nhà cung cấp dịch vụ'
        icon={Banknote}
        onAdd={() => navigate(PATHS.ACCOUNTING.VENDOR_PAYMENT_CREATE)}
      />
      <SearchBox value={search} onChange={setSearch} placeholder='Tìm theo nhà cung cấp, mã tour, dịch vụ...' />
      <AppTable columns={columns} data={filtered} />

      <RecordVendorPaymentDialog
        open={Boolean(recordTarget)}
        onOpenChange={(open) => {
          if (!open) setRecordTarget(null);
        }}
        vendor={recordTarget}
        onRecorded={() => {
          setRecordTarget(null);
          refresh();
        }}
      />
    </div>
  );
}
