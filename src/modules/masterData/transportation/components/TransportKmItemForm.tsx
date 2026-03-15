import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { transportKmItemSchema, type TransportKmItemFormValues } from "../schemas/transport-km.schema";
import type { TransportKmGroup } from "../types/transportation.type";

type Props = {
  defaultValues?: Partial<TransportKmItemFormValues>;
  groups: TransportKmGroup[];
  onSubmit: (values: TransportKmItemFormValues) => void;
  onCancel: () => void;
};

export default function TransportKmItemForm({ defaultValues, groups, onSubmit, onCancel }: Props) {
  const form = useForm<TransportKmItemFormValues>({
    resolver: zodResolver(transportKmItemSchema) as Resolver<TransportKmItemFormValues>,
    defaultValues: {
      groupId: "",
      schedule: "",
      km: undefined as unknown as number,
      notes: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='groupId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhóm tuyến đường</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn nhóm' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.code} – {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='schedule'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lịch trình</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập mô tả lịch trình...' rows={3} className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='km'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quãng đường (km)</FormLabel>
              <FormControl>
                <Input type='number' min={1} placeholder='Nhập số km' {...field} value={field.value ?? ""} />
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
                <Input placeholder='Ghi chú thêm (nếu có)' {...field} />
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
