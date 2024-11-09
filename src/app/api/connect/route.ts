import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { services, config } = await request.json();

  if (!services || !config || !process.env.DAILY_API_KEY) {
    return NextResponse.json(
      { error: 'Services or config not found in request body' },
      { status: 400 }
    );
  }

  if (!process.env.DAILY_BOTS_URL) {
    return NextResponse.json(
      { error: 'DAILY_BOTS_URL not configured' },
      { status: 500 }
    );
  }

  const payload = {
    bot_profile: 'voice_2024_10',
    max_duration: 600,
    services: {
      tts: services.tts,
      llm: services.llm,
    },
    api_keys: {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
    },
    config: config,
  };

  const response = await fetch(process.env.DAILY_BOTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}
