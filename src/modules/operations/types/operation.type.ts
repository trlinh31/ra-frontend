export type ServiceExecutionStatus = "pending" | "confirmed" | "done" | "issue";

export type OperationLogType = "note" | "incident" | "change";

export type OperationLog = {
  id: string;
  confirmedTourId: string;
  type: OperationLogType;
  content: string;
  createdBy: string;
  createdAt: string; // ISO datetime
};
