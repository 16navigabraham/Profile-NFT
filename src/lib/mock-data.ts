import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export const wallets = [
  {
    address: '0x1234AbcDef5678GhIjKlMnOpQrStUvWxYz',
    name: 'Primary Wallet',
    provider: 'metamask',
  },
  {
    address: '0xABCD1234EFGH5678IJKL9012MNOP3456QRST',
    name: 'Trading Wallet',
    provider: 'walletconnect',
  },
];

export const transactions = [
  { id: '0xabc1', type: 'Sent', asset: 'ETH', amount: '-0.5', value: '-$1,500.00', status: 'Completed', date: '2 days ago' },
  { id: '0xdef2', type: 'Received', asset: 'USDC', amount: '+1,000', value: '+$1,000.00', status: 'Completed', date: '3 days ago' },
  { id: '0xghi3', type: 'Swap', asset: 'ETH to WETH', amount: '1.0', value: '$3,000.00', status: 'Completed', date: '5 days ago' },
  { id: '0xjkl4', type: 'Minted', asset: 'NFT', amount: '1', value: '$150.00', status: 'Completed', date: '1 week ago' },
  { id: '0xmno5', type: 'Staked', asset: 'LDO', amount: '100', value: '$250.00', status: 'Pending', date: '2 weeks ago' },
  { id: '0xpqr6', type: 'Received', asset: 'ARB', amount: '+500', value: '+$450.00', status: 'Completed', date: '3 weeks ago' },
];

export const gasSpending = [
    { month: 'Jan', spent: 45 },
    { month: 'Feb', spent: 60 },
    { month: 'Mar', spent: 75 },
    { month: 'Apr', spent: 30 },
    { month: 'May', spent: 90 },
    { month: 'Jun', spent: 55 },
];

export const topTokens = [
  { name: 'Ethereum', symbol: 'ETH', balance: '2.5', value: '$7,500', logo: 'eth' },
  { name: 'USD Coin', symbol: 'USDC', balance: '5,000', value: '$5,000', logo: 'usdc' },
  { name: 'Lido DAO', symbol: 'LDO', balance: '1,500', value: '$3,750', logo: 'ldo' },
  { name: 'Wrapped BTC', symbol: 'WBTC', balance: '0.05', value: '$3,250', logo: 'wbtc' },
];

const nftPlaceholders = PlaceHolderImages.reduce((acc, img) => {
  acc[img.id] = img;
  return acc;
}, {} as Record<string, ImagePlaceholder>);


export const topNfts = [
  { name: 'Abstract Art #123', collection: 'Color Fusion', image: nftPlaceholders['nft-1'] },
  { name: 'Cyber City #42', collection: 'Neon Dreams', image: nftPlaceholders['nft-2'] },
  { name: 'Pixel Knight #88', collection: '8-Bit Heroes', image: nftPlaceholders['nft-3'] },
  { name: 'Mountain View #1', collection: 'Serene Scapes', image: nftPlaceholders['nft-4'] },
  { name: 'GeoCube #7', collection: 'Dimensionals', image: nftPlaceholders['nft-5'] },
  { name: 'Glimmerwing #21', collection: 'Mythical Beasts', image: nftPlaceholders['nft-6'] },
];
