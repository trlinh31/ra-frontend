import { PATHS } from "@/app/routes/route.constant";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import type { Quotation } from "@/modules/sales/quotation/types/quotation.type";
import TourDayForm from "@/modules/tour/tour/components/TourDayForm";
import { tourItineraryItemSchema, type TourItineraryItemFormValues } from "@/modules/tour/tour/schemas/tour.schema";
import type { TourItineraryItem } from "@/modules/tour/tour/types/tour.type";
import PageHeader from "@/shared/components/common/PageHeader";
import FormDatePicker from "@/shared/components/form/FormDatePicker";
import FormInput from "@/shared/components/form/FormInput";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Save } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

// ─── Schema kết hợp: thông tin đoàn + lịch trình ─────────────────────────────
// Giữ đủ các field mà TourDayForm cần (itinerary, numberOfPeople)
// cộng thêm các field dummy (code, name, description, content) để
// TourFormValues context hoạt động bình thường
const editQuotationSchema = z.object({
  customerName: z.string().min(1, "Vui lòng nhập tên khách hàng / tên đoàn"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  numberOfPeople: z.number({ error: "Vui lòng nhập số khách" }).min(1, "Số khách phải ít nhất 1"),
  departureDateEst: z.string().optional(),
  note: z.string().optional(),
  terms: z.string().optional(),
  itinerary: z.array(tourItineraryItemSchema),
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
});

type EditQuotationFormValues = z.infer<typeof editQuotationSchema>;

// ─── Mapper: TourItineraryItem → form values ──────────────────────────────────
function mapItineraryToForm(itinerary: TourItineraryItem[]): TourItineraryItemFormValues[] {
  return itinerary.map((item) => {
    if (item.kind === "day") {
      return {
        kind: "day" as const,
        code: item.code,
        title: item.title,
        country: item.country,
        city: item.city,
        description: item.description,
        services: item.services.map((s) => ({
          serviceType: s.serviceType,
          name: s.name,
          unitPrice: s.unitPrice,
          currency: s.currency,
          ...(s.hotelDetail ? { hotelDetail: s.hotelDetail } : {}),
          ...(s.transportDetail ? { transportDetail: s.transportDetail } : {}),
          ...(s.visaDetail ? { visaDetail: s.visaDetail } : {}),
          ...(s.entranceFeeDetail ? { entranceFeeDetail: s.entranceFeeDetail } : {}),
          ...(s.flightDetail ? { flightDetail: s.flightDetail } : {}),
        })),
      };
    }
    return {
      kind: "group_tour" as const,
      groupTourId: item.groupTourId,
      pricingPeriodId: item.pricingPeriodId,
      dayGroupId: item.dayGroupId,
      name: item.name,
      unitPrice: item.unitPrice,
      currency: item.currency,
    };
  });
}

// ─── Mapper: form values → TourItineraryItem ──────────────────────────────────
function mapFormToItinerary(items: TourItineraryItemFormValues[]): TourItineraryItem[] {
  return items.map((item, i) => {
    if (item.kind === "day") {
      return {
        kind: "day" as const,
        code: item.code,
        title: item.title,
        country: item.country,
        city: item.city,
        description: item.description ?? "",
        services: (item.services ?? []).map((s, si) => ({
          id: `svc-${Date.now()}-${i}-${si}`,
          serviceType: s.serviceType,
          name: s.name,
          unitPrice: s.unitPrice,
          currency: s.currency,
          ...(s.hotelDetail ? { hotelDetail: s.hotelDetail } : {}),
          ...(s.transportDetail ? { transportDetail: s.transportDetail } : {}),
          ...(s.visaDetail ? { visaDetail: s.visaDetail } : {}),
          ...(s.entranceFeeDetail ? { entranceFeeDetail: s.entranceFeeDetail } : {}),
          ...(s.flightDetail ? { flightDetail: s.flightDetail } : {}),
        })),
      };
    }
    return {
      kind: "group_tour" as const,
      groupTourId: item.groupTourId,
      pricingPeriodId: item.pricingPeriodId,
      dayGroupId: item.dayGroupId,
      name: item.name,
      unitPrice: item.unitPrice,
      currency: item.currency,
    };
  });
}

// ─── Component chính ──────────────────────────────────────────────────────────
export default function EditQuotationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const quotation: Quotation | undefined = id ? quotationMockStore.getById(id) : undefined;

  // Guard: không tìm thấy
  if (!quotation) {
    return (
      <div className='space-y-4'>
        <p className='text-muted-foreground'>Không tìm thấy báo giá.</p>
        <Button variant='outline' onClick={() => navigate(PATHS.SALES.QUOTATIONS)}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  // Guard: chỉ edit được khi draft hoặc sent
  const isEditable = quotation.status === "draft" || quotation.status === "sent";
  if (!isEditable) {
    return (
      <div className='space-y-4'>
        <div className='flex items-start gap-3 bg-amber-50 p-4 border border-amber-200 rounded-lg text-amber-800 text-sm'>
          <AlertCircle className='mt-0.5 w-4 h-4 shrink-0' />
          <div>
            <p className='font-medium'>Không thể chỉnh sửa</p>
            <p>
              Báo giá <strong>{quotation.code}</strong> đang ở trạng thái <strong>{quotation.status}</strong>, không thể chỉnh sửa.
            </p>
          </div>
        </div>
        <Button variant='outline' onClick={() => navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", quotation.id))}>
          Quay lại chi tiết
        </Button>
      </div>
    );
  }

  return <EditForm quotation={quotation} />;
}

// Tách thành component con để tránh lỗi hooks khi guard trả về sớm
function EditForm({ quotation }: { quotation: Quotation }) {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<EditQuotationFormValues>({
    resolver: zodResolver(editQuotationSchema),
    defaultValues: {
      customerName: quotation.customerName,
      customerEmail: quotation.customerEmail ?? "",
      customerPhone: quotation.customerPhone ?? "",
      numberOfPeople: quotation.numberOfPeople,
      departureDateEst: quotation.departureDateEst ?? "",
      note: quotation.note ?? "",
      terms: quotation.terms ?? "",
      itinerary: mapItineraryToForm(quotation.itinerary),
      code: "",
      name: "",
      description: "",
      content: "",
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = methods;

  const onSave = handleSubmit((values) => {
    quotationMockStore.update(quotation.id, {
      customerName: values.customerName,
      customerEmail: values.customerEmail || undefined,
      customerPhone: values.customerPhone || undefined,
      numberOfPeople: values.numberOfPeople,
      departureDateEst: values.departureDateEst || undefined,
      note: values.note || undefined,
      terms: values.terms || undefined,
      itinerary: mapFormToItinerary(values.itinerary),
    });
    navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", quotation.id));
  });

  const handleCancel = () => navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", quotation.id));

  return (
    <FormProvider {...methods}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={onSave} className='space-y-6'>
        <PageHeader
          title={`Chỉnh sửa Báo giá ${quotation.code}`}
          description={`Trạng thái: ${quotation.status === "draft" ? "Bản nháp" : "Đã gửi"} — Tạo bởi ${quotation.createdBy}`}
        />

        {/* Cảnh báo nếu đang ở trạng thái sent */}
        {quotation.status === "sent" && (
          <div className='flex items-start gap-3 bg-amber-50 p-4 border border-amber-200 rounded-lg text-amber-800 text-sm'>
            <AlertCircle className='mt-0.5 w-4 h-4 text-amber-500 shrink-0' />
            <div>
              <p className='font-medium'>Báo giá đã gửi cho khách</p>
              <p>Sau khi lưu thay đổi, hãy nhớ xuất PDF mới và ghi nhận gửi lại để tạo version mới cho khách.</p>
            </div>
          </div>
        )}

        {/* ── Thông tin đoàn ───────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Thông tin đoàn khách</CardTitle>
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
            <FormInput name='numberOfPeople' label='Số khách' required type='number' min={1} placeholder='VD: 20' />
            <FormDatePicker name='departureDateEst' label='Ngày khởi hành dự kiến' />
            <FormTextarea
              name='note'
              label='Ghi chú yêu cầu đặc biệt'
              placeholder='Ăn chay, hỗ trợ xe lăn, phòng loại đặc biệt...'
              className='md:col-span-2'
              rows={3}
            />
            <FormTextarea
              name='terms'
              label='Điều khoản báo giá'
              placeholder='VD: Bao gồm: vé máy bay, khách sạn 4 sao...'
              className='md:col-span-2'
              rows={4}
            />
          </CardContent>
        </Card>

        {/* ── Lịch trình ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Lịch trình</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TourDayForm đọc itinerary + numberOfPeople qua useFormContext — hoạt động vì schema có đủ hai field này */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <TourDayForm />
          </CardContent>
        </Card>

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={handleCancel}>
            Hủy
          </Button>
          <Button type='submit' disabled={!isDirty || isSubmitting}>
            <Save className='mr-2 w-4 h-4' />
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
