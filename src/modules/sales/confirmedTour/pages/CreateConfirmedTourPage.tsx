import { PATHS } from "@/app/routes/route.constant";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import { createConfirmedTourSchema, type CreateConfirmedTourFormValues } from "@/modules/sales/confirmedTour/schemas/confirmed-tour.schema";
import { tourMockStore } from "@/modules/tour/tour/data/tour.mock-store";
import PageHeader from "@/shared/components/common/PageHeader";
import FormDatePicker from "@/shared/components/form/FormDatePicker/FormDatePicker";
import FormInput from "@/shared/components/form/FormInput/FormInput";
import FormSelect from "@/shared/components/form/FormSelect/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function CreateConfirmedTourPage() {
  const navigate = useNavigate();

  const tourOptions = tourMockStore.getAll().map((t) => ({ value: t.id, label: `${t.code} - ${t.name}` }));

  const methods = useForm<CreateConfirmedTourFormValues>({
    resolver: zodResolver(createConfirmedTourSchema),
    defaultValues: {
      tourTemplateId: "",
      customerName: "",
      numberOfPeople: 1,
      departureDate: "",
      note: "",
    },
  });

  const handleSubmit = (values: CreateConfirmedTourFormValues) => {
    const template = tourMockStore.getById(values.tourTemplateId);
    confirmedTourMockStore.create({
      tourTemplateId: values.tourTemplateId,
      tourTemplateName: template?.name ?? "",
      customerName: values.customerName,
      numberOfPeople: values.numberOfPeople,
      departureDate: values.departureDate,
      itinerary: template?.itinerary ?? [],
      status: "draft",
      note: values.note,
      createdBy: "Seller A",
    });
    navigate(PATHS.SALES.CONFIRMED_TOURS);
  };

  const handleCancel = () => navigate(PATHS.SALES.CONFIRMED_TOURS);

  return (
    <div className='space-y-6'>
      <PageHeader title='Tạo Tour Booking' description='Điền thông tin để tạo booking tour mới cho khách hàng' />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className='gap-4 grid grid-cols-1 md:grid-cols-2'>
              <FormSelect
                name='tourTemplateId'
                label='Tour mẫu'
                required
                options={tourOptions}
                placeholder='Chọn tour mẫu'
                className='md:col-span-2'
              />

              <FormInput name='customerName' label='Tên đoàn / Khách hàng' required placeholder='VD: Đoàn công ty ABC' />

              <FormInput name='numberOfPeople' label='Số khách' required type='number' placeholder='Nhập số lượng khách' min={1} />

              <FormDatePicker name='departureDate' label='Ngày khởi hành' required />

              <FormTextarea name='note' label='Ghi chú' placeholder='Yêu cầu đặc biệt, lưu ý cho đoàn...' className='md:col-span-2' rows={3} />
            </CardContent>
          </Card>

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Hủy
            </Button>
            <Button type='submit'>Tạo Tour Booking</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
