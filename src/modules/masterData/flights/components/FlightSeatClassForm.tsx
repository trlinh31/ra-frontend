import type { FlightFormValues } from "@/modules/masterData/flights/schemas/flight.schema";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormTextarea from "@/shared/components/form/FormTextarea";
import ActionButton from "@/shared/components/table/ActionButton";
import { FieldError } from "@/shared/components/ui/field";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function FlightSeatClassForm() {
  const { control, formState } = useFormContext<FlightFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "seatClasses",
  });

  const handleAdd = () => {
    append({ name: "", note: "" });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có hạng vé nào. Nhấn &quot;Thêm hạng vé&quot; để bắt đầu.</p>

        <ActionButton action='add' text='Thêm hạng vé' variant='default' size='default' onClick={handleAdd} />
      </Section>
    );
  }

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <Section key={field.id} title={`Hạng vé #${index + 1}`} type='dashed' borderColor='red'>
          <div className='flex flex-col gap-3'>
            <FormInput name={`seatClasses.${index}.name`} label='Tên hạng vé' placeholder='VD: Economy, Business, First Class' required />
            <FormTextarea name={`seatClasses.${index}.note`} label='Ghi chú' />

            <div className='flex gap-2'>
              <ActionButton action='add' text='Thêm hạng vé' variant='default' size='default' onClick={handleAdd} />
              <ActionButton action='delete' text='Xóa hạng vé' variant='destructive' size='default' onClick={() => remove(index)} />
            </div>
          </div>
        </Section>
      ))}

      {formState.errors.seatClasses?.message && <FieldError errors={[formState.errors.seatClasses]} />}
    </div>
  );
}
