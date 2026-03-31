import type { DayFormValues, DayServiceFormValues } from "@/modules/tour/day/schemas/day.schema";
import { ServiceType } from "@/modules/tour/day/types/day.type";
import Section from "@/shared/components/common/Section";
import ActionButton from "@/shared/components/table/ActionButton";
import { useFieldArray, useFormContext } from "react-hook-form";
import DayServiceRow from "./DayServiceRow";

const DEFAULT_HOTEL_SERVICE: DayServiceFormValues = {
  serviceType: ServiceType.HOTEL,
  name: "",
  unitPrice: 0,
  currency: "",
  hotelDetail: {
    hotelId: "",
    pricingPeriodId: "",
    dayGroupId: "",
    roomTypeId: "",
  },
};

export default function DayServicesSection() {
  const { control } = useFormContext<DayFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: "services" });

  return (
    <Section title='3. Dịch vụ'>
      <div className='space-y-3'>
        {fields.length === 0 ? (
          <Section type='dashed' bgColor='transparent' className='text-muted-foreground text-sm text-center'>
            <p className='mb-3'>Chưa có dịch vụ nào. Nhấn &ldquo;Thêm dịch vụ&rdquo; để bắt đầu.</p>
            <ActionButton action='add' text='Thêm dịch vụ' variant='default' size='default' onClick={() => append(DEFAULT_HOTEL_SERVICE)} />
          </Section>
        ) : (
          <>
            {fields.map((field, index) => (
              <DayServiceRow key={field.id} index={index} onRemove={() => remove(index)} />
            ))}

            <div className='flex justify-start'>
              <ActionButton action='add' text='Thêm dịch vụ' variant='default' size='default' onClick={() => append(DEFAULT_HOTEL_SERVICE)} />
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
