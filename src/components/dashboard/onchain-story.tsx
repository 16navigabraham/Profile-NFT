"use client";

import { useState, useEffect } from "react";
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

const OnchainStory = () => {
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      const fetchTransactions = async () => {
        setIsTxLoading(true);
        try {
          const response = await fetch(`/api/transactions?address=${address}`);
          if (!response.ok) {
            throw new Error("Failed to fetch transactions.");
          }
          const data = await response.json();
          if (data.status === "1") {
            setTransactions(data.result);
          } else {
            setTransactions([]);
          }
        } catch (e: any) {
          console.error("Failed to fetch transactions for story:", e.message);
          setTransactions([]);
        } finally {
          setIsTxLoading(false);
        }
      };

      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [address, isConnected]);

  const handleGenerateStory = async () => {
    if (!address) return;
    setIsLoading(true);
    setStory("");
    try {
      // NOTE: In a real app, you'd fetch more comprehensive data
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
        <Button
          onClick={handleGenerateStory}
          disabled={isLoading || isTxLoading || !isConnected}
        >
          {isLoading || isTxLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading
            ? "Generating..."
            : isTxLoading
            ? "Loading data..."
            : "Generate with AI"}
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
