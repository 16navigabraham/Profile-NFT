"use client";

import React, { useState, useMemo, useRef } from "react";
import { useAccount, useEnsName } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateGradientFromAddress } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";
import ResumeCard from "./resume-card";
import html2canvas from "html2canvas";
import { usePersonality } from "./wallet-personality";
import { useTransactions } from "../providers/transaction-provider";

const ProfileHeader = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName, isLoading: isEnsLoading } = useEnsName({ address });
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);
  const { personality, isGenerating } = usePersonality();
  const { transactions } = useTransactions();

  const [profile] = useState({
    displayName: "Onchain OG",
    bio: "Exploring the decentralized frontier, one block at a time. ETH enthusiast and NFT collector.",
    twitter: "https://twitter.com/ethereum",
    website: "https://ethereum.org",
  });

  const bannerGradient = useMemo(
    () => (address ? generateGradientFromAddress(address) : "linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))"),
    [address]
  );

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Your Onchain Portfolio link has been copied.",
      });
    }
  };
  
  const handleDownload = () => {
    if (resumeRef.current) {
      html2canvas(resumeRef.current, {
        useCORS: true,
        backgroundColor: null, 
        scale: 2,
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `onchain-resume-${address?.slice(0, 6)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const isExportDisabled = !personality || isGenerating || !isConnected || transactions.length === 0;

  return (
    <header className="relative border-b border-border">
      <div
        className="h-48 w-full bg-cover bg-center transition-all"
        style={{ background: bannerGradient }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex flex-col items-start sm:flex-row sm:items-end sm:gap-6">
          <Avatar className="h-32 w-32 border-4 border-background bg-muted">
            {isConnected && address ? (
              <>
                <AvatarImage src={`https://effigy.im/a/${address}.svg`} alt={ensName || address} />
                <AvatarFallback className="text-4xl">
                  {ensName ? ensName.charAt(0).toUpperCase() : address.charAt(2).toUpperCase()}
                </AvatarFallback>
              </>
            ) : (
               <Skeleton className="h-full w-full rounded-full" />
            )}
          </Avatar>

          <div className="mt-4 flex-grow sm:mt-0 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {isConnected ? (
                <h1 className="text-3xl font-bold font-headline truncate" title={ensName || address}>
                  {isEnsLoading ? <Skeleton className="h-8 w-48"/> : ensName || profile.displayName}
                </h1>
              ) : (
                <h1 className="text-3xl font-bold font-headline">Onchain Portfolio</h1>
              )}
              
              <div className="flex items-center gap-2">
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={isExportDisabled}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Onchain Resume Card</DialogTitle>
                            <DialogDescription>
                                Preview and download your shareable onchain resume.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                           <ResumeCard ref={resumeRef} />
                        </div>
                        <Button onClick={handleDownload}>Download PNG</Button>
                    </DialogContent>
                </Dialog>

                <Button variant="secondary" size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>
            </div>
             <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                {isConnected ? profile.bio : "Connect your wallet to build your onchain resume."}
             </p>
          </div>
        </div>
      </div>
       <div className="h-16" />
    </header>
  );
};

export default ProfileHeader;
