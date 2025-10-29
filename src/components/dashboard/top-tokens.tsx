"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { topTokens } from "@/lib/mock-data";
import { TokenIcons } from "@/lib/icons";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const TopTokens = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Top Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        {topTokens.length > 0 ? (
          <div className="space-y-6">
            {topTokens.map((token) => {
              const Icon = TokenIcons[token.logo];
              return (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {Icon && <Icon className="h-8 w-8 text-primary" />}
                    <div>
                      <p className="font-semibold">{token.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {token.balance} {token.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-right">{token.value}</p>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`token-switch-${token.symbol}`}
                        defaultChecked={true}
                        aria-label={`Show ${token.name} on profile`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">No tokens found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopTokens;
