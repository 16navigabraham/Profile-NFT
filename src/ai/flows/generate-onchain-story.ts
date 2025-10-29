'use server';
/**
 * @fileOverview Generates a compelling narrative summary of a user's onchain activity.
 *
 * - generateOnchainStory - A function that generates the onchain story.
 * - GenerateOnchainStoryInput - The input type for the generateOnchainStory function.
 * - GenerateOnchainStoryOutput - The return type for the generateOnchainStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOnchainStoryInputSchema = z.object({
  walletAddresses: z
    .array(z.string())
    .describe('An array of blockchain wallet addresses.'),
  transactionHistory: z
    .string()
    .describe('A summary of the user transaction history'),
  topTokens: z
    .string()
    .describe('The top tokens held across all connected wallets'),
  topNFTs: z.string().describe('The top NFTs held across all connected wallets'),
});
export type GenerateOnchainStoryInput = z.infer<typeof GenerateOnchainStoryInputSchema>;

const GenerateOnchainStoryOutputSchema = z.object({
  story: z
    .string()
    .describe('A compelling narrative summary of the user onchain activity.'),
});
export type GenerateOnchainStoryOutput = z.infer<typeof GenerateOnchainStoryOutputSchema>;

export async function generateOnchainStory(input: GenerateOnchainStoryInput): Promise<GenerateOnchainStoryOutput> {
  return generateOnchainStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOnchainStoryPrompt',
  input: {schema: GenerateOnchainStoryInputSchema},
  output: {schema: GenerateOnchainStoryOutputSchema},
  prompt: `You are an AI assistant that crafts compelling narratives about users' onchain activity.

  Given the following information about the user's wallets, create a short story that highlights key transactions, top holdings, and overall onchain behavior.

  Wallet Addresses: {{{walletAddresses}}}
  Transaction History: {{{transactionHistory}}}
  Top Tokens: {{{topTokens}}}
  Top NFTs: {{{topNFTs}}}

  Write a captivating "Onchain Resume" that summarizes the user's onchain presence.
  `,
});

const generateOnchainStoryFlow = ai.defineFlow(
  {
    name: 'generateOnchainStoryFlow',
    inputSchema: GenerateOnchainStoryInputSchema,
    outputSchema: GenerateOnchainStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
