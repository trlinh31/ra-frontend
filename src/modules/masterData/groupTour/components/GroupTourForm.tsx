import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { groupTourSchema, type GroupTourFormValues } from "../schemas/group-tour.schema";

type Props = {
  defaultValues?: Partial<GroupTourFormValues>;
  onSubmit: (values: GroupTourFormValues) => void;
  onCancel: () => void;
};

export default function GroupTourForm({ defaultValues, onSubmit, onCancel }: Props) {
  const form = useForm<GroupTourFormValues>({
    resolver: zodResolver(groupTourSchema) as Resolver<GroupTourFormValues>,
    defaultValues: {
      tourName: "",
      contractRateUsd: undefined as unknown as number,
      notes: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='tourName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên tour</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập tên tour...' rows={2} className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='contractRateUsd'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Rate (USD)</FormLabel>
              <FormControl>
                <Input type='number' min={0} placeholder='Nhập giá hợp đồng' {...field} value={field.value ?? ""} />
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
                <Input placeholder='Ví dụ: 3.00 pm - 8.00 pm' {...field} />
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
