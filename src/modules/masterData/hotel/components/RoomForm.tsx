import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormDatePicker from "@/shared/components/form/FormDatePicker";
import FormSelect from "@/shared/components/form/FormSelect";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { addDays } from "date-fns";
import { PlusCircle } from "lucide-react";
import { useMemo } from "react";
import type { Matcher } from "react-day-picker";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

export default function RoomForm() {
  const { control } = useFormContext<HotelFormValues>();

  const roomCategories = useWatch({ control, name: "roomCategories" });

  const roomCategoriesOptions = useMemo(
    () => (roomCategories ?? []).filter((type) => type.name).map((type) => ({ label: type.name, value: type.name })),
    [roomCategories]
  );

  const rooms = useWatch({ control, name: "rooms" });

  const getDisabledDates = (index: number): Matcher[] => {
    const currentRoom = rooms?.[index];
    if (!currentRoom?.roomCategory) return [];

    return (rooms ?? [])
      .filter((room, i) => i !== index && room.roomCategory === currentRoom.roomCategory && room.startDate && room.endDate)
      .map((room) => ({
        from: new Date(room.startDate),
        to: new Date(room.endDate),
      }));
  };

  const getEndDateDisabledDates = (index: number): Matcher[] => {
    const currentRoom = rooms?.[index];
    const matchers: Matcher[] = [...getDisabledDates(index)];

    if (currentRoom?.startDate) {
      const startDate = new Date(currentRoom.startDate);
      matchers.push({ before: addDays(startDate, 1) });

      const sameCategory = (rooms ?? []).filter((room, i) => i !== index && room.roomCategory === currentRoom.roomCategory && room.startDate);

      const nextRangeStart = sameCategory
        .map((room) => new Date(room.startDate))
        .filter((d) => d > startDate)
        .sort((a, b) => a.getTime() - b.getTime())[0];

      if (nextRangeStart) {
        matchers.push({ after: addDays(nextRangeStart, -1) });
      }
    }

    return matchers;
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const handleAddRoom = () => {
    append({
      roomCategory: "",
      startDate: "",
      endDate: "",
      price: undefined as unknown as number,
      currency: "",
    });
  };

  if (roomCategoriesOptions.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có loại phòng nào. Vui lòng thêm loại phòng trước.</p>
      </Section>
    );
  }

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
    <div className='divide-y divide-gray-300'>
      {fields.map((field, index) => (
        <div key={field.id} className='flex gap-4 py-4'>
          <FormSelect name={`rooms.${index}.roomCategory`} label='Loại phòng' options={roomCategoriesOptions} required />
          <FormDatePicker name={`rooms.${index}.startDate`} label='Từ ngày' required disabledDates={getDisabledDates(index)} />
          <FormDatePicker name={`rooms.${index}.endDate`} label='Đến ngày' required disabledDates={getEndDateDisabledDates(index)} />
          <FormSelect name={`rooms.${index}.currency`} label='Đơn vị tiền tệ' options={CURRENCY_OPTIONS} required />
          <FormCurrencyInput name={`rooms.${index}.price`} label='Giá phòng' required />
          <div className='flex justify-end items-end gap-3'>
            <ActionButton action='add' onClick={handleAddRoom} />
            <ActionButton action='delete' onClick={() => remove(index)} />
          </div>
        </div>
      ))}
    </div>
  );
}
