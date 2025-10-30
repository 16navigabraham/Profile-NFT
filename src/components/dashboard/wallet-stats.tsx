"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNowStrict } from 'date-fns';
import { useTransactions } from "@/components/providers/transaction-provider";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const activityData = [
  { subject: 'Transactions', Ethereum: 85, Polygon: 65, Base: 70, Celo: 40, fullMark: 100 },
  { subject: 'Contracts', Ethereum: 75, Polygon: 80, Base: 60, Celo: 30, fullMark: 100 },
  { subject: 'Volume', Ethereum: 60, Polygon: 70, Base: 85, Celo: 50, fullMark: 100 },
  { subject: 'NFTs', Ethereum: 70, Polygon: 50, Base: 40, Celo: 20, fullMark: 100 },
  { subject: 'DeFi', Ethereum: 90, Polygon: 85, Base: 75, Celo: 60, fullMark: 100 },
];

const WalletStats = () => {
  const { isConnected, chain } = useAccount();
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
      <CardContent className="space-y-4">
        {!isConnected ? (
           <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-4 rounded-lg bg-background/30 h-[260px]">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">Connect your wallet to see your aggregated onchain stats.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <StatRow 
                icon={Activity} 
                label="Total Transactions" 
                value={isLoading ? '...' : (stats.totalTransactions >= 100 ? "100+" : stats.totalTransactions.toLocaleString())} 
                loading={isLoading} 
            />
            <StatRow 
                icon={Calendar} 
                label="Wallet Age" 
                value={getWalletAge(stats.walletAgeDays)} 
                loading={isLoading} 
            />

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activityData}>
                    <defs>
                      <radialGradient id="radarGradient">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </radialGradient>
                    </defs>
                    <PolarGrid stroke="hsl(var(--border) / 0.5)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Radar name={chain?.name ?? "Current Chain"} dataKey={chain?.name ?? "Ethereum"} stroke="hsl(var(--primary))" fill="url(#radarGradient)" fillOpacity={0.8} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletStats;
