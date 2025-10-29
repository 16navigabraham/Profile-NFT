"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { generateOnchainStory } from "@/ai/flows/generate-onchain-story";
import { wallets, transactions, topTokens, topNfts } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";

const OnchainStory = () => {
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isConnected } = useAccount();


  const handleGenerateStory = async () => {
    setIsLoading(true);
    setStory("");
    try {
      // NOTE: In a real app, you'd fetch this data from onchain sources
      const input = {
        walletAddresses: wallets.map((w) => w.address),
        transactionHistory: transactions
          .map((t) => `${t.type} ${t.amount} ${t.asset}`)
          .join(", "),
        topTokens: topTokens.map((t) => `${t.balance} ${t.symbol}`).join(", "),
        topNFTs: topNfts.map((n) => n.name).join(", "),
      };
      const result = await generateOnchainStory(input);
      setStory(result.story);
    } catch (error) {
      console.error("Failed to generate story:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate onchain story. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Your Onchain Story</CardTitle>
        <CardDescription>
          An AI-generated narrative of your onchain journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateStory} disabled={isLoading || !isConnected}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Generate with AI"}
        </Button>
        {isLoading && (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {story && (
          <div className="text-sm text-muted-foreground space-y-4 leading-relaxed pt-2">
            {story.split("\n").filter(p => p.trim() !== "").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnchainStory;
