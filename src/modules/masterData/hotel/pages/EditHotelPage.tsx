import { PATHS } from "@/app/routes/route.constant";
import HotelForm from "@/modules/masterData/hotel/components/HotelForm";
import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditHotelPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const hotel = id ? hotelMockStore.getById(id) : undefined;

  const handleSubmit = (values: HotelFormValues) => {
    // if (isEdit && id) {
    //   hotelMockStore.update(id, values);
    // } else {
    //   hotelMockStore.create(values);
    // }
    // navigate(PATHS.MASTER_DATA.HOTEL);
  };

  const handleCancel = () => {
    navigate(PATHS.MASTER_DATA.HOTEL);
  };

  if (isEdit && !hotel) {
    return (
      <div className='flex flex-col justify-center items-center gap-4 py-16'>
        <p className='text-muted-foreground'>Không tìm thấy thông tin phòng.</p>
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
        title={isEdit ? "Chỉnh sửa khách sạn" : "Thêm mới khách sạn"}
        description={isEdit ? `Cập nhật thông tin cho khách sạn ${hotel?.name}` : "Điền thông tin để tạo mới khách sạn"}
      />

      <HotelForm
        defaultValues={
          hotel
            ? {
                name: hotel.name,
                rate: String(hotel.rate),
                city: hotel.city,
                country: hotel.country,
                rooms: hotel.rooms,
                notes: hotel.notes,
                isActive: hotel.isActive,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={isEdit}
      />
    </div>
  );
}
