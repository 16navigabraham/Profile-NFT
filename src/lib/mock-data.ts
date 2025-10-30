import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export const wallets: any[] = [];

export const transactions: any[] = [];

export const gasSpending: any[] = [];

export const topTokens: any[] = [
    { name: "Ethereum", symbol: "ETH", value: 4500.50, change24h: 2.5, color: "hsl(var(--chart-1))" },
    { name: "Wrapped BTC", symbol: "WBTC", value: 2500.75, change24h: -1.2, color: "hsl(var(--chart-2))" },
    { name: "USD Coin", symbol: "USDC", value: 1800.00, change24h: 0.1, color: "hsl(var(--chart-3))" },
    { name: "Lido DAO", symbol: "LDO", value: 1200.25, change24h: 5.8, color: "hsl(var(--chart-4))" },
    { name: "Others", symbol: "OTHERS", value: 500.00, change24h: 1.5, color: "hsl(var(--chart-5))" },
];

const nftPlaceholders = PlaceHolderImages.reduce((acc, img) => {
  acc[img.id] = img;
  return acc;
}, {} as Record<string, ImagePlaceholder>);


export const topNfts: any[] = [
  {
    id: "1",
    name: "Abstract Orb #12",
    collection: "Crypto Abstracts",
    imageUrl: nftPlaceholders['nft-1'].imageUrl,
    imageHint: nftPlaceholders['nft-1'].imageHint,
  },
  {
    id: "2",
    name: "Future City #7",
    collection: "CyberScapes",
    imageUrl: nftPlaceholders['nft-2'].imageUrl,
    imageHint: nftPlaceholders['nft-2'].imageHint,
  },
   {
    id: "3",
    name: "Pixel Knight #88",
    collection: "Pixelverse",
    imageUrl: nftPlaceholders['nft-3'].imageUrl,
    imageHint: nftPlaceholders['nft-3'].imageHint,
  },
  {
    id: "4",
    name: "Serene Landscape #1",
    collection: "Nature's Palette",
    imageUrl: nftPlaceholders['nft-4'].imageUrl,
    imageHint: nftPlaceholders['nft-4'].imageHint,
  },
  {
    id: "5",
    name: "Geo Shape #42",
    collection: "Crypto Abstracts",
    imageUrl: nftPlaceholders['nft-5'].imageUrl,
    imageHint: nftPlaceholders['nft-5'].imageHint,
  },
  {
    id: "6",
    name: "Fantasy Dragon #3",
    collection: "Mythical Creatures",
    imageUrl: nftPlaceholders['nft-6'].imageUrl,
    imageHint: nftPlaceholders['nft-6'].imageHint,
  },
  {
    id: "7",
    name: "Pixel Mage #23",
    collection: "Pixelverse",
    imageUrl: "https://picsum.photos/seed/a8/600/600",
    imageHint: "pixel art",
  },
  {
    id: "8",
    name: "Future City #11",
    collection: "CyberScapes",
    imageUrl: "https://picsum.photos/seed/b3/600/600",
    imageHint: "futuristic city",
  },
];
