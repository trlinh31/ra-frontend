import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import GroupTourForm from "../components/GroupTourForm";
import { groupTourMockStore } from "../data/group-tour.mock-store";
import type { GroupTourFormValues } from "../schemas/group-tour.schema";
import type { GroupTour } from "../types/group-tour.type";

export default function GroupTourListPage() {
  const [tours, setTours] = useState<GroupTour[]>(() => groupTourMockStore.getAll());
  const [dialog, setDialog] = useState<{ open: boolean; target: GroupTour | null }>({
    open: false,
    target: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<GroupTour | null>(null);

  function handleSubmit(values: GroupTourFormValues) {
    if (dialog.target) {
      groupTourMockStore.update(dialog.target.id, values);
    } else {
      groupTourMockStore.create(values);
    }
    setTours(groupTourMockStore.getAll());
    setDialog({ open: false, target: null });
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    groupTourMockStore.delete(deleteTarget.id);
    setTours(groupTourMockStore.getAll());
    setDeleteTarget(null);
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <MapPin className='w-6 h-6 text-primary' />
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>Quản lý tour theo nhóm</h1>
            <p className='text-muted-foreground text-sm'>Danh sách tour theo nhóm và giá hợp đồng</p>
          </div>
        </div>
        <Button onClick={() => setDialog({ open: true, target: null })}>
          <Plus className='mr-2 w-4 h-4' />
          Thêm tour
        </Button>
      </div>

      {/* Table */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16 text-center'>STT</TableHead>
              <TableHead>Tour Name</TableHead>
              <TableHead className='w-52 text-right'>Contract Rate (USD)</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className='w-24 text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='py-10 text-muted-foreground text-center'>
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {tours.map((tour, idx) => (
              <TableRow key={tour.id}>
                <TableCell className='text-muted-foreground text-center'>{idx + 1}</TableCell>
                <TableCell className='font-medium'>{tour.tourName}</TableCell>
                <TableCell className='font-semibold text-right'>{tour.contractRateUsd}</TableCell>
                <TableCell className='text-muted-foreground text-sm'>{tour.notes || "—"}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end items-center gap-1'>
                    <Button variant='ghost' size='icon' onClick={() => setDialog({ open: true, target: tour })}>
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='text-destructive hover:text-destructive' onClick={() => setDeleteTarget(tour)}>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialog.open} onOpenChange={(open) => setDialog((s) => ({ ...s, open }))}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>{dialog.target ? "Chỉnh sửa tour" : "Thêm tour mới"}</DialogTitle>
          </DialogHeader>
          <GroupTourForm
            defaultValues={
              dialog.target
                ? {
                    tourName: dialog.target.tourName,
                    contractRateUsd: dialog.target.contractRateUsd,
                    notes: dialog.target.notes,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => setDialog({ open: false, target: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa tour <strong>&quot;{deleteTarget?.tourName}&quot;</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
