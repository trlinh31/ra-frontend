import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Bus, FolderPlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import TransportKmGroupForm from "../components/TransportKmGroupForm";
import TransportKmItemForm from "../components/TransportKmItemForm";
import TransportRouteItemForm from "../components/TransportRouteItemForm";
import { transportMockStore } from "../data/transportation.mock-store";
import type { TransportKmGroupFormValues, TransportKmItemFormValues } from "../schemas/transport-km.schema";
import type { TransportRouteItemFormValues } from "../schemas/transport-route.schema";
import type { TransportKmGroup, TransportKmItem, TransportRouteItem, VehicleSeat } from "../types/transportation.type";
import { VEHICLE_SEAT_OPTIONS } from "../types/transportation.type";

// ─── Helpers ───────────────────────────────────────────────
function routeItemToFormDefaults(item: TransportRouteItem): Partial<TransportRouteItemFormValues> {
  return {
    route: item.route,
    price_4: item.prices[4],
    price_7: item.prices[7],
    price_16: item.prices[16],
    price_29: item.prices[29],
    price_35: item.prices[35],
    price_45: item.prices[45],
  };
}

function formValuesToRouteData(values: TransportRouteItemFormValues): Omit<TransportRouteItem, "id"> {
  const prices: Partial<Record<VehicleSeat, number>> = {};
  for (const seat of VEHICLE_SEAT_OPTIONS) {
    const val = values[`price_${seat}` as keyof TransportRouteItemFormValues];
    if (typeof val === "number") prices[seat] = val;
  }
  return { route: values.route, prices };
}

