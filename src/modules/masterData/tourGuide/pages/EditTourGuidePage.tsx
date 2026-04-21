import { PATHS } from "@/app/routes/route.constant";
import AddonServiceSection from "@/modules/masterData/addon/components/AddonServiceSection";
import TourGuideForm from "@/modules/masterData/tourGuide/components/TourGuideForm";
import { tourGuideMockStore } from "@/modules/masterData/tourGuide/data/tourGuide.mock-store";
import { mapTourGuideFormValuesToPayload } from "@/modules/masterData/tourGuide/mappers/tourGuide-form.mapper";
import type { TourGuideFormValues } from "@/modules/masterData/tourGuide/schemas/tourGuide.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTourGuidePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const item = id ? tourGuideMockStore.getById(id) : undefined;

  const handleSubmit = (values: TourGuideFormValues) => {
    if (isEdit && id) {
      tourGuideMockStore.update(id, mapTourGuideFormValuesToPayload(values));
    } else {
      tourGuideMockStore.create(mapTourGuideFormValuesToPayload(values));
    }
    navigate(PATHS.MASTER_DATA.TOUR_GUIDE);
  };

  const handleCancel = () => navigate(PATHS.MASTER_DATA.TOUR_GUIDE);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật hướng dẫn viên" : "Thêm mới hướng dẫn viên"}
        description={isEdit ? `Cập nhật thông tin cho hướng dẫn viên ${item?.code}` : "Điền thông tin để tạo mới hướng dẫn viên"}
      />
      <TourGuideForm defaultValues={item} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />

      {isEdit && id && (
        <AddonServiceSection entityType="tour_guide" entityId={id} />
      )}
    </div>
  );
}
