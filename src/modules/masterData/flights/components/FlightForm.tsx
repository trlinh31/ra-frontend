import { mapFlightDataToFormValues } from "@/modules/masterData/flights/mappers/flight-form.mapper";
import type { Flight } from "@/modules/masterData/flights/types/flight.type";
import FlightCodeInput from "@/shared/components/common/FlightCodeInput";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSwitch from "@/shared/components/form/FormSwitch/FormSwitch";
import FormTextarea from "@/shared/components/form/FormTextarea";
import FormTimeInput from "@/shared/components/form/FormTimeInput/FormTimeInput";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { flightSchema, type FlightFormValues } from "../schemas/flight.schema";

interface FlightFormProps {
  defaultValues?: Flight | undefined;
  onSubmit: (values: FlightFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function FlightForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: FlightFormProps) {
  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    defaultValues: mapFlightDataToFormValues(defaultValues),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <Section className='col-span-2'>
            <FlightCodeInput
              label='Mã tuyến đường'
              value={{ airlineCode: form.watch("airlineCode"), origin: form.watch("origin"), destination: form.watch("destination") }}
              onChange={(value) => {
                form.setValue("airlineCode", value.airlineCode);
                form.setValue("origin", value.origin);
                form.setValue("destination", value.destination);
              }}
              placeholder={{
                airlineCode: "Nhập mã chuyến bay",
                origin: "Nhập mã điểm khởi hành",
                destination: "Nhập mã điểm đến",
              }}
              required
            />
          </Section>

          <FormInput name='code' label='Mã chuyến bay' required />

          <FormInput name='airline' label='Hãng bay' required />

          <FormTimeInput name='flightTime' label='Thời gian bay' required />

          <FormCurrencyInput name='price' label='Giá bay (VNĐ)' required />

          <FormTextarea name='notes' label='Ghi chú' />

          <FormSwitch name='isActive' label='Hoạt động' />
        </div>

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
