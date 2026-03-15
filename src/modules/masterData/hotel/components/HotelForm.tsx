import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";

import { hotelSchema, type HotelFormValues } from "../schemas/hotel.schema";
import { ROOM_TYPE_LABELS, ROOM_TYPES } from "../types/hotel.type";

type HotelFormProps = {
  defaultValues?: Partial<HotelFormValues>;
  onSubmit: (values: HotelFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export default function HotelForm({ defaultValues, onSubmit, onCancel, isSubmitting }: HotelFormProps) {
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema) as Resolver<HotelFormValues>,
    defaultValues: {
      roomType: defaultValues?.roomType,
      roomCount: defaultValues?.roomCount ?? (undefined as unknown as number),
      priceRanges: defaultValues?.priceRanges ?? [],
      notes: defaultValues?.notes ?? "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "priceRanges",
  });

  function handleAddPriceRange() {
    append({ startDate: undefined as unknown as Date, endDate: undefined as unknown as Date, price: undefined as unknown as number });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Loại phòng & Số phòng */}
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='roomType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại phòng</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn loại phòng' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {ROOM_TYPE_LABELS[type]}
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
            name='roomCount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số phòng</FormLabel>
                <FormControl>
                  <Input type='number' min={1} placeholder='Nhập số phòng' {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Khoảng giá theo thời gian */}
        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <Label className='font-medium text-sm'>Giá theo khoảng thời gian</Label>
            <Button type='button' variant='outline' size='sm' onClick={handleAddPriceRange}>
              <Plus className='mr-1 w-4 h-4' />
              Thêm khoảng giá
            </Button>
          </div>

          {form.formState.errors.priceRanges?.root && <p className='text-destructive text-sm'>{form.formState.errors.priceRanges.root.message}</p>}
          {form.formState.errors.priceRanges?.message && <p className='text-destructive text-sm'>{form.formState.errors.priceRanges.message}</p>}

          {fields.length === 0 && (
            <p className='py-6 border border-dashed rounded-lg text-muted-foreground text-sm text-center'>
              Chưa có khoảng giá nào. Nhấn &quot;Thêm khoảng giá&quot; để bắt đầu.
            </p>
          )}

          <div className='space-y-3'>
            {fields.map((field, index) => {
              const startDate = form.watch(`priceRanges.${index}.startDate`);
              const endDate = form.watch(`priceRanges.${index}.endDate`);

              const dateRange: DateRange | undefined = startDate || endDate ? { from: startDate, to: endDate } : undefined;

              return (
                <Card key={field.id}>
                  <CardContent className='pt-4'>
                    <div className='gap-4 grid grid-cols-1 sm:grid-cols-[1fr_180px_auto]'>
                      {/* Date range picker */}
                      <div className='space-y-2'>
                        <Label className='font-medium text-sm'>Khoảng thời gian</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type='button'
                              variant='outline'
                              className={cn("justify-start w-full font-normal text-left", !dateRange && "text-muted-foreground")}>
                              <CalendarIcon className='mr-2 w-4 h-4 shrink-0' />
                              {dateRange?.from && dateRange?.to
                                ? `${format(dateRange.from, "dd/MM/yyyy", { locale: vi })} – ${format(dateRange.to, "dd/MM/yyyy", { locale: vi })}`
                                : dateRange?.from
                                  ? format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                                  : "Chọn khoảng thời gian"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align='start' className='p-0 w-auto'>
                            <Calendar
                              mode='range'
                              selected={dateRange}
                              onSelect={(range) => {
                                form.setValue(`priceRanges.${index}.startDate`, range?.from as Date, { shouldValidate: true });
                                form.setValue(`priceRanges.${index}.endDate`, range?.to as Date, { shouldValidate: true });
                              }}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        {(form.formState.errors.priceRanges?.[index]?.startDate || form.formState.errors.priceRanges?.[index]?.endDate) && (
                          <p className='text-destructive text-sm'>
                            {form.formState.errors.priceRanges?.[index]?.startDate?.message ||
                              form.formState.errors.priceRanges?.[index]?.endDate?.message}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <FormField
                        control={form.control}
                        name={`priceRanges.${index}.price`}
                        render={({ field: priceField }) => (
                          <FormItem>
                            <FormLabel>Giá (VNĐ)</FormLabel>
                            <FormControl>
                              <Input type='number' min={0} placeholder='Nhập giá' {...priceField} value={priceField.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Delete */}
                      <div className='flex items-end'>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='text-destructive hover:text-destructive'
                          onClick={() => remove(index)}>
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Ghi chú */}
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập ghi chú...' className='resize-none' rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Trạng thái hoạt động */}
        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem className='flex flex-row justify-between items-center p-4 border rounded-lg'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Trạng thái hoạt động</FormLabel>
                <p className='text-muted-foreground text-sm'>Bật để hiển thị phòng này trong hệ thống đặt phòng</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Hủy
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
