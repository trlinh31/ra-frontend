export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  total: number;
  centerLabel?: string;
}

export function DonutChart({ data, total, centerLabel = "tổng" }: DonutChartProps) {
  const r = 34;
  const circ = 2 * Math.PI * r;

  let cumulative = 0;
  const slices = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const dash = (d.value / total) * circ;
      const slice = { ...d, dash, offset: -cumulative };
      cumulative += dash;
      return slice;
    });

  if (total === 0) {
    return (
      <div className='flex h-36 items-center justify-center text-sm text-muted-foreground'>
        Chưa có dữ liệu
      </div>
    );
  }

  return (
    <div className='flex items-center gap-5'>
      <svg viewBox='0 0 100 100' className='w-28 h-28 shrink-0'>
        <circle cx='50' cy='50' r={r} fill='none' stroke='currentColor' strokeWidth={13} className='text-muted/60' />
        <g transform='rotate(-90 50 50)'>
          {slices.map((s, i) => (
            <circle
              key={i}
              cx='50'
              cy='50'
              r={r}
              fill='none'
              stroke={s.color}
              strokeWidth={13}
              strokeDasharray={`${s.dash} ${circ}`}
              strokeDashoffset={s.offset}
              strokeLinecap='butt'
            />
          ))}
        </g>
        <text x='50' y='45' textAnchor='middle' fontSize='20' fontWeight='700' fill='currentColor'>
          {total}
        </text>
        <text x='50' y='58' textAnchor='middle' fontSize='8.5' fill='currentColor' opacity='0.5'>
          {centerLabel}
        </text>
      </svg>

      <div className='flex-1 space-y-1.5 min-w-0'>
        {slices.map((s, i) => (
          <div key={i} className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-1.5 min-w-0'>
              <div className='w-2.5 h-2.5 rounded-sm shrink-0' style={{ background: s.color }} />
              <span className='text-xs text-muted-foreground truncate'>{s.label}</span>
            </div>
            <span className='text-xs font-semibold tabular-nums shrink-0'>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
