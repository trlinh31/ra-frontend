import { PATHS } from "@/app/routes/route.constant";
import HotelForm from "@/modules/masterData/hotel/components/HotelForm";
import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import { mapHotelFormValuesToPayload } from "@/modules/masterData/hotel/mappers/hotel-form.mapper";
import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditHotelPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const hotel = id ? hotelMockStore.getById(id) : undefined;

  const handleSubmit = (values: HotelFormValues) => {
    if (isEdit && id) {
      hotelMockStore.update(id, mapHotelFormValuesToPayload(values));
    } else {
      hotelMockStore.create(mapHotelFormValuesToPayload(values));
    }

    handleCancel();
  };

  const handleCancel = () => {
    navigate(PATHS.MASTER_DATA.HOTEL);
  };

  if (isEdit && !hotel) return null;

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật Khách sạn" : "Thêm mới Khách sạn"}
        description={isEdit ? `Cập nhật thông tin cho Khách sạn ${hotel?.name}` : "Điền thông tin để tạo mới Khách sạn"}
      />

      <HotelForm defaultValues={hotel} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
