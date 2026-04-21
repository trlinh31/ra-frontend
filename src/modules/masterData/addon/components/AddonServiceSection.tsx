import AddonServiceDialog from "@/modules/masterData/addon/components/AddonServiceDialog";
import { addonMockStore } from "@/modules/masterData/addon/data/addon.mock-store";
import type { AddonServiceFormValues } from "@/modules/masterData/addon/schemas/addon.schema";
import type { AddonEntityType, AddonService } from "@/modules/masterData/addon/types/addon.type";
import { AppTable } from "@/shared/components/common/AppTable";
import Section from "@/shared/components/common/Section";
import ActionButton from "@/shared/components/table/ActionButton";
import { CURRENCIES } from "@/shared/constants/currency.constant";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface AddonServiceSectionProps {
  entityType: AddonEntityType;
  entityId: string;
}

function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export default function AddonServiceSection({ entityType, entityId }: AddonServiceSectionProps) {
  const { confirm } = useConfirm();

  const [addons, setAddons] = useState<AddonService[]>(() => addonMockStore.getByEntity(entityType, entityId));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AddonService | undefined>(undefined);

  const refresh = () => {
    setAddons(addonMockStore.getByEntity(entityType, entityId));
  };

  const handleOpenAdd = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const handleOpenEdit = (addon: AddonService) => {
    setEditing(addon);
    setDialogOpen(true);
  };

  const handleSave = (values: AddonServiceFormValues) => {
    if (editing) {
      addonMockStore.update(editing.id, {
        ...values,
        entityType,
        entityId,
      });
    } else {
      addonMockStore.create({
        ...values,
        entityType,
        entityId,
      });
    }
    refresh();
  };

  const handleDelete = async (addon: AddonService) => {
    const ok = await confirm({
      description: `Bạn có chắc chắn muốn xóa dịch vụ "${addon.name}"? Hành động này không thể hoàn tác.`,
    });
    if (!ok) return;
    addonMockStore.delete(addon.id);
    refresh();
  };

  const columns = useMemo<ColumnDef<AddonService>[]>(
    () => [
      { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
      { accessorKey: "name", header: "Tên dịch vụ" },
      {
        id: "price",
        accessorKey: "price",
        header: "Đơn giá",
        cell: ({ row }) => {
          const { price, currency } = row.original;
          const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;
          return (
            <div>
              <span className='font-semibold'>{formatNumberVN(price)}</span>
              <span className='ml-1 text-muted-foreground text-xs'>{symbol}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        enableSorting: false,
        maxSize: 300,
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <ActionButton action='edit' size='icon-sm' onClick={() => handleOpenEdit(row.original)} />
            <ActionButton action='delete' size='icon-sm' variant='destructive' onClick={() => handleDelete(row.original)} />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addons]
  );

  return (
    <>
      <Section title='Dịch vụ thêm (Add-on)'>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <p className='text-muted-foreground text-sm'>Danh sách các dịch vụ bổ sung.</p>

            <ActionButton action='add' text='Thêm dịch vụ' variant='default' size='default' onClick={handleOpenAdd} />
          </div>

          <AppTable columns={columns} data={addons} enablePagination={false} />
        </div>
      </Section>

      <AddonServiceDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultValues={editing} onSave={handleSave} />
    </>
  );
}
