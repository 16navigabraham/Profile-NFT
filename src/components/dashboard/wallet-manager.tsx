"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { wallets } from "@/lib/mock-data";
import { TokenIcons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const WalletManager = () => {
  const { toast } = useToast();

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied!",
      description: "Wallet address has been copied to your clipboard.",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-headline">Connected Wallets</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <PlusCircle className="mr-2 h-4 w-4 text-primary" />
              Connect
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect a new wallet</DialogTitle>
              <DialogDescription>
                Choose your wallet provider to continue. This is a mock UI.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button className="w-full justify-start gap-4" variant="outline">
                <TokenIcons.metamask className="h-6 w-6" />
                Metamask
              </Button>
              <Button className="w-full justify-start gap-4" variant="outline">
                <TokenIcons.walletconnect className="h-6 w-6" />
                WalletConnect
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wallets.map((wallet) => {
            const Icon = TokenIcons[wallet.provider];
            return (
              <div
                key={wallet.address}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  {Icon && <Icon className="h-8 w-8 text-primary flex-shrink-0" />}
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate">{wallet.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {wallet.address}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => copyAddress(wallet.address)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Address
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletManager;
