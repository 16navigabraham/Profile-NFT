"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";

const TopTokens = () => {
  const { isConnected } = useAccount();
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Top Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">
              Connect your wallet to see your top tokens.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px] p-4 rounded-lg bg-background/30">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">
              Top Tokens Coming Soon
            </p>
            <p className="text-xs">
              We're working on adding support for fetching token balances.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopTokens;
