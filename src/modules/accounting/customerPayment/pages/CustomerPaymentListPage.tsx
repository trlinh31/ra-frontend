import { PATHS } from "@/app/routes/route.constant";
import PaymentStatusBadge from "@/modules/accounting/customerPayment/components/PaymentStatusBadge";
import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import type { CustomerPayment } from "@/modules/accounting/customerPayment/types/customer-payment.type";
import { AppTable } from "@/shared/components/common/AppTable";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerPaymentListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [payments, setPayments] = useState<CustomerPayment[]>(() => customerPaymentMockStore.getAll());
  const [search, setSearch] = useState("");

  const refresh = () => setPayments(customerPaymentMockStore.getAll());

  const filtered = useMemo(() => {
    if (!search) return payments;
    const q = search.toLowerCase();
    return payments.filter((p) => p.customerName.toLowerCase().includes(q) || p.confirmedTourCode.toLowerCase().includes(q));
  }, [payments, search]);

  const handleDelete = async (payment: CustomerPayment) => {
    const ok = await confirm({
      description: `Bạn có chắc chắn muốn xóa phiếu thu của "${payment.customerName}" (${payment.confirmedTourCode})?`,
    });
    if (!ok) return;
    customerPaymentMockStore.delete(payment.id);
    refresh();
  };

  const columns: ColumnDef<CustomerPayment>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1, maxSize: 60 },
    { header: "Mã tour", accessorKey: "confirmedTourCode", maxSize: 130 },
    { header: "Khách hàng", accessorKey: "customerName" },
    {
      id: "totalAmount",
      header: "Tổng giá trị",
      enableSorting: false,
      cell: ({ row }) => (
        <span className='font-medium'>
          {formatNumberVN(row.original.totalAmount)} {row.original.currency}
        </span>
      ),
    },
    {
      id: "collected",
      header: "Đã thu",
      enableSorting: false,
      cell: ({ row }) => {
        const collected = customerPaymentMockStore.getCollectedAmount(row.original);
        return (
          <span className='font-medium text-green-700'>
            {formatNumberVN(collected)} {row.original.currency}
          </span>
        );
      },
    },
    {
      id: "remaining",
      header: "Còn lại",
      enableSorting: false,
      cell: ({ row }) => {
        const remaining = row.original.totalAmount - customerPaymentMockStore.getCollectedAmount(row.original);
        return (
          <span className={remaining > 0 ? "text-orange-600 font-medium" : "text-muted-foreground"}>
            {formatNumberVN(remaining)} {row.original.currency}
          </span>
        );
      },
    },
    {
      id: "overallStatus",
      header: "Trạng thái",
      enableSorting: false,
      cell: ({ row }) => <PaymentStatusBadge status={customerPaymentMockStore.getOverallStatus(row.original)} />,
    },
    {
      id: "installmentCount",
      header: "Số đợt",
      enableSorting: false,
      cell: ({ row }) => `${row.original.installments.length} đợt`,
    },
    {
      id: "actions",
      header: "Hành động",
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex items-center gap-1.5'>
          <ActionButton action='edit' size='icon-sm' onClick={() => navigate(`/accounting/customer-payments/${row.original.id}`)} />
          <ActionButton action='delete' size='icon-sm' variant='destructive' onClick={() => handleDelete(row.original)} />
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <TableToolbar
        title='Phiếu Thu Khách Hàng'
        description='Theo dõi các đợt thu tiền từ khách theo từng tour'
        icon={CreditCard}
        onAdd={() => navigate(PATHS.ACCOUNTING.CUSTOMER_PAYMENT_CREATE)}
      />
      <SearchBox value={search} onChange={setSearch} placeholder='Tìm theo tên khách hoặc mã tour...' />
      <AppTable columns={columns} data={filtered} />
    </div>
  );
}
