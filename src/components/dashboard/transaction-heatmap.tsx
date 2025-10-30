
"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAccount } from "wagmi";
import { useTransactions } from "@/components/providers/transaction-provider";
import {
  format,
  startOfDay,
  endOfYear,
  startOfYear,
  eachDayOfInterval,
  getDay,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";
import { getMonthName } from "@/lib/date-utils";
import { Skeleton } from "../ui/skeleton";

type HeatmapData = {
  [date: string]: {
    count: number;
  };
};

const HeatmapSkeleton = () => (
  <div className="flex gap-2 overflow-x-auto pb-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2 min-w-max">
        <Skeleton className="h-4 w-8 mx-auto" />
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {Array.from({ length: 35 }).map((_, j) => (
            <Skeleton key={j} className="h-3 w-3 rounded-sm" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const TransactionHeatmap = () => {
  const { isConnected } = useAccount();
  const { transactions, isLoading } = useTransactions();

  const data = useMemo(() => {
    if (!transactions || transactions.length === 0) return {};
    return transactions.reduce((acc: HeatmapData, tx) => {
      const date = format(
        startOfDay(new Date(parseInt(tx.timeStamp) * 1000)),
        "yyyy-MM-dd"
      );
      if (!acc[date]) {
        acc[date] = { count: 0 };
      }
      acc[date].count++;
      return acc;
    }, {});
  }, [transactions]);

  const now = new Date();
  const sixMonthsAgo = startOfDay(subMonths(now, 5));
  const yearStart = startOfYear(sixMonthsAgo);
  const yearEnd = endOfYear(now);

  const days = eachDayOfInterval({
    start: yearStart,
    end: yearEnd,
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-muted/50";
    if (count <= 2) return "bg-primary/20";
    if (count <= 5) return "bg-primary/40";
    if (count <= 10) return "bg-primary/60";
    if (count <= 20) return "bg-primary/80";
    return "bg-primary";
  };
  
  const daysByMonth = useMemo(() => {
    return days.reduce((acc, day) => {
      const month = format(day, "yyyy-MM");
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(day);
      return acc;
    }, {} as Record<string, Date[]>);
  }, [days]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Daily Activity</CardTitle>
        <CardDescription>
          Your on-chain transaction frequency over the past year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex justify-center items-center min-h-[140px]">
            <p className="text-muted-foreground">
              Connect wallet to see your activity.
            </p>
          </div>
        ) : isLoading ? (
          <div className="h-[140px] flex items-center">
            <HeatmapSkeleton />
          </div>
        ) : (
          <TooltipProvider>
            <div className="flex gap-2 overflow-x-auto pb-4">
              {Object.keys(daysByMonth).map(monthKey => (
                 <div key={monthKey} className="flex flex-col gap-2 min-w-max">
                   <p className="text-xs text-muted-foreground text-center">{getMonthName(parseInt(monthKey.split('-')[1]) - 1)}</p>
                   <div className="grid grid-flow-col grid-rows-7 gap-1">
                     {daysByMonth[monthKey].map((day, dayIndex) => {
                        const dateString = format(day, "yyyy-MM-dd");
                        const dayData = data[dateString] || { count: 0 };
                        
                        const firstDayOfMonth = dayIndex === 0 ? getDay(day) : -1;
                        const emptyDays = firstDayOfMonth > 0 ? Array.from({length: firstDayOfMonth}) : [];

                        return (
                          <>
                           {firstDayOfMonth > 0 && emptyDays.map((_, i) => <div key={`empty-${i}`} className="h-3 w-3"/>)}
                           <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "h-3 w-3 rounded-sm",
                                    getHeatmapColor(dayData.count)
                                  )}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  {dayData.count} transaction
                                  {dayData.count !== 1 && "s"} on{" "}
                                  {format(day, "MMM d, yyyy")}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )
                     })}
                   </div>
                 </div>
              ))}
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHeatmap;
