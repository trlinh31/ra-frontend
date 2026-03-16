import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { FolderPlus, Pencil, Plus, Ticket, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import EntranceFeeGroupForm from "../components/EntranceFeeGroupForm";
import EntranceFeeItemForm from "../components/EntranceFeeItemForm";
import { entranceFeeMockStore } from "../data/entrance-fee.mock-store";
import type { EntranceFeeGroupFormValues, EntranceFeeItemFormValues } from "../schemas/entrance-fee.schema";
import type { EntranceFeeGroup, EntranceFeeItem } from "../types/entrance-fee.type";

export default function EntranceFeeListPage() {
  const [groups, setGroups] = useState<EntranceFeeGroup[]>(() => entranceFeeMockStore.getAllGroups());
  const [items, setItems] = useState<EntranceFeeItem[]>(() => entranceFeeMockStore.getAllItems());

  const [groupDialog, setGroupDialog] = useState<{ open: boolean; target: EntranceFeeGroup | null }>({
    open: false,
    target: null,
  });
  const [itemDialog, setItemDialog] = useState<{ open: boolean; target: EntranceFeeItem | null }>({
    open: false,
    target: null,
  });
  const [deleteGroupTarget, setDeleteGroupTarget] = useState<EntranceFeeGroup | null>(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState<EntranceFeeItem | null>(null);

  // Flatten: group header rows + item rows, tracking per-group STT
  type DisplayRow = { type: "group"; group: EntranceFeeGroup } | { type: "item"; item: EntranceFeeItem; stt: number };

  const displayRows = useMemo((): DisplayRow[] => {
    const rows: DisplayRow[] = [];
    for (const group of groups) {
      rows.push({ type: "group", group });
      items.filter((i) => i.groupId === group.id).forEach((item, index) => rows.push({ type: "item", item, stt: index + 1 }));
    }
    return rows;
  }, [groups, items]);

  // ── Group handlers ──
  const handleGroupSubmit = (values: EntranceFeeGroupFormValues) => {
    if (groupDialog.target) {
      entranceFeeMockStore.updateGroup(groupDialog.target.id, { code: values.code, name: values.name ?? "" });
    } else {
      entranceFeeMockStore.createGroup({ code: values.code, name: values.name ?? "" });
    }
    setGroups(entranceFeeMockStore.getAllGroups());
    setGroupDialog({ open: false, target: null });
  };

  const handleDeleteGroupConfirm = () => {
    if (!deleteGroupTarget) return;
    entranceFeeMockStore.deleteGroup(deleteGroupTarget.id);
    setGroups(entranceFeeMockStore.getAllGroups());
    setItems(entranceFeeMockStore.getAllItems());
    setDeleteGroupTarget(null);
  };

  // ── Item handlers ──
  const handleItemSubmit = (values: EntranceFeeItemFormValues) => {
    const data: Omit<EntranceFeeItem, "id"> = {
      groupId: values.groupId,
      serviceName: values.serviceName,
      adultNetRateVnd: values.adultNetRateVnd,
      notes: values.notes ?? "",
    };
    if (itemDialog.target) {
      entranceFeeMockStore.updateItem(itemDialog.target.id, data);
    } else {
      entranceFeeMockStore.createItem(data);
    }
    setItems(entranceFeeMockStore.getAllItems());
    setItemDialog({ open: false, target: null });
  };

  const handleDeleteItemConfirm = () => {
    if (!deleteItemTarget) return;
    entranceFeeMockStore.deleteItem(deleteItemTarget.id);
    setItems(entranceFeeMockStore.getAllItems());
    setDeleteItemTarget(null);
  };

  const formatVnd = (amount?: number) => {
    if (amount == null) return <span className='text-muted-foreground'>—</span>;
    if (amount === 0) return <span className='text-muted-foreground'>FOC</span>;
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <div className='space-y-4'>
      {/* Page header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Ticket className='w-6 h-6 text-primary' />
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>Quản lý phí vào cổng</h1>
            <p className='text-muted-foreground text-sm'>Danh sách phí vào cổng theo nhóm địa điểm</p>
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
              <TableHead className='w-16 text-center'>STT</TableHead>
              <TableHead>Tên dịch vụ</TableHead>
              <TableHead className='w-48 text-right'>Net rate người lớn (VNĐ)</TableHead>
              <TableHead className='w-52'>Ghi chú</TableHead>
              <TableHead className='w-24 text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='py-10 text-muted-foreground text-center'>
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {displayRows.map((row) =>
              row.type === "group" ? (
                <TableRow key={`grp-${row.group.id}`} className='bg-muted/40 hover:bg-muted/50'>
                  <TableCell className='font-bold text-primary text-base text-center' colSpan={1}>
                    {row.group.code}
                  </TableCell>
                  <TableCell colSpan={3} className='font-semibold text-primary'>
                    {row.group.name || ""}
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
                  <TableCell className='text-muted-foreground text-sm text-center'>{row.stt}</TableCell>
                  <TableCell className='font-medium text-sm'>{row.item.serviceName}</TableCell>
                  <TableCell className='text-sm text-right'>{formatVnd(row.item.adultNetRateVnd)}</TableCell>
                  <TableCell className='text-muted-foreground text-sm'>{row.item.notes || "—"}</TableCell>
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
            <DialogTitle>{groupDialog.target ? "Chỉnh sửa nhóm" : "Thêm nhóm"}</DialogTitle>
          </DialogHeader>
          <EntranceFeeGroupForm
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
            <DialogTitle>Xoá nhóm</DialogTitle>
            <DialogDescription>
              Hành động này sẽ xoá nhóm <strong>{deleteGroupTarget?.code}</strong> và toàn bộ dịch vụ bên trong. Không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteGroupTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteGroupConfirm}>
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item: Add/Edit */}
      <Dialog open={itemDialog.open} onOpenChange={(open) => setItemDialog((s) => ({ ...s, open }))}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>{itemDialog.target ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}</DialogTitle>
          </DialogHeader>
          <EntranceFeeItemForm
            defaultValues={
              itemDialog.target
                ? {
                    groupId: itemDialog.target.groupId,
                    serviceName: itemDialog.target.serviceName,
                    adultNetRateVnd: itemDialog.target.adultNetRateVnd,
                    notes: itemDialog.target.notes,
                  }
                : undefined
            }
            groups={groups}
            onSubmit={handleItemSubmit}
            onCancel={() => setItemDialog({ open: false, target: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Item: Delete */}
      <Dialog open={!!deleteItemTarget} onOpenChange={() => setDeleteItemTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá dịch vụ</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xoá <strong>{deleteItemTarget?.serviceName}</strong>? Không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteItemTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteItemConfirm}>
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
