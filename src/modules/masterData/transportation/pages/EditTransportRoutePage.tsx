import { PATHS } from "@/app/routes/route.constant";
import TransportRouteForm from "@/modules/masterData/transportation/components/TransportRouteForm";
import { transportMockStore } from "@/modules/masterData/transportation/data/transportation.mock-store";
import { mapTransportRouteFormValuesToPayload } from "@/modules/masterData/transportation/mappers/transport-route-form.mapper";
import type { TransportRouteFormValues } from "@/modules/masterData/transportation/schemas/transport-route.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTransportRoutePage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const transportRoute = id ? transportMockStore.getRouteItemById(id) : undefined;

  const handleSubmit = (values: TransportRouteFormValues) => {
    if (isEdit && id) {
      transportMockStore.updateRouteItem(id, mapTransportRouteFormValuesToPayload(values));
    } else {
      transportMockStore.createRouteItem(mapTransportRouteFormValuesToPayload(values));
    }

    handleCancel();
  };

  const handleCancel = () => {
    navigate(PATHS.MASTER_DATA.TRANSPORTATION);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật Tuyến vận chuyển" : "Thêm mới Tuyến vận chuyển"}
        description={isEdit ? `Cập nhật thông tin cho Tuyến vận chuyển ${transportRoute?.code}` : "Điền thông tin để tạo mới Tuyến vận chuyển"}
      />

      <TransportRouteForm defaultValues={transportRoute} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
