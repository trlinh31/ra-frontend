import { PAYMENT_METHOD_OPTIONS } from "@/modules/accounting/customerPayment/constants/customer-payment.constant";
import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import { recordInstallmentSchema, type RecordInstallmentFormValues } from "@/modules/accounting/customerPayment/schemas/customer-payment.schema";
import type { PaymentInstallment } from "@/modules/accounting/customerPayment/types/customer-payment.type";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormDatePicker from "@/shared/components/form/FormDatePicker/FormDatePicker";
import FormSelect from "@/shared/components/form/FormSelect/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string;
  installment: PaymentInstallment | null;
  currency: string;
  onRecorded: () => void;
}

export default function RecordPaymentDialog({ open, onOpenChange, paymentId, installment, currency, onRecorded }: RecordPaymentDialogProps) {
  const methods = useForm<RecordInstallmentFormValues>({
    resolver: zodResolver(recordInstallmentSchema),
    values: {
      actualAmount: installment?.expectedAmount ?? 0,
      paidAt: new Date().toISOString().slice(0, 10),
      paymentMethod: "",
      note: "",
    },
  });

  const handleClose = () => {
    methods.reset();
    onOpenChange(false);
  };

  const handleSubmit = (values: RecordInstallmentFormValues) => {
    if (!installment) return;
    customerPaymentMockStore.recordInstallmentPayment(paymentId, installment.id, values);
    handleClose();
    onRecorded();
  };

  if (!installment) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Ghi nhận thanh toán</DialogTitle>
        </DialogHeader>

        <div className='space-y-1 bg-muted/40 p-3 rounded-md text-sm'>
          <p>
            <span className='text-muted-foreground'>Đợt thu: </span>
            <span className='font-medium'>{installment.label}</span>
          </p>
          <p>
            <span className='text-muted-foreground'>Số tiền dự kiến: </span>
            <span className='font-medium'>
              {formatNumberVN(installment.expectedAmount)} {currency}
            </span>
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormCurrencyInput
              name='actualAmount'
              label='Số tiền thực nhận'
              required
              placeholder={`VD: ${formatNumberVN(installment.expectedAmount)}`}
            />
            <FormDatePicker name='paidAt' label='Ngày nhận tiền' required />
            <FormSelect name='paymentMethod' label='Hình thức thanh toán' required options={PAYMENT_METHOD_OPTIONS} placeholder='Chọn hình thức' />
            <FormTextarea name='note' label='Ghi chú' placeholder='Số chứng từ, ngân hàng...' rows={2} />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Hủy
              </Button>
              <Button type='submit'>Xác nhận</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
