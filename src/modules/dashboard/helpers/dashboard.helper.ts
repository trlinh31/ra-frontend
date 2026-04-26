export function formatDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(iso).getTime() - today.getTime()) / 86_400_000);
}

/** Compact number: 78000000 → "78tr" */
export function compact(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}tỷ`;
  if (v >= 1_000_000) return `${Math.round(v / 1_000_000)}tr`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return String(v);
}
