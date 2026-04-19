import type { RestaurantFormValues } from "@/modules/masterData/restaurant/schemas/restaurant.schema";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import ActionButton from "@/shared/components/table/ActionButton";
import { FieldError } from "@/shared/components/ui/field";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function RestaurantMenuSection() {
  const { control, watch, formState } = useFormContext<RestaurantFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  const menuItems = watch("menuItems");
  const total = (menuItems ?? []).reduce((sum, item) => sum + (item.price || 0), 0);

  const handleAdd = () => {
    append({ name: "", price: 0 });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có món nào. Nhấn &quot;Thêm món&quot; để bắt đầu.</p>
        <ActionButton action='add' text='Thêm món' variant='default' size='default' onClick={handleAdd} />
      </Section>
    );
  }

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <Section key={field.id} type='dashed' borderColor='red'>
          <div className='items-end gap-3 grid grid-cols-1 sm:grid-cols-2'>
            <FormInput name={`menuItems.${index}.name`} label='Tên món' required />
            <FormCurrencyInput name={`menuItems.${index}.price`} label='Giá (VNĐ)' required />
            <div className='flex gap-2 sm:col-span-2'>
              <ActionButton action='add' text='Thêm món' variant='default' size='default' onClick={handleAdd} />
              <ActionButton action='delete' text='Xóa món' variant='destructive' size='default' onClick={() => remove(index)} />
            </div>
          </div>
        </Section>
      ))}

      {formState.errors.menuItems?.message && <FieldError errors={[formState.errors.menuItems]} />}

      <div className='flex justify-end'>
        <div className='font-medium text-sm'>
          Tổng cộng: <span className='font-bold text-primary text-base'>{total.toLocaleString("vi-VN")} ₫</span>
        </div>
      </div>
    </div>
  );
}
