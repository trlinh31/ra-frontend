import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function RoomCategoryForm() {
  const { control } = useFormContext<HotelFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roomCategories",
  });

  const handleAddRoomCategory = () => {
    append({
      name: "",
      quantity: undefined as unknown as number,
      area: undefined as unknown as number,
      note: "",
    });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có loại phòng nào. Nhấn &quot;Thêm loại phòng&quot; để bắt đầu.</p>

        <Button type='button' onClick={handleAddRoomCategory}>
          <PlusCircle className='w-4 h-4' />
          Thêm loại phòng
        </Button>
      </Section>
    );
  }

  return (
    <div className='divide-y divide-gray-300'>
      {fields.map((field, index) => (
        <div key={field.id} className='flex gap-4 py-4'>
          <FormInput name={`roomCategories.${index}.name`} label='Tên loại phòng' required />
          <FormCurrencyInput name={`roomCategories.${index}.quantity`} label='Số lượng' required />
          <FormCurrencyInput name={`roomCategories.${index}.area`} label='Diện tích (m²)' required />
          <FormInput name={`roomCategories.${index}.note`} label='Ghi chú' />

          <div className='flex justify-end items-end gap-3'>
            <ActionButton action='add' onClick={handleAddRoomCategory} />
            <ActionButton action='delete' onClick={() => remove(index)} />
          </div>
        </div>
      ))}
    </div>
  );
}
