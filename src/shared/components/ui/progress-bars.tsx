import { formatNumberVN } from "@/shared/helpers/formatNumberVN";

export interface ProgressBarItem {
  label: string;
  sub?: string;
  value: number;
  total: number;
  color: string;
  currency?: string;
}

interface ProgressBarsProps {
  items: ProgressBarItem[];
}

export function ProgressBars({ items }: ProgressBarsProps) {
  return (
    <div className='space-y-5'>
      {items.map((item, i) => {
        const pct = item.total > 0 ? Math.min((item.value / item.total) * 100, 100) : 0;
        const remaining = item.total - item.value;
        const cur = item.currency ?? "";
        return (
          <div key={i}>
            <div className='flex items-baseline justify-between mb-2'>
              <div>
                <p className='text-sm font-medium'>{item.label}</p>
                {item.sub && <p className='text-xs text-muted-foreground'>{item.sub}</p>}
              </div>
              <span className='text-sm font-bold tabular-nums' style={{ color: item.color }}>
                {Math.round(pct)}%
              </span>
            </div>
            <div className='relative w-full bg-muted rounded-full h-3 overflow-hidden'>
              <div
                className='h-3 rounded-full transition-all duration-500'
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </div>
            <div className='flex justify-between mt-1.5 text-xs'>
              <span className='text-muted-foreground'>
                Đã thực hiện:{" "}
                <span className='font-semibold text-foreground'>
                  {formatNumberVN(item.value)}{cur}
                </span>
              </span>
              <span className='text-muted-foreground'>
                Còn lại:{" "}
                <span className='font-semibold text-foreground'>
                  {formatNumberVN(remaining)}{cur}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