// ─── Component ─────────────────────────────────────────────
export default function TransportationListPage() {
  // ── KM state ──
  const [kmGroups, setKmGroups] = useState<TransportKmGroup[]>(() => transportMockStore.getAllGroups());
  const [kmItems, setKmItems] = useState<TransportKmItem[]>(() => transportMockStore.getAllKmItems());

  const [groupDialog, setGroupDialog] = useState<{ open: boolean; target: TransportKmGroup | null }>({
    open: false,
    target: null,
  });
  const [kmItemDialog, setKmItemDialog] = useState<{ open: boolean; target: TransportKmItem | null }>({
    open: false,
    target: null,
  });
  const [deleteGroupTarget, setDeleteGroupTarget] = useState<TransportKmGroup | null>(null);
  const [deleteKmItemTarget, setDeleteKmItemTarget] = useState<TransportKmItem | null>(null);

  // ── Route state ──
  const [routeItems, setRouteItems] = useState<TransportRouteItem[]>(() => transportMockStore.getAllRouteItems());
  const [routeDialog, setRouteDialog] = useState<{ open: boolean; target: TransportRouteItem | null }>({
    open: false,
    target: null,
  });
  const [deleteRouteTarget, setDeleteRouteTarget] = useState<TransportRouteItem | null>(null);

  // ── KM display rows (flatten groups + items) ──
  const kmDisplayRows = useMemo(() => {
    type Row = { type: "group"; group: TransportKmGroup } | { type: "item"; item: TransportKmItem; stt: number };
    const rows: Row[] = [];
    for (const group of kmGroups) {
      rows.push({ type: "group", group });
      const children = kmItems.filter((i) => i.groupId === group.id);
      children.forEach((item, idx) => rows.push({ type: "item", item, stt: idx + 1 }));
    }
    return rows;
  }, [kmGroups, kmItems]);

  // ── Columns that have at least one price ──
  const activeSeats = useMemo(() => VEHICLE_SEAT_OPTIONS.filter((seat) => routeItems.some((r) => r.prices[seat] != null)), [routeItems]);

  // ── Group handlers ──
  const handleGroupSubmit = (values: TransportKmGroupFormValues) => {
    if (groupDialog.target) transportMockStore.updateGroup(groupDialog.target.id, values);
    else transportMockStore.createGroup(values);
    setKmGroups(transportMockStore.getAllGroups());
    setGroupDialog({ open: false, target: null });
  };

  const handleDeleteGroupConfirm = () => {
    if (!deleteGroupTarget) return;
    transportMockStore.deleteGroup(deleteGroupTarget.id);
    setKmGroups(transportMockStore.getAllGroups());
    setKmItems(transportMockStore.getAllKmItems());
    setDeleteGroupTarget(null);
  };

  // ── KM item handlers ──
  const handleKmItemSubmit = (values: TransportKmItemFormValues) => {
    if (kmItemDialog.target) transportMockStore.updateKmItem(kmItemDialog.target.id, values);
    else transportMockStore.createKmItem(values);
    setKmItems(transportMockStore.getAllKmItems());
    setKmItemDialog({ open: false, target: null });
  };

  const handleDeleteKmItemConfirm = () => {
    if (!deleteKmItemTarget) return;
    transportMockStore.deleteKmItem(deleteKmItemTarget.id);
    setKmItems(transportMockStore.getAllKmItems());
    setDeleteKmItemTarget(null);
  };

  // ── Route handlers ──
  const handleRouteSubmit = (values: TransportRouteItemFormValues) => {
    const data = formValuesToRouteData(values);
    if (routeDialog.target) transportMockStore.updateRouteItem(routeDialog.target.id, data);
    else transportMockStore.createRouteItem(data);
    setRouteItems(transportMockStore.getAllRouteItems());
    setRouteDialog({ open: false, target: null });
  };

  const handleDeleteRouteConfirm = () => {
    if (!deleteRouteTarget) return;
    transportMockStore.deleteRouteItem(deleteRouteTarget.id);
    setRouteItems(transportMockStore.getAllRouteItems());
    setDeleteRouteTarget(null);
  };

  return (
    <div className='space-y-8'>
      {/* Page header */}
      <div className='flex items-center gap-3'>
        <Bus className='w-6 h-6 text-primary' />
        <div>
          <h1 className='font-bold text-2xl tracking-tight'>Quản lý vận chuyển</h1>
          <p className='text-muted-foreground text-sm'>Bảng giá dịch vụ vận chuyển theo KM và theo lộ trình</p>
        </div>
      </div>

      {/* ════════════════ SECTION 1: TÍNH THEO KM ════════════════ */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center bg-yellow-400/20 dark:bg-yellow-500/10 px-4 py-2 rounded-md'>
          <h2 className='font-semibold text-yellow-800 dark:text-yellow-400'>Tính theo KM</h2>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setGroupDialog({ open: true, target: null })}>
              <FolderPlus className='w-4 h-4' />
              Thêm nhóm
            </Button>
            <Button onClick={() => setKmItemDialog({ open: true, target: null })} disabled={kmGroups.length === 0}>
              <Plus className='w-4 h-4' />
              Thêm lịch trình
            </Button>
          </div>
        </div>

        <div className='border rounded-md'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-16 text-center'>STT</TableHead>
                <TableHead>Lịch trình</TableHead>
                <TableHead className='w-28 text-center'>Km</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className='w-24 text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kmDisplayRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='py-10 text-muted-foreground text-center'>
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {kmDisplayRows.map((row) =>
                row.type === "group" ? (
                  <TableRow key={`group-${row.group.id}`} className='bg-muted/40 hover:bg-muted/50'>
                    <TableCell className='font-bold text-primary text-center'>{row.group.code}</TableCell>
                    <TableCell colSpan={2} className='font-bold text-primary uppercase'>
                      {row.group.title}
                    </TableCell>
                    <TableCell />
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
                    <TableCell className='text-muted-foreground text-center'>{row.stt}</TableCell>
                    <TableCell className='text-sm'>{row.item.schedule}</TableCell>
                    <TableCell className='text-sm text-center'>{row.item.km} km</TableCell>
                    <TableCell className='text-muted-foreground text-sm'>{row.item.notes || "—"}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end items-center gap-1'>
                        <Button variant='ghost' size='icon' onClick={() => setKmItemDialog({ open: true, target: row.item })}>
                          <Pencil className='w-3.5 h-3.5' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-destructive hover:text-destructive'
                          onClick={() => setDeleteKmItemTarget(row.item)}>
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
      </div>

      {/* ════════════════ SECTION 2: TÍNH THEO LỘ TRÌNH ════════════════ */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center bg-yellow-400/20 dark:bg-yellow-500/10 px-4 py-2 rounded-md'>
          <h2 className='font-semibold text-yellow-800 dark:text-yellow-400'>Tính theo lộ trình</h2>
          <Button onClick={() => setRouteDialog({ open: true, target: null })}>
            <Plus className='w-4 h-4' />
            Thêm lộ trình
          </Button>
        </div>

        <div className='border rounded-md'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-14 text-center'>STT</TableHead>
                <TableHead>Lộ trình</TableHead>
                {VEHICLE_SEAT_OPTIONS.map((seat) => (
                  <TableHead key={seat} className='text-xs text-right'>
                    {seat} CHỖ
                    <br />
                    <span className='font-normal text-muted-foreground'>(Nghìn VNĐ)</span>
                  </TableHead>
                ))}
                <TableHead className='w-24 text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routeItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={VEHICLE_SEAT_OPTIONS.length + 3} className='py-10 text-muted-foreground text-center'>
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {routeItems.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell className='text-muted-foreground text-center'>{idx + 1}</TableCell>
                  <TableCell className='font-medium text-sm'>{item.route}</TableCell>
                  {VEHICLE_SEAT_OPTIONS.map((seat) => (
                    <TableCell key={seat} className='text-sm text-right'>
                      {item.prices[seat] != null ? item.prices[seat]!.toLocaleString("vi-VN") : <span className='text-muted-foreground'>—</span>}
                    </TableCell>
                  ))}
                  <TableCell className='text-right'>
                    <div className='flex justify-end items-center gap-1'>
                      <Button variant='ghost' size='icon' onClick={() => setRouteDialog({ open: true, target: item })}>
                        <Pencil className='w-3.5 h-3.5' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:text-destructive'
                        onClick={() => setDeleteRouteTarget(item)}>
                        <Trash2 className='w-3.5 h-3.5' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ════════════════ DIALOGS ════════════════ */}

      {/* KM Group: Add / Edit */}
      <Dialog open={groupDialog.open} onOpenChange={(open) => setGroupDialog((s) => ({ ...s, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{groupDialog.target ? "Chỉnh sửa nhóm" : "Thêm nhóm tuyến đường"}</DialogTitle>
          </DialogHeader>
          <TransportKmGroupForm
            defaultValues={groupDialog.target ?? undefined}
            onSubmit={handleGroupSubmit}
            onCancel={() => setGroupDialog({ open: false, target: null })}
          />
        </DialogContent>
      </Dialog>

      {/* KM Group: Delete */}
      <Dialog open={!!deleteGroupTarget} onOpenChange={() => setDeleteGroupTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa nhóm</DialogTitle>
            <DialogDescription>
              Xóa nhóm{" "}
              <strong>
                {deleteGroupTarget?.code} – {deleteGroupTarget?.title}
              </strong>{" "}
              sẽ đồng thời xóa tất cả lịch trình thuộc nhóm này. Hành động không thể hoàn tác.
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

      {/* KM Item: Add / Edit */}
      <Dialog open={kmItemDialog.open} onOpenChange={(open) => setKmItemDialog((s) => ({ ...s, open }))}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{kmItemDialog.target ? "Chỉnh sửa lịch trình" : "Thêm lịch trình"}</DialogTitle>
          </DialogHeader>
          <TransportKmItemForm
            groups={kmGroups}
            defaultValues={
              kmItemDialog.target
                ? {
                    groupId: kmItemDialog.target.groupId,
                    schedule: kmItemDialog.target.schedule,
                    km: kmItemDialog.target.km,
                    notes: kmItemDialog.target.notes,
                  }
                : undefined
            }
            onSubmit={handleKmItemSubmit}
            onCancel={() => setKmItemDialog({ open: false, target: null })}
          />
        </DialogContent>
      </Dialog>

      {/* KM Item: Delete */}
      <Dialog open={!!deleteKmItemTarget} onOpenChange={() => setDeleteKmItemTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa lịch trình</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa lịch trình <strong>&quot;{deleteKmItemTarget?.schedule}&quot;</strong>? Hành động không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteKmItemTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteKmItemConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route Item: Add / Edit */}
      <Dialog open={routeDialog.open} onOpenChange={(open) => setRouteDialog((s) => ({ ...s, open }))}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{routeDialog.target ? "Chỉnh sửa lộ trình" : "Thêm lộ trình"}</DialogTitle>
          </DialogHeader>
          <TransportRouteItemForm
            defaultValues={routeDialog.target ? routeItemToFormDefaults(routeDialog.target) : undefined}
            onSubmit={handleRouteSubmit}
            onCancel={() => setRouteDialog({ open: false, target: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Route Item: Delete */}
      <Dialog open={!!deleteRouteTarget} onOpenChange={() => setDeleteRouteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa lộ trình</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa lộ trình <strong>&quot;{deleteRouteTarget?.route}&quot;</strong>? Hành động không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteRouteTarget(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteRouteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
