"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Link as LinkIcon } from "lucide-react";
import { useAccount } from "wagmi";

const chainColors: { [key: string]: string } = {
  Ethereum: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Polygon: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Arbitrum: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Optimism: "bg-red-500/20 text-red-400 border-red-500/30",
  Base: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

const WalletStats = () => {
  const { isConnected } = useAccount();

  // Placeholder data - replace with actual onchain data
  const stats = {
    totalTransactions: isConnected ? 1248 : 0,
    walletAgeDays: isConnected ? 732 : 0,
    topChains: isConnected ? ["Ethereum", "Polygon", "Arbitrum"] : [],
  };

  const getWalletAge = (days: number) => {
    if (days >= 365) {
      return `${(days / 365).toFixed(1)} years`;
    }
    return `${days} days`;
  };

  return (
    <Card className="bg-card/60 border-border/50 backdrop-blur-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-white">
          Aggregated Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Activity className="h-5 w-5 text-primary" />
            <span>Total Transactions</span>
          </div>
          <span className="font-semibold text-white">
            {stats.totalTransactions.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Wallet Age</span>
          </div>
          <span className="font-semibold text-white">
            {getWalletAge(stats.walletAgeDays)}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <LinkIcon className="h-5 w-5 text-primary" />
            <span>Top Chains</span>
          </div>
          {isConnected ? (
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
             <p className="text-xs text-muted-foreground text-center py-2">Connect wallet to see chain data.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletStats;
