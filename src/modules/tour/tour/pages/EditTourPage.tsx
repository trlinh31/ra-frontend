import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowLeft, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { PATHS } from "@/app/routes/route.constant";
import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import { tourMockStore } from "../data/tour.mock-store";
import { tourSchema, type TourFormValues } from "../schemas/tour.schema";

export default function EditTourPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const existing = id ? tourMockStore.getById(id) : undefined;
  const allDays = dayMockStore.getAll();

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema) as Resolver<TourFormValues>,
    defaultValues: existing
      ? {
          code: existing.code,
          name: existing.name,
          description: existing.description,
          days: existing.days
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((d) => ({
              dayId: d.dayId,
              order: d.order,
            })),
        }
      : {
          code: "",
          name: "",
          description: "",
          days: [],
        },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "days",
  });

  function handleSubmit(values: TourFormValues) {
    const data = {
      code: values.code,
      name: values.name,
      description: values.description ?? "",
      days: values.days.map((d, i) => ({ dayId: d.dayId, order: i + 1 })),
    };
    if (isEdit && id) {
      tourMockStore.update(id, data);
    } else {
      tourMockStore.create(data);
    }
    navigate(PATHS.TOUR.TOURS);
  }

  function handleBack() {
    navigate(PATHS.TOUR.TOURS);
  }

  if (isEdit && !existing) {
    return (
      <div className='flex flex-col justify-center items-center gap-4 py-16'>
        <p className='text-muted-foreground'>Không tìm thấy tour.</p>
        <Button variant='outline' onClick={handleBack}>
          <ArrowLeft className='mr-2 w-4 h-4' />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-3xl'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleBack}>
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <div>
          <h1 className='font-bold text-2xl tracking-tight'>{isEdit ? "Chỉnh sửa tour" : "Tạo tour mới"}</h1>
          <p className='text-muted-foreground text-sm'>
            {isEdit ? "Cập nhật thông tin và hành trình tour" : "Ghép các ngày đã tạo thành một chương trình tour"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin tour</CardTitle>
            </CardHeader>
            <CardContent className='gap-4 grid grid-cols-2'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã tour</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: HN-HAL-3N2D' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tour</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: Hà Nội – Hạ Long 3N2Đ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Mô tả (không bắt buộc)</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Mô tả ngắn về chương trình tour...' rows={2} className='resize-none' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Days */}
          <Card>
            <CardHeader className='flex flex-row justify-between items-center pb-3'>
              <div>
                <CardTitle className='text-base'>Hành trình theo ngày</CardTitle>
                {form.formState.errors.days?.root && <p className='mt-1 text-destructive text-sm'>{form.formState.errors.days.root.message}</p>}
                {form.formState.errors.days?.message && <p className='mt-1 text-destructive text-sm'>{form.formState.errors.days.message}</p>}
              </div>
              <Button
                type='button'
                size='sm'
                variant='outline'
                disabled={allDays.length === 0}
                onClick={() => append({ dayId: allDays[0]?.id ?? "", order: fields.length + 1 })}>
                <Plus className='mr-1.5 w-4 h-4' />
                Thêm ngày
              </Button>
            </CardHeader>
            <Separator />
            <CardContent className='pt-4'>
              {allDays.length === 0 ? (
                <p className='py-6 text-muted-foreground text-sm text-center'>Chưa có ngày hành trình nào. Hãy tạo ngày trước.</p>
              ) : fields.length === 0 ? (
                <p className='py-6 text-muted-foreground text-sm text-center'>Chưa có ngày nào. Nhấn "Thêm ngày" để bắt đầu ghép tour.</p>
              ) : (
                <div className='space-y-2'>
                  {fields.map((field, index) => {
                    const selectedDay = allDays.find((d) => d.id === form.watch(`days.${index}.dayId`));
                    return (
                      <div key={field.id} className='flex items-center gap-3 bg-muted/30 p-3 border rounded-lg'>
                        {/* Drag handle / order indicator */}
                        <div className='flex flex-col items-center gap-0.5 text-muted-foreground'>
                          <GripVertical className='w-4 h-4' />
                        </div>

                        {/* Day number badge */}
                        <Badge variant='secondary' className='justify-center w-12 font-semibold shrink-0'>
                          Ngày {index + 1}
                        </Badge>

                        {/* Day select */}
                        <FormField
                          control={form.control}
                          name={`days.${index}.dayId`}
                          render={({ field }) => (
                            <FormItem className='flex-1'>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className='h-9'>
                                    <SelectValue placeholder='Chọn ngày hành trình' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {allDays.map((d) => (
                                    <SelectItem key={d.id} value={d.id}>
                                      <span className='mr-2 font-mono text-muted-foreground text-xs'>{d.code}</span>
                                      {d.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Service count preview */}
                        {selectedDay && (
                          <Badge variant='outline' className='text-xs shrink-0'>
                            {selectedDay.services.length} dịch vụ
                          </Badge>
                        )}

                        {/* Move up / down */}
                        <div className='flex gap-1 shrink-0'>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='w-7 h-7'
                            disabled={index === 0}
                            onClick={() => move(index, index - 1)}>
                            <ArrowUp className='w-3.5 h-3.5' />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='w-7 h-7'
                            disabled={index === fields.length - 1}
                            onClick={() => move(index, index + 1)}>
                            <ArrowDown className='w-3.5 h-3.5' />
                          </Button>
                        </div>

                        {/* Remove */}
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='w-8 h-8 text-destructive hover:text-destructive shrink-0'
                          onClick={() => remove(index)}>
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleBack}>
              Hủy
            </Button>
            <Button type='submit'>{isEdit ? "Lưu thay đổi" : "Tạo tour"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
