"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAccount } from "wagmi";
import { AlertCircle } from "lucide-react";

const GasAnalysis = () => {
  const { isConnected } = useAccount();
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Gas Spending</CardTitle>
        <CardDescription>
          USD spent on gas fees in the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">
              Connect your wallet to analyze gas spending.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px] p-4 rounded-lg bg-background/30">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">Gas Analysis Coming Soon</p>
            <p className="text-xs">
              We're working on adding support for gas fee analysis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GasAnalysis;
