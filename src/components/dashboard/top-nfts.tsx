import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { topNfts } from "@/lib/mock-data";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

const TopNfts = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Top NFTs</CardTitle>
        <CardDescription>
          Your most valuable and favorite NFT collections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topNfts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {topNfts.map((nft) => (
              <div key={nft.name} className="relative group">
                <Card className="overflow-hidden border-border transition-all group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:-translate-y-1">
                  <Image
                    src={nft.image.imageUrl}
                    alt={nft.name}
                    width={400}
                    height={400}
                    className="aspect-square object-cover transition-transform group-hover:scale-105"
                    data-ai-hint={nft.image.imageHint}
                  />
                </Card>
                <div className="mt-2">
                  <p className="font-semibold truncate text-sm">{nft.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {nft.collection}
                  </p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Switch
                    id={`nft-switch-${nft.name.replace(/\s/g, "-")}`}
                    defaultChecked={true}
                    aria-label={`Show ${nft.name} on profile`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">No NFTs found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopNfts;
