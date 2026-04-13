import type { EntranceFeeFormValues } from "@/modules/masterData/entranceFee/schemas/entrance-fee.schema";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormTextarea from "@/shared/components/form/FormTextarea";
import ActionButton from "@/shared/components/table/ActionButton";
import { FieldError } from "@/shared/components/ui/field";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function EntranceFeeTicketTypeForm() {
  const { control, formState } = useFormContext<EntranceFeeFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: "ticketTypes" });

  const handleAdd = () => append({ name: "", note: "" });

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có loại đối tượng nào. Nhấn &quot;Thêm loại đối tượng&quot; để bắt đầu.</p>
        <ActionButton action='add' text='Thêm loại đối tượng' variant='default' size='default' onClick={handleAdd} />
      </Section>
    );
  }

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <Section key={field.id} title={`Loại đối tượng #${index + 1}`} type='dashed' borderColor='red'>
          <div className='flex flex-col gap-3'>
            <FormInput name={`ticketTypes.${index}.name`} label='Tên loại đối tượng' required />
            <FormTextarea name={`ticketTypes.${index}.note`} label='Ghi chú' />
            <div className='flex gap-2'>
              <ActionButton action='add' text='Thêm loại đối tượng' variant='default' size='default' onClick={handleAdd} />
              <ActionButton action='delete' text='Xóa' variant='destructive' size='default' onClick={() => remove(index)} />
            </div>
          </div>
        </Section>
      ))}

      {formState.errors.ticketTypes?.message && <FieldError errors={[formState.errors.ticketTypes]} />}
    </div>
  );
}
