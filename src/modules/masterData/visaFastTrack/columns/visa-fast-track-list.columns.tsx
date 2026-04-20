import type { VisaService } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";
import ActionButton from "@/shared/components/table/ActionButton";
import type { ColumnDef } from "@tanstack/react-table";

interface GetVisaFastTrackListColumnsParams {
  onEdit: (item: VisaService) => void;
  onDelete: (item: VisaService) => void;
}

export const getVisaFastTrackListColumns = ({ onEdit, onDelete }: GetVisaFastTrackListColumnsParams): ColumnDef<VisaService>[] => [
  { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
  { header: "Quốc gia", accessorKey: "country" },
  { header: "Thành phố", accessorKey: "city" },
  { header: "Nhà cung cấp", accessorKey: "provider" },
  {
    id: "actions",
    header: "Hành động",
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <ActionButton action='edit' onClick={() => onEdit(row.original)} />
        <ActionButton action='delete' onClick={() => onDelete(row.original)} />
      </div>
    ),
  },
];
