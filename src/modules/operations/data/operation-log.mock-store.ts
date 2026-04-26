import type { OperationLog, OperationLogType } from "../types/operation.type";

let _logs: OperationLog[] = [
  {
    id: "log1",
    confirmedTourId: "ct3",
    type: "note",
    content: "Đã xác nhận phòng khách sạn với nhà cung cấp. Yêu cầu phòng hướng biển đã được ghi nhận.",
    createdBy: "Nguyễn Thị Mai",
    createdAt: "2026-04-20T09:15:00",
  },
  {
    id: "log2",
    confirmedTourId: "ct3",
    type: "change",
    content: "Thay đổi xe vận chuyển ngày 2: từ xe 16 chỗ sang xe 29 chỗ do số khách tăng thêm 3 người.",
    createdBy: "Nguyễn Thị Mai",
    createdAt: "2026-04-21T14:30:00",
  },
  {
    id: "log3",
    confirmedTourId: "ct3",
    type: "incident",
    content: "HDV báo cáo: 2 khách bị say sóng khi đi thuyền. Đã hỗ trợ thuốc và nghỉ ngơi tại cabin. Khách đã ổn định.",
    createdBy: "Nguyễn Thị Mai",
    createdAt: "2026-04-22T16:45:00",
  },
];

let _counter = 4;

export const operationLogMockStore = {
  getByTourId: (confirmedTourId: string): OperationLog[] =>
    _logs.filter((l) => l.confirmedTourId === confirmedTourId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  add: (data: { confirmedTourId: string; type: OperationLogType; content: string; createdBy: string }): OperationLog => {
    const log: OperationLog = {
      id: `log${_counter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    _logs = [log, ..._logs];
    return log;
  },

  delete: (id: string): void => {
    _logs = _logs.filter((l) => l.id !== id);
  },
};
