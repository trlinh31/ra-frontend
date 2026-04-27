export type FollowUpStatus = "pending" | "done";

export type FollowUp = {
  id: string;
  tripRequestId: string;
  /** Ngày & giờ cần follow-up (ISO string: "YYYY-MM-DDTHH:mm") */
  scheduledAt: string;
  /** Nội dung / ghi chú việc cần làm */
  note: string;
  status: FollowUpStatus;
  createdBy: string;
  createdAt: string;
  /** Thời điểm đánh dấu done */
  doneAt?: string;
};
