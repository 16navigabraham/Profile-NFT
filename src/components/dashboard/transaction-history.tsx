
"use client";

import { useState, useEffect } from "react";
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
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Star, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
  blockNumber: string;
};

const getStatusBadge = (isError: string, confirmations: number) => {
  if (isError === "1") {
    return <Badge variant="destructive">Failed</Badge>;
  }
  if (confirmations < 12) {
    return <Badge variant="outline">Pending ({confirmations}/12)</Badge>;
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
    // This case shouldn't happen if API is correct, but as a fallback
    return { type: "Contract", Icon: Star, className: "text-foreground" };
}

const formatValue = (value: string) => {
    const number = parseFloat(value);
    if (number > 1000) return `${(number / 10**18).toFixed(4)} ETH`;
    return `${(number / 10**9).toPrecision(4)} Gwei`;
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

const TransactionHistory = () => {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/transactions?address=${address}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch transactions.');
          }
          
          if (data.status === "1") {
            setTransactions(data.result);
          } else {
            setTransactions([]);
            if (data.message !== 'No transactions found') {
              setError(data.message);
            }
          }
        } catch (e: any) {
          setError(e.message || "An unexpected error occurred.");
          setTransactions([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [address, isConnected]);

  const groupedTransactions = groupTransactionsByMonth(transactions);
  const transactionMonths = Object.keys(groupedTransactions);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[240px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
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
                              {/* Add fiat value conversion here if available */}
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

