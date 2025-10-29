"use client";

import React, { useState, useMemo } from "react";
import { useAccount, useEnsName } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Share2, Twitter, Globe, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateGradientFromAddress } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const ProfileHeader = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName, isLoading: isEnsLoading } = useEnsName({ address });
  const { toast } = useToast();

  // Mock profile data - in a real app, this would be fetched or stored
  const [profile, setProfile] = useState({
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

  return (
    <header className="relative border-b border-border">
      <div
        className="h-48 w-full bg-cover bg-center transition-all"
        style={{ background: bannerGradient }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex flex-col items-start sm:flex-row sm:items-end sm:gap-6">
          <Avatar className="h-32 w-32 border-4 border-background bg-muted">
            {isConnected ? (
              <>
                <AvatarImage src={`https://effigy.im/a/${address}.svg`} alt={ensName || address} />
                <AvatarFallback className="text-4xl">
                  {ensName ? ensName.charAt(0).toUpperCase() : address ? address.charAt(2).toUpperCase() : "?"}
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
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-primary text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="secondary" size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>
            </div>

            {isConnected ? (
                 <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                    {profile.bio}
                 </p>
            ) : (
                <p className="mt-2 text-sm text-muted-foreground">Connect your wallet to build your onchain resume.</p>
            )}

            {isConnected && (
              <div className="mt-3 flex items-center gap-4 text-sm">
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-4 w-4"/>
                  <span>@{profile.twitter.split("/").pop()}</span>
                </a>
                 <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Globe className="h-4 w-4"/>
                  <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
       <div className="h-16" />
    </header>
  );
};

export default ProfileHeader;
