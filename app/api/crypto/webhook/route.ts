import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TIER_PRICES: Record<string, { title: string; desc: string; amount: string; asset: string }> = {
  silver: {
    title: 'NutriBot Silver (1 месяц)',
    desc: 'AI-сканирование блюд по фото и безлимитный сканер штрихкодов',
    amount: '2.00', // 2.00 USDT
    asset: 'USDT',
  },
  gold: {
    title: 'NutriBot Gold VIP (1 месяц)',
    desc: 'Полный безлимит на AI-сканирование, персональный ИИ-диетолог',
    amount: '4.40', // 4.40 USDT
    asset: 'USDT',
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier, userId } = body;

    const token = process.env.CRYPTO_PAY_TOKEN?.trim();

    if (!token) {
      return NextResponse.json(
        { error: 'CRYPTO_PAY_TOKEN не настроен в Environment Variables на Vercel' },
        { status: 500 }
      );
    }

    const tierInfo = TIER_PRICES[tier];
    if (!tierInfo) {
      return NextResponse.json(
        { error: `Неизвестный тариф: ${tier}` },
        { status: 400 }
      );
    }

    // Используем mainnet: https://pay.crypt.bot/api/
    // (Для тестового бота @CryptoTestnetBot URL: https://testnet-pay.crypt.bot/api/)
    const isTestnet = token.startsWith('test_');
    const apiUrl = isTestnet
      ? 'https://testnet-pay.crypt.bot/api/createInvoice'
      : 'https://pay.crypt.bot/api/createInvoice';

    const payloadData = JSON.stringify({
      userId: String(userId || 'user').slice(0, 32),
      tier,
      createdAt: Date.now(),
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Crypto-Pay-API-Token': token,
      },
      body: JSON.stringify({
        asset: tierInfo.asset,
        amount: tierInfo.amount,
        description: `${tierInfo.title}: ${tierInfo.desc}`,
        payload: payloadData,
        allow_comments: false,
        allow_anonymous: false,
        // Позволяет оплатить любой удобной криптовалютой с автоконвертацией
        accepted_assets: 'USDT,TON,BTC,ETH,NOT,USDC',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('Crypto Pay createInvoice failed:', data);
      return NextResponse.json(
        { error: data.error?.name || data.description || 'Ошибка создания счёта в Crypto Pay' },
        { status: 400 }
      );
    }

    // mini_app_invoice_url открывается нативно внутри Telegram как шторка приложения
    const invoiceUrl = data.result.mini_app_invoice_url || data.result.bot_invoice_url;

    return NextResponse.json({
      invoiceId: data.result.invoice_id,
      payUrl: invoiceUrl,
    });
  } catch (err: any) {
    console.error('Crypto invoice error:', err);
    return NextResponse.json(
      { error: err.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
