import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { transportRouteSchema, type TransportRouteItemFormValues } from "../schemas/transport-route.schema";
import { VEHICLE_SEAT_OPTIONS, type VehicleSeat } from "../types/transportation.type";

type Props = {
  defaultValues?: Partial<TransportRouteItemFormValues>;
  onSubmit: (values: TransportRouteItemFormValues) => void;
  onCancel: () => void;
};

export default function TransportRouteItemForm({ defaultValues, onSubmit, onCancel }: Props) {
  const form = useForm<TransportRouteItemFormValues>({
    resolver: zodResolver(transportRouteSchema) as Resolver<TransportRouteItemFormValues>,
    defaultValues: { route: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='route'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lộ trình</FormLabel>
              <FormControl>
                <Input placeholder='Ví dụ: ĐÓN/TIỀN SB ĐN - HỘI AN' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-2'>
          <p className='font-medium text-sm'>Giá theo loại xe (Nghìn VNĐ)</p>
          <div className='gap-3 grid grid-cols-2 sm:grid-cols-3'>
            {VEHICLE_SEAT_OPTIONS.map((seat) => (
              <FormField
                key={seat}
                control={form.control}
                name={`price_${seat}` as `price_${VehicleSeat}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{seat} chỗ</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        placeholder='—'
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Hủy
          </Button>
          <Button type='submit'>Lưu</Button>
        </div>
      </form>
    </Form>
  );
}
