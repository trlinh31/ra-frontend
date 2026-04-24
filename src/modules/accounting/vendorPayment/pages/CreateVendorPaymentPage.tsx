import { PATHS } from "@/app/routes/route.constant";
import { VENDOR_TYPE_OPTIONS } from "@/modules/accounting/vendorPayment/constants/vendor-payment.constant";
import { vendorPaymentMockStore } from "@/modules/accounting/vendorPayment/data/vendor-payment.mock-store";
import { createVendorPaymentSchema, type CreateVendorPaymentFormValues } from "@/modules/accounting/vendorPayment/schemas/vendor-payment.schema";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import PageHeader from "@/shared/components/common/PageHeader";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormDatePicker from "@/shared/components/form/FormDatePicker/FormDatePicker";
import FormInput from "@/shared/components/form/FormInput/FormInput";
import FormSelect from "@/shared/components/form/FormSelect/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const tourOptions = confirmedTourMockStore
  .getAll()
  .filter((t) => t.status !== "draft")
  .map((t) => ({ value: t.id, label: `${t.code} – ${t.customerName}` }));

export default function CreateVendorPaymentPage() {
  const navigate = useNavigate();

  const methods = useForm<CreateVendorPaymentFormValues>({
    resolver: zodResolver(createVendorPaymentSchema),
    defaultValues: {
      confirmedTourId: "",
      vendorName: "",
      vendorType: "",
      serviceDescription: "",
      expectedAmount: undefined as unknown as number,
      currency: "VND",
      dueDate: "",
      note: "",
    },
  });

  const handleSubmit = (values: CreateVendorPaymentFormValues) => {
    const tour = confirmedTourMockStore.getById(values.confirmedTourId);
    vendorPaymentMockStore.create({
      ...values,
      confirmedTourCode: tour?.code ?? "",
      status: "pending",
      createdBy: "Kế toán A",
    });
    navigate(PATHS.ACCOUNTING.VENDOR_PAYMENTS);
  };

  return (
    <div className='space-y-6'>
      <PageHeader title='Tạo phiếu chi' description='Ghi nhận khoản thanh toán cần chi cho nhà cung cấp dịch vụ' />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-6'>
          <Section title='Thông tin thanh toán'>
            <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
              <FormSelect name='confirmedTourId' label='Tour' required options={tourOptions} placeholder='Chọn tour liên quan' />
              <FormInput name='vendorName' label='Tên nhà cung cấp' required placeholder='VD: Khách sạn Ánh Dương' />
              <FormSelect name='vendorType' label='Loại nhà cung cấp' required options={VENDOR_TYPE_OPTIONS} placeholder='Chọn loại' />
              <FormCurrencyInput name='expectedAmount' label='Số tiền phải trả' placeholder='Nhập số tiền phải trả' required />
              <FormSelect name='currency' label='Tiền tệ' required options={CURRENCY_OPTIONS} placeholder='Chọn tiền tệ' />
              <FormDatePicker name='dueDate' label='Hạn thanh toán' required />
              <FormTextarea
                name='serviceDescription'
                label='Mô tả dịch vụ'
                required
                placeholder='VD: Phòng đôi 3 đêm × 6 phòng'
                rows={2}
                className='md:col-span-2'
              />
              <FormTextarea name='note' label='Ghi chú' placeholder='Số tài khoản, điều khoản...' rows={2} className='md:col-span-2' />
            </div>
          </Section>

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={() => navigate(PATHS.ACCOUNTING.VENDOR_PAYMENTS)}>
              Hủy
            </Button>
            <Button type='submit'>Tạo Phiếu Chi</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
