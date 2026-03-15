import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { flightSchema, type FlightFormValues } from "../schemas/flight.schema";

type Props = {
  defaultValues?: Partial<FlightFormValues>;
  onSubmit: (values: FlightFormValues) => void;
  onCancel: () => void;
};

export default function FlightForm({ defaultValues, onSubmit, onCancel }: Props) {
  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema) as Resolver<FlightFormValues>,
    defaultValues: { route: "", netRateUsd: undefined, notes: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='route'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tuyến bay</FormLabel>
              <FormControl>
                <Input placeholder='Ví dụ: VNA HAN - DAD' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='netRateUsd'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Rate (USD)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min={0}
                  placeholder='Nhập giá (USD)'
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder='Ghi chú thêm...' rows={2} className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
