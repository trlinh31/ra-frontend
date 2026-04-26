import { PATHS } from "@/app/routes/route.constant";
import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import {
  createCustomerPaymentSchema,
  type CreateCustomerPaymentFormValues,
} from "@/modules/accounting/customerPayment/schemas/customer-payment.schema";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
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
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Info, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type AutoFillSource =
  | { kind: "quotation"; code: string; sellingPrice: Record<string, number> }
  | { kind: "no_quotation" }
  | { kind: "no_selling_price"; quotationCode: string }
  | null;

export default function CreateCustomerPaymentPage() {
  const navigate = useNavigate();
  const [autoFill, setAutoFill] = useState<AutoFillSource>(null);

  const tourOptions = useMemo(
    () =>
      confirmedTourMockStore
        .getAll()
        .filter((t) => t.status === "confirmed" || t.status === "in_operation" || t.status === "completed")
        .map((t) => ({ value: t.id, label: `${t.code} – ${t.customerName}` })),
    []
  );

  const methods = useForm<CreateCustomerPaymentFormValues>({
    resolver: zodResolver(createCustomerPaymentSchema),
    defaultValues: {
      confirmedTourId: "",
      totalAmount: undefined as unknown as number,
      currency: "VND",
      customerPhone: "",
      customerEmail: "",
      installments: [{ label: "", dueDate: "", expectedAmount: undefined as unknown as number, note: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: "installments" });
  const watchedInstallments = useWatch({ control: methods.control, name: "installments" });
  const watchedTotal = useWatch({ control: methods.control, name: "totalAmount" });
  const installmentsSum = (watchedInstallments ?? []).reduce((acc, inst) => acc + (inst.expectedAmount ?? 0), 0);
  const sumDiff = (watchedTotal ?? 0) > 0 ? installmentsSum - (watchedTotal ?? 0) : 0;

  const handleTourChange = (tourId: string) => {
    const tour = confirmedTourMockStore.getById(tourId);
    if (!tour) return;

    // Auto-fill thông tin liên lạc
    methods.setValue("customerPhone", tour.customerPhone ?? "");
    methods.setValue("customerEmail", tour.customerEmail ?? "");

    // Auto-fill tổng giá trị hợp đồng từ báo giá liên kết
    if (!tour.quotationId) {
      setAutoFill({ kind: "no_quotation" });
      methods.setValue("totalAmount", undefined as unknown as number);
      return;
    }

    const quotation = quotationMockStore.getById(tour.quotationId);
    if (!quotation) {
      setAutoFill({ kind: "no_quotation" });
      return;
    }

    const entries = Object.entries(quotation.sellingPrice);
    if (entries.length === 0) {
      setAutoFill({ kind: "no_selling_price", quotationCode: quotation.code });
      methods.setValue("totalAmount", undefined as unknown as number);
      return;
    }

    // Lấy entry đầu tiên (thường chỉ có 1 loại tiền tệ)
    const [currency, amount] = entries[0];
    methods.setValue("totalAmount", amount);
    methods.setValue("currency", currency);
    setAutoFill({ kind: "quotation", code: quotation.code, sellingPrice: quotation.sellingPrice });
  };

  const handleSubmit = (values: CreateCustomerPaymentFormValues) => {
    const tour = confirmedTourMockStore.getById(values.confirmedTourId);
    customerPaymentMockStore.create({
      ...values,
      confirmedTourCode: tour?.code ?? "",
      customerName: tour?.customerName ?? "",
      customerPhone: values.customerPhone || undefined,
      customerEmail: values.customerEmail || undefined,
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
              <FormSelect
                name='confirmedTourId'
                label='Tour'
                required
                options={tourOptions}
                placeholder='Chọn tour'
                onChange={(val) => handleTourChange(String(val))}
              />

              {/* Tổng giá trị hợp đồng — tự động lấy từ báo giá nếu có */}
              <div className='flex flex-col gap-1.5'>
                <FormCurrencyInput
                  name='totalAmount'
                  label='Tổng giá trị hợp đồng'
                  placeholder='Tự động hoặc nhập tay'
                  required
                />
                {/* Thông báo nguồn auto-fill */}
                {autoFill?.kind === "quotation" && (
                  <div className='flex items-start gap-1.5 text-xs text-green-700'>
                    <CheckCircle2 className='w-3.5 h-3.5 mt-0.5 shrink-0' />
                    <span>
                      Lấy từ báo giá <strong>{autoFill.code}</strong>
                      {Object.keys(autoFill.sellingPrice).length > 1 && (
                        <span className='text-muted-foreground ml-1'>
                          ({Object.entries(autoFill.sellingPrice).map(([c, a]) => `${formatNumberVN(a)} ${c}`).join(", ")})
                        </span>
                      )}
                      . Có thể chỉnh lại nếu cần.
                    </span>
                  </div>
                )}
                {autoFill?.kind === "no_selling_price" && (
                  <div className='flex items-start gap-1.5 text-xs text-amber-600'>
                    <Info className='w-3.5 h-3.5 mt-0.5 shrink-0' />
                    <span>
                      Báo giá <strong>{autoFill.quotationCode}</strong> chưa có giá bán — vui lòng nhập tay.
                    </span>
                  </div>
                )}
                {autoFill?.kind === "no_quotation" && (
                  <div className='flex items-start gap-1.5 text-xs text-muted-foreground'>
                    <Info className='w-3.5 h-3.5 mt-0.5 shrink-0' />
                    <span>Tour không có báo giá liên kết — vui lòng nhập tổng giá trị hợp đồng.</span>
                  </div>
                )}
              </div>

              <FormSelect name='currency' label='Tiền tệ' required options={CURRENCY_OPTIONS} placeholder='Chọn tiền tệ' />
              <FormInput name='customerPhone' label='Số điện thoại liên hệ' placeholder='VD: 0901234567' />
              <FormInput name='customerEmail' label='Email liên hệ' placeholder='VD: khach@email.com' className='md:col-span-2' />
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
                  text='Thêm đợt'
                  variant='default'
                  size='default'
                  onClick={() =>
                    append({ label: `Đợt ${fields.length + 1}`, dueDate: "", expectedAmount: undefined as unknown as number, note: "" })
                  }
                />
              </div>

              {/* Thanh kiểm tra tổng */}
              {(watchedTotal ?? 0) > 0 && (
                <div
                  className={`flex justify-between items-center px-4 py-2.5 rounded-md text-sm font-medium border ${
                    sumDiff === 0
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-orange-50 border-orange-200 text-orange-700"
                  }`}
                >
                  <span>{sumDiff === 0 ? "✓ Tổng các đợt khớp với hợp đồng" : "Tổng các đợt"}</span>
                  <span>
                    {formatNumberVN(installmentsSum)}
                    {sumDiff !== 0 && (
                      <span className='ml-2 font-normal text-xs'>
                        ({sumDiff > 0 ? "+" : ""}
                        {formatNumberVN(sumDiff)} so với tổng hợp đồng)
                      </span>
                    )}
                  </span>
                </div>
              )}
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
