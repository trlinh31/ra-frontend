import { ROOM_TYPES } from "@/modules/masterData/hotel/types/hotel.type";
import Section from "@/shared/components/common/Section";
import FormCurrenctyInput from "@/shared/components/form/FormCurrenctyInput";
import FormDatePicker from "@/shared/components/form/FormDatePicker";
import FormSelect from "@/shared/components/form/FormSelect";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function RoomForm() {
  const { control } = useFormContext();

  const roomsType = useMemo(() => ROOM_TYPES.map((type) => ({ label: type, value: type })), []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const handleAddRoom = () => {
    append({
      roomType: "",
      priceRange: { startDate: "", endDate: "", price: undefined as unknown as number },
    });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có phòng nào. Nhấn &quot;Thêm phòng&quot; để bắt đầu.</p>
        <Button type='button' onClick={handleAddRoom}>
          <PlusCircle className='w-4 h-4' />
          Thêm phòng
        </Button>
      </Section>
    );
  }

  return (
    <div className='space-y-3'>
      {fields.map((field, index) => (
        <div key={field.id} className='gap-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_180px]'>
          <FormSelect name={`rooms.${index}.roomType`} label='Loại phòng' options={roomsType} required />
          <FormDatePicker name={`rooms.${index}.priceRange.startDate`} label='Từ ngày' required />
          <FormDatePicker name={`rooms.${index}.priceRange.endDate`} label='Đến ngày' required />
          <FormCurrenctyInput name={`rooms.${index}.priceRange.price`} label='Giá (VNĐ)' required />

          <div className='flex justify-end items-end gap-3'>
            <ActionButton action='add' onClick={handleAddRoom} />
            <ActionButton action='delete' onClick={() => remove(index)} />
          </div>
        </div>
      ))}
    </div>
  );
}
