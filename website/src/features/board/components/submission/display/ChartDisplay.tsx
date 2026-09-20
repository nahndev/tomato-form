"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { aggregateSubmissionsForChart } from "@/features/board/utils/chartAggregation";
import type { BoardView, BoardChartViewConfig } from "@/types/board-view";
import { ChartKind } from "@/types/board-view";
import type { Submission } from "@/types/submission";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

/** Validated categorical palette (globals.css) - unlike --chart-1..5, which are shades of one hue, these are distinct hues safe for color-as-identity encoding like pie slices. */
const PIE_COLORS = [
  "var(--chart-cat-1)",
  "var(--chart-cat-2)",
  "var(--chart-cat-3)",
  "var(--chart-cat-4)",
  "var(--chart-cat-5)",
];
const MAX_PIE_SLICES = 5;
const OTHER_LABEL = "Other";

const VALUE_CHART_CONFIG = {
  value: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig;

export interface ChartDisplayProps {
  view: BoardView;
  submissions: Submission[];
}

/** Renders a chart view: aggregates submissions per its config, then draws a bar/line/pie via recharts. */
const ChartDisplay: React.FC<ChartDisplayProps> = ({ view, submissions }) => {
  const config = view.config as BoardChartViewConfig;
  const data = useMemo(
    () => aggregateSubmissionsForChart(submissions, config),
    [submissions, config],
  );

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
        <TomatoIcon
          icon={TomatoIconKey.BarChart}
          className="mb-4 size-10 text-muted-foreground/40"
        />
        <h3 className="font-semibold text-muted-foreground">No data to chart</h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Submissions matching this view&apos;s fields will show up here.
        </p>
      </div>
    );
  }

  if (config.chartKind === ChartKind.PIE) {
    const pieData = foldIntoOther(data);
    const pieConfig = Object.fromEntries(
      pieData.map((d, i) => [d.label, { label: d.label, color: PIE_COLORS[i % PIE_COLORS.length] }]),
    ) satisfies ChartConfig;

    return (
      <ChartContainer config={pieConfig} className="mx-auto max-h-96">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
          <Pie data={pieData} dataKey="value" nameKey="label" innerRadius={60}>
            {pieData.map((d, i) => (
              <Cell key={d.label} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="label" />} />
        </PieChart>
      </ChartContainer>
    );
  }

  if (config.chartKind === ChartKind.LINE) {
    return (
      <ChartContainer config={VALUE_CHART_CONFIG} className="max-h-96 w-full">
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer config={VALUE_CHART_CONFIG} className="max-h-96 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

/** Pie identity is carried entirely by color, so cap the slice count rather than generating unbounded hues - the overflow folds into "Other". */
function foldIntoOther(data: { label: string; value: number }[]) {
  if (data.length <= MAX_PIE_SLICES) return data;

  const kept = data.slice(0, MAX_PIE_SLICES - 1);
  const otherValue = data
    .slice(MAX_PIE_SLICES - 1)
    .reduce((total, d) => total + d.value, 0);

  return [...kept, { label: OTHER_LABEL, value: otherValue }];
}

export default ChartDisplay;
