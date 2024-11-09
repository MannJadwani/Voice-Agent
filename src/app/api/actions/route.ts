import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { action, data } = await request.json();

  if (!action || !process.env.DAILY_API_KEY) {
    return NextResponse.json(
      { error: 'Action not found in request body or missing API key' },
      { status: 400 }
    );
  }

  if (!process.env.DAILY_BOTS_URL) {
    return NextResponse.json(
      { error: 'DAILY_BOTS_URL not configured' },
      { status: 500 }
    );
  }

  // Extract the meeting token from the URL
  const urlParts = process.env.DAILY_BOTS_URL.split('/');
  const meetingToken = urlParts[urlParts.length - 1];

  const actionUrl = `${process.env.DAILY_BOTS_URL}/actions`;

  const response = await fetch(actionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      action,
      data,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    return NextResponse.json(responseData, { status: response.status });
  }

  return NextResponse.json(responseData);
} 