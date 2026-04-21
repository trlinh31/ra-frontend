import type { RestaurantFormValues } from "@/modules/masterData/restaurant/schemas/restaurant.schema";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import ActionButton from "@/shared/components/table/ActionButton";
import { FieldError } from "@/shared/components/ui/field";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function RestaurantMenuSection() {
  const { control, formState } = useFormContext<RestaurantFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "comboPackages",
  });

  const handleAdd = () => {
    append({ name: "", maxGuests: undefined as unknown as number });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có gói combo nào. Nhấn &quot;Thêm gói combo&quot; để bắt đầu.</p>
        <ActionButton action='add' text='Thêm gói combo' variant='default' size='default' onClick={handleAdd} />
      </Section>
    );
  }

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <Section key={field.id} title={`Gói combo #${index + 1}`} type='dashed' borderColor='red'>
          <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
            <FormInput name={`comboPackages.${index}.name`} label='Tên gói combo' required />
            <FormInput name={`comboPackages.${index}.maxGuests`} label='Số người tối đa / combo' type='number' required />
          </div>
          <div className='flex gap-2 mt-3'>
            <ActionButton action='add' text='Thêm gói combo' variant='default' size='default' onClick={handleAdd} />
            <ActionButton action='delete' text='Xóa gói combo' variant='destructive' size='default' onClick={() => remove(index)} />
          </div>
        </Section>
      ))}

      {formState.errors.comboPackages?.message && <FieldError errors={[formState.errors.comboPackages]} />}
    </div>
  );
}
