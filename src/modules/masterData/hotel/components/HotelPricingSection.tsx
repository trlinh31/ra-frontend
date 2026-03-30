import HotelPricingForm from "@/modules/masterData/hotel/components/HotelPricingForm";
import Section from "@/shared/components/common/Section";

export default function HotelPricingSection() {
  return (
    <Section title='4. Bảng giá phòng'>
      <HotelPricingForm />
    </Section>
  );
}
