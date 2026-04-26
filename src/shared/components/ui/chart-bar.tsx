import { Bar, CartesianGrid, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface BarGroup {
  label: string;
  [key: string]: number | string;
}

export interface BarSeries {
  key: string;
  label: string;
  color: string;
}

interface BarChartProps {
  data: BarGroup[];
  series: BarSeries[];
  formatY?: (v: number) => string;
  height?: number;
}

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
};

export function BarChart({ data, series, formatY = (v) => v.toLocaleString("vi-VN"), height = 210 }: BarChartProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <RechartsBarChart data={data} margin={{ top: 4, right: 8, left: 4, bottom: 4 }} barCategoryGap='28%' barGap={4}>
        <CartesianGrid strokeDasharray='4 3' stroke='#e5e7eb' vertical={false} />
        <XAxis dataKey='label' tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatY} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={44} />
        <Tooltip formatter={(value: unknown) => [formatY(value as number)]} contentStyle={tooltipStyle} cursor={{ fill: "#f9fafb" }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[3, 3, 0, 0]} maxBarSize={36} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
