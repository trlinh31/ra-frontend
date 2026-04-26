import { PATHS } from "@/app/routes/route.constant";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import type { ConfirmedTour } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { SERVICE_TYPE_CONFIG } from "@/modules/tour/day/types/day.type";
import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import AppSelect from "@/shared/components/common/AppSelect";
import PageHeader from "@/shared/components/common/PageHeader";
import Section from "@/shared/components/common/Section";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { cn } from "@/shared/lib/utils";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Flag, MessageSquarePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  OPERATION_LOG_TYPE_CLASS,
  OPERATION_LOG_TYPE_LABEL,
  OPERATION_LOG_TYPE_OPTIONS,
  SERVICE_STATUS_CLASS,
  SERVICE_STATUS_LABEL,
  SERVICE_STATUS_OPTIONS,
} from "../constants/operation.constant";
import { operationLogMockStore } from "../data/operation-log.mock-store";
import type { OperationLogType, ServiceExecutionStatus } from "../types/operation.type";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function StatusPill({
  status,
  serviceId,
  tourId,
  onUpdate,
}: {
  status: ServiceExecutionStatus;
  serviceId: string;
  tourId: string;
  onUpdate: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val: ServiceExecutionStatus) => {
    confirmedTourMockStore.updateServiceStatus(tourId, serviceId, val);
    onUpdate();
    setOpen(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 border rounded-full font-medium text-xs transition-colors",
          SERVICE_STATUS_CLASS[status]
        )}>
        {status === "done" && <CheckCircle2 className='w-3 h-3' />}
        {status === "issue" && <AlertTriangle className='w-3 h-3' />}
        {SERVICE_STATUS_LABEL[status]}
        {open ? <ChevronUp className='w-3 h-3' /> : <ChevronDown className='w-3 h-3' />}
      </button>

      {open && (
        <div className='top-full left-0 z-50 absolute bg-white shadow-lg mt-1 border rounded-lg overflow-hidden'>
          {SERVICE_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value as ServiceExecutionStatus)}
              className={cn("hover:bg-muted px-3 py-2 w-full text-xs text-left transition-colors", status === opt.value && "font-semibold")}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DaySection({
  item,
  tour,
  onUpdate,
  dayIndex,
}: {
  item: Extract<ConfirmedTour["itinerary"][number], { kind: "day" }>;
  tour: ConfirmedTour;
  onUpdate: () => void;
  dayIndex: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const done = item.services.filter((s) => tour.serviceChecklist?.[s.id] === "done").length;
  const issues = item.services.filter((s) => tour.serviceChecklist?.[s.id] === "issue").length;

  return (
    <div className='border rounded-lg'>
      {/* Day header */}
      <button
        className='flex justify-between items-center bg-muted/40 hover:bg-muted/60 px-4 py-3 w-full transition-colors'
        onClick={() => setCollapsed((c) => !c)}>
        <div className='flex items-center gap-3'>
          <span className='bg-primary/10 px-2 py-0.5 rounded font-bold text-primary text-xs'>Ngày {dayIndex + 1}</span>
          <span className='font-medium text-sm text-left'>
            {item.title}
            {item.city && <span className='ml-1.5 font-normal text-muted-foreground'>— {item.city}</span>}
          </span>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex gap-2 text-xs'>
            <span className='text-green-700'>
              {done}/{item.services.length} hoàn thành
            </span>
            {issues > 0 && <span className='text-red-600'>{issues} sự cố</span>}
          </div>
          {collapsed ? <ChevronDown className='w-4 h-4 text-muted-foreground' /> : <ChevronUp className='w-4 h-4 text-muted-foreground' />}
        </div>
      </button>

      {/* Services */}
      {!collapsed && (
        <div className='divide-y'>
          {item.services.length === 0 && <p className='px-4 py-3 text-muted-foreground text-sm italic'>Không có dịch vụ nào.</p>}
          {item.services.map((svc) => {
            const currentStatus = (tour.serviceChecklist?.[svc.id] ?? "pending") as ServiceExecutionStatus;
            const typeConfig = SERVICE_TYPE_CONFIG[svc.serviceType];

            return (
              <div key={svc.id} className='flex flex-wrap justify-between items-center gap-3 px-4 py-3'>
                <div className='flex items-center gap-3 min-w-0'>
                  <span className='text-muted-foreground shrink-0'>{typeConfig?.icon}</span>
                  <div className='min-w-0'>
                    <p className='font-medium text-sm truncate'>{svc.name}</p>
                    <p className='text-muted-foreground text-xs'>{typeConfig?.label}</p>
                  </div>
                </div>
                <StatusPill status={currentStatus} serviceId={svc.id} tourId={tour.id} onUpdate={onUpdate} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function OperationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [tour, setTour] = useState<ConfirmedTour | undefined>(() => {
    if (!id) return undefined;
    const t = confirmedTourMockStore.getById(id);
    if (t) confirmedTourMockStore.initChecklist(t.id);
    return confirmedTourMockStore.getById(id);
  });

  const [logs, setLogs] = useState(() => (id ? operationLogMockStore.getByTourId(id) : []));
  const [logContent, setLogContent] = useState("");
  const [logType, setLogType] = useState<OperationLogType>("note");
  const [logError, setLogError] = useState(false);

  const refresh = () => {
    if (!id) return;
    setTour(confirmedTourMockStore.getById(id));
    setLogs(operationLogMockStore.getByTourId(id));
  };

  if (!tour) {
    return (
      <div className='space-y-4'>
        <p className='text-muted-foreground'>Không tìm thấy tour vận hành.</p>
        <Button variant='outline' onClick={() => navigate(PATHS.OPERATIONS.TOUR_LIST)}>
          Quay lại
        </Button>
      </div>
    );
  }

  const operator = userMockStore.getById(tour.assignedTo ?? "");
  const canComplete = tour.status === "in_operation";

  // Count progress
  let totalSvcs = 0,
    doneSvcs = 0;
  tour.itinerary.forEach((item) => {
    if (item.kind === "day") {
      item.services.forEach((svc) => {
        totalSvcs++;
        if (tour.serviceChecklist?.[svc.id] === "done") doneSvcs++;
      });
    }
  });
  const progressPct = totalSvcs > 0 ? Math.round((doneSvcs / totalSvcs) * 100) : 0;

  const handleComplete = async () => {
    const ok = await confirm({
      description: `Xác nhận hoàn thành tour "${tour.code}"? Trạng thái sẽ chuyển thành "Đã hoàn thành".`,
    });
    if (!ok) return;
    confirmedTourMockStore.updateStatus(tour.id, "completed");
    refresh();
  };

  const handleAddLog = () => {
    if (!logContent.trim()) {
      setLogError(true);
      return;
    }
    operationLogMockStore.add({
      confirmedTourId: tour.id,
      type: logType,
      content: logContent.trim(),
      createdBy: operator?.fullName ?? "Operator",
    });
    setLogContent("");
    setLogError(false);
    refresh();
  };

  const handleDeleteLog = async (logId: string) => {
    const ok = await confirm({ description: "Xóa nhật ký này?" });
    if (!ok) return;
    operationLogMockStore.delete(logId);
    refresh();
  };

  const dayItems = tour.itinerary.filter((item): item is Extract<typeof item, { kind: "day" }> => item.kind === "day");
  const groupItems = tour.itinerary.filter((item) => item.kind === "group_tour");

  return (
    <div className='space-y-6'>
      <PageHeader title={`Vận hành: ${tour.code}`} description={`${tour.customerName} — Khởi hành ${tour.departureDate}`} />

      {/* Status + action bar */}
      <Card>
        <CardContent className='py-4'>
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <Badge
                  variant='outline'
                  className={
                    tour.status === "in_operation" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"
                  }>
                  {tour.status === "in_operation" ? "Đang vận hành" : "Hoàn thành"}
                </Badge>
                {operator && (
                  <span className='text-muted-foreground text-sm'>
                    Operator: <strong>{operator.fullName}</strong>
                  </span>
                )}
              </div>
              {totalSvcs > 0 && (
                <div className='flex items-center gap-3'>
                  <div className='bg-gray-100 rounded-full w-48 h-2 overflow-hidden'>
                    <div className='bg-green-500 rounded-full h-2 transition-all' style={{ width: `${progressPct}%` }} />
                  </div>
                  <span className='font-medium text-sm'>
                    {doneSvcs}/{totalSvcs} dịch vụ hoàn thành ({progressPct}%)
                  </span>
                </div>
              )}
            </div>
            {canComplete && (
              <Button className='bg-blue-600 hover:bg-blue-700' onClick={handleComplete}>
                <Flag className='mr-2 w-4 h-4' />
                Hoàn thành Tour
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <div className='gap-4 grid grid-cols-1 md:grid-cols-3'>
        <InfoItem label='Tên đoàn' value={tour.customerName} />
        <InfoItem label='Số khách' value={`${tour.numberOfPeople} người`} />
        <InfoItem label='Ngày khởi hành' value={tour.departureDate} />
        {tour.tourTemplateName && <InfoItem label='Tour mẫu' value={tour.tourTemplateName} />}
        {tour.note && <InfoItem label='Yêu cầu đặc biệt' value={tour.note} className='md:col-span-2' />}
      </div>

      {/* Checklist */}
      <Section title='Lịch trình & Kiểm tra dịch vụ'>
        <div className='space-y-3'>
          {dayItems.length === 0 && groupItems.length === 0 && (
            <p className='text-muted-foreground text-sm italic'>Tour không có lịch trình chi tiết.</p>
          )}

          {dayItems.map((item, idx) => (
            <DaySection key={idx} item={item} tour={tour} onUpdate={refresh} dayIndex={idx} />
          ))}

          {groupItems.length > 0 && (
            <div className='space-y-2 p-4 border rounded-lg'>
              <p className='font-medium text-muted-foreground text-sm'>Dịch vụ nhóm (Group Tour)</p>
              {groupItems.map((item, idx) =>
                item.kind === "group_tour" ? (
                  <div key={idx} className='flex justify-between items-center text-sm'>
                    <span>{item.name}</span>
                    <span className='text-muted-foreground'>
                      {item.unitPrice.toLocaleString("vi-VN")} {item.currency}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Operation Logs */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <MessageSquarePlus className='w-4 h-4 text-muted-foreground' />
            <CardTitle className='text-base'>Nhật ký vận hành</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Add log form */}
          {tour.status === "in_operation" && (
            <div className='space-y-3 bg-muted/30 p-4 border rounded-lg'>
              <div className='flex items-center gap-3'>
                <div className='w-36 shrink-0'>
                  <AppSelect
                    options={OPERATION_LOG_TYPE_OPTIONS}
                    value={logType}
                    onChange={(v) => setLogType(v as OperationLogType)}
                    placeholder='Loại'
                  />
                </div>
                <span className='text-muted-foreground text-sm'>Thêm nhật ký mới</span>
              </div>
              <Textarea
                rows={3}
                placeholder='Nhập nội dung ghi chú, sự cố, hoặc thay đổi...'
                value={logContent}
                onChange={(e) => {
                  setLogContent(e.target.value);
                  setLogError(false);
                }}
                className={logError ? "border-red-400" : ""}
              />
              {logError && <p className='text-red-500 text-xs'>Vui lòng nhập nội dung.</p>}
              <div className='flex justify-end'>
                <Button size='sm' onClick={handleAddLog}>
                  Lưu nhật ký
                </Button>
              </div>
            </div>
          )}

          {/* Log list */}
          {logs.length === 0 ? (
            <p className='text-muted-foreground text-sm italic'>Chưa có nhật ký nào.</p>
          ) : (
            <div className='space-y-3'>
              {logs.map((log) => (
                <div key={log.id} className='group flex gap-3'>
                  <div className='flex flex-col items-center'>
                    <div
                      className={cn(
                        "mt-1 rounded-full w-2 h-2 shrink-0",
                        log.type === "incident" ? "bg-red-500" : log.type === "change" ? "bg-amber-500" : "bg-gray-400"
                      )}
                    />
                    <div className='flex-1 bg-gray-200 mt-1 w-px' />
                  </div>
                  <div className='flex-1 pb-3'>
                    <div className='flex justify-between items-start gap-2'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className={cn("px-2 py-0.5 rounded-full font-medium text-xs", OPERATION_LOG_TYPE_CLASS[log.type])}>
                          {OPERATION_LOG_TYPE_LABEL[log.type]}
                        </span>
                        <span className='text-muted-foreground text-xs'>
                          {log.createdBy} · {new Date(log.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      {tour.status === "in_operation" && (
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className='opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity'>
                          <Trash2 className='w-3.5 h-3.5' />
                        </button>
                      )}
                    </div>
                    <p className='mt-1.5 text-sm'>{log.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />
      <div>
        <Button variant='outline' size='sm' onClick={() => navigate(PATHS.OPERATIONS.TOUR_LIST)}>
          ← Quay lại danh sách
        </Button>
      </div>
    </div>
  );
}

function InfoItem({ label, value, className }: { label: string; value?: string; className?: string }) {
  return (
    <div className={cn("bg-muted/30 p-3 rounded-lg", className)}>
      <p className='mb-0.5 text-muted-foreground text-xs'>{label}</p>
      <p className='font-medium text-sm'>{value ?? "—"}</p>
    </div>
  );
}
