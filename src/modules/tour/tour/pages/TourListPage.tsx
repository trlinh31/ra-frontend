import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Compass, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PATHS } from "@/app/routes/route.constant";
import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import { tourMockStore } from "../data/tour.mock-store";
import type { Tour } from "../types/tour.type";

export default function TourListPage() {
  const navigate = useNavigate();
  const allDays = dayMockStore.getAll();
  const [tours, setTours] = useState<Tour[]>(() => tourMockStore.getAll());
  const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    tourMockStore.delete(deleteTarget.id);
    setTours(tourMockStore.getAll());
    setDeleteTarget(null);
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Compass className='w-6 h-6 text-primary' />
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>Quản lý Tour</h1>
            <p className='text-muted-foreground text-sm'>Tạo và quản lý các chương trình tour từ ngày hành trình</p>
          </div>
        </div>
        <Button onClick={() => navigate(PATHS.TOUR.TOUR_CREATE)}>
          <Plus className='w-4 h-4' />
          Tạo tour mới
        </Button>
      </div>

      {/* Table */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16 text-center'>STT</TableHead>
              <TableHead className='w-36'>Mã tour</TableHead>
              <TableHead>Tên tour</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className='w-24 text-center'>Số ngày</TableHead>
              <TableHead>Hành trình</TableHead>
              <TableHead className='w-24 text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className='py-10 text-muted-foreground text-center'>
                  Chưa có tour nào
                </TableCell>
              </TableRow>
            )}
            {tours.map((tour, idx) => {
              const dayTitles = tour.days
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((td) => allDays.find((d) => d.id === td.dayId)?.title ?? td.dayId);

              return (
                <TableRow key={tour.id}>
                  <TableCell className='text-muted-foreground text-center'>{idx + 1}</TableCell>
                  <TableCell>
                    <Badge variant='outline' className='font-mono'>
                      {tour.code}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-medium'>{tour.name}</TableCell>
                  <TableCell className='max-w-xs text-muted-foreground text-sm truncate'>{tour.description || "—"}</TableCell>
                  <TableCell className='text-center'>
                    <Badge variant='secondary'>{tour.days.length} ngày</Badge>
                  </TableCell>
                  <TableCell className='max-w-sm'>
                    <div className='flex flex-wrap gap-1'>
                      {dayTitles.map((title, i) => (
                        <span key={i} className='inline-flex items-center gap-1 text-xs'>
                          <span className='bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground'>N{i + 1}</span>
                          <span className='text-foreground'>{title}</span>
                          {i < dayTitles.length - 1 && <span className='text-muted-foreground'>→</span>}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end items-center gap-1'>
                      <Button variant='ghost' size='icon' onClick={() => navigate(PATHS.TOUR.TOUR_EDIT.replace(":id", tour.id))}>
                        <Pencil className='w-4 h-4' />
                      </Button>
                      <Button variant='ghost' size='icon' className='text-destructive hover:text-destructive' onClick={() => setDeleteTarget(tour)}>
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá tour</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xoá tour <strong>{deleteTarget?.name}</strong>? Không thể hoàn tác.
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
