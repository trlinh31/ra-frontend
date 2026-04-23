import { Card, CardContent } from "@/shared/components/ui/card";
import type React from "react";

interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
  onClick?: () => void;
}

export function StatCard({ icon: Icon, iconColor, iconBg, label, value, sub, subColor, onClick }: StatCardProps) {
  return (
    <Card
      className={onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
      onClick={onClick}>
      <CardContent className='p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <p className='text-sm text-muted-foreground mb-1'>{label}</p>
            <p className='text-2xl font-bold tracking-tight truncate'>{value}</p>
            {sub && <p className={`text-xs mt-1 ${subColor ?? "text-muted-foreground"}`}>{sub}</p>}
          </div>
          <div className={`p-2.5 rounded-lg shrink-0 ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
