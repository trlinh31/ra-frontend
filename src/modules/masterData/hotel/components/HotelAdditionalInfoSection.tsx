import Section from "@/shared/components/common/Section";
import FormTextarea from "@/shared/components/form/FormTextarea";

export default function HotelAdditionalInfoSection() {
  return (
    <Section title='5. Thông tin bổ sung'>
      <div className='gap-4 grid grid-cols-1'>
        <FormTextarea name='note' label='Ghi chú' />
      </div>
    </Section>
  );
}
