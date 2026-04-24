import { PAYMENT_METHOD_OPTIONS } from "@/modules/accounting/customerPayment/constants/customer-payment.constant";
import { vendorPaymentMockStore } from "@/modules/accounting/vendorPayment/data/vendor-payment.mock-store";
import { recordVendorPaymentSchema, type RecordVendorPaymentFormValues } from "@/modules/accounting/vendorPayment/schemas/vendor-payment.schema";
import type { VendorPayment } from "@/modules/accounting/vendorPayment/types/vendor-payment.type";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormDatePicker from "@/shared/components/form/FormDatePicker/FormDatePicker";
import FormSelect from "@/shared/components/form/FormSelect/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

interface RecordVendorPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: VendorPayment | null;
  onRecorded: () => void;
}

export default function RecordVendorPaymentDialog({ open, onOpenChange, vendor, onRecorded }: RecordVendorPaymentDialogProps) {
  const methods = useForm<RecordVendorPaymentFormValues>({
    resolver: zodResolver(recordVendorPaymentSchema),
    values: {
      actualAmount: vendor?.expectedAmount ?? 0,
      paidAt: new Date().toISOString().slice(0, 10),
      paymentMethod: "",
      note: "",
    },
  });

  const handleClose = () => {
    methods.reset();
    onOpenChange(false);
  };

  const handleSubmit = (values: RecordVendorPaymentFormValues) => {
    if (!vendor) return;
    vendorPaymentMockStore.recordPayment(vendor.id, values);
    handleClose();
    onRecorded();
  };

  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Ghi nhận thanh toán cho nhà cung cấp</DialogTitle>
        </DialogHeader>

        <Section>
          <p>
            <span className='text-muted-foreground'>Nhà cung cấp: </span>
            <span className='font-medium'>{vendor.vendorName}</span>
          </p>
          <p>
            <span className='text-muted-foreground'>Dịch vụ: </span>
            <span className='font-medium'>{vendor.serviceDescription}</span>
          </p>
          <p>
            <span className='text-muted-foreground'>Phải thanh toán: </span>
            <span className='font-medium'>
              {formatNumberVN(vendor.expectedAmount)} {vendor.currency}
            </span>
          </p>
        </Section>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormCurrencyInput name='actualAmount' label='Số tiền thực trả' required placeholder={`VD: ${formatNumberVN(vendor.expectedAmount)}`} />
            <FormDatePicker name='paidAt' label='Ngày thanh toán' required />
            <FormSelect name='paymentMethod' label='Hình thức thanh toán' required options={PAYMENT_METHOD_OPTIONS} placeholder='Chọn hình thức' />
            <FormTextarea name='note' label='Ghi chú' placeholder='Số tham chiếu, chứng từ...' rows={2} />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Hủy
              </Button>
              <Button type='submit'>Xác nhận thanh toán</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
