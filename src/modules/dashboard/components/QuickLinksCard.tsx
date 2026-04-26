import { PATHS } from "@/app/routes/route.constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useNavigate } from "react-router-dom";

const QUICK_LINKS = [
  { label: "Tạo báo giá mới", path: PATHS.SALES.QUOTATION_CREATE, color: "text-sky-600 hover:bg-sky-50 border-sky-200" },
  { label: "Tạo Tour Xác Nhận", path: PATHS.SALES.CONFIRMED_TOUR_CREATE, color: "text-teal-600 hover:bg-teal-50 border-teal-200" },
  { label: "Tạo phiếu thu", path: PATHS.ACCOUNTING.CUSTOMER_PAYMENT_CREATE, color: "text-green-600 hover:bg-green-50 border-green-200" },
  { label: "Tạo phiếu chi", path: PATHS.ACCOUNTING.VENDOR_PAYMENT_CREATE, color: "text-rose-600 hover:bg-rose-50 border-rose-200" },
];

export default function QuickLinksCard() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Truy cập nhanh</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2 pt-0'>
        {QUICK_LINKS.map((item) => (
          <button
            key={item.path}
            className={`w-full text-left text-sm font-medium px-3 py-2 rounded-md border transition-colors cursor-pointer ${item.color}`}
            onClick={() => navigate(item.path)}>
            + {item.label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
