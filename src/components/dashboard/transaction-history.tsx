
"use client";

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

// NOTE: This is temporary mock data to showcase the new timeline component.
// It will be removed once real on-chain data is integrated.
const transactions = [
  {
    id: "0xabc1",
    type: "Sent",
    asset: "ETH",
    amount: "-0.5",
    value: "-$1,500.00",
    date: "2024-07-28",
    status: "Completed",
  },
  {
    id: "0xdef2",
    type: "Received",
    asset: "USDC",
    amount: "+1,000",
    value: "+$1,000.00",
    date: "2024-07-27",
    status: "Completed",
  },
  {
    id: "0xghi3",
    type: "Swap",
    asset: "ETH to WETH",
    amount: "1.0",
    value: "$3,000.00",
    date: "2024-06-15",
    status: "Completed",
  },
  {
    id: "0xjkl4",
    type: "Minted",
    asset: "NFT",
    amount: "1",
    value: "$150.00",
    date: "2024-06-10",
    status: "Completed",
  },
  {
    id: "0xmno5",
    type: "Staked",
    asset: "LDO",
    amount: "100",
    value: "$250.00",
    date: "2023-12-20",
    status: "Completed",
  },
  {
    id: "0xpqr6",
    type: "Received",
    asset: "ARB",
    amount: "+500",
    value: "+$450.00",
    date: "2023-12-18",
    status: "Completed",
  },
];

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="border-primary/50 bg-primary/10 text-primary"
        >
          Completed
        </Badge>
      );
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  const baseClass = "h-5 w-5 flex-shrink-0";
  switch (type) {
    case "Sent":
      return <ArrowUpRight className={`${baseClass} text-destructive`} />;
    case "Received":
      return <ArrowDownLeft className={`${baseClass} text-primary`} />;
    case "Swap":
      return <RefreshCw className={`${baseClass} text-accent-foreground`} />;
    case "Minted":
    case "Staked":
      return <Star className={`${baseClass} text-foreground`} />;
    default:
      return <div className={baseClass} />;
  }
};

const groupTransactionsByMonth = (transactions: any[]) => {
  return transactions.reduce((acc, tx) => {
    const date = new Date(tx.date);
    const month = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(tx);
    return acc;
  }, {} as Record<string, any[]>);
};

const TransactionHistory = () => {
  const groupedTransactions = groupTransactionsByMonth(transactions);
  const transactionMonths = Object.keys(groupedTransactions);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
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
                    {groupedTransactions[month].map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-muted rounded-full">
                            {getTypeIcon(tx.type)}
                          </div>
                          <div>
                            <p className="font-semibold">{tx.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {tx.asset}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              tx.amount.startsWith("+")
                                ? "text-primary"
                                : tx.amount.startsWith("-")
                                ? "text-destructive"
                                : ""
                            }`}
                          >
                            {tx.amount}{" "}
                            {tx.asset.includes(" ")
                              ? ""
                              : tx.asset.split(" ")[0]}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {tx.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex justify-center items-center min-h-[240px]">
            <p className="text-muted-foreground">No transactions found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
