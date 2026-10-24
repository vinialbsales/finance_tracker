import { createElement, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Label, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LabelProps, TooltipContentProps } from "recharts";
import type { CategoryTotal } from "../../lib/summary";
import { formatCompactCurrency, formatCurrency, formatPercent, fromCents, toCents } from "../../lib/format";
import {
  Car,
  Ellipsis,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  House,
  Receipt,
  ShoppingBag,
  Tag,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CategoryDot } from "../ui/CategoryDot";
import { CHART_ANIMATION, CHART_TOOLTIP_ANIMATION } from "../../lib/ui";

// Categories are the fixed set seeded by Flyway (V3), so their icons live here,
// keyed by name. Anything not listed falls back to a generic tag.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Alimentação": Utensils,
  "Transporte": Car,
  "Moradia": House,
  "Saúde": HeartPulse,
  "Lazer": Gamepad2,
  "Educação": GraduationCap,
  "Compras": ShoppingBag,
  "Contas e utilidades": Receipt,
  "Outros": Ellipsis,
};
const FALLBACK_CATEGORY_ICON = Tag;

function categoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? FALLBACK_CATEGORY_ICON;
}

// Neutral ink for axis/labels: text never takes the series color.
const MUTED_TEXT = "#71717a"; // zinc-500
const GRID_LINE = "#f4f4f5"; // zinc-100
const HOVER_BAND = "#f4f4f5"; // zinc-100
const STRONG_TEXT = "#18181b"; // zinc-900

// Recharts' accessibility layer makes each chart one tab stop driven by the arrow keys.
const KEYBOARD_HINT = "Use as setas para a esquerda e para a direita para percorrer as categorias.";

const CHART_HEIGHT = 280;
const DONUT_SIZE = 240;
// Hole radius as a share of the outer radius (outer = half the shorter side of the chart box).
const DONUT_INNER_RATIO = 0.68;

function CategoryTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as CategoryTotal;

  // role="status" mirrors Recharts' default tooltip: when a bar or slice is reached
  // with the arrow keys, screen readers announce what the tooltip shows.
  return (
    <div role="status" className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs">
      <div className="flex items-center gap-2 font-medium text-zinc-900">
        <CategoryDot color={row.color} />
        {row.name}
      </div>
      <p className="mt-1 tabular-nums text-zinc-600">
        {formatCurrency(row.total)} <span className="text-zinc-500">· {formatPercent(row.share)}</span>
      </p>
    </div>
  );
}

const TOTAL_FONT_SIZE = 15;
const MIN_TOTAL_FONT_SIZE = 11;
const DIGIT_WIDTH_EM = 0.6; // average advance of a tabular digit at weight 600
const HOLE_FILL = 0.8; // share of the hole's diameter the total may span

// Two lines in the donut hole: a muted caption over the grand total. With
// position="center" Recharts passes the center of the chart area as x/y, which
// is where the pie is centered, and that area as viewBox. On narrow screens the text shrinks to fit the
// hole, and below a legible size it is left out: the same total is in the
// "Despesas" tile and in the chart summary.
function DonutCenter({ x, y, viewBox, total }: LabelProps & { total: number }) {
  if (x == null || y == null) return null;
  const cx = Number(x);
  const cy = Number(y);
  const value = formatCurrency(total);
  const innerRadius =
    viewBox && "width" in viewBox && viewBox.width != null && viewBox.height != null
      ? (Math.min(viewBox.width, viewBox.height) / 2) * DONUT_INNER_RATIO
      : Infinity;
  const fontSize = Math.min(TOTAL_FONT_SIZE, (innerRadius * 2 * HOLE_FILL) / (value.length * DIGIT_WIDTH_EM));
  if (fontSize < MIN_TOTAL_FONT_SIZE) return null;

  return (
    <text x={cx} y={cy} textAnchor="middle">
      <tspan x={cx} dy="-0.4em" fill={MUTED_TEXT} fontSize={Math.min(12, fontSize)}>
        Total
      </tspan>
      <tspan x={cx} dy="1.5em" fill={STRONG_TEXT} fontSize={fontSize} fontWeight={600} style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </tspan>
    </text>
  );
}

const ICON_SIZE = 18;
const MIN_ICON_SIZE = 10; // below this an icon is unreadable, so it is skipped
const ICON_GAP = 6; // space between the icon and the top of its bar

