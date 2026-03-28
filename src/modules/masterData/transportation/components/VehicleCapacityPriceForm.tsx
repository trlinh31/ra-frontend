import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function VehicleCapacityPriceForm() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicleCapacityPrice",
  });

  const handleAddVehicleCapacityPrice = () => {
    append({
      capacity: undefined as unknown as number,
      price: undefined as unknown as number,
    });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có loại xe nào. Nhấn &quot;Thêm loại xe&quot; để bắt đầu.</p>

        <Button type='button' onClick={handleAddVehicleCapacityPrice}>
          <PlusCircle className='w-4 h-4' />
          Thêm loại xe
        </Button>
      </Section>
    );
  }

  return (
    <div className='space-y-3'>
      {fields.map((field, index) => (
        <div key={field.id} className='flex gap-4'>
          <FormCurrencyInput name={`vehicleCapacityPrice.${index}.capacity`} label='Sức chứa' required />

          <FormCurrencyInput name={`vehicleCapacityPrice.${index}.price`} label='Giá (VNĐ)' required />

          <div className='flex justify-end items-end gap-3'>
            <ActionButton action='add' onClick={handleAddVehicleCapacityPrice} />
            <ActionButton action='delete' onClick={() => remove(index)} />
          </div>
        </div>
      ))}
    </div>
  );
}
