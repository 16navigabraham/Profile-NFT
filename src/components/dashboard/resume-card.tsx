"use client";

import React from "react";
import { useAccount, useEnsName } from "wagmi";
import QRCode from "qrcode.react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { generateGradientFromAddress } from "@/lib/utils";
import { useTransactions } from "../providers/transaction-provider";
import { usePersonality } from "./wallet-personality";
import { Star, Award, Gem, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

const iconMap: { [key: string]: LucideIcon } = {
  Award,
  Gem,
  Rocket,
  Sparkles,
  Star,
};

const ResumeCard = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { transactions } = useTransactions();
  const { personality } = usePersonality();

  const bannerGradient = React.useMemo(
    () =>
      address
        ? generateGradientFromAddress(address)
        : "linear-gradient(to right, #888, #555)",
    [address]
  );
  
  const profileUrl = typeof window !== 'undefined' ? window.location.href : '';

  const walletAgeInDays = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;
    const firstTx = [...transactions].sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp))[0];
    if (!firstTx) return 0;
    const firstTxTimestamp = parseInt(firstTx.timeStamp) * 1000;
    const ageInMs = Date.now() - firstTxTimestamp;
    return Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  }, [transactions]);


  return (
    <div ref={ref} className="bg-background text-foreground p-1" {...props}>
      <Card className="w-full max-w-lg mx-auto rounded-xl overflow-hidden border-border shadow-2xl">
        <div className="h-32" style={{ background: bannerGradient }} />

        <div className="relative p-6">
          <div className="absolute -top-16 left-6">
            <Avatar className="h-24 w-24 border-4 border-background bg-muted">
              {address && (
                <>
                  <AvatarImage
                    src={`https://effigy.im/a/${address}.svg`}
                    alt={ensName || address}
                  />
                  <AvatarFallback className="text-3xl">
                    {ensName
                      ? ensName.charAt(0).toUpperCase()
                      : address.charAt(2).toUpperCase()}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold truncate">
              {ensName || "Onchain OG"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">{address}</p>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
             <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Transactions</p>
                <p className="text-lg font-bold">{transactions.length >= 100 ? "100+" : transactions.length}</p>
             </div>
             <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Wallet Age</p>
                <p className="text-lg font-bold">{walletAgeInDays} days</p>
             </div>
          </div>

          {personality ? (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-primary">{personality.personality}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{personality.summary}</p>
              
              {personality.badges?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2 text-accent-foreground">Top Badges</h4>
                  <div className="flex gap-4">
                    {personality.badges.map(badge => {
                      const Icon = iconMap[badge.icon] || Star;
                      return (
                        <div key={badge.name} className="flex items-center gap-2 text-sm">
                           <Icon className="h-5 w-5 text-primary" />
                           <span className="font-medium">{badge.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
               <Skeleton className="h-6 w-1/2" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-3/4" />
            </div>
          )}

          <div className="absolute bottom-4 right-4">
             <QRCode value={profileUrl} size={64} bgColor="transparent" fgColor="hsl(var(--foreground))" />
          </div>
        </div>
      </Card>
    </div>
  );
});

ResumeCard.displayName = "ResumeCard";
export default ResumeCard;
