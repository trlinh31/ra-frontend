import { PATHS } from "@/app/routes/route.constant";
import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import {
  createCustomerPaymentSchema,
  type CreateCustomerPaymentFormValues,
} from "@/modules/accounting/customerPayment/schemas/customer-payment.schema";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import PageHeader from "@/shared/components/common/PageHeader";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormDatePicker from "@/shared/components/form/FormDatePicker/FormDatePicker";
import FormInput from "@/shared/components/form/FormInput/FormInput";
import FormSelect from "@/shared/components/form/FormSelect/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea/FormTextarea";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const tourOptions = confirmedTourMockStore
  .getAll()
  .filter((t) => t.status !== "draft")
  .map((t) => ({ value: t.id, label: `${t.code} – ${t.customerName}` }));

export default function CreateCustomerPaymentPage() {
  const navigate = useNavigate();

  const methods = useForm<CreateCustomerPaymentFormValues>({
    resolver: zodResolver(createCustomerPaymentSchema),
    defaultValues: {
      confirmedTourId: "",
      totalAmount: undefined as unknown as number,
      currency: "VND",
      installments: [{ label: "", dueDate: "", expectedAmount: undefined as unknown as number, note: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: "installments" });

  const handleSubmit = (values: CreateCustomerPaymentFormValues) => {
    const tour = confirmedTourMockStore.getById(values.confirmedTourId);
    customerPaymentMockStore.create({
      ...values,
      confirmedTourCode: tour?.code ?? "",
      customerName: tour?.customerName ?? "",
      createdBy: "Kế toán A",
      installments: values.installments.map((installment) => ({
        ...installment,
        id: Math.random().toString(36).substr(2, 9),
        status: "pending",
      })),
    });
    navigate(PATHS.ACCOUNTING.CUSTOMER_PAYMENTS);
  };

  return (
    <div className='space-y-6'>
      <PageHeader title='Tạo Phiếu Thu' description='Thiết lập kế hoạch thu tiền từ khách hàng theo từng đợt' />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-6'>
          {/* Tour & Tổng giá trị */}
          <Section title='Thông tin chung'>
            <div className='gap-4 grid grid-cols-1 md:grid-cols-3'>
              <FormSelect name='confirmedTourId' label='Tour' required options={tourOptions} placeholder='Chọn tour' />
              <FormCurrencyInput name='totalAmount' label='Tổng giá trị hợp đồng' placeholder='Nhập giá trị hợp đồng' required />
              <FormSelect name='currency' label='Tiền tệ' required options={CURRENCY_OPTIONS} placeholder='Chọn tiền tệ' />
            </div>
          </Section>

          {/* Kế hoạch thu */}
          <Section title='Kế hoạch thu theo đợt'>
            <div className='space-y-4'>
              {fields.map((field, index) => (
                <div key={field.id} className='space-y-3 p-4 border rounded-lg'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-sm'>Đợt {index + 1}</span>
                    {fields.length > 1 && (
                      <Button type='button' size='icon-sm' variant='ghost' onClick={() => remove(index)}>
                        <Trash2 className='w-4 h-4 text-red-500' />
                      </Button>
                    )}
                  </div>
                  <div className='gap-3 grid grid-cols-1 md:grid-cols-3'>
                    <FormInput name={`installments.${index}.label`} label='Tên đợt' required placeholder='VD: Đặt cọc 30%' />
                    <FormDatePicker name={`installments.${index}.dueDate`} label='Hạn thanh toán' required />
                    <FormCurrencyInput
                      name={`installments.${index}.expectedAmount`}
                      label='Số tiền dự kiến'
                      placeholder='Nhập số tiền dự kiến'
                      required
                    />
                    <FormTextarea name={`installments.${index}.note`} label='Ghi chú' className='md:col-span-3' />
                  </div>
                </div>
              ))}

              <div className='flex justify-center'>
                <ActionButton
                  action='add'
                  text='Thêm giai đoạn'
                  variant='default'
                  size='default'
                  onClick={() => append({ label: `Đợt ${fields.length + 1}`, dueDate: "", expectedAmount: undefined as unknown as number, note: "" })}
                />
              </div>
            </div>
          </Section>

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={() => navigate(PATHS.ACCOUNTING.CUSTOMER_PAYMENTS)}>
              Hủy
            </Button>
            <Button type='submit'>Tạo Phiếu Thu</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
