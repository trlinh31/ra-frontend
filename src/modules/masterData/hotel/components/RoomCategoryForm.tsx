import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormTextarea from "@/shared/components/form/FormTextarea";
import ActionButton from "@/shared/components/table/ActionButton";
import { FieldError } from "@/shared/components/ui/field";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function RoomCategoryForm() {
  const { control, formState } = useFormContext<HotelFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roomTypes",
  });

  const handleAddRoomCategory = () => {
    append({
      name: "",
      maxGuests: undefined as unknown as number,
      note: "",
    });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Phòng trống. Nhấn &quot;Thêm phòng&quot; để bắt đầu.</p>

        <ActionButton action='add' text='Thêm phòng' variant='default' size='default' onClick={handleAddRoomCategory} />
      </Section>
    );
  }

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <Section key={field.id} title={`Phòng #${index + 1}`} type='dashed' borderColor='red'>
          <div className='flex flex-col gap-3'>
            <FormInput name={`roomTypes.${index}.name`} label='Tên loại phòng' required />
            <FormCurrencyInput name={`roomTypes.${index}.maxGuests`} label='Số người tối đa' required />
            <FormTextarea name={`roomTypes.${index}.note`} label='Ghi chú' />

            <div className='flex gap-2'>
              <ActionButton action='add' text='Thêm loại phòng' variant='default' size='default' onClick={handleAddRoomCategory} />
              <ActionButton action='delete' text='Xóa loại phòng' variant='destructive' size='default' onClick={() => remove(index)} />
            </div>
          </div>
        </Section>
      ))}

      {formState.errors.roomTypes?.message && <FieldError errors={[formState.errors.roomTypes]} />}
    </div>
  );
}
