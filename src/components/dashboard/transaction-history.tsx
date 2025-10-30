
"use client";

import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTransactions, type Transaction } from "@/components/providers/transaction-provider";
import { Skeleton } from "../ui/skeleton";

const getStatusBadge = (isError: string) => {
  if (isError === "1") {
    return <Badge variant="destructive">Failed</Badge>;
  }
  return (
    <Badge
      variant="secondary"
      className="border-primary/50 bg-primary/10 text-primary"
    >
      Completed
    </Badge>
  );
};

const getType = (tx: Transaction, address: string) => {
    const from = tx.from.toLowerCase();
    const to = tx.to.toLowerCase();
    const self = address.toLowerCase();

    if (from === self && to === self) return { type: "Self", Icon: RefreshCw, className: "text-accent-foreground" };
    if (from === self) return { type: "Sent", Icon: ArrowUpRight, className: "text-destructive" };
    if (to === self) return { type: "Received", Icon: ArrowDownLeft, className: "text-primary" };
    return { type: "Contract", Icon: Star, className: "text-foreground" };
}

const groupTransactionsByMonth = (transactions: Transaction[]) => {
  return transactions.reduce((acc, tx) => {
    const date = new Date(parseInt(tx.timeStamp) * 1000);
    const month = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);
};

const TransactionHistorySkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i}>
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);


const TransactionHistory = () => {
  const { address, isConnected } = useAccount();
  const { transactions, isLoading, error } = useTransactions();

  const groupedTransactions = groupTransactionsByMonth(transactions);
  const transactionMonths = Object.keys(groupedTransactions);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TransactionHistorySkeleton />
        ) : !isConnected ? (
          <div className="flex justify-center items-center min-h-[240px]">
            <p className="text-muted-foreground">Connect your wallet to view transactions.</p>
          </div>
        ) : error ? (
           <div className="flex justify-center items-center min-h-[240px]">
            <p className="text-destructive text-center">Error fetching transactions: {error}</p>
          </div>
        ) : transactions.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={transactionMonths.slice(0, 1)}
            className="w-full"
          >
            {transactionMonths.map((month) => (
              <AccordionItem key={month} value={month}>
                <AccordionTrigger className="py-4 font-semibold text-base hover:no-underline">
                  {month}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {groupedTransactions[month].map((tx) => {
                        const { type, Icon, className } = getType(tx, address!);
                        const valueInEth = parseFloat(tx.value) / 10**18;
                        const sign = type === "Sent" ? "-" : type === "Received" ? "+" : "";

                        return (
                          <a
                            key={tx.hash}
                            href={`https://etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-muted rounded-full">
                                <Icon className={`h-5 w-5 flex-shrink-0 ${className}`} />
                              </div>
                              <div>
                                <p className="font-semibold">{type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(new Date(parseInt(tx.timeStamp) * 1000), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${className}`}>
                                {sign}{valueInEth.toFixed(5)} ETH
                              </p>
                            </div>
                          </a>
                        )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex justify-center items-center min-h-[240px]">
            <p className="text-muted-foreground">No transactions found for this address.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
