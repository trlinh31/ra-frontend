import { PATHS } from "@/app/routes/route.constant";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import { createQuotationSchema, type CreateQuotationFormValues } from "@/modules/sales/quotation/schemas/quotation.schema";
import { tripRequestMockStore } from "@/modules/sales/tripRequest/data/trip-request.mock-store";
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
import { useNavigate, useSearchParams } from "react-router-dom";

const NO_TEMPLATE = "__none__";

export default function CreateQuotationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripRequestId = searchParams.get("tripRequestId") ?? undefined;
  const linkedTripRequest = tripRequestId ? tripRequestMockStore.getById(tripRequestId) : undefined;

  const tourOptions = [
    { value: NO_TEMPLATE, label: "— Không chọn (tự xây lịch trình) —" },
    ...tourMockStore.getAll().map((t) => ({ value: t.id, label: `${t.code} - ${t.name}` })),
  ];

  const methods = useForm<CreateQuotationFormValues>({
    resolver: zodResolver(createQuotationSchema),
    defaultValues: {
      customerName: linkedTripRequest?.customerName ?? "",
      customerEmail: linkedTripRequest?.customerEmail ?? "",
      customerPhone: linkedTripRequest?.customerPhone ?? "",
      numberOfPeople: linkedTripRequest
        ? linkedTripRequest.numberOfAdults + linkedTripRequest.numberOfChildren
        : 1,
      departureDateEst: linkedTripRequest?.departureDateEst ?? "",
      tourTemplateId: linkedTripRequest?.suggestedTourId ?? NO_TEMPLATE,
      terms: "",
      note: linkedTripRequest?.specialRequirements ?? "",
    },
  });

  const handleSaveDraft = (values: CreateQuotationFormValues) => {
    const templateId = values.tourTemplateId === NO_TEMPLATE ? undefined : values.tourTemplateId;
    const template = templateId ? tourMockStore.getById(templateId) : undefined;
    const quotation = quotationMockStore.create({
      ...values,
      tourTemplateId: templateId,
      tourTemplateName: template?.name,
      itinerary: template?.itinerary ?? [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller A",
    });
    if (tripRequestId) {
      tripRequestMockStore.linkQuotation(tripRequestId, quotation.id);
      navigate(PATHS.SALES.TRIP_REQUEST_DETAIL.replace(":id", tripRequestId));
    } else {
      navigate(PATHS.SALES.QUOTATIONS);
    }
  };

  const handleCancel = () => {
    if (tripRequestId) {
      navigate(PATHS.SALES.TRIP_REQUEST_DETAIL.replace(":id", tripRequestId));
    } else {
      navigate(PATHS.SALES.QUOTATIONS);
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Tạo Báo giá mới'
        description='Điền thông tin khách hàng và chọn tour mẫu để tạo báo giá'
      />

      <FormProvider {...methods}>
        <form className='space-y-6'>
          {/* Thông tin khách hàng */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin khách hàng / đoàn</CardTitle>
            </CardHeader>
            <CardContent className='gap-4 grid grid-cols-1 md:grid-cols-2'>
              <FormInput
                name='customerName'
                label='Tên khách hàng / tên đoàn'
                required
                placeholder='VD: Công ty ABC, Đoàn nhà thờ...'
                className='md:col-span-2'
              />
              <FormInput name='customerEmail' label='Email liên hệ' placeholder='email@example.com' type='email' />
              <FormInput name='customerPhone' label='Số điện thoại' placeholder='0901234567' />
              <FormInput name='numberOfPeople' label='Số khách dự kiến' required type='number' min={1} placeholder='VD: 20' />
              <FormDatePicker name='departureDateEst' label='Ngày khởi hành dự kiến' />
              <FormTextarea
                name='note'
                label='Ghi chú yêu cầu đặc biệt'
                placeholder='Ăn chay, hỗ trợ xe lăn, phòng loại đặc biệt...'
                className='md:col-span-2'
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Chọn tour mẫu */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Tour mẫu làm cơ sở</CardTitle>
            </CardHeader>
            <CardContent>
              <FormSelect
                name='tourTemplateId'
                label='Tour mẫu'
                options={tourOptions}
                placeholder='Chọn tour mẫu (tùy chọn)'
              />
              <p className='text-xs text-muted-foreground mt-2'>
                Nếu chọn tour mẫu, hệ thống sẽ sao chép lịch trình và tự động tính chi phí. Bạn có thể tùy chỉnh sau trong trang chi tiết báo giá.
              </p>
            </CardContent>
          </Card>

          {/* Điều khoản */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Điều khoản báo giá</CardTitle>
            </CardHeader>
            <CardContent>
              <FormTextarea
                name='terms'
                label='Bao gồm / Không bao gồm / Chính sách hủy'
                placeholder='VD: Bao gồm: vé máy bay, khách sạn 4 sao...'
                rows={4}
              />
            </CardContent>
          </Card>

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Hủy
            </Button>
            <Button type='button' variant='secondary' onClick={methods.handleSubmit(handleSaveDraft)}>
              Lưu nháp
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
