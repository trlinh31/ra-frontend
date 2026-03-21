import { PATHS } from "@/app/routes/route.constant";
import FlightForm from "@/modules/masterData/flights/components/FlightForm";
import { flightMockStore } from "@/modules/masterData/flights/data/flight.mock-store";
import { mapFlightFormValuesToPayload } from "@/modules/masterData/flights/mappers/flight-form.mapper";
import type { FlightFormValues } from "@/modules/masterData/flights/schemas/flight.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFlightPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const flight = id ? flightMockStore.getById(id) : undefined;

  const handleSubmit = (values: FlightFormValues) => {
    if (isEdit && id) {
      flightMockStore.update(id, mapFlightFormValuesToPayload(values));
    } else {
      flightMockStore.create(mapFlightFormValuesToPayload(values));
    }

    handleCancel();
  };

  const handleCancel = () => {
    navigate(PATHS.MASTER_DATA.FLIGHTS);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật Chuyến bay" : "Thêm mới Chuyến bay"}
        description={isEdit ? `Cập nhật thông tin cho Chuyến bay ${flight?.code}` : "Điền thông tin để tạo mới Chuyến bay"}
      />

      <FlightForm defaultValues={flight} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
