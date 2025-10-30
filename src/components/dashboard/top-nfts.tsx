"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAccount } from "wagmi";
import { topNfts } from "@/lib/mock-data";
import { Badge } from "../ui/badge";

type Nft = {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  imageHint: string;
};

type GroupedNfts = {
  [collection: string]: Nft[];
};

const TopNfts = () => {
  const { isConnected } = useAccount();

  const groupedNfts = useMemo(() => {
    return topNfts.reduce((acc: GroupedNfts, nft: Nft) => {
      if (!acc[nft.collection]) {
        acc[nft.collection] = [];
      }
      acc[nft.collection].push(nft);
      return acc;
    }, {});
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Top NFTs</CardTitle>
        <CardDescription>
          Your most valuable and favorite NFT collections (mock data).
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
          <div className="space-y-6">
            {Object.keys(groupedNfts).map((collectionName) => (
              <div key={collectionName}>
                <h3 className="text-lg font-semibold mb-3 text-accent-foreground">
                  {collectionName}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {groupedNfts[collectionName].map((nft) => (
                    <div
                      key={nft.id}
                      className="group relative overflow-hidden rounded-lg shadow-lg border border-border/50"
                    >
                      <Image
                        src={nft.imageUrl}
                        alt={nft.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                        data-ai-hint={nft.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-2 text-white">
                        <p className="text-xs font-semibold truncate">
                          {nft.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopNfts;
