import HotelAdditionalInfoSection from "@/modules/masterData/hotel/components/HotelAdditionalInfoSection";
import HotelBasicInfoSection from "@/modules/masterData/hotel/components/HotelBasicInfoSection";
import HotelPricingSection from "@/modules/masterData/hotel/components/HotelPricingSection";
import HotelRoomTypeSection from "@/modules/masterData/hotel/components/HotelRoomTypeSection";
import { mapHotelDataToFormValues } from "@/modules/masterData/hotel/mappers/hotel-form.mapper";
import { hotelSchema, type HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import type { Hotel } from "@/modules/masterData/hotel/types/hotel.type";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

type HotelFormProps = {
  defaultValues?: Hotel | undefined;
  onSubmit: (values: HotelFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
};

export default function HotelForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: HotelFormProps) {
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: mapHotelDataToFormValues(defaultValues),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <HotelBasicInfoSection />

        <HotelRoomTypeSection />

        <HotelPricingSection />

        <HotelAdditionalInfoSection />

        <div className='flex justify-start gap-3'>
          <Button type='button' variant='outline' size='lg' onClick={onCancel}>
            Hủy
          </Button>

          <Button type='submit' size='lg' disabled={isSubmitting}>
            <Save />
            {isEdit ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
