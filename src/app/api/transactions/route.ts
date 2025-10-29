
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const apiKey = process.env.ETHERSCAN_API_KEY;

  if (!address) {
    return NextResponse.json({ message: 'Address is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ message: 'Etherscan API key is not configured. Please add ETHERSCAN_API_KEY to your .env file.' }, { status: 500 });
  }
  
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.status === '1') {
      return NextResponse.json(data);
    } else {
      // Etherscan API returns a message when there's an error (e.g., invalid key, rate limit)
      const errorMessage = data.message || data.result || 'An unknown error occurred with the Etherscan API.';
      
      // Specifically check for common error messages to provide better feedback.
      if (data.result && typeof data.result === 'string' && data.result.includes('Invalid API Key')) {
          return NextResponse.json({ message: `Etherscan API Error: Invalid API Key. Please check your API key.` }, { status: 500 });
      }
      if (data.message === 'NOTOK' || (data.result && typeof data.result === 'string' && data.result.includes('rate limit'))) {
         return NextResponse.json({ message: `Etherscan API Error: Rate limit exceeded. Please check your API plan or wait a moment.` }, { status: 429 });
      }
       if (data.result && typeof data.result === 'string' && data.result.includes('V1 endpoint')) {
        return NextResponse.json({ message: `Etherscan API Error: ${data.result}. Please check your API key and plan limits.` }, { status: 500 });
      }
      return NextResponse.json({ message: errorMessage }, { status: response.status });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch data from Etherscan' }, { status: 500 });
  }
}
