
import { NextRequest, NextResponse } from 'next/server';

const getApiConfig = (chainId: string) => {
    switch (chainId) {
        case '1': // Ethereum Mainnet
            return {
                url: 'https://api.etherscan.io/api',
                apiKey: process.env.ETHERSCAN_API_KEY,
                keyName: 'ETHERSCAN_API_KEY'
            };
        case '8453': // Base
            return {
                url: 'https://api.basescan.org/api',
                apiKey: process.env.BASESCAN_API_KEY || process.env.ETHERSCAN_API_KEY,
                keyName: 'BASESCAN_API_KEY'
            };
        case '137': // Polygon
            return {
                url: 'https://api.polygonscan.com/api',
                apiKey: process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY,
                keyName: 'POLYGONSCAN_API_KEY'
            };
        case '42220': // Celo
            return {
                url: 'https://api.celoscan.io/api',
                apiKey: process.env.CELOSCAN_API_KEY || process.env.ETHERSCAN_API_KEY,
                keyName: 'CELOSCAN_API_KEY'
            };
        default:
            return null;
    }
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chainId = searchParams.get('chainId');

  if (!address) {
    return NextResponse.json({ message: 'Address is required' }, { status: 400 });
  }

  if (!chainId) {
      return NextResponse.json({ message: 'Chain ID is required' }, { status: 400 });
  }

  const apiConfig = getApiConfig(chainId);

  if (!apiConfig) {
      return NextResponse.json({ message: `Unsupported chain ID: ${chainId}`}, { status: 400});
  }
  
  const { url: apiUrl, apiKey, keyName } = apiConfig;

  if (!apiKey) {
    return NextResponse.json({ message: `API key for ${keyName} or a fallback ETHERSCAN_API_KEY is not configured. Please add it to your .env file.` }, { status: 500 });
  }
  
  const url = `${apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.status === '1') {
      return NextResponse.json(data);
    } else {
      const errorMessage = data.message || data.result || `An unknown error occurred with the API for chain ${chainId}.`;
      
      if (data.result && typeof data.result === 'string' && data.result.includes('Invalid API Key')) {
          return NextResponse.json({ message: `Etherscan API Error: Invalid API Key. Please check your key.` }, { status: 500 });
      }
      if (data.message === 'NOTOK' || (data.result && typeof data.result === 'string' && data.result.includes('rate limit'))) {
         return NextResponse.json({ message: `Etherscan API Error: Rate limit exceeded. Please check your API plan or wait a moment.` }, { status: 429 });
      }
       if (data.result && typeof data.result === 'string' && data.result.includes('V2 endpoint')) {
          return NextResponse.json({ message: `Etherscan API Error: You are using a deprecated V1 endpoint, switch to Etherscan API V2 using https://docs.etherscan.io/v2-migration. Please check your API key and plan limits.` }, { status: 500 });
      }

      return NextResponse.json({ message: errorMessage }, { status: response.status });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message || `Failed to fetch data from chain ${chainId}` }, { status: 500 });
  }
}
