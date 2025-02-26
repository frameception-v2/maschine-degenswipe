import { NextResponse } from 'next/server';

async function fetchDegenData(fid: string) {
  const [season1, season2, allowances] = await Promise.all([
    fetch(`https://api.degen.tips/airdrop2/season1/points?fid=${fid}`).then(r => r.json()),
    fetch(`https://api.degen.tips/airdrop2/season2/points?fid=${fid}`).then(r => r.json()),
    fetch(`https://api.degen.tips/airdrop2/allowances?fid=${fid}`).then(r => r.json())
  ]);

  return {
    season1: season1[0] || null,
    season2: season2[0] || null,
    allowances: allowances[0] || null
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');

  if (!fid) {
    return NextResponse.json({ error: 'FID parameter required' }, { status: 400 });
  }

  try {
    const data = await fetchDegenData(fid);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch degen data' }, { status: 500 });
  }
}
