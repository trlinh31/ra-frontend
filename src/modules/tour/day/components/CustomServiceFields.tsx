import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppCurrencyInput from "@/shared/components/common/AppCurrencyInput";
import AppSelect from "@/shared/components/common/AppSelect";
import FormInput from "@/shared/components/form/FormInput";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { Controller, useFormContext } from "react-hook-form";

interface CustomServiceFieldsProps {
  index: number;
}

export default function CustomServiceFields({ index }: CustomServiceFieldsProps) {
  const { control, formState } = useFormContext<DayFormValues>();

  const nameError = formState.errors?.services?.[index]?.name;
  const priceError = formState.errors?.services?.[index]?.unitPrice;
  const currencyError = formState.errors?.services?.[index]?.currency;

  return (
    <div className='space-y-3 mt-1 pt-3 border-t'>
      <FormInput name={`services.${index}.name`} label='Tên dịch vụ' placeholder='VD: Thuê xe máy, Massage 60 phút...' required />

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <Field data-invalid={!!priceError}>
          <FieldLabel htmlFor={`custom-price-${index}`}>
            Đơn giá <span className='text-red-500'>*</span>
          </FieldLabel>
          <Controller
            control={control}
            name={`services.${index}.unitPrice`}
            render={({ field }) => (
              <AppCurrencyInput id={`custom-price-${index}`} value={field.value} onChange={field.onChange} placeholder='Nhập đơn giá' />
            )}
          />
          {priceError && <FieldError errors={[priceError]} />}
        </Field>

        <Field data-invalid={!!currencyError}>
          <FieldLabel>
            Tiền tệ <span className='text-red-500'>*</span>
          </FieldLabel>
          <Controller
            control={control}
            name={`services.${index}.currency`}
            render={({ field }) => (
              <AppSelect options={CURRENCY_OPTIONS} value={field.value} onChange={(val) => field.onChange(val)} placeholder='Chọn tiền tệ' />
            )}
          />
          {currencyError && <FieldError errors={[currencyError]} />}
        </Field>
      </div>

      <FormTextarea name={`services.${index}.customDetail.description`} label='Ghi chú' placeholder='Mô tả thêm về dịch vụ (tùy chọn)' rows={2} />

      <p className='text-muted-foreground text-xs italic'>Dịch vụ tự do không lưu vào Master Data — chỉ tồn tại trong lịch trình này.</p>
    </div>
  );
}
