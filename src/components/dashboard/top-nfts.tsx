"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";

const TopNfts = () => {
  const { isConnected } = useAccount();
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Top NFTs</CardTitle>
        <CardDescription>
          Your most valuable and favorite NFT collections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">
              Connect your wallet to see your top NFTs.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px] p-4 rounded-lg bg-background/30">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">Top NFTs Coming Soon</p>
            <p className="text-xs">
              We're working on adding support for fetching your NFT collections.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopNfts;
