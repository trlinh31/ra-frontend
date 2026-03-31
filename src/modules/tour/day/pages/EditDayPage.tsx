import { PATHS } from "@/app/routes/route.constant";
import DayForm from "@/modules/tour/day/components/DayForm";
import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditDayPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const day = id ? dayMockStore.getById(id) : undefined;

  const handleSubmit = (values: DayFormValues) => {
    // if (isEdit && id) {
    //   dayMockStore.update(id, mapDayFormValuesToPayload(values));
    // } else {
    //   dayMockStore.create(mapDayFormValuesToPayload(values));
    // }
    // handleCancel();
    console.log("values", values);
  };

  const handleCancel = () => navigate(PATHS.TOUR.DAYS);

  if (isEdit && !day) {
    return (
      <div className='flex flex-col justify-center items-center gap-4 py-16'>
        <p className='text-muted-foreground'>Không tìm thấy ngày hành trình.</p>
        <Button variant='outline' onClick={handleCancel}>
          <ArrowLeft className='mr-2 w-4 h-4' />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật Ngày hành trình" : "Thêm mới Ngày hành trình"}
        description={isEdit ? `Cập nhật thông tin ngày ${day?.code} - ${day?.title}` : "Điền thông tin để tạo mới ngày hành trình"}
      />
      <DayForm defaultValues={day} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
