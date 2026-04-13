import { SERVICE_TYPE_CONFIG, type Day } from "@/modules/tour/day/types/day.type";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";

interface DayServicesTableProps {
  item: Day;
}

export default function DayServicesTable({ item }: DayServicesTableProps) {
  if (!item.services.length) {
    return <p className='px-4 py-3 text-muted-foreground text-sm italic'>Chưa có dịch vụ nào.</p>;
  }

  return (
    <div className='px-4 py-3'>
      <table className='w-full text-sm border-collapse'>
        <thead>
          <tr className='bg-muted text-muted-foreground'>
            <th className='px-3 py-2 border font-medium text-left'>STT</th>
            <th className='px-3 py-2 border font-medium text-left'>Loại dịch vụ</th>
            <th className='px-3 py-2 border font-medium text-left'>Tên dịch vụ</th>
            <th className='px-3 py-2 border font-medium text-right'>Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          {item.services.map((svc, idx) => {
            const config = SERVICE_TYPE_CONFIG[svc.serviceType];
            return (
              <tr key={svc.id} className='hover:bg-muted/40'>
                <td className='px-3 py-2 border text-center'>{idx + 1}</td>
                <td className='px-3 py-2 border'>
                  <span className='flex items-center gap-1.5'>
                    {config?.icon}
                    {config?.label ?? svc.serviceType}
                  </span>
                </td>
                <td className='px-3 py-2 border'>{svc.name}</td>
                <td className='px-3 py-2 border font-medium text-green-600 text-right'>
                  {svc.unitPrice ? (
                    `${formatNumberVN(svc.unitPrice)} ${svc.currency}`
                  ) : (
                    <span className='font-normal text-muted-foreground italic'>Chưa có</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className='bg-muted font-semibold'>
            <td colSpan={3} className='px-3 py-2 border text-right'>
              Tổng cộng
            </td>
            <td className='px-3 py-2 border text-green-700 text-right'>
              {(() => {
                const byCurrency = item.services.reduce<Record<string, number>>((acc, svc) => {
                  if (!svc.unitPrice || !svc.currency) return acc;
                  acc[svc.currency] = (acc[svc.currency] ?? 0) + svc.unitPrice;
                  return acc;
                }, {});
                const entries = Object.entries(byCurrency);
                if (!entries.length) return <span className='font-normal text-muted-foreground italic'>—</span>;
                return entries.map(([cur, total]) => `${formatNumberVN(total)} ${cur}`).join(" + ");
              })()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
