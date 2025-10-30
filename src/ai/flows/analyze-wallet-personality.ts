'use server';
/**
 * @fileOverview Analyzes on-chain data to determine a wallet's "personality" and assign badges.
 *
 * - analyzeWalletPersonality - A function that analyzes wallet data.
 * - AnalyzeWalletPersonalityInput - The input type for the function.
 * - AnalyzeWalletPersonalityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWalletPersonalityInputSchema = z.object({
  walletAddress: z.string().describe('The user blockchain wallet address.'),
  transactionCount: z.number().describe('The total number of transactions.'),
  walletAgeInDays: z
    .number()
    .describe('The age of the wallet in days since its first transaction.'),
  transactionHistory: z
    .string()
    .describe('A summary of the recent transaction history.'),
});
export type AnalyzeWalletPersonalityInput = z.infer<
  typeof AnalyzeWalletPersonalityInputSchema
>;

const BadgeSchema = z.object({
  name: z.string().describe('A short, catchy title for the badge (e.g., "Early Adopter").'),
  description: z.string().describe('A one-sentence explanation of why the badge was awarded.'),
  icon: z
    .string()
    .describe('A single, relevant Lucide icon name (e.g., "Award", "Sparkles", "Gem", "Rocket").'),
});

const AnalyzeWalletPersonalityOutputSchema = z.object({
  personality: z
    .string()
    .describe(
      'A single, concise title for the wallet\'s personality (e.g., "Seasoned Trader", "NFT Connoisseur", "Cautious Explorer").'
    ),
  summary: z
    .string()
    .describe(
      "A brief, engaging one-paragraph summary of the user's on-chain persona and history."
    ),
  badges: z
    .array(BadgeSchema)
    .max(3)
    .describe('A list of up to 3 achievement badges based on on-chain activity.'),
});
export type AnalyzeWalletPersonalityOutput = z.infer<
  typeof AnalyzeWalletPersonalityOutputSchema
>;

export async function analyzeWalletPersonality(
  input: AnalyzeWalletPersonalityInput
): Promise<AnalyzeWalletPersonalityOutput> {
  return analyzeWalletPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWalletPersonalityPrompt',
  input: {schema: AnalyzeWalletPersonalityInputSchema},
  output: {schema: AnalyzeWalletPersonalityOutputSchema},
  prompt: `You are an expert onchain analyst with a flair for storytelling. Your task is to analyze a user's wallet activity and create a "Wallet Personality" profile.

Analyze the following data to identify patterns and assign a personality, a summary, and up to 3 descriptive badges.

**Wallet Data:**
- Wallet Address: {{{walletAddress}}}
- Total Transactions: {{{transactionCount}}}
- Wallet Age: {{{walletAgeInDays}}} days
- Recent Transaction Summary: {{{transactionHistory}}}

**Badge Ideas (use these as inspiration):**
- **Early Adopter:** For wallets created several years ago.
- **Frequent Trader:** For wallets with a high transaction count.
- **Weekend Spender:** For wallets with transaction activity clustered around weekends.
- **NFT Enthusiast:** If transactions suggest NFT minting/trading (even if a summary).
- **DeFi Degen:** If transactions involve many different DeFi protocols.
- **Gas Saver:** If average gas fees are low.
- **Fresh Start:** For very new wallets with few transactions.

Based on the data, generate a personality, a summary, and a list of badges. The tone should be fun, encouraging, and insightful. Focus on the most prominent characteristics revealed by the data.`,
});

const analyzeWalletPersonalityFlow = ai.defineFlow(
  {
    name: 'analyzeWalletPersonalityFlow',
    inputSchema: AnalyzeWalletPersonalityInputSchema,
    outputSchema: AnalyzeWalletPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
