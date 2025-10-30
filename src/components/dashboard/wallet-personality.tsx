"use client";

import React, { useState, useMemo, createContext, useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Award, Gem, Rocket, Star, type LucideIcon } from "lucide-react";
import { analyzeWalletPersonality, type AnalyzeWalletPersonalityOutput } from "@/ai/flows/analyze-wallet-personality";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useTransactions } from "@/components/providers/transaction-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const iconMap: { [key: string]: LucideIcon } = {
  Award,
  Gem,
  Rocket,
  Sparkles,
  Star,
};

const Badge = ({ name, description, icon, index }: { name: string; description: string; icon: string; index: number }) => {
  const Icon = iconMap[icon] || Star;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="relative flex flex-col items-center justify-center gap-2 p-4 bg-accent/50 border border-accent rounded-lg text-center animate-in fade-in zoom-in-90"
            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
          >
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-4 h-4 bg-primary rounded-full animate-ping" style={{ animationDelay: `${index * 150 + 500}ms` }} />
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-4 h-4 bg-primary rounded-full" />
            
            <Icon className="h-8 w-8 text-primary" />
            <p className="font-bold text-sm text-accent-foreground">{name}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface PersonalityContextType {
  personality: AnalyzeWalletPersonalityOutput | null;
  isGenerating: boolean;
  generatePersonality: () => Promise<void>;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(undefined);

export const usePersonality = () => {
  const context = useContext(PersonalityContext);
  if (!context) {
    throw new Error("usePersonality must be used within a WalletPersonality provider");
  }
  return context;
};

const WalletPersonalityContent = () => {
  const { personality, isGenerating, generatePersonality } = usePersonality();
  const { transactions, isLoading: isTxLoading } = useTransactions();
  const { isConnected } = useAccount();

  const isButtonDisabled = isGenerating || isTxLoading || !isConnected || transactions.length === 0;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Wallet Personality</CardTitle>
        <CardDescription>
          Discover your onchain identity with AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generatePersonality} disabled={isButtonDisabled}>
          {isGenerating && !isTxLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isGenerating && !isTxLoading
            ? "Analyzing..."
            : isTxLoading
            ? "Loading transactions..."
            : "Analyze Personality"}
        </Button>
        
        {(isGenerating && !isTxLoading) && (
          <div className="pt-2 space-y-4">
            <Skeleton className="h-5 w-3/4" />
             <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        )}

        {personality && (
          <div className="pt-2 space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-primary">{personality.personality}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{personality.summary}</p>
            {personality.badges && personality.badges.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-accent-foreground">Badges Unlocked</h4>
                <div className="grid grid-cols-3 gap-4">
                  {personality.badges.map((badge, index) => (
                    <Badge key={badge.name} {...badge} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {!isConnected && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Connect your wallet to discover your personality.
            </p>
        )}
      </CardContent>
    </Card>
  )
}

export const WalletPersonality = ({ children }: { children: React.ReactNode }) => {
  const [personality, setPersonality] = useState<AnalyzeWalletPersonalityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { transactions, isLoading: isTxLoading } = useTransactions();

  const walletAgeInDays = useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;
    const firstTx = [...transactions].sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp))[0];
    if (!firstTx) return 0;
    const firstTxTimestamp = parseInt(firstTx.timeStamp) * 1000;
    const ageInMs = Date.now() - firstTxTimestamp;
    return Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  }, [transactions]);

  const handleGenerate = async () => {
    if (!address) return;
    setIsLoading(true);
    setPersonality(null);
    try {
      const transactionSummary = transactions
        .slice(0, 15)
        .map(
          (t) => `Tx from ${t.from.slice(0,6)}... to ${t.to.slice(0,6)}... of ${ (parseFloat(t.value) / 10 ** 18).toFixed(4)} ETH`
        ).join("; ");

      const input = {
        walletAddress: address,
        transactionCount: transactions.length,
        walletAgeInDays,
        transactionHistory: transactionSummary || "No recent transactions.",
      };
      
      const result = await analyzeWalletPersonality(input);
      setPersonality(result);

    } catch (error) {
      console.error("Failed to analyze wallet personality:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Couldn't generate your wallet personality. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
      personality,
      isGenerating: isLoading || isTxLoading,
      generatePersonality: handleGenerate,
  }

  return (
    <PersonalityContext.Provider value={value}>
        {children}
    </PersonalityContext.Provider>
  )
};

// Add this to your main page layout where you want the card to appear.
// e.g. <WalletPersonality><WalletPersonalityContent /></WalletPersonality>
export default WalletPersonality;
