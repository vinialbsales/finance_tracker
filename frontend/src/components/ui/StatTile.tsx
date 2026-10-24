import type { ReactNode } from "react";

type StatTileProps = {
  label: string;
  value: string;
  hint?: string;
  marker?: ReactNode;
};

// One term/value pair: render tiles inside a <dl> so the label is read with its value.
// Amounts can't wrap (Intl puts a no-break space after "R$"), so the value steps down
// a size when the tile itself is narrow, e.g. three columns beside the md sidebar.
export function StatTile({ label, value, hint, marker }: StatTileProps) {
  return (
    <div className="@container min-w-0 px-5 py-5">
      <dt className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        {marker}
        {label}
      </dt>
      <dd className="mt-2 text-xl font-semibold @[10rem]:text-2xl tracking-tight tabular-nums text-zinc-900">{value}</dd>
      {hint && <dd className="mt-1 text-xs text-zinc-500">{hint}</dd>}
    </div>
  );
}
