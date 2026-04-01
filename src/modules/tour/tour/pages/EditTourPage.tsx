import { PATHS } from "@/app/routes/route.constant";
import { tourMockStore } from "@/modules/tour/tour/data/tour.mock-store";
import { mapTourFormValuesToPayload } from "@/modules/tour/tour/mappers/tour-form.mapper";
import type { TourFormValues } from "@/modules/tour/tour/schemas/tour.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTourPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const tour = id ? tourMockStore.getById(id) : undefined;

  const handleSubmit = (values: TourFormValues) => {
    if (isEdit && id) {
      tourMockStore.update(id, mapTourFormValuesToPayload(values));
    } else {
      tourMockStore.create(mapTourFormValuesToPayload(values));
    }
    handleCancel();
  };

  const handleCancel = () => navigate(PATHS.TOUR.TOURS);

  if (isEdit && !tour) {
    return (
      <div className='flex flex-col justify-center items-center gap-4 py-16'>
        <p className='text-muted-foreground'>Không tìm thấy tour.</p>
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
        title={isEdit ? "Cập nhật Tour" : "Thêm mới Tour"}
        description={isEdit ? `Cập nhật thông tin tour ${tour?.code} - ${tour?.name}` : "Điền thông tin để tạo mới tour du lịch"}
      />
      {/* <TourForm defaultValues={tour} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} /> */}
    </div>
  );
}
