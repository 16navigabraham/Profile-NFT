import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export const wallets: any[] = [];

export const transactions: any[] = [];

export const gasSpending: any[] = [];

export const topTokens: any[] = [];

const nftPlaceholders = PlaceHolderImages.reduce((acc, img) => {
  acc[img.id] = img;
  return acc;
}, {} as Record<string, ImagePlaceholder>);


export const topNfts: any[] = [];
