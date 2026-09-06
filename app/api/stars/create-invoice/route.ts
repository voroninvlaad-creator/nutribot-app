import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TIER_PRICES: Record<string, { title: string; desc: string; stars: number }> = {
  silver: {
    title: 'NutriBot Silver (1 мес)',
    desc: 'AI-сканирование еды по фото (до 10 раз/день) и безлимитный сканер штрихкодов',
    stars: 99,
  },
  gold: {
    title: 'NutriBot Gold VIP (1 мес)',
    desc: 'Безлимитное AI-сканирование еды, умный ИИ-диетолог и приоритетный доступ',
    stars: 249,
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier, userId } = body;

    let botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || '';

    // Удаляем случайную приставку "bot", если она была введена в Vercel
    if (botToken.toLowerCase().startsWith('bot')) {
      botToken = botToken.substring(3);
    }

    if (!botToken) {
      return NextResponse.json(
        { error: 'TELEGRAM_BOT_TOKEN не найден в настройках Vercel' },
        { status: 500 }
      );
    }

    const tierInfo = TIER_PRICES[tier];
    if (!tierInfo) {
      return NextResponse.json(
        { error: `Неизвестный тариф подписки: ${tier}` },
        { status: 400 }
      );
    }

    const payload = JSON.stringify({
      u: String(userId || 'user').slice(0, 32),
      t: tier,
      ts: Date.now(),
    });

    // ВАЖНО: По официальной спецификации Telegram Bot API 7.4+, для валюты XTR (Stars)
    // поле provider_token ОБЯЗАНО полностью отсутствовать в объекте.
    const telegramPayload = {
      title: tierInfo.title,
      description: tierInfo.desc,
      payload: payload,
      currency: 'XTR',
      prices: [
        {
          label: tierInfo.title,
          amount: tierInfo.stars,
        },
      ],
    };

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramPayload),
      }
    );

    const tgData = await telegramRes.json();

    if (!telegramRes.ok || !tgData.ok) {
      console.error('Telegram API createInvoiceLink failed:', tgData);
      return NextResponse.json(
        {
          error: tgData.description || 'Telegram отклонил создание счёта на оплату звёздами',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ invoiceLink: tgData.result });
  } catch (err: any) {
    console.error('Create invoice server error:', err);
    return NextResponse.json(
      { error: err.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
