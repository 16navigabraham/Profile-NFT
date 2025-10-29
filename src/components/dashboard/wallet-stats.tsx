"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { Skeleton } from "../ui/skeleton";

const chainColors: { [key: string]: string } = {
  Ethereum: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Polygon: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Arbitrum: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Optimism: "bg-red-500/20 text-red-400 border-red-500/30",
  Base: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

const WalletStats = () => {
  const { isConnected } = useAccount();

  // NOTE: In a real app, this data would be fetched from onchain sources
  const isLoading = false; // Replace with actual loading state
  const stats = {
    totalTransactions: 0,
    walletAgeDays: 0,
    topChains: [],
  };

  const getWalletAge = (days: number) => {
    if (days === 0) return "New wallet";
    if (days >= 365) {
      return `${(days / 365).toFixed(1)} years`;
    }
    return `${days} days`;
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
            <StatRow icon={Activity} label="Total Transactions" value={stats.totalTransactions.toLocaleString()} loading={isLoading} />
            <StatRow icon={Calendar} label="Wallet Age" value={getWalletAge(stats.walletAgeDays)} loading={isLoading} />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <LinkIcon className="h-5 w-5 text-primary" />
                <span>Top Chains</span>
              </div>
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ) : stats.topChains.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stats.topChains.map((chain) => (
                    <Badge
                      key={chain}
                      variant="secondary"
                      className={`text-xs font-medium ${
                        chainColors[chain] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {chain}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No chain data available.
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletStats;
