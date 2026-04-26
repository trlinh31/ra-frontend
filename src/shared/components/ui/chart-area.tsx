import { Area, CartesianGrid, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface AreaSeries {
  key: string;
  label: string;
  color: string;
  fill: string;
}

export interface AreaDataPoint {
  label: string;
  [key: string]: number | string;
}

interface AreaChartProps {
  data: AreaDataPoint[];
  series: AreaSeries[];
  formatY?: (v: number) => string;
  height?: number;
}

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
};

export function AreaChart({ data, series, formatY = (v) => v.toLocaleString("vi-VN"), height = 210 }: AreaChartProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <RechartsAreaChart data={data} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`area-grad-${s.key}`} x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={s.color} stopOpacity={0.25} />
              <stop offset='95%' stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray='4 3' stroke='#e5e7eb' vertical={false} />
        <XAxis dataKey='label' tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatY} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={44} />
        <Tooltip formatter={(value: unknown) => [formatY(value as number)]} contentStyle={tooltipStyle} />
        {series.map((s) => (
          <Area
            key={s.key}
            type='monotone'
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.5}
            fill={`url(#area-grad-${s.key})`}
            dot={false}
            activeDot={{ r: 4.5, strokeWidth: 2 }}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
