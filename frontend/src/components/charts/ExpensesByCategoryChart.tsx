import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LabelProps, TooltipContentProps } from "recharts";
import type { CategoryTotal } from "../../lib/summary";
import { formatCompactCurrency, formatCurrency, formatPercent, fromCents, toCents } from "../../lib/format";
import { CategoryDot } from "../ui/CategoryDot";

// Neutral ink for axis/labels: text never takes the series color.
const MUTED_TEXT = "#71717a"; // zinc-500
const GRID_LINE = "#f4f4f5"; // zinc-100
const HOVER_BAND = "#f4f4f5"; // zinc-100
const STRONG_TEXT = "#18181b"; // zinc-900
const SURFACE = "#ffffff";

const CHART_HEIGHT = 280;
const MAX_NAME_LENGTH = 14;
const DONUT_SIZE = 240;

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

// Two lines in the donut hole: a muted caption over the grand total. With
// position="center" Recharts passes the center of the chart area as x/y, which
// is where the pie is centered.
function DonutCenter({ x, y, total }: LabelProps & { total: number }) {
  if (x == null || y == null) return null;
  const cx = Number(x);
  const cy = Number(y);

  return (
    <text x={cx} y={cy} textAnchor="middle">
      <tspan x={cx} dy="-0.4em" fill={MUTED_TEXT} fontSize={12}>
        Total
      </tspan>
      <tspan x={cx} dy="1.5em" fill={STRONG_TEXT} fontSize={15} fontWeight={600} style={{ fontVariantNumeric: "tabular-nums" }}>
        {formatCurrency(total)}
      </tspan>
    </text>
  );
}

// Vertical bars sorted by total (largest on the left): magnitude reads along one
// baseline and the category name sits on the axis, so identity never depends on
// color alone. Each bar is filled with its category's own color.
function ExpensesBarChart({ data }: { data: CategoryTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_LINE} />
        <XAxis
          dataKey="name"
          interval={0}
          angle={0}
          textAnchor="end"
          height={72}
          axisLine={false}
          tickLine={false}
          tick={{ fill: MUTED_TEXT, fontSize: 12 }}
          tickFormatter={truncate}
        />
        <YAxis
          width={64}
          axisLine={false}
          tickLine={false}
          tick={{ fill: MUTED_TEXT, fontSize: 12 }}
          tickFormatter={(value) => formatCompactCurrency(Number(value))}
        />
        <Tooltip cursor={{ fill: HOVER_BAND }} content={CategoryTooltip} />
        <Bar dataKey="total" maxBarSize={40} radius={[4, 4, 0, 0]}>
          {data.map((row) => (
            <Cell key={row.categoryId} fill={row.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Share of the total per category; slices are split by a thin surface-colored gap
// (skipped for a single slice, where it would just be a seam in the ring).
function ExpensesDonutChart({ data, total }: { data: CategoryTotal[]; total: number }) {
  return (
    <ResponsiveContainer width="100%" height={DONUT_SIZE}>
      <PieChart>
        <Tooltip content={CategoryTooltip} />
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          innerRadius="68%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          stroke={SURFACE}
          strokeWidth={data.length > 1 ? 2 : 0}
          isAnimationActive={false}
        >
          {data.map((row) => (
            <Cell key={row.categoryId} fill={row.color} />
          ))}
          <Label position="center" content={(props) => <DonutCenter {...props} total={total} />} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

// Bars on the left, donut on the right, at every width. The bars get the larger
// share since they need room for one column per category.
export function ExpensesByCategoryChart({ data }: { data: CategoryTotal[] }) {
  const sorted = useMemo(() => [...data].sort((a, b) => b.total - a.total), [data]);
  const total = useMemo(
    () => fromCents(data.reduce((sum, row) => sum + toCents(String(row.total)), 0)),
    [data],
  );

  return (
    <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-4">
      <ExpensesBarChart data={sorted} />
      <ExpensesDonutChart data={sorted} total={total} />
    </div>
  );
}
