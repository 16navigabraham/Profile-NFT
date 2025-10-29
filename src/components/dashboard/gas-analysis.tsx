"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { type ChartConfig } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { gasSpending } from "@/lib/mock-data";

const chartConfig = {
  spent: {
    label: "Gas Spent ($)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const GasAnalysis = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Gas Spending</CardTitle>
        <CardDescription>
          USD spent on gas fees in the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={gasSpending}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GasAnalysis;
