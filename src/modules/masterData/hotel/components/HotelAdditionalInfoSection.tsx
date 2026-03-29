import Section from "@/shared/components/common/Section";
import FormSwitch from "@/shared/components/form/FormSwitch/FormSwitch";
import FormTextarea from "@/shared/components/form/FormTextarea";

export default function HotelAdditionalInfoSection() {
  return (
    <Section title='4. Thông tin bổ sung'>
      <div className='gap-4 grid grid-cols-1'>
        <FormTextarea name='note' label='Ghi chú' />
        <FormSwitch name='isActive' label='Hoạt động' />
      </div>
    </Section>
  );
}
