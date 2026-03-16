import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { PATHS } from "@/app/routes/route.constant";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import { dayMockStore } from "../data/day.mock-store";
import { daySchema, type DayFormValues } from "../schemas/day.schema";
import { CURRENCIES, SERVICE_TYPE_LABELS, SERVICE_TYPES } from "../types/day.type";

export default function EditDayPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const existing = id ? dayMockStore.getById(id) : undefined;

  const form = useForm<DayFormValues>({
    resolver: zodResolver(daySchema) as Resolver<DayFormValues>,
    defaultValues: existing
      ? {
          code: existing.code,
          title: existing.title,
          description: existing.description,
          services: existing.services.map((s) => ({
            serviceType: s.serviceType,
            name: s.name,
            quantity: s.quantity,
            unitPrice: s.unitPrice,
            currency: s.currency,
            notes: s.notes,
          })),
        }
      : {
          code: "",
          title: "",
          description: "",
          services: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  function handleSubmit(values: DayFormValues) {
    const data = {
      code: values.code,
      title: values.title,
      description: values.description ?? "",
      services: values.services.map((s, i) => ({
        id: existing?.services[i]?.id ?? `s${Date.now()}-${i}`,
        serviceType: s.serviceType,
        name: s.name,
        quantity: s.quantity as number,
        unitPrice: s.unitPrice as number,
        currency: s.currency,
        notes: s.notes ?? "",
      })),
    };
    if (isEdit && id) {
      dayMockStore.update(id, data);
    } else {
      dayMockStore.create(data);
    }
    navigate(PATHS.TOUR.DAYS);
  }

  function handleBack() {
    navigate(PATHS.TOUR.DAYS);
  }

  if (isEdit && !existing) {
    return (
      <div className='flex flex-col justify-center items-center gap-4 py-16'>
        <p className='text-muted-foreground'>Không tìm thấy ngày hành trình.</p>
        <Button variant='outline' onClick={handleBack}>
          <ArrowLeft className='mr-2 w-4 h-4' />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-5xl'>
      {/* Page header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleBack}>
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <div>
          <h1 className='font-bold text-2xl tracking-tight'>{isEdit ? "Chỉnh sửa ngày hành trình" : "Thêm ngày hành trình"}</h1>
          <p className='text-muted-foreground text-sm'>
            {isEdit ? "Cập nhật thông tin và dịch vụ trong ngày" : "Tạo template ngày mới để ghép vào tour"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className='gap-4 grid grid-cols-2'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã ngày</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: HN-01, HN-HAL-01...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: Hà Nội → Hạ Long' {...field} />
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
                      <Textarea placeholder='Mô tả ngắn về hành trình trong ngày...' rows={2} className='resize-none' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader className='flex flex-row justify-between items-center pb-3'>
              <CardTitle className='text-base'>Danh sách dịch vụ</CardTitle>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() =>
                  append({
                    serviceType: "transport",
                    name: "",
                    quantity: 1,
                    unitPrice: 0,
                    currency: "VND",
                    notes: "",
                  })
                }>
                <Plus className='mr-1.5 w-4 h-4' />
                Thêm dịch vụ
              </Button>
            </CardHeader>
            <Separator />
            <CardContent className='pt-4'>
              {fields.length === 0 ? (
                <div className='py-8 text-muted-foreground text-sm text-center'>Chưa có dịch vụ nào. Nhấn "Thêm dịch vụ" để bắt đầu.</div>
              ) : (
                <div className='space-y-3'>
                  {/* Table header */}
                  <div className='gap-2 grid grid-cols-[140px_1fr_80px_120px_90px_1fr_40px] font-medium text-muted-foreground text-xs uppercase tracking-wide'>
                    <span>Loại dịch vụ</span>
                    <span>Tên dịch vụ</span>
                    <span className='text-right'>SL</span>
                    <span className='text-right'>Đơn giá</span>
                    <span>Tiền tệ</span>
                    <span>Ghi chú</span>
                    <span />
                  </div>
                  <Separator />
                  {fields.map((field, index) => (
                    <div key={field.id} className='items-start gap-2 grid grid-cols-[140px_1fr_80px_120px_90px_1fr_40px]'>
                      {/* Service type */}
                      <FormField
                        control={form.control}
                        name={`services.${index}.serviceType`}
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className='h-9'>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICE_TYPES.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {SERVICE_TYPE_LABELS[t]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name={`services.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input className='h-9' placeholder='Tên dịch vụ' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Quantity */}
                      <FormField
                        control={form.control}
                        name={`services.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className='h-9 text-right'
                                type='number'
                                min={1}
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Unit price */}
                      <FormField
                        control={form.control}
                        name={`services.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className='h-9 text-right'
                                type='number'
                                min={0}
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Currency */}
                      <FormField
                        control={form.control}
                        name={`services.${index}.currency`}
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className='h-9'>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CURRENCIES.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Notes */}
                      <FormField
                        control={form.control}
                        name={`services.${index}.notes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input className='h-9' placeholder='Ghi chú' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Delete */}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='mt-0.5 w-9 h-9 text-destructive hover:text-destructive'
                        onClick={() => remove(index)}>
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer actions */}
          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleBack}>
              Hủy
            </Button>
            <Button type='submit'>{isEdit ? "Lưu thay đổi" : "Tạo ngày hành trình"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
