"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNowStrict } from 'date-fns';


const chainColors: { [key: string]: string } = {
  Ethereum: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Polygon: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Arbitrum: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Optimism: "bg-red-500/20 text-red-400 border-red-500/30",
  Base: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

const WalletStats = () => {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    walletAgeDays: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      const fetchStats = async () => {
        setIsLoading(true);
        try {
          // Fetch total transactions
          const txListResponse = await fetch(`/api/transactions?address=${address}&offset=1`); // offset=1 is enough to get count
          const txListData = await txListResponse.json();

          // Etherscan doesn't give total count directly, so we need another call for first transaction for age
          const firstTxResponse = await fetch(`/api/transactions?address=${address}&sort=asc&page=1&offset=1`);
          const firstTxData = await firstTxResponse.json();

          let totalTransactions = 0;
          if (txListData.status === "1" && txListData.result.length > 0) {
            // This is a limitation of the free Etherscan API. It doesn't give a total count.
            // For this app, we'll show "100+" if there are 100 or more txns.
            const checkFullPage = await fetch(`/api/transactions?address=${address}&page=1&offset=100`);
            const fullPageData = await checkFullPage.json();
            if (fullPageData.result.length === 100) {
                 // A more robust solution would use a paid API or multiple page fetches.
                 // For now, we assume a high number but can't be precise.
                 // Let's just show the number of transactions up to 100
                 totalTransactions = fullPageData.result.length;
            } else {
                 totalTransactions = fullPageData.result.length;
            }
          }
          
          let walletAgeDays = 0;
          if (firstTxData.status === "1" && firstTxData.result.length > 0) {
            const firstTxTimestamp = parseInt(firstTxData.result[0].timeStamp) * 1000;
            const ageInMs = Date.now() - firstTxTimestamp;
            walletAgeDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
          }
          
          setStats({ totalTransactions, walletAgeDays });

        } catch (error) {
          console.error("Failed to fetch wallet stats:", error);
          setStats({ totalTransactions: 0, walletAgeDays: 0 });
        } finally {
          setIsLoading(false);
        }
      };

      fetchStats();
    } else {
        setStats({ totalTransactions: 0, walletAgeDays: 0 });
    }
  }, [address, isConnected]);


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
