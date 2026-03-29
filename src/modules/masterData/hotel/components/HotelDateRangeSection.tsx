import RoomDateRangeForm from "@/modules/masterData/hotel/components/RoomDateRangeForm";
import Section from "@/shared/components/common/Section";

export default function HotelDateRangeSection() {
  return (
    <Section title='3. Khoảng thời gian áp dụng'>
      <RoomDateRangeForm />
    </Section>
  );
}
