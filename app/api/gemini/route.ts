import { NextResponse } from 'next/server';

export const runtime = 'edge';

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.0-flash'
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'ОШИБКА: API ключ Gemini не установлен в Vercel.' }, { status: 500 });
    }

    let lastError = 'Неизвестная ошибка Google API';

    for (const model of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]) {
          return NextResponse.json(data);
        }

        if (data.error?.message) {
          lastError = data.error.message;
          if (data.error.message.includes('not found') || data.error.message.includes('no longer available')) {
            continue;
          }
        }
      } catch (err: any) {
        lastError = err.message || lastError;
      }
    }

    return NextResponse.json({ error: lastError }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
