"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNowStrict } from 'date-fns';
import { useTransactions } from "@/components/providers/transaction-provider";

const chainColors: { [key: string]: string } = {
  Ethereum: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Polygon: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Arbitrum: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Optimism: "bg-red-500/20 text-red-400 border-red-500/30",
  Base: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

const WalletStats = () => {
  const { isConnected } = useAccount();
  const { transactions, isLoading } = useTransactions();

  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalTransactions: 0, walletAgeDays: 0 };
    }

    const totalTransactions = transactions.length;

    const firstTx = [...transactions].sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp))[0];
    
    let walletAgeDays = 0;
    if (firstTx) {
      const firstTxTimestamp = parseInt(firstTx.timeStamp) * 1000;
      const ageInMs = Date.now() - firstTxTimestamp;
      walletAgeDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    }
    
    return { totalTransactions, walletAgeDays };
  }, [transactions]);

  const getWalletAge = (days: number) => {
    if (!isConnected || (stats.totalTransactions === 0 && days === 0 && !isLoading) ) return "New wallet";
    if (days === 0 && isLoading) return "Loading...";
    if (days === 0) return "New wallet";
    return formatDistanceToNowStrict(new Date(Date.now() - days * 24 * 60 * 60 * 1000), { addSuffix: true });
  };

  const StatRow = ({ icon: Icon, label, value, loading }: { icon: React.ElementType, label: string, value: React.ReactNode, loading: boolean }) => (
     <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Icon className="h-5 w-5 text-primary" />
        <span>{label}</span>
      </div>
      {loading ? <Skeleton className="h-4 w-16"/> : <span className="font-semibold text-white">{value}</span>}
    </div>
  )

  return (
    <Card className="bg-card/60 border-border/50 backdrop-blur-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-white">
          Aggregated Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
           <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-4 rounded-lg bg-background/30">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">Connect your wallet to see your aggregated onchain stats.</p>
          </div>
        ) : (
          <>
            <StatRow 
                icon={Activity} 
                label="Total Transactions" 
                value={stats.totalTransactions >= 100 ? "100+" : stats.totalTransactions.toLocaleString()} 
                loading={isLoading} 
            />
            <StatRow 
                icon={Calendar} 
                label="Wallet Age" 
                value={getWalletAge(stats.walletAgeDays)} 
                loading={isLoading} 
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <LinkIcon className="h-5 w-5 text-primary" />
                <span>Top Chains</span>
              </div>
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Badge
                      key="Ethereum"
                      variant="secondary"
                      className={`text-xs font-medium ${
                        chainColors["Ethereum"] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      Ethereum
                    </Badge>
                     <Badge
                      variant="secondary"
                      className={`text-xs font-medium bg-muted text-muted-foreground`}
                    >
                      More coming soon
                    </Badge>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletStats;
