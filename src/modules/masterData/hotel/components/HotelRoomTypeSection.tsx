import RoomCategoryForm from "@/modules/masterData/hotel/components/RoomCategoryForm";
import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import Section from "@/shared/components/common/Section";
import { FieldError } from "@/shared/components/ui/field";
import { useFormContext } from "react-hook-form";

export default function HotelRoomTypeSection() {
  const { formState } = useFormContext<HotelFormValues>();

  return (
    <Section title='2. Danh sách phòng'>
      <RoomCategoryForm />
      {formState.errors.roomTypes?.message && <FieldError errors={[formState.errors.roomTypes]} />}
    </Section>
  );
}
