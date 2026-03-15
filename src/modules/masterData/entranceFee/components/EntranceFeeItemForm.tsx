import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { entranceFeeItemSchema, type EntranceFeeItemFormValues } from "../schemas/entrance-fee.schema";
import type { EntranceFeeGroup } from "../types/entrance-fee.type";

type Props = {
  defaultValues?: Partial<EntranceFeeItemFormValues>;
  groups: EntranceFeeGroup[];
  onSubmit: (values: EntranceFeeItemFormValues) => void;
  onCancel: () => void;
};

export default function EntranceFeeItemForm({ defaultValues, groups, onSubmit, onCancel }: Props) {
  const form = useForm<EntranceFeeItemFormValues>({
    resolver: zodResolver(entranceFeeItemSchema) as Resolver<EntranceFeeItemFormValues>,
    defaultValues: {
      groupId: "",
      serviceName: "",
      adultNetRateVnd: undefined,
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
              <FormLabel>Nhóm</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn nhóm' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.code}
                      {g.name ? ` – ${g.name}` : ""}
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
          name='serviceName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên dịch vụ</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập tên địa điểm / dịch vụ...' rows={2} className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='adultNetRateVnd'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net rate người lớn (VNĐ)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min={0}
                  placeholder='Nhập giá (VNĐ)'
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
                <Input placeholder='Ghi chú thêm...' {...field} />
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