// Rendered by <LabelList> once per bar: Recharts passes the bar's box as viewBox
// and its position in `data` as index. The icon sits centered above the bar in
// neutral ink; the bar itself carries the category color.
function BarIcon({ viewBox, index, data }: LabelProps & { data: CategoryTotal[] }) {
  if (!viewBox || !("width" in viewBox) || index == null) return null;
  const row = data[index];
  if (!row) return null;

  const { x, y, width } = viewBox;
  // Never wider than the bar; on very narrow bars the tooltip alone names it.
  const size = Math.min(ICON_SIZE, Math.floor(width * 0.7));
  if (size < MIN_ICON_SIZE) return null;

  return (
    // Recharts only draws labels once the bars finish growing; the fade keeps the
    // icons from popping in (skipped under prefers-reduced-motion).
    <g role="img" aria-label={row.name} className="motion-safe:animate-fade-in">
      <title>{row.name}</title>
      {/* createElement because the icon is looked up, not declared, per bar. */}
      {createElement(categoryIcon(row.name), {
        x: x + (width - size) / 2,
        y: y - size - ICON_GAP,
        width: size,
        height: size,
        color: MUTED_TEXT,
        "aria-hidden": true,
      })}
    </g>
  );
}

// Vertical bars sorted by total (largest on the left): magnitude reads along one
// baseline. Each bar is filled with its category's own color and topped by its
// icon; the name is in the tooltip, the icon's aria-label and the table below,
// so identity never depends on color or the icon alone.
function ExpensesBarChart({ data }: { data: CategoryTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart
        data={data}
        margin={{ top: ICON_SIZE + ICON_GAP + 4, right: 8, bottom: 0, left: 0 }}
        aria-label={`Gráfico de barras das despesas por categoria. ${KEYBOARD_HINT}`}
      >
        <CartesianGrid vertical={false} stroke={GRID_LINE} />
        <XAxis dataKey="name" hide />
        <YAxis
          width={64}
          axisLine={false}
          tickLine={false}
          tick={{ fill: MUTED_TEXT, fontSize: 12 }}
          tickFormatter={(value) => formatCompactCurrency(Number(value))}
        />
        <Tooltip cursor={{ fill: HOVER_BAND }} content={CategoryTooltip} {...CHART_TOOLTIP_ANIMATION} />
        <Bar dataKey="total" maxBarSize={40} radius={[4, 4, 0, 0]} {...CHART_ANIMATION}>
          {data.map((row) => (
            <Cell key={row.categoryId} fill={row.color} />
          ))}
          <LabelList dataKey="total" content={(props) => <BarIcon {...props} data={data} />} />
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
      <PieChart aria-label={`Gráfico de rosca da participação de cada categoria no total. ${KEYBOARD_HINT}`}>
        <Tooltip content={CategoryTooltip} {...CHART_TOOLTIP_ANIMATION} />
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          innerRadius={`${DONUT_INNER_RATIO * 100}%`}
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          stroke="none"
          strokeWidth={data.length > 1 ? 2 : 0}
          {...CHART_ANIMATION}
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

// Text version of both charts for screen readers: everything a sighted reader
// takes from them (ranking, amounts, shares, total) in reading order.
function ChartSummary({ data, total }: { data: CategoryTotal[]; total: number }) {
  return (
    <figcaption className="sr-only">
      <p>
        Despesas por categoria, do maior para o menor gasto. Total de {formatCurrency(total)} em {data.length}{" "}
        {data.length === 1 ? "categoria" : "categorias"}.
      </p>
      <ol>
        {data.map((row) => (
          <li key={row.categoryId}>
            {row.name}: {formatCurrency(row.total)} ({formatPercent(row.share)} do total)
          </li>
        ))}
      </ol>
    </figcaption>
  );
}

// Recharts doesn't style the focused <svg>; this gives it the app's focus ring.
const chartFocusClass =
  "[&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-offset-2 " +
  "[&_.recharts-surface:focus-visible]:outline-zinc-900 [&_.recharts-surface]:rounded-sm";

// Bars on the left, donut on the right, at every width. The bars get the larger
// share since they need room for one column per category.
export function ExpensesByCategoryChart({ data }: { data: CategoryTotal[] }) {
  const sorted = useMemo(() => [...data].sort((a, b) => b.total - a.total), [data]);
  const total = useMemo(
    () => fromCents(data.reduce((sum, row) => sum + toCents(String(row.total)), 0)),
    [data],
  );

  return (
    // A short name for the figure; the caption is read as its content, not as the name.
    <figure aria-label="Gráficos de despesas por categoria">
      <ChartSummary data={sorted} total={total} />
      <div className={`grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-4 ${chartFocusClass}`}>
        <ExpensesBarChart data={sorted} />
        <ExpensesDonutChart data={sorted} total={total} />
      </div>
    </figure>
  );
}
