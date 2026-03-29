import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormSelect from "@/shared/components/form/FormSelect";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { PlusCircle } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function VehicleCapacityPriceForm() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicleCapacityPrice",
  });

  const handleAdd = () => {
    append({
      capacity: undefined as unknown as number,
      currency: "VND",
      price: undefined as unknown as number,
    });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có loại xe nào. Nhấn &quot;Thêm loại xe&quot; để bắt đầu.</p>
        <Button type='button' onClick={handleAdd}>
          <PlusCircle className='w-4 h-4' />
          Thêm loại xe
        </Button>
      </Section>
    );
  }

  return (
    <div className='space-y-3'>
      {fields.map((field, index) => (
        <div key={field.id} className='flex items-end gap-4'>
          <FormCurrencyInput name={`vehicleCapacityPrice.${index}.capacity`} label='Sức chứa (chỗ)' required />
          <FormSelect name={`vehicleCapacityPrice.${index}.currency`} options={CURRENCY_OPTIONS} label='Đơn vị tiền tệ' required />
          <FormCurrencyInput name={`vehicleCapacityPrice.${index}.price`} label='Giá' required />
          <div className='flex justify-end items-end gap-2 pb-0.5'>
            <ActionButton action='add' onClick={handleAdd} />
            <ActionButton action='delete' variant='destructive' onClick={() => remove(index)} />
          </div>
        </div>
      ))}
    </div>
  );
}
