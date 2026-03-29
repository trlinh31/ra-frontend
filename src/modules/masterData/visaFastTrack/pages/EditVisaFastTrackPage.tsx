import { PATHS } from "@/app/routes/route.constant";
import VisaServiceForm from "@/modules/masterData/visaFastTrack/components/VisaServiceForm";
import { visaFastTrackMockStore } from "@/modules/masterData/visaFastTrack/data/visa-fast-track.mock-store";
import { mapVisaServiceFormValuesToPayload } from "@/modules/masterData/visaFastTrack/mappers/visa-fast-track-form.mapper";
import type { VisaServiceFormValues } from "@/modules/masterData/visaFastTrack/schemas/visa-fast-track.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import ProviderForm from "../components/ProviderForm";

export default function EditVisaFastTrackPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const item = id ? visaFastTrackMockStore.getItemById(id) : undefined;

  const handleSubmit = (values: VisaServiceFormValues) => {
    if (isEdit && id) {
      visaFastTrackMockStore.update(id, mapVisaServiceFormValuesToPayload(values));
    } else {
      visaFastTrackMockStore.create(mapVisaServiceFormValuesToPayload(values));
    }
    navigate(PATHS.MASTER_DATA.VISA_FAST_TRACK);
  };

  const handleCancel = () => navigate(PATHS.MASTER_DATA.VISA_FAST_TRACK);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật Visa / Fast Track" : "Thêm mới Visa / Fast Track"}
        description={isEdit ? `Cập nhật thông tin dịch vụ ${item?.id}` : "Điền thông tin để tạo mới dịch vụ Visa / Fast Track"}
      />
      <ProviderForm defaultValues={item} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
