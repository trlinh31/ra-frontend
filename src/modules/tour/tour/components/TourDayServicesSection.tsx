import { type DayFormValues, type DayServiceFormValues } from "@/modules/tour/day/schemas/day.schema";
import { SERVICE_TYPE_CONFIG, ServiceType } from "@/modules/tour/day/types/day.type";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import ActionButton from "@/shared/components/table/ActionButton";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { useFieldArray, useFormContext } from "react-hook-form";

const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_CONFIG).map(([key, cfg]) => ({
  label: cfg.label,
  value: key,
}));

const DEFAULT_SERVICE: DayServiceFormValues = {
  serviceType: ServiceType.TRANSPORT,
  name: "",
  unitPrice: 0,
  currency: "VND",
};

interface TourDayServiceRowProps {
  index: number;
  onRemove: () => void;
}

function TourDayServiceRow({ index, onRemove }: TourDayServiceRowProps) {
  return (
    <div className='flex flex-wrap items-start gap-3 bg-muted/20 px-3 py-3 border rounded-md'>
      <FormSelect name={`services.${index}.serviceType`} label='Loại dịch vụ' options={SERVICE_TYPE_OPTIONS} className='w-40 shrink-0' required />
      <FormInput name={`services.${index}.name`} label='Tên dịch vụ' placeholder='Nhập tên dịch vụ...' className='flex-1 min-w-48' required />
      <FormCurrencyInput name={`services.${index}.unitPrice`} label='Đơn giá' placeholder='0' className='w-36 shrink-0' required />
      <FormSelect name={`services.${index}.currency`} label='Tiền tệ' options={CURRENCY_OPTIONS} className='w-58 shrink-0' required />
      <div className='pt-6 shrink-0'>
        <ActionButton action='delete' onClick={onRemove} />
      </div>
    </div>
  );
}

export default function TourDayServicesSection() {
  const { control } = useFormContext<DayFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "services" });

  return (
    <Section title='Dịch vụ'>
      <div className='space-y-3'>
        {fields.length === 0 ? (
          <Section type='dashed' bgColor='transparent' className='text-muted-foreground text-sm text-center'>
            <p className='mb-3'>Chưa có dịch vụ nào. Nhấn &ldquo;Thêm dịch vụ&rdquo; để bắt đầu.</p>
            <ActionButton action='add' text='Thêm dịch vụ' variant='default' size='default' onClick={() => append(DEFAULT_SERVICE)} />
          </Section>
        ) : (
          <>
            {fields.map((field, index) => (
              <TourDayServiceRow key={field.id} index={index} onRemove={() => remove(index)} />
            ))}
            <div className='flex justify-start'>
              <ActionButton action='add' text='Thêm dịch vụ' variant='default' size='default' onClick={() => append(DEFAULT_SERVICE)} />
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
