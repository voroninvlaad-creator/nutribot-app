import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Включаем режим Edge для мгновенных ответов без холодных стартов

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API ключ не найден в настройках Vercel' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/Gemini 3.1 Flash Lite:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Ошибка Google API' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
