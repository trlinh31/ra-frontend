import { PATHS } from "@/app/routes/route.constant";
import TransportationForm from "@/modules/masterData/transportation/components/TransportationForm";
import { transportMockStore } from "@/modules/masterData/transportation/data/transportation.mock-store";
import { mapTransportationFormValuesToPayload } from "@/modules/masterData/transportation/mappers/transportation-form.mapper";
import type { TransportationFormValues } from "@/modules/masterData/transportation/schemas/transportation.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTransportationPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const transportation = id ? transportMockStore.getById(id) : undefined;

  const handleSubmit = (values: TransportationFormValues) => {
    const payload = mapTransportationFormValuesToPayload(values);
    if (isEdit && id) {
      transportMockStore.update(id, payload);
    } else {
      transportMockStore.create(payload);
    }
    navigate(PATHS.MASTER_DATA.TRANSPORTATION);
  };

  const handleCancel = () => {
    navigate(PATHS.MASTER_DATA.TRANSPORTATION);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật lịch trình vận chuyển" : "Thêm mới lịch trình vận chuyển"}
        description={isEdit ? `Cập nhật thông tin cho lịch trình ${transportation?.code}` : "Điền thông tin để tạo mới lịch trình vận chuyển"}
      />
      <TransportationForm defaultValues={transportation} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
