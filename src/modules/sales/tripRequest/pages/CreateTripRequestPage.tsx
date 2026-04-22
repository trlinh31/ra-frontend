import { PATHS } from "@/app/routes/route.constant";
import {
  LEAD_SOURCE_OPTIONS,
  SELLER_OPTIONS,
  SERVICE_LEVEL_OPTIONS,
} from "@/modules/sales/tripRequest/constants/trip-request.constant";
import { tripRequestMockStore } from "@/modules/sales/tripRequest/data/trip-request.mock-store";
import {
  createTripRequestSchema,
  type CreateTripRequestFormValues,
} from "@/modules/sales/tripRequest/schemas/trip-request.schema";
import { tourMockStore } from "@/modules/tour/tour/data/tour.mock-store";
import PageHeader from "@/shared/components/common/PageHeader";
import FormDatePicker from "@/shared/components/form/FormDatePicker/FormDatePicker";
import FormInput from "@/shared/components/form/FormInput/FormInput";
import FormSelect from "@/shared/components/form/FormSelect/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const tourOptions = tourMockStore.getAll().map((t) => ({ value: t.id, label: `${t.code} — ${t.name}` }));
const NO_TOUR = "__none__";

export default function CreateTripRequestPage() {
  const navigate = useNavigate();

  const methods = useForm<CreateTripRequestFormValues>({
    resolver: zodResolver(createTripRequestSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      leadSource: "",
      destination: "",
      departureDateEst: "",
      durationDays: "",
      numberOfAdults: 1,
      numberOfChildren: 0,
      serviceLevel: "",
      specialRequirements: "",
      budgetEstimate: "",
      budgetCurrency: "VND",
      suggestedTourId: NO_TOUR,
      assignedTo: "",
      internalNotes: "",
    },
  });

  const handleSubmit = (values: CreateTripRequestFormValues) => {
    const suggestedTourId =
      values.suggestedTourId && values.suggestedTourId !== NO_TOUR
        ? values.suggestedTourId
        : undefined;
    const suggestedTour = suggestedTourId ? tourMockStore.getById(suggestedTourId) : undefined;

    tripRequestMockStore.create({
      customerName: values.customerName,
      customerEmail: values.customerEmail || undefined,
      customerPhone: values.customerPhone || undefined,
      leadSource: values.leadSource as never,
      destination: values.destination || undefined,
      departureDateEst: values.departureDateEst || undefined,
      durationDays: values.durationDays ? parseInt(values.durationDays) : undefined,
      numberOfAdults: values.numberOfAdults,
      numberOfChildren: values.numberOfChildren,
      serviceLevel: values.serviceLevel as never,
      specialRequirements: values.specialRequirements || undefined,
      budgetEstimate: values.budgetEstimate ? parseFloat(values.budgetEstimate) : undefined,
      budgetCurrency: values.budgetEstimate ? (values.budgetCurrency || "VND") : undefined,
      suggestedTourId: suggestedTourId,
      suggestedTourName: suggestedTour?.name,
      assignedTo: values.assignedTo || undefined,
      status: values.assignedTo ? "assigned" : "new",
      internalNotes: values.internalNotes || undefined,
      createdBy: "Seller A",
    });
    navigate(PATHS.SALES.TRIP_REQUESTS);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Tạo Trip Request'
        description='Ghi nhận yêu cầu chuyến đi từ khách hàng vào phễu bán hàng'
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-6'>

          {/* ── Thông tin khách hàng ── */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormInput
                name='customerName'
                label='Tên khách / Tên đoàn'
                required
                placeholder='VD: Gia đình anh Hoàng, Công ty ABC...'
                className='md:col-span-2'
              />
              <FormInput name='customerEmail' label='Email liên hệ' placeholder='email@example.com' />
              <FormInput name='customerPhone' label='Số điện thoại' placeholder='0901234567' />
              <FormSelect
                name='leadSource'
                label='Nguồn lead'
                required
                options={LEAD_SOURCE_OPTIONS}
                placeholder='Khách đến từ kênh nào?'
              />
            </CardContent>
          </Card>

          {/* ── Nhu cầu chuyến đi ── */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Nhu cầu chuyến đi</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormInput
                name='destination'
                label='Điểm đến mong muốn'
                placeholder='VD: Đà Lạt, Phú Quốc, Hội An...'
                className='md:col-span-2'
              />
              <FormDatePicker name='departureDateEst' label='Ngày đi dự kiến' />
              <FormInput
                name='durationDays'
                label='Số ngày dự kiến'
                type='number'
                placeholder='VD: 3'
              />
              <FormInput
                name='numberOfAdults'
                label='Số người lớn'
                required
                type='number'
                placeholder='1'
                min={1}
              />
              <FormInput
                name='numberOfChildren'
                label='Số trẻ em'
                type='number'
                placeholder='0'
                min={0}
              />
              <FormSelect
                name='serviceLevel'
                label='Mức dịch vụ'
                required
                options={SERVICE_LEVEL_OPTIONS}
                placeholder='Chọn mức dịch vụ'
              />
              <div className='flex gap-2 items-end'>
                <FormInput
                  name='budgetEstimate'
                  label='Ngân sách tham khảo'
                  type='number'
                  placeholder='Ngân sách khách đề xuất'
                  className='flex-1'
                />
                <FormSelect
                  name='budgetCurrency'
                  label=''
                  options={CURRENCY_OPTIONS.slice(0, 5)}
                  placeholder='VND'
                  className='w-28'
                />
              </div>
              <FormTextarea
                name='specialRequirements'
                label='Yêu cầu đặc biệt'
                placeholder='Ăn chay, phòng riêng, xe lăn, dị ứng thực phẩm...'
                rows={3}
                className='md:col-span-2'
              />
            </CardContent>
          </Card>

          {/* ── Phân công & ghi chú ── */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Phân công & Tour gợi ý</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormSelect
                name='assignedTo'
                label='Giao cho Seller'
                options={SELLER_OPTIONS}
                placeholder='Chọn Seller phụ trách (hoặc để trống)'
              />
              <FormSelect
                name='suggestedTourId'
                label='Tour mẫu gợi ý'
                options={[{ value: NO_TOUR, label: "— Không chọn —" }, ...tourOptions]}
                placeholder='Chọn tour phù hợp (nếu có)'
              />
              <FormTextarea
                name='internalNotes'
                label='Ghi chú nội bộ'
                placeholder='Thông tin thêm để Seller nắm tình hình...'
                rows={3}
                className='md:col-span-2'
              />
            </CardContent>
          </Card>

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={() => navigate(PATHS.SALES.TRIP_REQUESTS)}>
              Hủy
            </Button>
            <Button type='submit'>Tạo Trip Request</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
