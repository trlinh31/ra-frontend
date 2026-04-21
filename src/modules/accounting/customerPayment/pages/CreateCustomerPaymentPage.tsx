import { PATHS } from "@/app/routes/route.constant";
import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import {
  createCustomerPaymentSchema,
  type CreateCustomerPaymentFormValues,
} from "@/modules/accounting/customerPayment/schemas/customer-payment.schema";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import PageHeader from "@/shared/components/common/PageHeader";
import FormDatePicker from "@/shared/components/form/FormDatePicker/FormDatePicker";
import FormInput from "@/shared/components/form/FormInput/FormInput";
import FormSelect from "@/shared/components/form/FormSelect/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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
      totalAmount: 0,
      currency: "VND",
      installments: [{ label: "Đặt cọc", dueDate: "", expectedAmount: 0, note: "" }],
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
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className='gap-4 grid grid-cols-1 md:grid-cols-3'>
              <FormSelect name='confirmedTourId' label='Tour' required options={tourOptions} placeholder='Chọn tour' className='md:col-span-3' />
              <FormInput name='totalAmount' label='Tổng giá trị hợp đồng' required type='number' className='md:col-span-2' />
              <FormSelect name='currency' label='Tiền tệ' required options={CURRENCY_OPTIONS} placeholder='Chọn tiền tệ' />
            </CardContent>
          </Card>

          {/* Kế hoạch thu */}
          <Card>
            <CardHeader className='flex flex-row justify-between items-center'>
              <CardTitle className='text-base'>Kế hoạch thu theo đợt</CardTitle>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => append({ label: `Đợt ${fields.length + 1}`, dueDate: "", expectedAmount: 0, note: "" })}>
                + Thêm đợt
              </Button>
            </CardHeader>
            <CardContent className='space-y-4'>
              {fields.map((field, index) => (
                <div key={field.id} className='space-y-3 p-4 border rounded-lg'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-muted-foreground text-sm'>Đợt {index + 1}</span>
                    {fields.length > 1 && (
                      <Button type='button' size='icon-sm' variant='ghost' onClick={() => remove(index)}>
                        <Trash2 className='w-4 h-4 text-red-500' />
                      </Button>
                    )}
                  </div>
                  <div className='gap-3 grid grid-cols-1 md:grid-cols-3'>
                    <FormInput
                      name={`installments.${index}.label`}
                      label='Tên đợt'
                      required
                      placeholder='VD: Đặt cọc 30%'
                      className='md:col-span-2'
                    />
                    <FormDatePicker name={`installments.${index}.dueDate`} label='Hạn thanh toán' required />
                    <FormInput name={`installments.${index}.expectedAmount`} label='Số tiền dự kiến' required type='number' />
                    <FormTextarea name={`installments.${index}.note`} label='Ghi chú' placeholder='Tùy chọn...' rows={1} className='md:col-span-2' />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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
