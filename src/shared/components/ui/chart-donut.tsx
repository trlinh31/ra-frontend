import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
};

export function DonutChart({ data, total, centerLabel = "tổng" }: DonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeData = data.filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <div className='flex flex-col justify-center items-center gap-3 py-6'>
        <div className='relative w-45 h-45'>
          <svg viewBox='0 0 180 180' width={180} height={180}>
            <circle cx={90} cy={90} r={70} fill='none' stroke='#f3f4f6' strokeWidth={26} />
          </svg>
          <div className='absolute inset-0 flex flex-col justify-center items-center pointer-events-none'>
            <span className='font-bold text-muted-foreground text-2xl'>0</span>
            <span className='text-muted-foreground text-xs'>{centerLabel}</span>
          </div>
        </div>
        <p className='text-muted-foreground text-xs'>Chưa có dữ liệu</p>
      </div>
    );
  }

  const hovered = hoveredIdx !== null ? activeData[hoveredIdx] : null;
  const displayValue = hovered ? hovered.value : total;
  const displayLabel = hovered ? hovered.label : centerLabel;

  return (
    <div className='flex flex-col items-center gap-3 w-full'>
      <div className='relative w-45 h-45'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={activeData}
              cx='50%'
              cy='50%'
              innerRadius={44}
              outerRadius={70}
              dataKey='value'
              nameKey='label'
              paddingAngle={activeData.length > 1 ? 2 : 0}
              startAngle={90}
              endAngle={-270}
              onMouseEnter={(_, index) => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}>
              {activeData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  opacity={hoveredIdx !== null && hoveredIdx !== index ? 0.55 : 1}
                  style={{ cursor: "pointer", outline: "none" }}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className='absolute inset-0 flex flex-col justify-center items-center pointer-events-none'>
          <span className='font-bold text-2xl leading-none'>{displayValue}</span>
          <span className='mt-1 text-muted-foreground text-xs'>{displayLabel}</span>
        </div>
      </div>

      {/* Legend */}
      <div className='gap-x-4 gap-y-1.5 grid grid-cols-2 w-full'>
        {activeData.map((s, i) => (
          <div
            key={i}
            className='flex items-center gap-2 cursor-pointer'
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}>
            <span className='rounded-sm w-2.5 h-2.5 shrink-0' style={{ background: s.color }} />
            <span className={`text-xs truncate ${hoveredIdx === i ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {s.label}
              <span className='ml-1 font-semibold text-foreground'>{s.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
