"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical, Copy, LogOut, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccount, useConnect, useDisconnect, useEnsName, useSwitchChain } from "wagmi";
import { TokenIcons } from "@/lib/icons";
import { walletConnectConnector, injectedConnector } from "../providers/web3-provider";
import { mainnet, base, polygon, celo } from "viem/chains";

const chains = [mainnet, base, polygon, celo];

const WalletManager = () => {
  const { toast } = useToast();
  const { address, isConnected, connector, chain } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied!",
      description: "Wallet address has been copied to your clipboard.",
    });
  };

  const ConnectedWallet = () => {
    if (!address) return null;
    
    const Icon = TokenIcons[connector?.name.toLowerCase() || "walletconnect"];

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-hidden">
          {Icon && <Icon className="h-8 w-8 text-primary flex-shrink-0" />}
          <div className="overflow-hidden">
            <p className="font-semibold truncate">{ensName || "Primary Wallet"}</p>
            <p className="text-sm text-muted-foreground truncate">
              {address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <span>{chain?.name ?? "Select Network"}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  {chains.map((c) => (
                    <DropdownMenuItem key={c.id} onClick={() => switchChain({ chainId: c.id })}>
                      {c.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => copyAddress(address)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => disconnect()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-headline">
          {isConnected ? "Connected Wallet" : "Connect Wallet"}
        </CardTitle>
        {!isConnected && (
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
                  Choose your wallet provider to continue.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                 <Button
                  className="w-full justify-start gap-4"
                  variant="outline"
                  onClick={() => connect({ connector: injectedConnector })}
                >
                  <TokenIcons.metamask className="h-6 w-6" />
                  Browser Wallet
                </Button>
                <Button
                  className="w-full justify-start gap-4"
                  variant="outline"
                  onClick={() => connect({ connector: walletConnectConnector })}
                >
                  <TokenIcons.walletconnect className="h-6 w-6" />
                  WalletConnect
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isConnected && address ? (
            <ConnectedWallet />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No wallet connected.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletManager;
