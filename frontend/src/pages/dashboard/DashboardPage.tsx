// Visão geral: totais e gastos por categoria, calculados no próprio frontend.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChartPie, Inbox, Scale } from "lucide-react";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { summarizeTransactions } from "../../lib/summary";
import { formatCurrency, formatPercent } from "../../lib/format";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { StatTile } from "../../components/ui/StatTile";
import { CategoryDot } from "../../components/ui/CategoryDot";
import { TransactionRow } from "../../components/ui/TransactionRow";
import { EmptyState, ErrorState, Skeleton, SkeletonStatus } from "../../components/ui/States";
import { ExpensesByCategoryChart } from "../../components/charts/ExpensesByCategoryChart";
import { secondaryButtonClass, segmentedGroupClass, segmentedOptionClass, subtleButtonClass } from "../../lib/ui";

const RECENT_COUNT = 5;

const PERIOD_OPTIONS = [
  { days: 7, label: "Última semana" },
  { days: 30, label: "Último mês" },
  { days: 365, label: "Último ano" },
] as const;

type PeriodDays = (typeof PERIOD_OPTIONS)[number]["days"];

// Local calendar date as YYYY-MM-DD; toISOString() would use UTC and can jump a day ahead.
function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function periodRange(days: PeriodDays) {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - days);
  return { from: toIsoDate(from), to: toIsoDate(to) };
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

