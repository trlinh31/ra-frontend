import { PATHS } from "@/app/routes/route.constant";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Hotel as HotelIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelMockStore } from "../data/hotel.mock-store";
import { ROOM_TYPE_LABELS, type Hotel } from "../types/hotel.type";

export default function HotelListPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>(() => hotelMockStore.getAll());
  const [deleteTarget, setDeleteTarget] = useState<Hotel | null>(null);

  function handleEdit(hotel: Hotel) {
    navigate(`${PATHS.MASTER_DATA.HOTEL}/${hotel.id}`);
  }

  function handleAdd() {
    navigate(PATHS.MASTER_DATA.HOTEL_CREATE);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    hotelMockStore.delete(deleteTarget.id);
    setHotels(hotelMockStore.getAll());
    setDeleteTarget(null);
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <HotelIcon className='w-6 h-6 text-primary' />
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>Quản lý phòng khách sạn</h1>
            <p className='text-muted-foreground text-sm'>Danh sách các loại phòng trong hệ thống</p>
          </div>
        </div>

        <Button onClick={handleAdd}>
          <Plus className='mr-2 w-4 h-4' />
          Thêm phòng mới
        </Button>
      </div>

      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại phòng</TableHead>
              <TableHead className='text-center'>Số phòng</TableHead>
              <TableHead>Khoảng giá</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className='text-center'>Trạng thái</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='py-10 text-muted-foreground text-center'>
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {hotels.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell className='font-medium'>{ROOM_TYPE_LABELS[hotel.roomType]}</TableCell>
                <TableCell className='text-center'>{hotel.roomCount}</TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    {hotel.priceRanges.map((range, idx) => (
                      <div key={idx} className='text-sm'>
                        <span className='text-muted-foreground'>
                          {format(range.startDate, "dd/MM/yyyy", { locale: vi })}
                          {" – "}
                          {format(range.endDate, "dd/MM/yyyy", { locale: vi })}
                        </span>
                        <span className='ml-2 font-medium text-foreground'>{range.price.toLocaleString("vi-VN")}₫</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className='max-w-50 text-muted-foreground text-sm truncate'>{hotel.notes || "—"}</TableCell>
                <TableCell className='text-center'>
                  <Badge variant={hotel.isActive ? "default" : "secondary"}>{hotel.isActive ? "Hoạt động" : "Tạm dừng"}</Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end items-center gap-1'>
                    <Button variant='ghost' size='icon' onClick={() => handleEdit(hotel)}>
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='text-destructive hover:text-destructive' onClick={() => setDeleteTarget(hotel)}>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phòng <strong>{deleteTarget ? ROOM_TYPE_LABELS[deleteTarget.roomType] : ""}</strong> không? Hành động này
              không thể hoàn tác.
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
