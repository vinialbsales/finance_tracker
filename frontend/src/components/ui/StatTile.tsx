import type { ReactNode } from "react";

type StatTileProps = {
  label: string;
  value: string;
  hint?: string;
  marker?: ReactNode;
};

export function StatTile({ label, value, hint, marker }: StatTileProps) {
  return (
    <div className="px-5 py-5">
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        {marker}
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}
