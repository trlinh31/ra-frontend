import type { Room } from "@/modules/masterData/hotel/types/hotel.type";
import { format, parseISO } from "date-fns";

export const getWeekdayKey = (date: string) => {
  return format(parseISO(date), "dd/MM");
};

export const getRangeLabel = (startDate: string, endDate: string) => {
  // "2026-04-01", "2026-04-02" => "01/04-02/04"
  const start = format(parseISO(startDate), "dd/MM");
  const end = format(parseISO(endDate), "dd/MM");

  if (start === end) return start;

  return `${start} - ${end}`;
};

export const transformData = (data: Room[]) => {
  const map = new Map();

  data.forEach((item) => {
    const room = item.roomCategory.name;

    if (!map.has(room)) {
      map.set(room, {
        key: room,
        name: room,
        quantity: item.roomCategory.quantity,
        note: item.roomCategory.note,
        currency: item.currency,
        prices: {},
      });
    }

    const label = getRangeLabel(item.startDate, item.endDate);

    map.get(room).prices[label] = item.price;
  });

  return Array.from(map.values());
};

export const getRangeColumns = (data: Room[]) => {
  const set = new Set();

  data.forEach((item) => {
    set.add(getRangeLabel(item.startDate, item.endDate));
  });

  return Array.from(set);
};
