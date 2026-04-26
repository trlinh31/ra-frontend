import PaymentStatusBadge from "@/modules/accounting/customerPayment/components/PaymentStatusBadge";
import RecordPaymentDialog from "@/modules/accounting/customerPayment/components/RecordPaymentDialog";
import { PAYMENT_METHOD_LABEL } from "@/modules/accounting/customerPayment/constants/customer-payment.constant";
import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import type { CustomerPayment, PaymentInstallment } from "@/modules/accounting/customerPayment/types/customer-payment.type";
import { AppTable } from "@/shared/components/common/AppTable";
import PageHeader from "@/shared/components/common/PageHeader";
import Section from "@/shared/components/common/Section";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { BadgeDollarSign } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CustomerPaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<CustomerPayment | undefined>(() => (id ? customerPaymentMockStore.getById(id) : undefined));
  const [recordTarget, setRecordTarget] = useState<PaymentInstallment | null>(null);

  if (!payment) {
    return (
      <div className='flex flex-col justify-center items-center gap-4 py-16'>
        <p className='text-muted-foreground'>Không tìm thấy phiếu thu.</p>
        <Button variant='outline' onClick={() => navigate(-1)}>
          ← Quay lại
        </Button>
      </div>
    );
  }

  const collected = customerPaymentMockStore.getCollectedAmount(payment);
  const remaining = payment.totalAmount - collected;
  const overallStatus = customerPaymentMockStore.getOverallStatus(payment);

  const columns: ColumnDef<PaymentInstallment>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1, maxSize: 60 },
    { header: "Đợt thu", accessorKey: "label" },
    { header: "Hạn thanh toán", accessorKey: "dueDate" },
    {
      id: "expectedAmount",
      header: "Dự kiến",
      cell: ({ row }) => (
        <span>
          {formatNumberVN(row.original.expectedAmount)} {payment.currency}
        </span>
      ),
    },
    {
      id: "actualAmount",
      header: "Thực thu",
      cell: ({ row }) => {
        const amt = row.original.actualAmount;
        return (
          amt !== undefined && (
            <span className='font-medium text-green-700'>
              {formatNumberVN(amt)} {payment.currency}
            </span>
          )
        );
      },
    },
    {
      id: "paidAt",
      header: "Ngày nhận",
      cell: ({ row }) => row.original.paidAt,
    },
    {
      id: "paymentMethod",
      header: "Hình thức",
      cell: ({ row }) => {
        const m = row.original.paymentMethod;
        return m && (PAYMENT_METHOD_LABEL[m] ?? m);
      },
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Hành động",
      enableSorting: false,
      cell: ({ row }) => {
        const inst = row.original;
        if (inst.status === "paid") return null;
        return (
          <Button type='button' size='sm' variant='outline' onClick={() => setRecordTarget(inst)}>
            <BadgeDollarSign className='mr-1 w-4 h-4' />
            Ghi nhận
          </Button>
        );
      },
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Chi tiết Phiếu Thu'
        description={`${payment.confirmedTourCode} — ${payment.customerName}${payment.customerPhone ? ` · ${payment.customerPhone}` : ""}${payment.customerEmail ? ` · ${payment.customerEmail}` : ""}`}
      />

      {/* Summary */}
      <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          { label: "Tổng giá trị", value: formatNumberVN(payment.totalAmount), suffix: payment.currency, color: "" },
          { label: "Đã thu", value: formatNumberVN(collected), suffix: payment.currency, color: "text-green-700" },
          {
            label: "Còn lại",
            value: formatNumberVN(remaining),
            suffix: payment.currency,
            color: remaining > 0 ? "text-orange-600" : "text-muted-foreground",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className='pt-4'>
              <p className='mb-1 text-muted-foreground text-xs'>{item.label}</p>
              <p className={`text-xl font-bold ${item.color}`}>
                {item.value} <span className='font-normal text-sm'>{item.suffix}</span>
              </p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className='pt-4'>
            <p className='mb-2 text-muted-foreground text-xs'>Trạng thái tổng</p>
            <PaymentStatusBadge status={overallStatus} />
          </CardContent>
        </Card>
      </div>

      {/* Installments table */}
      {/* <Card>
        <CardHeader>
          <CardTitle className='text-base'>Kế hoạch thu theo đợt</CardTitle>
        </CardHeader>
        <CardContent>
          <AppTable columns={columns} data={payment.installments} enablePagination={false} />
        </CardContent>
      </Card> */}

      <Section title='Kế hoạch thu theo đợt'>
        <AppTable columns={columns} data={payment.installments} enablePagination={false} />
      </Section>

      <RecordPaymentDialog
        open={Boolean(recordTarget)}
        onOpenChange={(open) => {
          if (!open) setRecordTarget(null);
        }}
        paymentId={payment.id}
        installment={recordTarget}
        currency={payment.currency}
        onRecorded={() => {
          setRecordTarget(null);
          setPayment(customerPaymentMockStore.getById(payment.id));
        }}
      />
    </div>
  );
}
