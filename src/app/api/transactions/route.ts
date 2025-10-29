
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
      const errorMessage = data.message || 'An unknown error occurred with the Etherscan API.';
      // Specifically check for "NOTOK" which can mean rate-limit issues.
      if (data.result === 'Error! Invalid API Key' || data.message === 'NOTOK') {
          return NextResponse.json({ message: `Etherscan API Error: ${data.result || errorMessage}. Please check your API key and plan limits.` }, { status: 500 });
      }
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch data from Etherscan' }, { status: 500 });
  }
}
