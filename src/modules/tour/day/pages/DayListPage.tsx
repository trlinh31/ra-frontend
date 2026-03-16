import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PATHS } from "@/app/routes/route.constant";
import { dayMockStore } from "../data/day.mock-store";
import type { Day } from "../types/day.type";

export default function DayListPage() {
  const navigate = useNavigate();
  const [days, setDays] = useState<Day[]>(() => dayMockStore.getAll());
  const [deleteTarget, setDeleteTarget] = useState<Day | null>(null);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    dayMockStore.delete(deleteTarget.id);
    setDays(dayMockStore.getAll());
    setDeleteTarget(null);
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <CalendarDays className='w-6 h-6 text-primary' />
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>Ngày hành trình</h1>
            <p className='text-muted-foreground text-sm'>Quản lý template các ngày trong tour</p>
          </div>
        </div>
        <Button onClick={() => navigate(PATHS.TOUR.DAY_CREATE)}>
          <Plus className='w-4 h-4' />
          Thêm ngày
        </Button>
      </div>

      {/* Table */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16 text-center'>STT</TableHead>
              <TableHead className='w-28'>Mã ngày</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className='w-28 text-center'>Số dịch vụ</TableHead>
              <TableHead className='w-24 text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='py-10 text-muted-foreground text-center'>
                  Chưa có ngày hành trình nào
                </TableCell>
              </TableRow>
            )}
            {days.map((day, idx) => (
              <TableRow key={day.id}>
                <TableCell className='text-muted-foreground text-center'>{idx + 1}</TableCell>
                <TableCell>
                  <Badge variant='outline' className='font-mono'>
                    {day.code}
                  </Badge>
                </TableCell>
                <TableCell className='font-medium'>{day.title}</TableCell>
                <TableCell className='max-w-xs text-muted-foreground text-sm truncate'>{day.description || "—"}</TableCell>
                <TableCell className='text-center'>
                  <Badge variant='secondary'>{day.services.length} dịch vụ</Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end items-center gap-1'>
                    <Button variant='ghost' size='icon' onClick={() => navigate(PATHS.TOUR.DAY_EDIT.replace(":id", day.id))}>
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='text-destructive hover:text-destructive' onClick={() => setDeleteTarget(day)}>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá ngày hành trình</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xoá ngày <strong>{deleteTarget?.title}</strong>? Không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteConfirm}>
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
