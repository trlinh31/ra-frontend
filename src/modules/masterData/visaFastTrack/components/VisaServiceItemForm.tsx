import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { visaServiceItemSchema, type VisaServiceItemFormValues } from "../schemas/visa-fast-track.schema";
import type { VisaServiceGroup } from "../types/visa-fast-track.type";

type Props = {
  defaultValues?: Partial<VisaServiceItemFormValues>;
  groups: VisaServiceGroup[];
  onSubmit: (values: VisaServiceItemFormValues) => void;
  onCancel: () => void;
};

export default function VisaServiceItemForm({ defaultValues, groups, onSubmit, onCancel }: Props) {
  const form = useForm<VisaServiceItemFormValues>({
    resolver: zodResolver(visaServiceItemSchema) as Resolver<VisaServiceItemFormValues>,
    defaultValues: {
      groupId: "",
      serviceName: "",
      priceUsd: undefined,
      priceUnit: "",
      description: "",
      pickupLocation: "",
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
                    <SelectValue placeholder='Chọn nhóm dịch vụ' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
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
              <FormLabel>Dịch vụ</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên dịch vụ' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='gap-3 grid grid-cols-2'>
          <FormField
            control={form.control}
            name='priceUsd'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn Giá (USD)</FormLabel>
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
          <FormField
            control={form.control}
            name='priceUnit'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn vị</FormLabel>
                <FormControl>
                  <Input placeholder='PAX, CHỖ...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder='Mô tả dịch vụ...' rows={3} className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='pickupLocation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nơi đón</FormLabel>
              <FormControl>
                <Input placeholder='Visa on arrival, Đón khách quầy E-F...' {...field} />
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
