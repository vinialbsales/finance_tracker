import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { CategoryTotal } from "../../lib/summary";
import { formatCurrency, formatPercent } from "../../lib/format";
import { CategoryDot } from "../ui/CategoryDot";

// Neutral ink for axis/labels: text never takes the series color.
const MUTED_TEXT = "#71717a"; // zinc-500
const LABEL_TEXT = "#52525b"; // zinc-600
const HOVER_BAND = "#f4f4f5"; // zinc-100

const ROW_HEIGHT = 40;
const MAX_NAME_LENGTH = 16;

function truncate(name: string) {
  return name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH - 1)}…` : name;
}

function CategoryTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as CategoryTotal;

  return (
    <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs">
      <div className="flex items-center gap-2 font-medium text-zinc-900">
        <CategoryDot color={row.color} />
        {row.name}
      </div>
      <p className="mt-1 tabular-nums text-zinc-600">
        {formatCurrency(row.total)} <span className="text-zinc-400">· {formatPercent(row.share)}</span>
      </p>
    </div>
  );
}

// Horizontal bars sorted by total: magnitude reads along one baseline and the
// category name sits on the axis, so identity never depends on color alone.
// Each bar is filled with its category's own color (gray when it has none).
export function ExpensesByCategoryChart({ data }: { data: CategoryTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={data.length * ROW_HEIGHT + 8}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 96, bottom: 4, left: 0 }}>
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="name"
          width={124}
          axisLine={false}
          tickLine={false}
          tick={{ fill: MUTED_TEXT, fontSize: 12 }}
          tickFormatter={truncate}
        />
        <Tooltip cursor={{ fill: HOVER_BAND }} content={CategoryTooltip} />
        <Bar dataKey="total" barSize={20} radius={[0, 4, 4, 0]}>
          {data.map((row) => (
            <Cell key={row.categoryId} fill={row.color} />
          ))}
          <LabelList
            dataKey="total"
            position="right"
            offset={8}
            formatter={(value) => formatCurrency(Number(value))}
            style={{ fill: LABEL_TEXT, fontSize: 12, fontVariantNumeric: "tabular-nums" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
