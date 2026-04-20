import type { Service } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";

export const getVisaServiceDetailColumns = (): ColumnDef<Service>[] => [
  { id: "index", header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
  { header: "Nhóm", accessorKey: "group" },
  { header: "Tên dịch vụ", accessorKey: "serviceName" },
  {
    header: "Giá",
    accessorKey: "price",
    cell: ({ row }) => formatNumberVN(row.original.price) + " " + row.original.priceUnit,
  },
  { header: "Địa điểm đón", accessorKey: "pickupLocation", enableSorting: false },
  { header: "Mô tả", accessorKey: "description", enableSorting: false },
];
