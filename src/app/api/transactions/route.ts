
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
    if (!response.ok) {
      throw new Error(`Etherscan API responded with status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch data from Etherscan' }, { status: 500 });
  }
}
