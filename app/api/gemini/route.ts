import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Устанавливаем модель gemini-3.1-flash-lite по вашему запросу
const MODEL_NAME = 'gemini-3.1-flash-lite';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'ОШИБКА: API ключ Gemini не установлен в Vercel.' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && data.candidates?.[0]) {
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: data.error?.message || 'Неизвестная ошибка Google API' }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
