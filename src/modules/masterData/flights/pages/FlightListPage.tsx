import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Pencil, Plane, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import FlightForm from "../components/FlightForm";
import { flightMockStore } from "../data/flight.mock-store";
import type { FlightFormValues } from "../schemas/flight.schema";
import type { Flight } from "../types/flight.type";

export default function FlightListPage() {
  const [flights, setFlights] = useState<Flight[]>(() => flightMockStore.getAll());
  const [dialog, setDialog] = useState<{ open: boolean; target: Flight | null }>({
    open: false,
    target: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Flight | null>(null);

  function handleSubmit(values: FlightFormValues) {
    const data: Omit<Flight, "id"> = {
      route: values.route,
      netRateUsd: values.netRateUsd as number,
      notes: values.notes ?? "",
    };
    if (dialog.target) {
      flightMockStore.update(dialog.target.id, data);
    } else {
      flightMockStore.create(data);
    }
    setFlights(flightMockStore.getAll());
    setDialog({ open: false, target: null });
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    flightMockStore.delete(deleteTarget.id);
    setFlights(flightMockStore.getAll());
    setDeleteTarget(null);
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Plane className='w-6 h-6 text-primary' />
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>Quản lý chuyến bay</h1>
            <p className='text-muted-foreground text-sm'>Danh sách tuyến bay và giá net</p>
          </div>
        </div>
        <Button onClick={() => setDialog({ open: true, target: null })}>
          <Plus className='mr-2 w-4 h-4' />
          Thêm tuyến bay
        </Button>
      </div>

      {/* Table */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16 text-center'>STT</TableHead>
              <TableHead>Tuyến bay</TableHead>
              <TableHead className='w-44 text-right'>Net Rate (USD)</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className='w-24 text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='py-10 text-muted-foreground text-center'>
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {flights.map((flight, idx) => (
              <TableRow key={flight.id}>
                <TableCell className='text-muted-foreground text-center'>{idx + 1}</TableCell>
                <TableCell className='font-medium'>{flight.route}</TableCell>
                <TableCell className='font-semibold text-right'>{flight.netRateUsd}</TableCell>
                <TableCell className='text-muted-foreground text-sm'>{flight.notes || "—"}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end items-center gap-1'>
                    <Button variant='ghost' size='icon' onClick={() => setDialog({ open: true, target: flight })}>
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='text-destructive hover:text-destructive' onClick={() => setDeleteTarget(flight)}>
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
            <DialogTitle>{dialog.target ? "Chỉnh sửa tuyến bay" : "Thêm tuyến bay mới"}</DialogTitle>
          </DialogHeader>
          <FlightForm
            defaultValues={
              dialog.target ? { route: dialog.target.route, netRateUsd: dialog.target.netRateUsd, notes: dialog.target.notes } : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => setDialog({ open: false, target: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá tuyến bay</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xoá tuyến <strong>{deleteTarget?.route}</strong>? Không thể hoàn tác.
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
