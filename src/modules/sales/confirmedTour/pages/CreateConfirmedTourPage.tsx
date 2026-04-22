import { PATHS } from "@/app/routes/route.constant";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import { createConfirmedTourSchema, type CreateConfirmedTourFormValues } from "@/modules/sales/confirmedTour/schemas/confirmed-tour.schema";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import { tourMockStore } from "@/modules/tour/tour/data/tour.mock-store";
import PageHeader from "@/shared/components/common/PageHeader";
import FormDatePicker from "@/shared/components/form/FormDatePicker/FormDatePicker";
import FormInput from "@/shared/components/form/FormInput/FormInput";
import FormSelect from "@/shared/components/form/FormSelect/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CreateConfirmedTourPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Nếu có quotationId trong query string → tạo từ báo giá đã approved
  const quotationId = searchParams.get("quotationId") ?? undefined;
  const quotation = quotationId ? quotationMockStore.getById(quotationId) : undefined;
  const isFromQuotation = Boolean(quotation && quotation.status === "approved");

  const tourOptions = tourMockStore.getAll().map((t) => ({ value: t.id, label: `${t.code} - ${t.name}` }));

  const defaultValues = useMemo<CreateConfirmedTourFormValues>(
    () => ({
      tourTemplateId: quotation?.tourTemplateId ?? "",
      customerName: quotation?.customerName ?? "",
      numberOfPeople: quotation?.numberOfPeople ?? 1,
      departureDate: quotation?.departureDateEst ?? "",
      note: quotation?.note ?? "",
    }),
    [quotation]
  );

  const methods = useForm<CreateConfirmedTourFormValues>({
    resolver: zodResolver(createConfirmedTourSchema),
    defaultValues,
  });

  const handleSubmit = (values: CreateConfirmedTourFormValues) => {
    if (isFromQuotation && quotationId) {
      // Tạo từ Quotation approved
      const ct = confirmedTourMockStore.createFromQuotation(quotationId, {
        customerName: values.customerName,
        numberOfPeople: values.numberOfPeople,
        departureDate: values.departureDate,
        note: values.note,
        createdBy: "Seller A",
      });
      if (ct) {
        navigate(PATHS.SALES.CONFIRMED_TOURS);
      }
    } else {
      // Tạo trực tiếp từ tour mẫu
      const template = values.tourTemplateId ? tourMockStore.getById(values.tourTemplateId) : undefined;
      confirmedTourMockStore.create({
        tourTemplateId: values.tourTemplateId || undefined,
        tourTemplateName: template?.name,
        customerName: values.customerName,
        numberOfPeople: values.numberOfPeople,
        departureDate: values.departureDate,
        itinerary: template?.itinerary ?? [],
        status: "draft",
        note: values.note,
        createdBy: "Seller A",
      });
      navigate(PATHS.SALES.CONFIRMED_TOURS);
    }
  };

  const handleCancel = () => navigate(PATHS.SALES.CONFIRMED_TOURS);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Tạo Tour Xác Nhận'
        description={
          isFromQuotation && quotation
            ? `Từ báo giá ${quotation.code} — ${quotation.customerName}`
            : "Tạo tour thực tế từ tour mẫu cho đoàn khách"
        }
      />

      {/* Banner báo giá gốc */}
      {isFromQuotation && quotation && (
        <div className='flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800'>
          <CheckCircle2 className='w-5 h-5 mt-0.5 shrink-0' />
          <div>
            <p className='font-semibold'>Tạo từ báo giá đã chấp thuận: {quotation.code}</p>
            <p className='text-green-700 mt-0.5'>
              Lịch trình và thông tin khách hàng đã được sao chép từ báo giá. Bạn có thể điều chỉnh trước khi tạo tour.
            </p>
          </div>
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin đoàn khách</CardTitle>
            </CardHeader>
            <CardContent className='gap-4 grid grid-cols-1 md:grid-cols-2'>
              {/* Chỉ hiện chọn tour mẫu nếu KHÔNG tạo từ báo giá */}
              {!isFromQuotation && (
                <FormSelect
                  name='tourTemplateId'
                  label='Tour mẫu'
                  required
                  options={tourOptions}
                  placeholder='Chọn tour mẫu'
                  className='md:col-span-2'
                />
              )}

              {isFromQuotation && quotation?.tourTemplateName && (
                <div className='md:col-span-2'>
                  <p className='text-xs text-muted-foreground mb-1'>Tour mẫu cơ sở</p>
                  <p className='text-sm font-medium'>{quotation.tourTemplateName}</p>
                </div>
              )}

              <FormInput name='customerName' label='Tên đoàn / Khách hàng' required placeholder='VD: Đoàn công ty ABC' />
              <FormInput name='numberOfPeople' label='Số khách thực tế' required type='number' placeholder='Số lượng khách' min={1} />
              <FormDatePicker name='departureDate' label='Ngày khởi hành chính thức' required />
              <FormTextarea name='note' label='Ghi chú yêu cầu đặc biệt' placeholder='Yêu cầu đặc biệt, lưu ý cho đoàn...' className='md:col-span-2' rows={3} />
            </CardContent>
          </Card>

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Hủy
            </Button>
            <Button type='submit'>Tạo Tour Xác Nhận</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
