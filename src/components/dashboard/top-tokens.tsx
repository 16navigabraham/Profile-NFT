
"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { useAccount } from "wagmi";
import { topTokens as mockTokens } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { useTransactions } from "../providers/transaction-provider";

const chartConfig = {
  value: {
    label: "Value (USD)",
  },
  ...mockTokens.reduce((acc, token) => {
    acc[token.symbol] = { label: token.name, color: token.color };
    return acc;
  }, {} as any),
};

const TokenPortfolioChartSkeleton = () => (
    <div className="h-[300px] flex items-center justify-center">
        <Skeleton className="h-[240px] w-[240px] rounded-full" />
    </div>
);


const TokenPortfolioChart = () => {
  const { isConnected } = useAccount();
  const { isLoading: isTxLoading } = useTransactions();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalValue = useMemo(() => {
    return mockTokens.reduce((sum, token) => sum + token.value, 0);
  }, []);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
          {payload.symbol}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-sm">
          ${value.toLocaleString()}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  if (isTxLoading) {
      return <TokenPortfolioChartSkeleton />
  }

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center min-h-[280px]">
        <p className="text-muted-foreground">
          Connect your wallet to see your top tokens.
        </p>
      </div>
    );
  }
  
  if (mockTokens.length === 0) {
     return (
        <div className="flex justify-center items-center min-h-[280px]">
            <p className="text-muted-foreground">
              No token data available.
            </p>
        </div>
     )
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full"
    >
      <PieChart onMouseEnter={onPieEnter} onMouseLeave={onPieLeave}>
        <ChartTooltip
            cursor={false}
            content={
                <ChartTooltipContent
                formatter={(value, name, item) => (
                    <div>
                        <p className="font-bold">{item.payload.name}</p>
                        <p>Value: ${Number(value).toLocaleString()}</p>
                        <p className={cn("text-sm", item.payload.change24h >= 0 ? "text-green-500" : "text-red-500")}>
                           24h: {item.payload.change24h >= 0 ? "+" : ""}{item.payload.change24h.toFixed(2)}%
                        </p>
                    </div>
                )}
                />
            }
        />
        <Pie
          data={mockTokens}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          activeIndex={activeIndex ?? undefined}
          activeShape={renderActiveShape}
        >
          {mockTokens.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

const TopTokens = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Top Tokens</CardTitle>
        <CardDescription>Your portfolio distribution by token value (mock data).</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <TokenPortfolioChart />
      </CardContent>
    </Card>
  );
};

export default TopTokens;
