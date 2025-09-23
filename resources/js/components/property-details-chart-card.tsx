"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis  } from "recharts"
import { type MarketMetricsItem } from "@/types";

import { ChartConfig,
         ChartContainer,
         ChartTooltip,
         ChartTooltipContent,
         ChartLegend,
         ChartLegendContent } from "@/components/ui/chart";

interface PropertyDetailsChartCardProps {
  title: string;
  content: string;
  formatter: string;
  lineTypes: string[];
  xAxisDataKey: string;
  yAxisDataKey: string;
  data: MarketMetricsItem[];
  chartConfig: {
    [key: string]: { label: string; color: string };
  };
}

export function PropertyDetailsChartCard({
  title,
  content,
  lineTypes,
  xAxisDataKey,
  yAxisDataKey,
  data,
  chartConfig,
  formatter,
}: PropertyDetailsChartCardProps) {
  return (
    <div className="bg-white dark:bg-[#23232e] shadow-md rounded-xl p-4">
      <div className="flex flex-col gap-4">
        {/* Title and Content */}
        <div className="flex flex-col">
          <div className="text-gray-800 dark:text-gray-300 text-sm">{title}</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{content}</div>
        </div>

        {/* Chart */}
        <div className="w-full h-full">
          <ChartContainer config={chartConfig} className="h-full w-full p-6">
            <LineChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} stroke="#e0e0e0" dark:stroke="#3b3b4a" strokeDasharray="3 3" />
              
              <XAxis
                dataKey={xAxisDataKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                stroke="#6b7280" // default gray-500
                className="dark:stroke-gray-400"
              />
              
              <YAxis
                dataKey={yAxisDataKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `${formatter}${value.toLocaleString()}`}
                stroke="#6b7280"
                className="dark:stroke-gray-400"
              />
              
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${formatter}${value.toLocaleString()}`}
                    className="dark:bg-gray-800 dark:text-gray-200"
                  />
                }
                wrapperStyle={{
                  backgroundColor: "white",
                  color: "#111827",
                  borderRadius: 6,
                  padding: "0.5rem",
                }}
              />
              
              <ChartLegend
                content={
                  <ChartLegendContent
                    className="dark:text-gray-200 text-gray-800"
                  />
                }
              />

              {lineTypes.map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="natural"
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
