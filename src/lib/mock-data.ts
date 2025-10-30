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


export const topNfts: any[] = [];
