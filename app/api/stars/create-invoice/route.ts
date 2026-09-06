import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Цены в Telegram Stars (XTR): 1 Star ~ 1.5 - 2 рубля
const TIER_PRICES: Record<string, { title: string; desc: string; stars: number }> = {
  silver: {
    title: 'NutriBot Silver',
    desc: 'Доступ к AI-сканированию еды по фото (до 10 раз/день) и штрихкодам',
    stars: 99,
  },
  gold: {
    title: 'NutriBot Gold VIP',
    desc: 'Безлимитный AI-сканер, персональный ИИ-диетолог и приоритетная скорость',
    stars: 249,
  },
};

export async function POST(req: Request) {
  try {
    const { tier, userId } = await req.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { error: 'Токен бота (TELEGRAM_BOT_TOKEN) не настроен в переменных окружения Vercel.' },
        { status: 500 }
      );
    }

    const tierInfo = TIER_PRICES[tier];
    if (!tierInfo) {
      return NextResponse.json({ error: 'Неизвестный тариф подписки' }, { status: 400 });
    }

    // Для Telegram Stars (XTR) provider_token ОБЯЗАН быть пустой строкой
    const payload = JSON.stringify({
      userId: userId || 'anonymous',
      tier,
      timestamp: Date.now(),
    });

    const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: tierInfo.title,
        description: tierInfo.desc,
        payload: payload,
        provider_token: '', // Пустая строка для Telegram Stars
        currency: 'XTR',    // Код валюты Telegram Stars
        prices: [
          {
            label: tierInfo.title,
            amount: tierInfo.stars, // Количество звёзд
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('Telegram createInvoiceLink error:', data);
      return NextResponse.json(
        { error: data.description || 'Не удалось создать счет на оплату звёздами.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ invoiceLink: data.result });
  } catch (error: any) {
    console.error('API stars create invoice error:', error);
    return NextResponse.json({ error: error.message || 'Ошибка сервера' }, { status: 500 });
  }
}
