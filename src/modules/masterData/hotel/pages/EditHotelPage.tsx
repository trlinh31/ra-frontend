import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { PATHS } from "@/app/routes/route.constant";
import { Button } from "@/shared/components/ui/button";

import HotelForm from "../components/HotelForm";
import { hotelMockStore } from "../data/hotel.mock-store";
import type { HotelFormValues } from "../schemas/hotel.schema";

export default function EditHotelPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = !!id;
  const hotel = id ? hotelMockStore.getById(id) : undefined;

  function handleSubmit(values: HotelFormValues) {
    if (isEdit && id) {
      hotelMockStore.update(id, values);
    } else {
      hotelMockStore.create(values);
    }
    navigate(PATHS.MASTER_DATA.HOTEL);
  }

  function handleCancel() {
    navigate(PATHS.MASTER_DATA.HOTEL);
  }

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
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleCancel}>
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <div>
          <h1 className='font-bold text-2xl tracking-tight'>{isEdit ? "Chỉnh sửa phòng" : "Thêm phòng mới"}</h1>
          <p className='text-muted-foreground text-sm'>
            {isEdit ? "Cập nhật thông tin phòng khách sạn" : "Điền thông tin để thêm phòng mới vào hệ thống"}
          </p>
        </div>
      </div>

      <HotelForm
        defaultValues={
          hotel
            ? {
                roomType: hotel.roomType,
                roomCount: hotel.roomCount,
                priceRanges: hotel.priceRanges,
                notes: hotel.notes,
                isActive: hotel.isActive,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
