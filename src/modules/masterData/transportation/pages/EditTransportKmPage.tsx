import { PATHS } from "@/app/routes/route.constant";
import TransportKmForm from "@/modules/masterData/transportation/components/TransportKmForm";
import { transportMockStore } from "@/modules/masterData/transportation/data/transportation.mock-store";
import type { TransportKmFormValues } from "@/modules/masterData/transportation/schemas/transport-km.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTransportKmPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const transportKm = id ? transportMockStore.getKmItemById(id) : undefined;

  const handleSubmit = (values: TransportKmFormValues) => {
    if (isEdit && id) {
      transportMockStore.updateKmItem(id, values);
    } else {
      transportMockStore.createKmItem(values);
    }

    handleCancel();
  };

  const handleCancel = () => {
    navigate(PATHS.MASTER_DATA.TRANSPORTATION);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật Phí vận chuyển" : "Thêm mới Phí vận chuyển"}
        description={isEdit ? `Cập nhật thông tin cho Phí vận chuyển ${transportKm?.code}` : "Điền thông tin để tạo mới Phí vận chuyển"}
      />

      <TransportKmForm defaultValues={transportKm} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
