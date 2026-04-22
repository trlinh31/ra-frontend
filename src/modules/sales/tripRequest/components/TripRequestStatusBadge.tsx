import { TRIP_REQUEST_STATUS_LABEL } from "../constants/trip-request.constant";
import type { TripRequestStatus } from "../types/trip-request.type";

const STATUS_CLS: Record<TripRequestStatus, string> = {
  new:         "bg-gray-100 text-gray-700",
  assigned:    "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-800",
  converted:   "bg-green-100 text-green-700",
  lost:        "bg-red-100 text-red-700",
  on_hold:     "bg-purple-100 text-purple-700",
};

export default function TripRequestStatusBadge({ status }: { status: TripRequestStatus }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_CLS[status]}`}>
      {TRIP_REQUEST_STATUS_LABEL[status]}
    </span>
  );
}
