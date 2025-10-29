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
import { Sparkles, Loader2 } from "lucide-react";
import { generateOnchainStory } from "@/ai/flows/generate-onchain-story";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useTransactions } from "@/components/providers/transaction-provider";

const OnchainStory = () => {
  const [story, setStory] = useState("");
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { transactions, isLoading: isTxLoading } = useTransactions();

  const handleGenerateStory = async () => {
    if (!address) return;
    setIsStoryLoading(true);
    setStory("");
    try {
      const transactionSummary = transactions
        .slice(0, 10)
        .map(
          (t) =>
            `Txn from ${t.from} to ${t.to} of ${
              parseFloat(t.value) / 10 ** 18
            } ETH`
        )
        .join(", ");

      const input = {
        walletAddresses: [address],
        transactionHistory: transactionSummary || "No recent transactions.",
        topTokens: "ETH (mocked)", // Placeholder, replace with real data
        topNFTs: "None (mocked)", // Placeholder, replace with real data
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
      setIsStoryLoading(false);
    }
  };

  const isLoading = isStoryLoading || isTxLoading;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Your Onchain Story</CardTitle>
        <CardDescription>
          An AI-generated narrative of your onchain journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateStory}
          disabled={isLoading || !isConnected}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isStoryLoading
            ? "Generating..."
            : isTxLoading
            ? "Loading data..."
            : "Generate with AI"}
        </Button>
        {isStoryLoading && (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {story && (
          <div className="text-sm text-muted-foreground space-y-4 leading-relaxed pt-2">
            {story
              .split("\n")
              .filter((p) => p.trim() !== "")
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnchainStory;