// Same outline as the loaded page (stat row, chart panel, recent list), so nothing
// jumps when the data arrives.
function DashboardSkeleton() {
  return (
    <SkeletonStatus label="Calculando resumo…">
      <div className="space-y-8">
        <Panel>
          <div className="grid divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[0, 1, 2].map((tile) => (
              <div key={tile} className="space-y-3 px-5 py-5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </Panel>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <Panel>
            <div className="space-y-2 border-b border-zinc-200 px-5 py-4">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
            <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-end gap-4 p-5">
              <div className="flex h-56 items-end gap-3">
                {["h-full", "h-4/5", "h-3/5", "h-2/5", "h-1/4"].map((height) => (
                  <Skeleton key={height} className={`flex-1 rounded-b-none ${height}`} />
                ))}
              </div>
              <Skeleton className="mx-auto aspect-square w-full max-w-48 rounded-full" />
            </div>
          </Panel>
          <Panel>
            <div className="border-b border-zinc-200 px-5 py-4">
              <Skeleton className="h-3.5 w-36" />
            </div>
            <div className="divide-y divide-zinc-100">
              {[0, 1, 2, 3, 4].map((row) => (
                <div key={row} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-3.5 w-16" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </SkeletonStatus>
  );
}

export function DashboardPage() {
  const [periodDays, setPeriodDays] = useState<PeriodDays>(30);
  const { from, to } = periodRange(periodDays);
  const { data: transactions, isLoading, error, refetch } = useTransactions(from, to);
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const summary = useMemo(
    () => summarizeTransactions(transactions ?? [], categories ?? []),
    [transactions, categories],
  );

  const recent = useMemo(
    () =>
      [...(transactions ?? [])]
        .sort((a, b) => (b.date ?? b.createdAt).localeCompare(a.date ?? a.createdAt) || b.id - a.id)
        .slice(0, RECENT_COUNT),
    [transactions],
  );

  // Full width on phones (three equal options), compact beside the title from sm up.
  const periodFilter = (
    <fieldset className="w-full sm:w-auto">
      <legend className="sr-only">Período</legend>
      <div className={`grid grid-cols-3 ${segmentedGroupClass}`}>
        {PERIOD_OPTIONS.map((option) => (
          <label key={option.days} className={`${segmentedOptionClass} whitespace-nowrap px-2 text-xs sm:px-3`}>
            <input
              type="radio"
              name="dashboard-period"
              value={option.days}
              checked={periodDays === option.days}
              onChange={() => setPeriodDays(option.days)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );

  const header = (
    <PageHeader
      title="Dashboard"
      description="Resumo das transações registradas no período selecionado."
      aside={periodFilter}
    />
  );

  if (isLoading || categoriesLoading) {
    return (
      <div className="space-y-8">
        {header}
        <DashboardSkeleton />
      </div>
    );
  }

  const loadError = error ?? categoriesError;
  if (loadError) {
    return (
      <div className="space-y-8">
        {header}
        <Panel>
          <ErrorState
            message={loadError.message}
            onRetry={() => {
              if (error) refetch();
              if (categoriesError) refetchCategories();
            }}
          />
        </Panel>
      </div>
    );
  }

  const categoriesById = new Map(categories?.map((category) => [category.id, category]));
  const hasTransactions = (transactions?.length ?? 0) > 0;
  const balanceSign = summary.balance < 0 ? "−" : "";

  return (
    <div className="space-y-8">
      {header}

      <Panel>
        <dl className="grid divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <StatTile
            label="Receitas"
            value={formatCurrency(summary.income)}
            hint={pluralize(summary.incomeCount, "lançamento", "lançamentos")}
            marker={<ArrowUpRight className="h-3.5 w-3.5 text-accent" aria-hidden="true" />}
          />
          <StatTile
            label="Despesas"
            value={formatCurrency(summary.expense)}
            hint={pluralize(summary.expenseCount, "lançamento", "lançamentos")}
            marker={<ArrowDownRight className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />}
          />
          <StatTile
            label="Saldo"
            value={`${balanceSign}${formatCurrency(Math.abs(summary.balance))}`}
            hint="Receitas menos despesas"
            marker={<Scale className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />}
          />
        </dl>
      </Panel>

      {!hasTransactions ? (
        <Panel>
          <EmptyState
            icon={Inbox}
            title="Nenhuma transação no período"
            description="Os totais e o gráfico de gastos aparecem aqui assim que houver transações no período selecionado."
            action={
              <Link to="/transactions" className={secondaryButtonClass}>
                Adicionar transação <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <Panel title="Despesas por categoria" description="Total gasto em cada categoria, do maior para o menor.">
            {summary.expensesByCategory.length === 0 ? (
              <EmptyState
                icon={ChartPie}
                title="Nenhuma despesa registrada"
                description="Apenas receitas foram lançadas no período."
              />
            ) : (
              <>
                <div className="px-3 pt-4 pb-2">
                  <ExpensesByCategoryChart data={summary.expensesByCategory} />
                </div>
                <table className="w-full border-t border-zinc-200 text-sm">
                  <caption className="sr-only">Despesas por categoria</caption>
                  <thead>
                    <tr className="text-left text-xs text-zinc-500">
                      <th scope="col" className="py-2.5 pr-3 pl-5 font-medium">Categoria</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">Total</th>
                      <th scope="col" className="py-2.5 pr-5 pl-3 text-right font-medium">
                        <span aria-hidden="true">%</span>
                        <span className="sr-only">Participação</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 border-t border-zinc-100">
                    {summary.expensesByCategory.map((row) => (
                      <tr key={row.categoryId}>
                        <td className="py-2.5 pr-3 pl-5">
                          <span className="flex items-center gap-2 text-zinc-900">
                            <CategoryDot color={row.color} />
                            {row.name}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right whitespace-nowrap tabular-nums text-zinc-900">{formatCurrency(row.total)}</td>
                        <td className="py-2.5 pr-5 pl-3 text-right tabular-nums text-zinc-500">{formatPercent(row.share)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </Panel>

          <Panel
            title="Transações recentes"
            action={
              <Link to="/transactions" className={subtleButtonClass}>
                Ver todas
              </Link>
            }
          >
            <ul className="divide-y divide-zinc-100">
              {recent.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  category={transaction.categoryId != null ? categoriesById.get(transaction.categoryId) : undefined}
                />
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </div>
  );
}
