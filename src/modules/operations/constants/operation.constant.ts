import type { ServiceExecutionStatus, OperationLogType } from "../types/operation.type";

export const SERVICE_STATUS_LABEL: Record<ServiceExecutionStatus, string> = {
  pending: "Chưa xử lý",
  confirmed: "Đã xác nhận",
  done: "Hoàn thành",
  issue: "Có vấn đề",
};

export const SERVICE_STATUS_CLASS: Record<ServiceExecutionStatus, string> = {
  pending: "bg-gray-100 text-gray-600 border-gray-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  done: "bg-green-50 text-green-700 border-green-200",
  issue: "bg-red-50 text-red-700 border-red-200",
};

export const SERVICE_STATUS_OPTIONS = (
  Object.entries(SERVICE_STATUS_LABEL) as [ServiceExecutionStatus, string][]
).map(([value, label]) => ({ value, label }));

export const OPERATION_LOG_TYPE_LABEL: Record<OperationLogType, string> = {
  note: "Ghi chú",
  incident: "Sự cố",
  change: "Thay đổi",
};

export const OPERATION_LOG_TYPE_CLASS: Record<OperationLogType, string> = {
  note: "bg-gray-100 text-gray-600",
  incident: "bg-red-100 text-red-700",
  change: "bg-amber-100 text-amber-700",
};

export const OPERATION_LOG_TYPE_OPTIONS = (
  Object.entries(OPERATION_LOG_TYPE_LABEL) as [OperationLogType, string][]
).map(([value, label]) => ({ value, label }));
