import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { FolderPlus, Pencil, Plus, Shield, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import VisaGroupForm from "../components/VisaGroupForm";
import VisaServiceItemForm from "../components/VisaServiceItemForm";
import { visaFastTrackMockStore } from "../data/visa-fast-track.mock-store";
import type { VisaGroupFormValues, VisaServiceItemFormValues } from "../schemas/visa-fast-track.schema";
import type { VisaServiceGroup, VisaServiceItem } from "../types/visa-fast-track.type";

export default function VisaFastTrackListPage() {
  const [groups, setGroups] = useState<VisaServiceGroup[]>(() => visaFastTrackMockStore.getAllGroups());
  const [items, setItems] = useState<VisaServiceItem[]>(() => visaFastTrackMockStore.getAllItems());

  const [groupDialog, setGroupDialog] = useState<{ open: boolean; target: VisaServiceGroup | null }>({
    open: false,
    target: null,
  });
  const [itemDialog, setItemDialog] = useState<{ open: boolean; target: VisaServiceItem | null }>({
    open: false,
    target: null,
  });
  const [deleteGroupTarget, setDeleteGroupTarget] = useState<VisaServiceGroup | null>(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState<VisaServiceItem | null>(null);

  // Flatten: group header rows + item rows
  type DisplayRow = { type: "group"; group: VisaServiceGroup } | { type: "item"; item: VisaServiceItem };

  const displayRows = useMemo((): DisplayRow[] => {
    const rows: DisplayRow[] = [];
    for (const group of groups) {
      rows.push({ type: "group", group });
      items.filter((i) => i.groupId === group.id).forEach((item) => rows.push({ type: "item", item }));
    }
    return rows;
  }, [groups, items]);

  // ── Group handlers ──
  const handleGroupSubmit = (values: VisaGroupFormValues) => {
    if (groupDialog.target) visaFastTrackMockStore.updateGroup(groupDialog.target.id, values);
    else visaFastTrackMockStore.createGroup(values);
    setGroups(visaFastTrackMockStore.getAllGroups());
    setGroupDialog({ open: false, target: null });
  };

  const handleDeleteGroupConfirm = () => {
    if (!deleteGroupTarget) return;
    visaFastTrackMockStore.deleteGroup(deleteGroupTarget.id);
    setGroups(visaFastTrackMockStore.getAllGroups());
    setItems(visaFastTrackMockStore.getAllItems());
    setDeleteGroupTarget(null);
  };

  // ── Item handlers ──
  const handleItemSubmit = (values: VisaServiceItemFormValues) => {
    const data: Omit<VisaServiceItem, "id"> = {
      groupId: values.groupId,
      serviceName: values.serviceName,
      priceUsd: values.priceUsd,
      priceUnit: values.priceUnit ?? "",
      description: values.description ?? "",
      pickupLocation: values.pickupLocation ?? "",
    };
    if (itemDialog.target) visaFastTrackMockStore.updateItem(itemDialog.target.id, data);
    else visaFastTrackMockStore.createItem(data);
    setItems(visaFastTrackMockStore.getAllItems());
    setItemDialog({ open: false, target: null });
  };

  const handleDeleteItemConfirm = () => {
    if (!deleteItemTarget) return;
    visaFastTrackMockStore.deleteItem(deleteItemTarget.id);
    setItems(visaFastTrackMockStore.getAllItems());
    setDeleteItemTarget(null);
  };

  return (
    <div className='space-y-4'>
      {/* Page header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Shield className='w-6 h-6 text-primary' />
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>Quản lý Visa + Fast Track</h1>
            <p className='text-muted-foreground text-sm'>Danh sách dịch vụ visa và fast track theo nhóm</p>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => setGroupDialog({ open: true, target: null })}>
            <FolderPlus className='w-4 h-4' />
            Thêm nhóm
          </Button>
          <Button onClick={() => setItemDialog({ open: true, target: null })} disabled={groups.length === 0}>
            <Plus className='w-4 h-4' />
            Thêm dịch vụ
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-44'>Nhóm</TableHead>
              <TableHead>Dịch Vụ</TableHead>
              <TableHead className='w-36'>Đơn Giá (USD)</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className='w-44'>Nơi đón</TableHead>
              <TableHead className='w-24 text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='py-10 text-muted-foreground text-center'>
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {displayRows.map((row) =>
              row.type === "group" ? (
                // Group header row — spans col 1, merges visually across items below
                <TableRow key={`grp-${row.group.id}`} className='bg-muted/40 hover:bg-muted/50'>
                  <TableCell className='font-bold text-primary uppercase' colSpan={5}>
                    {row.group.name}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end items-center gap-1'>
                      <Button variant='ghost' size='icon' onClick={() => setGroupDialog({ open: true, target: row.group })}>
                        <Pencil className='w-3.5 h-3.5' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:text-destructive'
                        onClick={() => setDeleteGroupTarget(row.group)}>
                        <Trash2 className='w-3.5 h-3.5' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={row.item.id}>
                  <TableCell />
                  <TableCell className='font-medium text-sm'>{row.item.serviceName}</TableCell>
                  <TableCell className='text-sm'>
                    {row.item.priceUsd != null ? (
                      <span>
                        {row.item.priceUsd} USD
                        {row.item.priceUnit ? `/ ${row.item.priceUnit}` : ""}
                      </span>
                    ) : (
                      <span className='text-muted-foreground'>—</span>
                    )}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>{row.item.description || "—"}</TableCell>
                  <TableCell className='text-muted-foreground text-sm'>{row.item.pickupLocation || "—"}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end items-center gap-1'>
                      <Button variant='ghost' size='icon' onClick={() => setItemDialog({ open: true, target: row.item })}>
                        <Pencil className='w-3.5 h-3.5' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:text-destructive'
                        onClick={() => setDeleteItemTarget(row.item)}>
                        <Trash2 className='w-3.5 h-3.5' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Dialogs ── */}
      {/* Group: Add/Edit */}
      <Dialog open={groupDialog.open} onOpenChange={(open) => setGroupDialog((s) => ({ ...s, open }))}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{groupDialog.target ? "Chỉnh sửa nhóm" : "Thêm nhóm dịch vụ"}</DialogTitle>
          </DialogHeader>
          <VisaGroupForm
            defaultValues={groupDialog.target ?? undefined}
            onSubmit={handleGroupSubmit}
            onCancel={() => setGroupDialog({ open: false, target: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Group: Delete */}
      <Dialog open={!!deleteGroupTarget} onOpenChange={() => setDeleteGroupTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa nhóm</DialogTitle>
            <DialogDescription>
              Xóa nhóm <strong>&quot;{deleteGroupTarget?.name}&quot;</strong> sẽ đồng thời xóa tất cả dịch vụ trong nhóm này. Hành động không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteGroupTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteGroupConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item: Add/Edit */}
      <Dialog open={itemDialog.open} onOpenChange={(open) => setItemDialog((s) => ({ ...s, open }))}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{itemDialog.target ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}</DialogTitle>
          </DialogHeader>
          <VisaServiceItemForm
            groups={groups}
            defaultValues={
              itemDialog.target
                ? {
                    groupId: itemDialog.target.groupId,
                    serviceName: itemDialog.target.serviceName,
                    priceUsd: itemDialog.target.priceUsd,
                    priceUnit: itemDialog.target.priceUnit,
                    description: itemDialog.target.description,
                    pickupLocation: itemDialog.target.pickupLocation,
                  }
                : undefined
            }
            onSubmit={handleItemSubmit}
            onCancel={() => setItemDialog({ open: false, target: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Item: Delete */}
      <Dialog open={!!deleteItemTarget} onOpenChange={() => setDeleteItemTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa dịch vụ</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa dịch vụ <strong>&quot;{deleteItemTarget?.serviceName}&quot;</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteItemTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteItemConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
